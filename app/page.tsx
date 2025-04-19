import { SignOutButton } from "@/components/sign-out";
import { headers } from "next/headers";
import { betterFetch } from "@better-fetch/fetch";
import Link from "next/link";

export default async function Home() {
  const requestHeaders = await headers();
  const cookie = requestHeaders.get("cookie") || "";

  const { data: session } = await betterFetch(
    process.env.AUTH_APP_SESSION_API_URL!,
    {
      headers: {
        //get the cookie from the request
        cookie,
      },
    }
  );

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <ol className="list-inside text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            This is a simple app to test SSO.{" "}
            <span className="font-bold">
              {session ? "You're logged in" : "You're not logged in"}
            </span>
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {session ? (
            <>
              <SignOutButton cookie={cookie} />
              <Link
                href="/home"
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
              >
                Go to Home
              </Link>
            </>
          ) : (
            <a
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
              href={`${
                process.env.AUTH_APP_LOGIN_URL
              }?redirectTo=${encodeURIComponent(
                process.env.APP_URL + "/home"
              )}`}
            >
              Sign in
            </a>
          )}
        </div>
      </main>
    </div>
  );
}
