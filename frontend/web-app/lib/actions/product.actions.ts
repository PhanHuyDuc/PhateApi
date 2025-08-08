"use server";

import { fetchWrapper } from "@/lib/fetchWrapper";
import { Product } from "@/types";

export async function getData(query: string): Promise<Product[]> {
  const result = await fetchWrapper.get(`/products?${query}`);
  if (result.error) {
    throw new Error(result.error.message);
  }
  return Array.isArray(result) ? result : [result];
}
//get single product by slug
export async function getProductBySlug(slug: string): Promise<Product> {
  const result = await fetchWrapper.get(`/products/${slug}`);
  if (result.error) {
    throw new Error(result.error.message);
  }
  return result;
}