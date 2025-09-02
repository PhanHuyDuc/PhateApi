"use client";

import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  height: number;
  width: number;
  sizes?: string;
  className?: string;
};

export default function ImageLoader({
  alt,
  height,
  src,
  width,
  sizes,
  className,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div className="relative flex items-center justify-center">
      {isLoading && (
        <LoaderCircle className="animate-spin text-gray-500" size={48} />
      )}
      <Image
        alt={alt}
        src={src}
        width={width}
        height={height}
        sizes={sizes}
        priority={true}
        onLoadingComplete={() => setIsLoading(false)}
        className={
          isLoading ? "opacity-0 " + className : "opacity-100 " + className
        }
      />
    </div>
  );
}
