"use client";

import { Banner } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import AutoPlay from "embla-carousel-autoplay";
import Link from "next/link";
import ImageLoader from "./image-loader";

type Props = {
  data: Banner[];
};
export default function MainCarousel({ data }: Props) {
  return (
    <>
      <Carousel
        className="w-full mb-12"
        opts={{ loop: true }}
        plugins={[
          AutoPlay({
            delay: 10000,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
          }),
        ]}
      >
        <CarouselContent>
          {data.map((banner: Banner) => (
            <CarouselItem key={banner.id}>
              <Link href={`${banner.link}`}>
                <div className="relative mx-auto">
                  <ImageLoader
                    src={banner.url}
                    alt={banner.title}
                    height={0}
                    width={0}
                    sizes="100vw"
                    className="h-auto w-full"
                  />
                  <div className="absolute inset-0 flex items-end justify-center">
                    <h2 className="bg-gray-900 opacity-50 text-2xl font-bold px-2 text-white">
                      {banner.title}
                    </h2>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
}
