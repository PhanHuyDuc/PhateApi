"use server";

import { WebInfo } from "@/types";
import { fetchWrapper } from "../fetchWrapper";
import toast from "react-hot-toast";
import { FieldValues } from "react-hook-form";

export async function getWebInfo(): Promise<WebInfo> {
  try {
    const result = await fetchWrapper.get(`/webinfos`);

    return result;
  } catch (error: any) {
    toast.error("Failed to get data " + error.message);
    throw error;
  }
}
export async function getWebInfoById(id: string): Promise<WebInfo> {
  try {
    const result = await fetchWrapper.get(`/webinfos/${id}`);
    return result;
  } catch (error: any) {
    toast.error("Failed to get data " + error.message);
    throw error;
  }
}
export async function updateWebInfo(data: FieldValues, id: string) {
  const result = await fetchWrapper.put(`/webinfos/${id}`, data);
  return result;
}
