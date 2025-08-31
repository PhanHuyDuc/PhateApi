"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";

type Props = {
  id: string;
  action: (id: string) => Promise<{ success: boolean; message: string }>;
  onSuccess?: () => void;
  Resolved: boolean;
};
export default function ResolvedButton({
  id,
  action,
  onSuccess,
  Resolved,
}: Props) {
  const [isPending, startTransition] = useTransition();
  function hanldeResolvedClick() {
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
      onClick={hanldeResolvedClick}
      variant="outline"
      size="sm"
      className="cursor-pointer"
      disabled={isPending || Resolved}
    >
      {isPending ? (
        <LoaderCircle className="animate-spin" />
      ) : Resolved ? (
        "Resolved"
      ) : (
        "Not Resolved"
      )}
    </Button>
  );
}
