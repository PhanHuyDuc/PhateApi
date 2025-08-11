import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  NEXTAUTH_URL_GETCURRENTUSER,
  NEXTAUTH_URL_LOGIN,
} from "./lib/constants";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      id: "creds",
      name: "Creds",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials): Promise<User | null> {
        if (credentials == null) {
          return null;
        }
        try {
          const loginResponse = await fetch(NEXTAUTH_URL_LOGIN, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          // Extract Set-Cookie headers (array in Node.js fetch)
          const cookies = loginResponse.headers.getSetCookie() || [];
          const cookieHeader = cookies.join("; ");

          if (!loginResponse.ok) {
            throw new Error("Invalid email or password");
          }

          const userResponse = await fetch(NEXTAUTH_URL_GETCURRENTUSER, {
            method: "GET",
            headers: {
              Cookie: cookieHeader, // Manually forward cookies
            },
          });

          if (!userResponse.ok) {
            throw new Error("Failed to fetch user information");
          }
          // Get body as text first to debug invalid JSON
          const userText = await userResponse.text();
          // Attempt to parse JSON
          let userData;
          try {
            userData = JSON.parse(userText);
            
          } catch (parseError) {
            console.error(
              "JSON parsing error:",
              parseError,
              "Raw text:",
              userText
            );
            return null;
          }

          // Validate required fields
          if (!userData.id || !userData.email) {
            console.log(
              "Invalid user data, missing required fields:",
              userData
            );
            return null;
          }

          // Return the user object to be stored in the session
          return {
            id: userData.id,
            email: userData.email,
            name: userData.displayName,
            pictureUrl: userData.pictureUrl,
            bio: userData.bio,
            roles: userData.roles,
            displayName: userData.displayName,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT for session management
  },

  callbacks: {
    async jwt({ token, user }) {
      // When user signs in, add custom fields to the JWT token
      if (user) {
        token.id = user.id;
        token.pictureUrl = user.pictureUrl;
        token.bio = user.bio;
        token.roles = user.roles;
        token.displayName = user.displayName;
      }
      return token;
    },
    async session({ session, token }) {
      // Transfer custom fields from token to session.user
      if (session.user) {
        session.user.id = token.id as string;
        session.user.pictureUrl = token.pictureUrl;
        session.user.bio = token.bio;
        session.user.roles = token.roles;
        session.user.displayName = token.displayName;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async authorized({ auth }) {
      return !!auth;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in", // Error page URL
  },
});
