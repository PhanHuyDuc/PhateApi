"use server";

import { Menu, PagedResult } from "@/types";
import { fetchWrapper } from "../fetchWrapper";
import toast from "react-hot-toast";
import { FieldValues } from "react-hook-form";

export async function getAdminMenu(query: string): Promise<PagedResult<Menu>> {
  try {
    const result = await fetchWrapper.getPaginated(
      `/menus/getadminmenu${query}`
    );

    return result;
  } catch (error: any) {
    toast.error("Failed to get data " + error.message);
    throw error;
  }
}

export async function getAllMenu(): Promise<Menu> {
  const result = await fetchWrapper.get(`/menus`);
  return result;
}

export async function deleteMenu(id: string) {
  try {
    await fetchWrapper.del(`/menus/${id}`);
    return { success: true, message: "Deleted success" };
  } catch (error) {
    return {
      success: false,
      message: "Delete error:" + error,
    };
  }
}

export async function createMenu(data: FieldValues) {
  const result = await fetchWrapper.post(`/menus`, data);

  return result;
}

export async function updateMenu(data: FieldValues, id: string) {
  const result = await fetchWrapper.put(`/menus/${id}`, data);
  return result;
}

export async function getMenuById(id: string) {
  const result = await fetchWrapper.get(`/menus/${id}`);
  return result;
}

export async function toggleMenu(id: string) {
  await fetchWrapper.post(`/menus/toggle-active/${id}`, {});
  return { success: true, message: "Change success" };
}
