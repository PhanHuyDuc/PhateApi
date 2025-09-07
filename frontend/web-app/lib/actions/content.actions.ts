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

// export async function createContent(data: FieldValues) {
//   try {
//     const files: File[] = Array.isArray(data.contentImages)
//       ? data.contentImages
//       : [];
//     const chunkSize = 3;
//     let contentId: string | null = null;

//     // First chunk: Include DTO and first images
//     const firstChunk = files.slice(0, chunkSize);
//     const formData = new FormData();
//     Object.entries(data).forEach(([key, value]) => {
//       if (key !== "contentImages") {
//         formData.append(key, value as any);
//       }
//     });
//     firstChunk.forEach((file) => {
//       formData.append("contentImages", file);
//     });
//     console.log("first chunk: " + formData);
//     const createRes = await fetchWrapper.postFormData(`/Contents`, formData);

//     if (!createRes.success) {
//       throw new Error(createRes.message || "Failed to create content");
//     }
//     contentId = createRes.data; // Assuming backend returns content.Id as string

//     // Remaining chunks: Append images only
//     for (let i = chunkSize; i < files.length; i += chunkSize) {
//       const chunk = files.slice(i, i + chunkSize);
//       const appendFormData = new FormData();
//       chunk.forEach((file) => {
//         appendFormData.append("contentImages", file);
//       });

//       const appendRes = await fetchWrapper.postFormData(
//         `/Contents/${contentId}/images`,
//         appendFormData
//       );
//       console.log("append Form Data: " + appendFormData);
//       if (!appendRes.success) {
//         throw new Error(appendRes.message || "Failed to append image chunk");
//       }
//     }

//     return { success: true, contentId };
//   } catch (error: any) {
//     return {
//       success: false,
//       message: "Create Content failed: " + error.message,
//     };
//   }
// }

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
