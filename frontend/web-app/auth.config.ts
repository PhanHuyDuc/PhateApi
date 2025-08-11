import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [], // Required by NextAuthConfig type
  callbacks: {
    authorized({ request, auth }) {
      // Array of regex patterns of paths we want to protect
      const protectedPaths = [/\/profile/, /\/user\/(.*)/, /\/admin/];

      // Get pathname from the req URL object
      const { pathname } = request.nextUrl;
      // Check if user is not authenticated and accessing a protected path
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

      return true;
    },
  },
} satisfies NextAuthConfig;
