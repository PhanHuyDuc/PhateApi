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
    const files: File[] = Array.isArray(data.contentImages)
      ? data.contentImages
      : [];

    const chunkSize = 3;
    let contentId: string | null = null;

    // First chunk: Include DTO and first 3 images (or all if less than 3)
    const firstChunk = files.slice(0, Math.min(chunkSize, files.length));
    const formData = new FormData();

    // Add all form fields except contentImages
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "contentImages") {
        formData.append(key, value as any);
      }
    });

    // Add first chunk images
    firstChunk.forEach((file) => {
      formData.append("contentImages", file);
    });

    console.log(`Creating content with ${firstChunk.length} images...`);
    const createRes = await fetchWrapper.postFormData(`/Contents`, formData);

    // Check if response has error property (error case)
    if (createRes.error) {
      throw new Error(createRes.error.message || "Failed to create content");
    }

    // Extract content ID from successful response
    contentId = createRes.id || createRes.Id;
    if (!contentId) {
      throw new Error("Could not extract content ID from response");
    }

    console.log(`Content created with ID: ${contentId}`);

    // Remaining chunks: Append images only (if there are more than chunkSize images)
    if (files.length > chunkSize) {
      for (let i = chunkSize; i < files.length; i += chunkSize) {
        const chunk = files.slice(i, i + chunkSize);
        const appendFormData = new FormData();

        chunk.forEach((file) => {
          appendFormData.append("contentImages", file);
        });

        console.log(
          `Appending chunk ${
            Math.floor((i - chunkSize) / chunkSize) + 2
          } with ${chunk.length} images...`
        );

        const appendRes = await fetchWrapper.postFormData(
          `/Contents/${contentId}/images`,
          appendFormData
        );

        // Check if append response has error
        if (appendRes.error) {
          throw new Error(
            `Failed to append image chunk ${
              Math.floor((i - chunkSize) / chunkSize) + 2
            }: ${appendRes.error.message}`
          );
        }
      }
    }

    return { success: true, contentId };
  } catch (error: any) {
    console.error("Create content error:", error);
    return {
      success: false,
      message: "Create Content failed: " + error.message,
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
