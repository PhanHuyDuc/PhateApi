"use client";

import { BannerCategory } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import { useEffect } from "react";
import toast from "react-hot-toast";
import InputForm from "../shared/input-form-hook";
import TextAreaForm from "../shared/textarea-form-hook";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";
import {
  createBannerCat,
  updateBannerCat,
} from "@/lib/actions/bannerCategory.actions";

type Props = {
  bannerCats?: BannerCategory;
};

export default function BannerCategoryForm({ bannerCats }: Props) {
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
    if (bannerCats) {
      setTimeout(() => {
        const { name, description } = bannerCats;
        reset({
          name: name || "",
          description: description || "",
        });
      }, 0);
    }
    setFocus("name");
  }, [bannerCats, reset, setFocus]);

  async function onSubmit(data: FieldValues) {
    try {
      let res;
      if (pathName === "/admin/bannerCats/create") {
        res = await createBannerCat(data);
      } else {
        if (bannerCats) {
          res = await updateBannerCat(data, bannerCats.id.toString());
        }
      }
      if (res.error) {
        throw res.error;
      }
      toast.success("Successful");
      router.push(`/admin/bannerCats`);
    } catch (error: any) {
      toast.error(error.status + " " + error.message);
    }
  }

  return (
    <form className=" space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col md:flex-row gap-5">
        {/* Name */}
        <InputForm
          label="Banner Category name"
          name="name"
          control={control}
          rules={{ required: "Name is required" }}
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
          onClick={() => router.push("/admin/bannerCats")}
          type="button"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
