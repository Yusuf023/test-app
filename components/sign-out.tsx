"use client";

import { useState } from "react";
import { betterFetch } from "@better-fetch/fetch";

export const SignOutButton = ({ cookie }: { cookie: string }) => {
  const [loading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await betterFetch(
        process.env.NEXT_PUBLIC_AUTH_APP_LOGOUT_API_URL!,
        {
          method: "POST",
          throw: false,
          body: JSON.stringify({}),
          credentials: "include",
          headers: {
            //get the cookie from the request
            cookie,
          },
        }
      );
      if (!error) {
        window.location.href = "/";
      } else {
        console.error(error);
        alert("Failed to sign out");
      }
    } catch (error) {
      alert("Failed to sign out");
      console.error(error);
    }

    setIsLoading(false);
  };

  return (
    <>
      <button
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        onClick={handleSignOut}
      >
        Sign out
      </button>
      {loading && (
        <div className="fixed top-0 right-0 w-full h-full bg-black/60 text-white flex justify-center items-center pointer-events-auto z-50">
          Loading...
        </div>
      )}
    </>
  );
};
