"use server";

import { Artist, PagedResult } from "@/types";
import { fetchWrapper } from "../fetchWrapper";
import toast from "react-hot-toast";
import { FieldValues } from "react-hook-form";

export async function getArtist(query: string): Promise<PagedResult<Artist>> {
  try {
    const result = await fetchWrapper.getPaginated(`/Artists${query}`);
    return result;
  } catch (error: any) {
    toast.error("Failed to get data " + error.message);
    throw error;
  }
}

export async function deleteArtist(id: string) {
  try {
    await fetchWrapper.del(`/Artists/${id}`);
    return { success: true, message: "Deleted success" };
  } catch (error) {
    return {
      success: false,
      message: "Delete error:" + error,
    };
  }
}

export async function createArtist(data: FieldValues) {
  const result = await fetchWrapper.post(`/Artists`, data);

  return result;
}

export async function updateArtist(data: FieldValues, id: string) {
  const result = await fetchWrapper.put(`/Artists/${id}`, data);
  return result;
}

export async function getArtistById(id: string) {
  const result = await fetchWrapper.get(`/Artists/${id}`);
  return result;
}
