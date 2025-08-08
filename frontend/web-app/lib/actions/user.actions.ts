"use server";

import { signInSchema } from "../validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { auth, signIn, signOut } from "@/auth";

export async function SignIn(prevState: unknown, formData: FormData) {
  try {
    const user = await signInSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    const result = await signIn("Credentials", {
      email: user.email,
      password: user.password,
      redirect: false, // Prevent automatic redirect
    });
    console.log(result);
    // Check for explicit error or null result indicating failure
    if (result?.error || !result) {
      return {
        success: false,
        message: result?.error || "Invalid email or password",
      };
    }

    // Verify that a session was created (optional, for extra validation)
    const session = await auth();
    console.log("Session after signIn:", session);
    if (!session?.user) {
      return {
        success: false,
        message: "Authentication failed: No user session created",
      };
    }

    return { success: true, message: "Login successful" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("SignIn error:", error);
    return { success: false, message: "Invalid email or password" };
  }
}

export async function SignOut() {
  await signOut();
}
