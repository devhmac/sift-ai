import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create();
const middleware = t.middleware;

const isAuth = middleware(async (opts) => {
  //logic - ensure user is authenticated
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id) throw new TRPCError({ code: "UNAUTHORIZED" });

  //opts.next - any api call that uses this middleware proceedure gets access to  this middleware context(ctx) object
  return opts.next({
    ctx: {
      userId: user.id,
      user,
    },
  });
});
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProceedure = t.procedure.use(isAuth);
// public proceedure = public api route
