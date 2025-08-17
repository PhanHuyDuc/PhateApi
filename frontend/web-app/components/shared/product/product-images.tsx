"use client";
import { cn } from "@/lib/utils";
import { MultiImage } from "@/types";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  multiImage: MultiImage[];
};
export default function ProductImages({ multiImage }: Props) {
  const mainImage = multiImage.find((image) => image.isMain)?.url;
  const [current, setCurrent] = useState(mainImage);
  // Update current when multiImage changes (e.g., prop updates)
  useEffect(() => {
    const newMainImageUrl =
      multiImage.find((image) => image.isMain)?.url || multiImage[0]?.url || "";
    setCurrent(newMainImageUrl);
  }, [multiImage]);

  return (
    <div className="space-y-4">
      <Image
        src={
          current ||
          "https://cdn.pixabay.com/photo/2015/03/12/06/56/frame-669754_640.png"
        }
        alt="product image"
        width={1000}
        height={1000}
        className="min-h-[300px] object-cover object-center"
      />
      <div className="flex">
        {multiImage.map((image) => (
          <div
            key={image.id}
            onClick={() => setCurrent(image.url)}
            className={cn(
              "border mr-2 cursor-pointer hover:border-orange-600",
              current === image.url && "border-orange-500"
            )}
          >
            <Image src={image.url || ""} alt="image" width={100} height={100} />
          </div>
        ))}
      </div>
    </div>
  );
}
