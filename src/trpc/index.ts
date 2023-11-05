//routes go in here

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { publicProcedure, privateProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { z } from "zod";
import { INFINITE_QUERY_LIMIT } from "@/app/config/infinite-query";

export const appRouter = router({
  //can do querys (generally get requests etc) and mutations (posts etc)

  // AuthCallback route to verify or create user account ------- public proceedure, any user can hit this
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = getUser();
    console.log("err 500 in here?");

    if (!user.id || !user.email) throw new TRPCError({ code: "UNAUTHORIZED" });

    //is user in DB, no create, yes return true
    const dbUser = await db.user.findFirst({
      where: { id: user.id },
    });

    if (!dbUser) {
      await db.user.create({
        data: { id: user.id, email: user.email },
      });
    }

    return { success: true };
  }),

  //Get user files endpoint --------
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { user, userId } = ctx;

    return await db.file.findMany({
      where: { userId },
    });
  }),

  getFile: privateProcedure
    .input(z.object({ key: z.string() }))
    //ctx coming from proceedure middleware which calls user and provides the context, input = body
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await db.file.findFirst({
        where: {
          key: input.key,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });
      return file;
    }),

  //delete file route ------------------------------
  deleteFile: privateProcedure
    .input(z.object({ id: z.string() })) //this zod function makes the input typesafe
    .mutation(async ({ ctx, input }) => {
      //gets input from the input function above
      const { userId, user } = ctx;
      //find file
      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      await db.file.delete({
        where: {
          id: input.id,
          userId,
        },
      });
      return file;
    }),

  // chat related routes -----------------------
  getFileUploadStatus: privateProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ ctx, input }) => {
      const file = await db.file.findFirst({
        where: {
          id: input.fileId,
          userId: ctx.userId,
        },
      });
      //as const here tells typescript we're looking specificially for the string "PENDING" not just any string
      if (!file) return { status: "PENDING" as const };

      return { status: file.uploadStatus };
    }),

  getFileMessages: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        fileId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      //limit is num messages we want
      //cursor is where we're at in the messages so we dont query the same ones over again

      const limit = input.limit ?? INFINITE_QUERY_LIMIT;

      const file = await db.file.findFirst({
        where: {
          id: input.fileId,
          userId: ctx.userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      const messages = await db.message.findMany({
        take: limit + 1,
        where: {
          userId: ctx.userId,
          fileId: input.fileId,
        },
        orderBy: {
          createdAt: "desc",
        },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        select: {
          id: true,
          isUserMessage: true,
          createdAt: true,
          text: true,
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      //grab the id of the last message which will be used as the cursor start for the next query
      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id;
      }
      return {
        messages,
        nextCursor,
      };
    }),
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
