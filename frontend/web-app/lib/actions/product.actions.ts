"use server";

import { fetchWrapper } from "@/lib/fetchWrapper";
import { PagedResult, Product } from "@/types";
import { revalidatePath } from "next/cache";
import { FieldValues } from "react-hook-form";
import toast from "react-hot-toast";

export async function getData(query: string): Promise<Product> {
  const result = await fetchWrapper.get(`/products${query}`);
  return result;
}
//get single product by slug
export async function getProductBySlug(slug: string): Promise<Product> {
  const result = await fetchWrapper.get(`/products/${slug}`);
  if (result.error) {
    throw new Error(result.error.message);
  }
  return result;
}

export async function createProduct(data: FieldValues) {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "multiImages" && Array.isArray(value)) {
        value.forEach((file: File) => {
          formData.append("multiImages", file);
        });
      } else {
        formData.append(key, value as any);
      }
    });

    const result = await fetchWrapper.postFormData(`/products`, formData);
    revalidatePath("/admin/products");
    return result;
  } catch (error) {
    return {
      success: false,
      message: "Create Product failed:" + error,
    };
  }
}

export async function updateProduct(data: FieldValues, id: string) {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "multiImages" && Array.isArray(value)) {
        value.forEach((file: File) => {
          formData.append("multiImages", file);
        });
      } else {
        formData.append(key, value as any);
      }
    });

    const result = await fetchWrapper.putFormData(`/products/${id}`, formData);
    revalidatePath("/admin/products");
    return result;
  } catch (error) {
    return {
      success: false,
      message: "Create Product failed:" + error,
    };
  }
}

export async function deleteProduct(id: string) {
  try {
    await fetchWrapper.del(`/products/${id}`);
    return { success: true, message: "Deleted success" };
  } catch (error) {
    return {
      success: false,
      message: "Delete error:" + error,
    };
  }
}

export async function getAdminProduct(
  query: string
): Promise<PagedResult<Product>> {
  try {
    const result = await fetchWrapper.getPaginated(`/products${query}`);
    return result;
  } catch (error: any) {
    toast.error("Failed to get data " + error.message);
    throw error;
  }
}
