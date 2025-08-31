"use client";

import { useParamsStore } from "@/hooks/useParamsStore";
import { Button } from "../ui/button";

type Props = {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
};

export default function EmptyData({
  title = "No matches for this fitler",
  subtitle = "try changing the filter or search term",
  showReset,
}: Props) {
  const reset = useParamsStore((state) => state.reset);
  return (
    <div className="flex flex-col gap-2 items-center justify-center h-[40vh] shadow-lg">
      <div className={"text-center"}>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && (
          <p className="font-light text-neutral-500 mt-2">{subtitle}</p>
        )}
      </div>
      <div className="mt-4">
        {showReset && (
          <Button variant={"outline"} onClick={reset}>
            Remove filters
          </Button>
        )}
      </div>
    </div>
  );
}
