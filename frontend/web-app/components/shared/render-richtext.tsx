"use client";

import DOMPurify from "dompurify";
import { useEffect, useState } from "react";

type Props = {
  description: string;
};

export default function RenderRichText({ description }: Props) {
  const [sanitizedHtml, setSanitizedHtml] = useState("");
  useEffect(() => {
    setSanitizedHtml(DOMPurify.sanitize(description));
  }, [description]);
  return (
    <div
      className="text-gray-600"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    ></div>
  );
}
