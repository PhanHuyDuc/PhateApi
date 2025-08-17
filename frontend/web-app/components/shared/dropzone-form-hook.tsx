"use client";

import { useCallback, useState } from "react";
import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { AlertCircleIcon, MinusIcon, UploadIcon, X } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Alert, AlertTitle } from "../ui/alert";

type Props<T extends FieldValues> = {
  label?: string;
} & UseControllerProps<T>;

export default function AppDropZone<T extends FieldValues>({
  label,
  ...props
}: Props<T>) {
  const { field, fieldState } = useController({ ...props });

  // local preview state
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      // add previews
      const newPreviews = acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );

      setPreviews((prev) => [...prev, ...newPreviews]);

      // update form state
      field.onChange([...(field.value || []), ...acceptedFiles]);
    },
    [field]
  );

  const removeFile = (index: number) => {
    const updatedFiles = (field.value || []).filter(
      (_: File, i: number) => i !== index
    );
    const updatedPreviews = previews.filter((_, i) => i !== index);

    field.onChange(updatedFiles);
    setPreviews(updatedPreviews);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  return (
    <div className="space-y-3 block w-full">
      {label && <p className="font-medium">{label}</p>}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <UploadIcon size={40} className="mx-auto text-gray-500" />
        <p className="text-gray-600">
          Drag & drop images here, or click to select
        </p>
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {previews.map((src, i) => (
            <div key={i} className="relative">
              <Image
                src={src}
                alt={`preview-${i}`}
                width={100}
                height={100}
                className="rounded object-cover w-full h-20"
              />
              <Button
                onClick={() => removeFile(i)}
                className="absolute -top-2 -right-2 bg-red-600 rounded-full shadow p-1 hover:bg-red-400"
              >
                <MinusIcon size={20} color="white" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {fieldState.error && (
        <Alert variant={"destructive"}>
          <AlertCircleIcon />
          <AlertTitle>{fieldState.error.message}</AlertTitle>
        </Alert>
      )}
    </div>
  );
}
