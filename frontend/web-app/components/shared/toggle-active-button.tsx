"use client";

import { useTransition } from "react";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

type Props = {
  id: string;
  action: (id: string) => Promise<{ success: boolean; message: string }>;
  onSuccess?: () => void;
  isActive: boolean;
};

export default function ToggleButton({
  id,
  action,
  onSuccess,
  isActive,
}: Props) {
  const [isPending, startTransition] = useTransition();
  function hanldeToggleClick() {
    startTransition(async () => {
      const res = await action(id);
      if (!res.success) {
        toast.error(res.message);
      } else {
        onSuccess?.();
        toast.success(res.message);
      }
    });
  }
  return (
    <Button
      onClick={hanldeToggleClick}
      variant="outline"
      size="sm"
      className="cursor-pointer"
      disabled={isPending}
    >
      {isPending ? (
        <LoaderCircle className="animate-spin" />
      ) : isActive ? (
        "Active"
      ) : (
        "Inactive"
      )}
    </Button>
  );
}
