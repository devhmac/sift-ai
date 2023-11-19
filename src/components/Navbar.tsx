import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRightCircle, Divide } from "lucide-react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();
  const loggedIn = user ? true : false;

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className=" flex z-40 font-semibold">
            .sift-ai
          </Link>
          <div className="hidden items-center space-x-4 sm:flex">
            <>
              <Link
                href="/pricing"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Pricing
              </Link>
              {loggedIn ? (
                <Link
                  href="/dashboard"
                  className={cn(
                    "text-sm flex-center justify-cente align-center",
                    buttonVariants({ variant: "ghost" })
                  )}
                >
                  Welcome {user.email}
                </Link>
              ) : (
                <>
                  <LoginLink
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    Login
                  </LoginLink>
                  <RegisterLink
                    className={buttonVariants({
                      size: "sm",
                      className: "bg-green-600",
                    })}
                  >
                    Sign Up <ArrowRightCircle className="ml-1.5 h-4.5 w-4.5" />
                  </RegisterLink>
                </>
              )}
            </>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
