import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import Dashboard from "@/components/Dashboard";

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  //check if kind user exists or has no id
  if (!user || !user.id) redirect("/auth-callback?origin=dashboard");
  //check if user that is logged in exists in our db
  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });
  //if not redirect to our user creation db sync call
  if (!dbUser) redirect("/auth-callback?origin=dashboard");

  return <Dashboard />;
};

export default Page;
