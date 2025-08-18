"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { deleteImageProduct } from "@/lib/actions/product.actions";
import { Loader, MinusIcon } from "lucide-react";

export default function ProductManageImages({ images }: { images: any[] }) {
  const [list, setList] = useState(images);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteImageProduct(id);
    setList(list.filter((img) => img.id !== id));
    setDeletingId(null);
  };

  return (
    <div className="grid grid-cols-5 gap-3">
      {list.map((img, index) => (
        <div key={img.publicId} className="relative gap-3">
          <Image
            src={img.url}
            alt="Product Image"
            height={100}
            width={100}
            className="rounded object-cover w-full h-20"
          />
          {img.isMain ? (
            <Button
              disabled
              className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 hover:bg-red-400"
            >
              <MinusIcon size={20} color="white" />
            </Button>
          ) : (
            <Button
              onClick={() => handleDelete(img.id)}
              className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 hover:bg-red-400"
              disabled={deletingId === img.id}
            >
              {deletingId === img.id ? (
                <Loader className="animate-spin" key={index} />
              ) : (
                <MinusIcon size={20} color="white" />
              )}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
