//routes go in here

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";

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
  getUserFiles,
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
