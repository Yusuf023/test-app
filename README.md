# Test App with Auth Integration

This is a Next.js application that demonstrates how to integrate with a centralized authentication service. The app uses a two-layer authentication system with optimistic cookie checks in middleware and server-side session verification.

## Authentication Flow

1. **Sign In**: Users are redirected to the auth app's login page with a `redirectTo` parameter
2. **Session Verification**: Two-layer verification:
   - Middleware: Optimistic cookie check
   - Server-side: Full session verification via API
3. **Sign Out**: Handled through the auth app's logout endpoint

## Environment Variables

The following environment variables are required:

```env
# Your app's base URL
APP_URL=http://localhost:3001

# Auth app endpoints
AUTH_APP_LOGIN_URL=https://auth-app.example.com/login
AUTH_APP_SESSION_API_URL=https://auth-app.example.com/api/session
NEXT_PUBLIC_AUTH_APP_LOGOUT_API_URL=https://auth-app.example.com/api/logout

# Cookie name for session
AUTH_COOKIE_NAME=auth_session
```

## Integration Guide

### 1. Middleware Setup

Create a `middleware.ts` file in your project root to handle optimistic authentication:

```typescript
import { type NextRequest, NextResponse } from "next/server";

const unprotectedRoutes = ["/"];

export async function middleware(request: NextRequest) {
  const cookie = request.cookies.get(process.env.AUTH_COOKIE_NAME!);
  const pathName = request.nextUrl.pathname;
  const isUnprotectedRoute = unprotectedRoutes.includes(pathName);

  if (!cookie && !isUnprotectedRoute) {
    const newUrl = new URL(`${process.env.AUTH_APP_LOGIN_URL}${request.nextUrl.search}`);
    newUrl.searchParams.set("redirectTo", `${process.env.APP_URL}/home`);
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/home"],
};
```

### 2. Session Verification

In your protected pages, verify the session using the auth app's session API:

```typescript
const { data: session } = await betterFetch(process.env.AUTH_APP_SESSION_API_URL!, {
  headers: { cookie },
});

if (!session) {
  redirect(`${process.env.AUTH_APP_LOGIN_URL}?redirectTo=${process.env.APP_URL}/home`);
}
```

### 3. Sign Out Implementation

Create a sign-out component that calls the auth app's logout endpoint:

```typescript
const handleSignOut = async () => {
  await betterFetch(process.env.NEXT_PUBLIC_AUTH_APP_LOGOUT_API_URL!, {
    method: "POST",
    credentials: "include",
    headers: { cookie },
  });
  window.location.href = "/";
};
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up the required environment variables
4. Run the development server:
   ```bash
   pnpm dev
   ```

## Security Considerations

- The middleware provides an optimistic check for protected routes
- Always verify the session on the server side for sensitive operations
- Use environment variables for all auth-related URLs and configurations
- Ensure proper CORS and cookie settings in your auth app

## Dependencies

- Next.js 15.3.1
- React 19
- @better-fetch/fetch for API calls
- TailwindCSS for styling
