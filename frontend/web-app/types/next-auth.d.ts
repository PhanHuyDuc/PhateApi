import { type DefaultSession } from "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      displayName: string;
      pictureUrl: string;
      bio: string;
      roles: string[];
    } & DefaultSession["user"];
    accessToken: string;
  }

  interface User {
    id: string;
    email: string;
    displayName: string;
    pictureUrl: string;
    bio: string;
    roles: string[];
    cookies: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email: string;
    id: string;
    displayName: string;
    pictureUrl: string;
    bio: string;
    roles: string[];
    cookies: string;
  }
}
