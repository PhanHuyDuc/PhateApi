"use server";

import { Banner, PagedResult } from "@/types";
import { fetchWrapper } from "../fetchWrapper";
import toast from "react-hot-toast";
import { FieldValues } from "react-hook-form";

export async function getAdminBanner(
  query: string
): Promise<PagedResult<Banner>> {
  try {
    const result = await fetchWrapper.getPaginated(`/banners${query}`);
    return result;
  } catch (error: any) {
    toast.error("Failed to get data " + error.message);
    throw error;
  }
}

export async function getBannerById(id: string): Promise<Banner> {
  const result = await fetchWrapper.get(`/banners/${id}`);
  if (result.error) {
    throw new Error(result.error.message);
  }
  return result;
}

export async function deleteBanner(id: string) {
  try {
    await fetchWrapper.del(`/banners/${id}`);
    return { success: true, message: "Deleted success" };
  } catch (error) {
    return {
      success: false,
      message: "Delete error:" + error,
    };
  }
}

export async function createBanner(data: FieldValues) {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "File" && Array.isArray(value)) {
        value.forEach((file: File) => {
          formData.append("File", file);
        });
      } else {
        formData.append(key, value as any);
      }
    });

    const result = await fetchWrapper.postFormData(`/banners`, formData);

    return result;
  } catch (error) {
    return {
      success: false,
      message: "Create Banner failed: " + error,
    };
  }
}

export async function updateBanner(data: FieldValues, id: string) {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "File" && Array.isArray(value)) {
        value.forEach((file: File) => {
          formData.append("File", file);
        });
      } else {
        formData.append(key, value as any);
      }
    });
    const result = await fetchWrapper.putFormData(`/banners/${id}`, formData);
    return result;
  } catch (error) {
    return {
      success: false,
      message: "Update Banner failed:" + error,
    };
  }
}

export async function toggleBanner(id: string) {
  try {
    await fetchWrapper.post(`/banners/toggle-active/${id}`, {});

    return { success: true, message: "Change success" };
  } catch (error) {
    return {
      success: false,
      message: "Toggle status error:" + error,
    };
  }
}
