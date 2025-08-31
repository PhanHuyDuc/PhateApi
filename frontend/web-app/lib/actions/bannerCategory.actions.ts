"use server";

import { BannerCategory, PagedResult } from "@/types";
import { fetchWrapper } from "../fetchWrapper";
import toast from "react-hot-toast";
import { FieldValues } from "react-hook-form";

export async function getAdminBannerCat(
  query: string
): Promise<PagedResult<BannerCategory>> {
  try {
    const result = await fetchWrapper.getPaginated(`/bannercategories${query}`);
    return result;
  } catch (error: any) {
    toast.error("Failed to get data " + error.message);
    throw error;
  }
}

export async function deleteBannerCat(id: string) {
  try {
    await fetchWrapper.del(`/bannercategories/${id}`);
    return { success: true, message: "Deleted success" };
  } catch (error) {
    return {
      success: false,
      message: "Delete error:" + error,
    };
  }
}

export async function createBannerCat(data: FieldValues) {
  const result = await fetchWrapper.post(`/bannercategories`, data);
  console.log(result);
  return result;
}

export async function updateBannerCat(data: FieldValues, id: string) {
  const result = await fetchWrapper.put(`/bannercategories/${id}`, data);
  return result;
}

export async function getBannerCatById(id: string) {
  const result = await fetchWrapper.get(`/bannercategories/${id}`);
  return result;
}
