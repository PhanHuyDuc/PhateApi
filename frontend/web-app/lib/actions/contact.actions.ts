"use server";

import { Contact, PagedResult } from "@/types";
import { fetchWrapper } from "../fetchWrapper";
import toast from "react-hot-toast";
import { FieldValues } from "react-hook-form";

export async function getAdminContact(
  query: string
): Promise<PagedResult<Contact>> {
  try {
    const result = await fetchWrapper.getPaginated(`/contacts/admin${query}`);
    return result;
  } catch (error: any) {
    toast.error("Failed to get data " + error.message);
    throw error;
  }
}

export async function createContact(data: FieldValues) {
  const result = await fetchWrapper.post(`/contacts`, data);
  return result;
}

export async function resolvedContact(id: string) {
  await fetchWrapper.post(`/contacts/resolve/${id}`, {});
  return { success: true, message: "Change success" };
}
