"use client";

import { Banner, BannerCategory } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import { useEffect } from "react";
import toast from "react-hot-toast";
import InputForm from "../shared/input-form-hook";
import SelectForm from "../shared/select-form-hook";
import TextAreaForm from "../shared/textarea-form-hook";
import { Button } from "../ui/button";
import AppDropZone from "../shared/dropzone-form-hook";
import { LoaderCircle } from "lucide-react";
import { createBanner, updateBanner } from "@/lib/actions/banner.actions";

type Props = {
  banner?: Banner;
  bannerCats?: BannerCategory[];
};

export default function BannerForm({ banner, bannerCats }: Props) {
  const router = useRouter();

  const pathName = usePathname();

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
    if (banner) {
      setTimeout(() => {
        const { title, description, link, bannerCategoryId } = banner;
        reset({
          title: title || "",
          description: description || "",
          bannerCategoryId: bannerCategoryId || "",
          link: link || "",
        });
      }, 0);
    }
    setFocus("title");
  }, [banner, reset, setFocus]);

  async function onSubmit(data: FieldValues) {
    try {
      let res;
      if (pathName === "/admin/banners/create") {
        res = await createBanner(data);
      } else {
        if (banner) {
          res = await updateBanner(data, banner.id.toString());
        }
      }
      if (res.error) {
        throw res.error;
      }
      toast.success("Successful");
      router.push(`/admin/banners`);
    } catch (error: any) {
      toast.error(error.status + " " + error.message);
    }
  }

  return (
    <form className=" space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col md:flex-row gap-5">
        {/* Name */}
        <InputForm
          label="Banner title"
          name="title"
          control={control}
          rules={{ required: "Title is required" }}
          showlabel={true}
        />
        {/* Type */}
        <SelectForm
          label="Banner Category"
          placeholder="--Select Category--"
          name="bannerCategoryId"
          control={control}
          showlabel={true}
          rules={{ required: "Category is required" }}
          data={(bannerCats ?? []).map((bannerCat) => ({
            label: bannerCat.name,
            value: bannerCat.id,
          }))}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Link */}
        <InputForm
          label="Link"
          name="link"
          control={control}
          showlabel={true}
        />
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
        {pathName === "/admin/banners/create" ? (
          <AppDropZone
            control={control}
            name="File"
            label="Banner Image"
            rules={{ required: "At least one image needed" }}
          />
        ) : (
          <AppDropZone control={control} name="File" label="Banner Image" />
        )}
      </div>
      <div className="flex justify-between">
        <Button
          type="submit"
          className="bg-green-600 hover:bg-green-400 cursor-pointer"
          size={"lg"}
          disabled={!isDirty || !isValid || isSubmitting}
        >
          {isSubmitting && <LoaderCircle className="animate-spin" />}
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
        <Button
          className="outline bg-gray-500 hover:bg-gray-700 cursor-pointer"
          onClick={() => router.push("/admin/banners")}
          type="button"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
