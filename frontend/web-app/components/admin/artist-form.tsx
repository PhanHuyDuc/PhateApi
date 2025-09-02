"use client";

import { createArtist, updateArtist } from "@/lib/actions/artist.actions";
import { Artist } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import InputForm from "../shared/input-form-hook";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";

type Props = {
  artists?: Artist;
};

export default function ArtistForm({ artists }: Props) {
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
    if (artists) {
      setTimeout(() => {
        const { name } = artists;
        reset({
          name: name || "",
        });
      }, 0);
    }
    setFocus("name");
  }, [artists, reset, setFocus]);

  async function onSubmit(data: FieldValues) {
    try {
      let res;
      if (pathName === "/admin/artists/create") {
        res = await createArtist(data);
      } else {
        if (artists) {
          res = await updateArtist(data, artists.id.toString());
        }
      }
      if (res.error) {
        throw res.error;
      }
      toast.success("Successful");
      router.push(`/admin/artists`);
    } catch (error: any) {
      toast.error(error.status + " " + error.message);
    }
  }

  return (
    <form className=" space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col md:flex-row gap-5">
        {/* Name */}
        <InputForm
          label="Aritst Name"
          name="name"
          control={control}
          rules={{ required: "Name is required" }}
          showlabel={true}
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
          onClick={() => router.push("/admin/artists")}
          type="button"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
