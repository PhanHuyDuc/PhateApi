"use server";

import { signInSchema, signUpSchema } from "../validators";
import { signIn, signOut } from "@/auth";
import { register } from "./authActions";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function SignIn(prevState: unknown, formData: FormData) {
  try {
    const user = await signInSchema.parseAsync({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const result = await signIn("creds", {
      email: user.email,
      password: user.password,
      redirect: false,
    });

    if (!result) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    return {
      success: true,
      message: "Signed in successfully",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "Invalid email or password" };
  }
}

export async function SignOut() {
  await signOut({ redirectTo: "/sign-in" });
}

export async function SignUp(prevState: unknown, formData: FormData) {
  try {
    const user = signUpSchema.parse({
      displayName: formData.get("displayName"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      bio: formData.get("bio"),
    });

    //POST to register function
    const registerResult = (await register(user)) as any;

    if (registerResult?.error) {
      return {
        success: false,
        message: "Email already register ",
      };
    }

    //SignIn when register success
    await signIn("creds", {
      email: user.email,
      password: user.password,
      redirect: false,
    });
    return { success: true, message: "user registered successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: error };
  }
}
