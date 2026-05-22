"use client"; 
import { useState, useEffect, useRef } from "react";
import ImageLoader from "@/components/shared/image-loader";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

// 1. Removed Thumbnails imports

type ImageProps = {
  id: string;
  url: string;
  order: number;
};

export default function ContentLoadImage({ images }: { images: ImageProps[] }) {
  const [visibleCount, setVisibleCount] = useState(20);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [jumpPage, setJumpPage] = useState(""); 

  const loaderRef = useRef<HTMLDivElement>(null);

  // --- 1. Standard Infinite Scroll Observer ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !lightboxOpen) {
          setVisibleCount((prev) => Math.min(prev + 20, images.length));
        }
      },
      { rootMargin: "400px" }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [images.length, lightboxOpen]);

  // --- 2. The Sync & Scroll Magic ---
  const handleLightboxClose = () => {
    setLightboxOpen(false);

    if (currentIndex >= visibleCount) {
      setVisibleCount(currentIndex + 5); 
    }

    setTimeout(() => {
      const targetElement = document.getElementById(`grid-image-${currentIndex}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "instant", block: "center" });
      }
    }, 100);
  };

  // --- 3. The Custom Jump Handler ---
  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const targetIndex = parseInt(jumpPage) - 1; 

    if (!isNaN(targetIndex) && targetIndex >= 0 && targetIndex < images.length) {
      setCurrentIndex(targetIndex); 
      setJumpPage(""); 
    } else {
      alert(`Please enter a valid page number between 1 and ${images.length}`);
    }
  };

  if (!images || images.length === 0) return <div>No images yet</div>;

  const slides = images.map((img) => ({ src: img.url }));

  return (
    <div className="place-content-center flex flex-col items-center gap-4 relative">
      
      {/* --- Main Page Grid --- */}
      <div className="place-content-center flex flex-col items-center gap-4 w-full">
        {images.slice(0, visibleCount).map((img, i) => (
          <div 
            key={img.id} 
            id={`grid-image-${i}`} 
            className="w-full max-w-3xl cursor-pointer transition-transform hover:scale-[1.01]" 
            onClick={() => {
              setCurrentIndex(i);
              setLightboxOpen(true);
            }}
          >
            <ImageLoader
              src={img.url}
              alt={img.order?.toString() || "Content image"}
              height={720}
              width={1080}
            />
          </div>
        ))}

        {visibleCount < images.length && (
          <div ref={loaderRef} className="h-20 w-full flex justify-center items-center">
            <span className="text-gray-500 animate-pulse">Loading more...</span>
          </div>
        )}
      </div>

      {/* --- The Fullscreen Lightbox --- */}
    <Lightbox
        open={lightboxOpen}
        close={handleLightboxClose} 
        index={currentIndex}
        slides={slides}
        plugins={[Zoom]} 
        on={{
          view: ({ index }) => setCurrentIndex(index),
        }}
        // --- Input jumpto page ---
        toolbar={{
          buttons: [
            // 1. custom form into the Lightbox DOM
            <div 
              key="jump-bar" 
              className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-white/20"
            >
              <form 
                onSubmit={handleJump} 
                className="flex items-center gap-3"
                // 2. Stop event propagation so clicking the input doesn't trigger a swipe/zoom!
                onPointerDownCapture={(e) => e.stopPropagation()}
                onKeyDownCapture={(e) => e.stopPropagation()}
              >
                <span className="text-sm font-medium text-white">Jump:</span>
                <input
                  type="number"
                  min="1"
                  max={images.length}
                  value={jumpPage}
                  onChange={(e) => setJumpPage(e.target.value)}
                  placeholder={`${currentIndex + 1} / ${images.length}`}
                  className="w-24 px-2 py-1 text-black text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="submit"
                  className="bg-white text-black px-3 py-1 text-sm rounded font-medium hover:bg-gray-200 transition-colors"
                >
                  Go
                </button>
              </form>
            </div>,
            
            // 3. Keep the default close button at the top right
            "close", 
          ],
        }}
      />
    </div>
  );
}