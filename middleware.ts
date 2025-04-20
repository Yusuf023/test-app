import { type NextRequest, NextResponse } from "next/server";

const unprotectedRoutes = ["/"];

export async function middleware(request: NextRequest) {
  // Check cookie for optimistic redirects for protected routes
  // Use getSession in your RSC to protect a route via SSR or useAuthenticate client side

  const cookie = request.cookies.get(process.env.AUTH_COOKIE_NAME!);
  const pathName = request.nextUrl.pathname;
  const isUnprotectedRoute = unprotectedRoutes.includes(pathName);

  if (!cookie) {
    // Redirect to the sign in page of auth app for protected routes
    if (!isUnprotectedRoute) {
      const newUrl = new URL(
        `${process.env.AUTH_APP_LOGIN_URL}${request.nextUrl.search}`
      );
      newUrl.searchParams.set("redirectTo", `${process.env.APP_URL}/home`);
      return NextResponse.redirect(
        newUrl
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/home"],
};
