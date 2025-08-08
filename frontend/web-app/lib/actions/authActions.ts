"use server";

import { Account } from "@/types";
import { fetchWrapper } from "../fetchWrapper";
import { auth } from "@/auth";

export async function getUserInfo(): Promise<Account> {
  const result = await fetchWrapper.get("/account/user-info");
  return result;
}

export async function getCurrentUser() {
  try {
    const session = await auth();

    if (!session) return null;

    return session.user;
  } catch (error) {
    console.log(error);
    return null;
  }
}
