import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserInfo } from "./lib/actions/authActions";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (credentials == null) {
          return null;
        }

        try {
          console.log("Sending request to login API...");
          // Step 1: Make a POST request to the login API
          const loginResponse = await fetch(
            "http://localhost:5001/api/login?useCookies=true",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
              credentials: "include", // Include cookies in the request
            }
          );
          console.log("Login API response status:", loginResponse.status);

          // Step 2: Check if the login was successful
          if (loginResponse.ok) {
            const userData = await getUserInfo();
            if (!userData) return null;
            return {
              id: userData.id,
              email: userData.email,
              displayName: userData.displayName,
              bio: userData.bio,
              pictureUrl: userData.pictureUrl,
              roles: userData.roles,
            };
          } else {
            // Handle failed login (e.g., invalid credentials)
            return null;
          }
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
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
