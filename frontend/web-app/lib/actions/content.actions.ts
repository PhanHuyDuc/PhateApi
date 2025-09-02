"use server";

import { fetchWrapper } from "@/lib/fetchWrapper";
import { PagedResult, Content } from "@/types";
import { FieldValues } from "react-hook-form";
import toast from "react-hot-toast";

export async function getContent(query: string): Promise<PagedResult<Content>> {
  try {
    const result = await fetchWrapper.getPaginated(`/Contents${query}`);
    return result;
  } catch (error: any) {
    toast.error("Failed to get data " + error.message);
    throw error;
  }
}

//get single Content by slug
export async function getContentBySlug(slug: string): Promise<Content> {
  const result = await fetchWrapper.get(`/Contents/${slug}`);
  if (result.error) {
    throw new Error(result.error.message);
  }
  return result;
}

export async function createContent(data: FieldValues) {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "contentImages" && Array.isArray(value)) {
        value.forEach((file: File) => {
          formData.append("contentImages", file);
        });
      } else {
        formData.append(key, value as any);
      }
    });

    const result = await fetchWrapper.postFormData(`/Contents`, formData);
    return result;
  } catch (error) {
    return {
      success: false,
      message: "Create Content failed:" + error,
    };
  }
}

export async function updateContent(data: FieldValues, id: string) {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "contentImages" && Array.isArray(value)) {
        value.forEach((file: File) => {
          formData.append("contentImages", file);
        });
      } else {
        formData.append(key, value as any);
      }
    });

    const result = await fetchWrapper.putFormData(`/Contents/${id}`, formData);
    
    return result;
  } catch (error) {
    return {
      success: false,
      message: "Update Content failed:" + error,
    };
  }
}

export async function deleteContent(id: string) {
  try {
    await fetchWrapper.del(`/Contents/${id}`);
    return { success: true, message: "Deleted success" };
  } catch (error) {
    return {
      success: false,
      message: "Delete error:" + error,
    };
  }
}
