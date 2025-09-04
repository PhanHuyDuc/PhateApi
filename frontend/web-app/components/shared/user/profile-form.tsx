"use client";

import InputForm from "@/components/shared/input-form-hook";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function ProfileForm() {
  const { data: session } = useSession();
  const {
    control,
    reset,
    formState: {},
  } = useForm({
    mode: "onTouched",
  });
  useEffect(() => {
    if (session?.user) {
      reset({
        email: session.user.email || "",
        displayName: session.user.displayName || "",
      });
    }
  }, [session, reset]);
  return (
    <>
      <form className="flex flex-col gap-5">
        <div className="flex flex-col gap-5">
          <InputForm name="email" label="Email" control={control} disabled />
        </div>
        <div className="flex flex-col gap-5">
          <InputForm
            name="displayName"
            label="Display Name"
            control={control}
            disabled
          />
        </div>
      </form>
    </>
  );
}
