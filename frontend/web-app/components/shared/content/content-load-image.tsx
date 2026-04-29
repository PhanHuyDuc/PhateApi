"use client"; 
import { useState, useEffect, useRef } from "react";
import ImageLoader from "@/components/shared/image-loader";


type ImageProps = {
  id: string;
  url: string;
  order: number;
};

export default function ContentLoadImage({ images }: { images: ImageProps[] }) {
  // 1. Start by only showing the first 20 images
  const [visibleCount, setVisibleCount] = useState(20);
  
  // 2. We use this ref to attach to an invisible div at the bottom
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 3. Set up the Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        // If the invisible div comes into the viewport, load 20 more!
        if (target.isIntersecting) {
          setVisibleCount((prevCount) => Math.min(prevCount + 20, images.length));
        }
      },
      { 
        rootMargin: "400px", // Trigger the load slightly before they hit the very bottom
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    // Cleanup observer on unmount
    return () => observer.disconnect();
  }, [images.length]);

  if (!images || images.length === 0) {
    return <div>No images yet</div>;
  }

  return (
    <div className="place-content-center flex flex-col items-center gap-4">
      {/* 4. Slice the array so we only render the visible amount */}
      {images.slice(0, visibleCount).map((img) => (
        <ImageLoader
          key={img.id}
          src={img.url}
          alt={img.order?.toString() || "Content image"}
          height={720}
          width={1080}
        />
      ))}

      {/* 5. The invisible trigger div */}
      {visibleCount < images.length && (
        <div ref={loaderRef} className="h-20 w-full flex justify-center items-center">
          <span className="text-gray-500 animate-pulse">Loading more...</span>
        </div>
      )}
    </div>
  );
}