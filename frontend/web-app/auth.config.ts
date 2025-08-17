import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";
import { getCurrentUser } from "./lib/actions/authActions";

export const authConfig = {
  providers: [], // Required by NextAuthConfig type
  callbacks: {
    async authorized({ request, auth }) {
      // Array of regex patterns of paths we want to protect
      const protectedPaths = [/\/profile/, /\/user\/(.*)/];
      const adminPaths = [/\/admin/];
      // Get pathname from the req URL object
      const { pathname } = request.nextUrl;
      // Check if user is not authenticated and accessing a protected path
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

      if (!auth && adminPaths.some((p) => p.test(pathname))) return false;

      //check admin and manager roles
      if (auth && adminPaths.some((p) => p.test(pathname))) {
        const userRoles = (await getCurrentUser())?.roles || [];

        const adminAccess = userRoles.toLocaleString();

        if (adminAccess == "Member") {
          return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
