// proxy.ts
import { auth } from "@/auth";

// 1. Explicitly export the auth function as the named "proxy" export.
// This tells Turbopack exactly what it wants to hear.
export const proxy = auth;

// Alternatively, you can do it in one line like this:
// export { auth as proxy } from "@/auth";

// 2. Keep your matcher exactly the same
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};