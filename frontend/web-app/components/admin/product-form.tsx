"use client";

import { Product } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import InputForm from "../shared/input-form-hook";
import SelectForm from "../shared/select-form-hook";
import TextAreaForm from "../shared/textarea-form-hook";
import { Button } from "../ui/button";
import AppDropZone from "../shared/dropzone-form-hook";
import { LoaderCircle } from "lucide-react";

type Props = {
  product?: Product;
};

export default function ProductForm({ product }: Props) {
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
    if (product) {
      setTimeout(() => {
        const {
          name,
          description,
          type,
          brand,
          multiImages,
          price,
          quantityInStock,
          saleOff,
          shortDescription,
        } = product;
        reset({
          name: name || "",
          description: description || "",
          type: type || "",
          brand: brand || "",
          multiImages: multiImages || [],
          price: price || 0,
          quantityInStock: quantityInStock || 0,
          saleOff: saleOff || 0,
          shortDescription: shortDescription || "",
        });
      }, 0);
    }
    setFocus("type");
  }, [product, reset, setFocus]);

  async function onSubmit(data: FieldValues) {
    try {
      let res;
      if (pathName === "/admin/products/create") {
        res = await createProduct(data);
      } else {
        if (product) {
          res = await updateProduct(data, product.id.toString());
        }
      }
      if (res.error) {
        throw res.error;
      }
      toast.success("Successful");
      router.push(`/admin/products`);
    } catch (error: any) {
      toast.error(error.status + " " + error.message);
    }
  }

  return (
    <form className=" space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col md:flex-row gap-5">
        {/* Name */}
        <InputForm
          label="Product Name"
          name="name"
          control={control}
          rules={{ required: "Name is required" }}
          showlabel={true}
        />
        {/* Type */}
        <SelectForm
          label="Type"
          placeholder="--Select type--"
          name="type"
          control={control}
          showlabel={true}
          rules={{ required: "Type is required" }}
          data={[
            { label: "CAFÉ", value: "CAFÉ" },
            { label: "ĐÁ XAY", value: "ĐÁ XAY" },
            { label: "LATTE", value: "LATTE" },
            { label: "YAOURT", value: "YAOURT" },
            { label: "TRÀ SỮA", value: "TRÀ SỮA" },
            { label: "MILK FOAM", value: "MILK FOAM" },
            { label: "TOPPING", value: "TOPPING" },
            { label: "SINH TỐ", value: "SINH TỐ" },
            { label: "NƯỚC ÉP", value: "NƯỚC ÉP" },
            { label: "ĂN VẶT", value: "ĂN VẶT" },
            { label: "TRÀ TRÁI CÂY", value: "TRÀ TRÁI CÂY" },
            { label: "SODA", value: "SODA" },
            { label: "NƯỚC NGỌT", value: "NƯỚC NGỌT" },
          ]}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-5">
        {/* Brand */}
        <SelectForm
          label="Brand"
          placeholder="--Select brand--"
          name="brand"
          control={control}
          showlabel={true}
          rules={{ required: "Brand is required" }}
          data={[{ label: "Daily Coffee", value: "Daily Coffee" }]}
        />
        {/* ShortDesc */}
        <InputForm
          label="Short Description"
          name="shortDescription"
          control={control}
          showlabel={true}
          rules={{ required: "ShortDesc is required" }}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-5">
        {/* Price */}
        <InputForm
          label="Price"
          name="price"
          control={control}
          rules={{ required: "Price is required" }}
          showlabel={true}
          type="number"
        />
        {/* SaleOff */}
        <InputForm
          label="Sale Off"
          name="saleOff"
          control={control}
          showlabel={true}
          type="number"
        />
        {/* Quantity */}
        <InputForm
          label="Quantity in Stock"
          name="quantityInStock"
          control={control}
          showlabel={true}
          type="number"
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
        {pathName === "/admin/products/create" ? (
          <AppDropZone
            control={control}
            name="multiImages"
            label="Product Image"
            rules={{ required: "At least one image needed" }}
          />
        ) : (
          <AppDropZone
            control={control}
            name="multiImages"
            label="Product Image"
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
          onClick={() => router.push("/admin/products")}
          type="button"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
