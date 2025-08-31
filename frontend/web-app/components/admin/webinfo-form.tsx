"use client";

import { WebInfo } from "@/types";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import { useEffect } from "react";
import toast from "react-hot-toast";
import InputForm from "../shared/input-form-hook";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";
import { updateWebInfo } from "@/lib/actions/WebInfo.actions";

type Props = {
  webInfo?: WebInfo;
};

export default function WebInfoForm({ webInfo }: Props) {
  const router = useRouter();

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
    if (webInfo) {
      setTimeout(() => {
        const { title, email, phoneNumber, metaDescription, url, keywords } =
          webInfo;
        reset({
          title: title || "",
          metaDescription: metaDescription || "",
          email: email || "",
          phoneNumber: phoneNumber || "",
          url: url || "#",
          keywords: keywords || "",
        });
      }, 0);
    }
    setFocus("title");
  }, [webInfo, reset, setFocus]);

  async function onSubmit(data: FieldValues) {
    try {
      let res;
      if (webInfo) {
        res = await updateWebInfo(data, webInfo?.id.toString());
      }

      if (res.error) {
        throw res.error;
      }
      toast.success("Successful");
      router.push(`/admin/infos`);
    } catch (error: any) {
      toast.error(error.status + " " + error.message);
    }
  }

  return (
    <form className=" space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col md:flex-row gap-5">
        <InputForm
          label="Title"
          name="title"
          control={control}
          rules={{ required: "Title is required" }}
        />

        <InputForm label="Email" name="email" control={control} />
        <InputForm label="Phone Number" name="phoneNumber" control={control} />
      </div>
      <div className="flex flex-col md:flex-row gap-5">
        <InputForm
          label="metaDescription"
          name="metaDescription"
          control={control}
          rules={{ required: "meta Description is required" }}
        />

        <InputForm label="Url" name="url" control={control} />
        <InputForm label="Key words" name="keywords" control={control} />
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
          onClick={() => router.push("/admin/infos")}
          type="button"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
