"use client";

import { Contact } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import { useEffect } from "react";
import toast from "react-hot-toast";
import InputForm from "../shared/input-form-hook";
import TextAreaForm from "../shared/textarea-form-hook";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";
import { createBannerCat } from "@/lib/actions/bannerCategory.actions";

type Props = {
  contact?: Contact;
};

export default function ContactForm({ contact }: Props) {
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
    if (contact) {
      setTimeout(() => {
        const { name, email, phoneNumber, description } = contact;
        reset({
          name: name || "",
          description: description || "",
          email: email || "customer@gmail.com",
          phoneNumber: phoneNumber || "",
        });
      }, 0);
    }
    setFocus("name");
  }, [contact, reset, setFocus]);

  async function onSubmit(data: FieldValues) {
    try {
      let res;
      if (pathName === "/admin/contacts/create") {
        res = await createBannerCat(data);
      }
      if (res.error) {
        throw res.error;
      }
      toast.success("Successful");
      router.push(`/contacts`);
    } catch (error: any) {
      toast.error(error.status + " " + error.message);
    }
  }

  return (
    <form className=" space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col md:flex-row gap-5">
        {/* Name */}
        <InputForm
          label="Name"
          name="name"
          control={control}
          rules={{ required: "Name is required" }}
        />
        {/* Email */}
        <InputForm label="Email" name="email" control={control} />
        <InputForm label="Phone Number" name="phoneNumber" control={control} />
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Description */}
        <TextAreaForm
          label="Description"
          name="description"
          control={control}
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
      </div>
    </form>
  );
}
