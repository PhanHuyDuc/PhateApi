"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  deleteImageProduct,
  setMainImage,
} from "@/lib/actions/product.actions";
import { Check, Loader, MinusIcon } from "lucide-react";
import toast from "react-hot-toast";
import ImageLoader from "@/components/shared/image-loader";

export default function ProductManageImages({ images }: { images: any[] }) {
  const [list, setList] = useState(images);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [main, setMain] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteImageProduct(id);
    setList(list.filter((img) => img.id !== id));
    setDeletingId(null);
    toast.success("Delete successful");
  };
  const handleSetMainImage = async (imageId: string, productId: number) => {
    setMain(imageId);
    try {
      await setMainImage(imageId, productId);
      // Update the list to reflect the new main image
      setList(
        list.map((img) => ({
          ...img,
          isMain: img.id === imageId ? true : false,
        }))
      );
      toast.success("Change Main Image successful");
    } catch (error) {
      console.error("Failed to set main image:", error);
    } finally {
      setMain(null);
    }
  };
  return (
    <div className="grid grid-cols-5 gap-3">
      {list.map((img) => (
        <div key={img.publicId} className="relative group">
          <ImageLoader
            src={img.url}
            alt="Product Image"
            height={200}
            width={200}
            className="rounded object-cover w-full h-20"
          />
          {img.isMain ? (
            <>
              <Button
                onClick={() => {
                  toast.error("Cannot delete main image", {
                    style: {
                      border: "1px solid #713200",
                      padding: "16px",
                      color: "#713200",
                      backgroundColor: "yellow",
                    },
                  });
                }}
                className="absolute -top-2 -right-2 bg-red-400 hover:bg-red-300 rounded-full p-1  transition-opacity duration-200 opacity-0 group-hover:opacity-100"
              >
                <MinusIcon size={20} color="white" />
              </Button>

              <Button
                onClick={() => {
                  toast.error("main image already", {
                    style: {
                      border: "1px solid #713200",
                      padding: "16px",
                      color: "#713200",
                      backgroundColor: "yellow",
                    },
                  });
                }}
                className="absolute bottom-0 w-full bg-green-400 hover:bg-green-300 transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                title="Main Image"
              >
                <Check size={20} color="white" />
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => handleDelete(img.id)}
                className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 hover:bg-red-400 transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                disabled={deletingId === img.id || img.isMain}
              >
                {deletingId === img.id ? (
                  <Loader className="animate-spin" size={20} color="white" />
                ) : (
                  <MinusIcon size={20} color="white" />
                )}
              </Button>

              <Button
                onClick={() => handleSetMainImage(img.id, img.productId)}
                className="absolute bottom-0 w-full bg-green-700 hover:bg-green-500 transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                disabled={img.isMain || main === img.id}
                title={img.isMain ? "Main Image" : "Set as Main Image"}
              >
                {main === img.id ? (
                  <Loader className="animate-spin" size={20} color="white" />
                ) : (
                  <Check size={20} color="white" />
                )}
              </Button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
