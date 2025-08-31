"use client";

import { createMenu, updateMenu } from "@/lib/actions/menu.actions";
import { Menu } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import InputForm from "../shared/input-form-hook";
import SelectForm from "../shared/select-form-hook";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";

type Props = {
  menu?: Menu;
  menus?: Menu[];
};
export default function MenuForm({ menu, menus }: Props) {
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
    if (menu) {
      setTimeout(() => {
        const { name, type, url, order, parentId } = menu;
        reset({
          name: name || "",
          type: type || "",
          url: url || "",
          order: order || 0,
          parentId: parentId || null,
        });
      }, 0);
    }
    setFocus("name");
  }, [menu, reset, setFocus]);

  async function onSubmit(data: FieldValues) {
    try {
      let res;
      if (pathName === "/admin/menus/create") {
        res = await createMenu(data);
      } else {
        if (menu) {
          res = await updateMenu(data, menu.id.toString());
        }
      }
      if (res.error) {
        throw res.error;
      }
      toast.success("Successful");
      router.push("/admin/menus");
    } catch (error: any) {
      toast.error("Error: " + error.message);
    }
  }
  return (
    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col md:flex-row gap-5">
        <InputForm
          label="Menu Name"
          name="name"
          control={control}
          rules={{ required: "Name is required" }}
        />
        <SelectForm
          label="Type"
          placeholder="--Select type--"
          name="type"
          control={control}
          rules={{ required: "Type is required" }}
          data={[
            { label: "Main menu", value: "main-menu" },
            { label: "Left menu", value: "left-menu" },
            { label: "Right menu", value: "right-menu" },
            { label: "Footer menu", value: "bottom-menu" },
          ]}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-5">
        {/* pass menu list here */}
        {menus && menus.length > 0 ? (
          <SelectForm
            label="Parent Menu"
            placeholder="--Select parent menu--"
            name="parentId"
            control={control}
            data={
              menus?.map((m) => ({ label: m.name, value: m.id.toString() })) ||
              []
            }
          />
        ) : (
          <></>
        )}

        <InputForm
          label="URL"
          name="url"
          defaultValue={"#"}
          control={control}
          rules={{ required: "URL is required" }}
        />
        <InputForm
          label="Order"
          name="order"
          type="number"
          control={control}
          defaultValue={"1"}
          rules={{
            required: "Order is required",
            min: { value: 0, message: "Minimum value is 0" },
          }}
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
          onClick={() => router.push("/admin/menus")}
          type="button"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
