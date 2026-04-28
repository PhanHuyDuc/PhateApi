"use client";

import { createContent, updateContent } from "@/lib/actions/content.actions";
import { Content } from "@/types";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import InputForm from "../shared/input-form-hook";
import SelectForm from "../shared/select-form-hook";
import TextAreaForm from "../shared/textarea-form-hook";
import AppDropZone from "../shared/dropzone-form-hook";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { getArtist } from "@/lib/actions/artist.actions";
import MultiSelectForm from "../shared/multi-select-form";

type Props = {
  content?: Content;
};

export default function ContentForm({ content }: Props) {
  const router = useRouter();

  const pathName = usePathname();

  const [artists, setArtists] = useState<{ label: string; value: string }[]>(
    []
  );

  const {
    control,
    handleSubmit,
    setFocus,
    reset,
    formState: { isSubmitting, isValid, isDirty },
  } = useForm({
    mode: "onTouched",
  });

  useEffect(() => {
    if (content) {
      setTimeout(() => {
        const { name, description, tag, contentImages, artist } = content;
        reset({
          name: name || "",
          description: description || "",
          artist: artist || "",
          tag: tag || "",
          contentImages: contentImages || [],
        });
      }, 0);
    }
    setFocus("name");
  }, [content, reset, setFocus]);

  // Load artistData
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await getArtist("?pageSize=50");
        const data = Array.isArray(res) ? res : res.results ?? [];

        const artistOptions = data.map((a: any) => ({
          label: a.name,
          value: a.name,
        }));
        setArtists(artistOptions);
      } catch (err) {
        console.error("Failed to fetch artists", err);
      }
    };
    fetchArtists();
  }, []);

  async function onSubmit(data: FieldValues) {
    try {
      let res;
      // 1. move FormData from Server Action
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
      
      const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;
      
      if (pathName === "/admin/contents/create") {
        // 2. Direct browser-to-Azure fetch for CREATE
        const response = await fetch(`${API_URL}/Contents`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!response.ok) {
           const errText = await response.text();
           throw new Error(`Upload failed: ${response.status} - ${errText}`);
        }
        
        // Parse response JSON returns 
        res = await response.json().catch(() => ({})); 

      } else {
        if (content) {
          // 3. Direct browser-to-Azure fetch for UPDATE
          const response = await fetch(`${API_URL}/Contents/${content.id}`, {
            method: "PUT",
            body: formData,
            credentials: "include", 
          });

          if (!response.ok) {
             const errText = await response.text();
             throw new Error(`Update failed: ${response.status} - ${errText}`);
          }
          res = await response.json().catch(() => ({}));
        }
      }

      toast.success("Successful");
      router.push(`/admin/contents`);
      
    } catch (error: any) {
      toast.error(error.message || "Something went wrong!");
    }
  }

  return (
    <form className=" space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col md:flex-row gap-5">
        {/* Name */}
        <InputForm
          label="content Name"
          name="name"
          control={control}
          rules={{ required: "Name is required" }}
          showlabel={true}
        />
        {/* Artist */}
        {!content ? (
          <SelectForm
            label="Artist"
            placeholder="--Select Artist--"
            name="artist"
            control={control}
            showlabel={true}
            rules={{ required: "Artist is required" }}
            data={artists}
          />
        ) : (
          <>
            <InputForm
              label="Artist"
              name="artist"
              control={control}
              showlabel={true}
            />
          </>
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-5">
        {/* Tag */}
        {!content ? (
          <MultiSelectForm
            label="Tags"
            placeholder="--Select tags--"
            name="tag"
            control={control}
            showlabel={true}
            rules={{ required: "At least one tag is required" }}
            data={[
              { label: "Group", value: "Group" },
              { label: "Huge Tits", value: "Huge Tits" },
              { label: "Pregnant", value: "Pregnant" },
              { label: "Schoolgirl uniform", value: "Schoolgirl uniform" },
              { label: "NTR", value: "NTR" },
              { label: "Crying", value: "Crying" },
              { label: "Cheating", value: "Cheating" },
            ]}
          />
        ) : (
          <>
            <InputForm
              label="Tag"
              name="tag"
              control={control}
              showlabel={true}
            />
          </>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Description */}
        <TextAreaForm
          label="Description"
          name="description"
          control={control}
          showlabel={true}
          rules={{ required: "Description is required" }}
        />
      </div>
      <div className="upload-field flex flex-col md:flex-row gap-5">
        {/* Image */}
        {pathName === "/admin/contents/create" ? (
          <AppDropZone
            control={control}
            name="contentImages"
            label="Content Image"
            rules={{ required: "At least one image needed" }}
          />
        ) : (
          <AppDropZone
            control={control}
            name="contentImages"
            label="Content Image"
          />
        )}
      </div>
      <div className="flex justify-between">
        <Button
          type="submit"
          className="bg-green-600 hover:bg-green-400"
          size={"lg"}
          disabled={!isDirty || !isValid || isSubmitting}
        >
          {isSubmitting && <LoaderCircle className="animate-spin" />}
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
        <Button
          className="outline bg-gray-500 hover:bg-gray-700 cursor-pointer"
          onClick={() => router.push("/admin/contents")}
          type="button"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
