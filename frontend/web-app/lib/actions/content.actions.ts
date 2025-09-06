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

// export async function createContent(data: FieldValues) {
//   try {
//     const formData = new FormData();

//     Object.entries(data).forEach(([key, value]) => {
//       if (key === "contentImages" && Array.isArray(value)) {
//         value.forEach((file: File) => {
//           formData.append("contentImages", file);
//         });
//       } else {
//         formData.append(key, value as any);
//       }
//     });

//     const result = await fetchWrapper.postFormData(`/Contents`, formData);
//     return result;
//   } catch (error) {
//     return {
//       success: false,
//       message: "Create Content failed:" + error,
//     };
//   }
// }

export async function createContent(data: FieldValues) {
  try {
    const { contentImages, ...rest } = data;

    if (!Array.isArray(contentImages) || contentImages.length === 0) {
      // No images, just send the rest
      const formData = new FormData();
      Object.entries(rest).forEach(([key, value]) => {
        formData.append(key, value as any);
      });
      return await fetchWrapper.postFormData(`/Contents`, formData);
    }

    // Split images into chunks of 15
    const chunkSize = 15;
    const chunks: File[][] = [];
    for (let i = 0; i < contentImages.length; i += chunkSize) {
      chunks.push(contentImages.slice(i, i + chunkSize));
    }

    let result: any = null;

    // Upload chunks sequentially
    for (let i = 0; i < chunks.length; i++) {
      const formData = new FormData();

      // Add non-file fields only for the first chunk
      if (i === 0) {
        Object.entries(rest).forEach(([key, value]) => {
          formData.append(key, value as any);
        });
      }

      // Add the current chunk of images
      chunks[i].forEach((file: File) => {
        formData.append("contentImages", file);
      });

      // Mark chunk index so backend can handle "append" uploads
      formData.append("chunkIndex", i.toString());
      formData.append("totalChunks", chunks.length.toString());

      result = await fetchWrapper.postFormData(`/Contents`, formData);

      if (!result?.success) {
        throw new Error(result?.message || `Chunk ${i + 1} failed`);
      }
    }

    return result; // Final result after last chunk
  } catch (error) {
    return {
      success: false,
      message: "Create Content failed: " + error,
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
