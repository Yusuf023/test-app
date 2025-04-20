import { SignOutButton } from "@/components/sign-out";
import { headers } from "next/headers";
import { betterFetch } from "@better-fetch/fetch";
import { redirect } from "next/navigation";

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

  if (!session) {
    redirect(
      `${process.env.AUTH_APP_LOGIN_URL}?redirectTo=${
        process.env.APP_URL
      }/home`
    );
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <ol className="list-inside text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            This is a protected page, which is only accessible by signed in
            users.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <SignOutButton cookie={cookie} />
        </div>
      </main>
    </div>
  );
}
