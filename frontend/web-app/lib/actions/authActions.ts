"use server";

import { auth } from "@/auth";
import { fetchWrapper } from "../fetchWrapper";
import { Account, RegisterInput } from "@/types";

export async function getCurrentUser() {
  try {
    const session = await auth();

    if (!session) return null;

    return session.user;
  } catch (error) {
    return error;
  }
}

export async function register(user: RegisterInput): Promise<Account> {
  const result = await fetchWrapper.post("/account/register", user);
  return result as Account;
}
