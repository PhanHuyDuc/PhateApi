"use client";

import InputForm from "@/components/shared/input-form-hook";
import TextAreaForm from "@/components/shared/textarea-form-hook";
import { Button } from "@/components/ui/button";
import { createContact } from "@/lib/actions/contact.actions";
import { Contact } from "@/types";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Props = {
  contacts?: Contact;
};

export default function ContactForm({ contacts }: Props) {
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
    if (contacts) {
      setTimeout(() => {
        const { name, description, email, phoneNumber } = contacts;
        reset({
          name: name || "",
          description: description || "",
          email: email || "",
          phoneNumber: phoneNumber || "",
        });
      }, 0);
    }
  }, [contacts, reset, setFocus]);

  async function onSubmit(data: FieldValues) {
    try {
      await createContact(data);

      toast.success("Successful");
      router.push(`/contacts`);
      reset();
    } catch (error: any) {
      toast.error(error.status + " " + error.message);
    }
  }

  return (
    <form className=" space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col md:flex-row gap-5">
        <InputForm
          label="Name"
          name="name"
          control={control}
          rules={{ required: "Name is required" }}
          showlabel={true}
        />
        <InputForm
          label="Email"
          name="email"
          control={control}
          showlabel={true}
        />
        <InputForm
          label="Phone Number"
          name="phoneNumber"
          control={control}
          showlabel={true}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-5">
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
      </div>
    </form>
  );
}
