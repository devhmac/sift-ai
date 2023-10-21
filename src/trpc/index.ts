//routes go in here

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { publicProcedure, privateProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { z } from "zod";

export const appRouter = router({
  //can do querys (generally get requests etc) and mutations (posts etc)

  // AuthCallback route to verify or create user account ------- public proceedure, any user can hit this
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = getUser();

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
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
