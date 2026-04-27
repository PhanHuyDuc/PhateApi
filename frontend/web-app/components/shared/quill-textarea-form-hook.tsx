import { useController, UseControllerProps } from "react-hook-form";
import { useEffect, useRef, useMemo } from "react";
import { Label } from "../ui/label";
import { Alert, AlertTitle } from "../ui/alert";
import { AlertCircleIcon } from "lucide-react";
import "quill/dist/quill.snow.css";

// Dynamically import Quill to prevent SSR issues
const loadQuill = () => import("quill");

type Props = {
  label: string;
  showlabel?: boolean;
  placeholder?: string;
  theme?: "snow" | "bubble";
  modules?: any;
  formats?: string[];
} & UseControllerProps;

export default function QuillTextAreaForm(props: Props) {
  const { field, fieldState } = useController({ ...props });
  const quillRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<any>(null);
  const isUpdatingContent = useRef(false);
  const isInitialized = useRef(false);

  // Memoize the configuration to prevent recreation
  const quillConfig = useMemo(
    () => ({
      theme: props.theme || "snow",
      placeholder: props.placeholder || props.label,
      modules: props.modules || {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ header: 1 }, { header: 2 }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ direction: "rtl" }],
          [{ size: ["small", false, "large", "huge"] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
          ["clean"],
          ["link", "image", "video"],
        ],
      },
      formats: props.formats || [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "color",
        "background",
        "align",
        "size",
        "font",
        "code-block",
        "script",
        "direction",
      ],
    }),
    [props.theme, props.placeholder, props.label, props.modules, props.formats]
  );

  // Initialize Quill only once
  useEffect(() => {
    // Prevent double initialization
    if (isInitialized.current || !quillRef.current) return;

    const container = quillRef.current;

    // Check if already has Quill elements (StrictMode protection)
    if (
      container.querySelector(".ql-toolbar") ||
      container.querySelector(".ql-editor")
    ) {
      return;
    }

    const initializeQuill = async () => {
      try {
        // Dynamic import for Next.js
        const QuillModule = await loadQuill();
        const Quill = QuillModule.default;

        // Clear container
        container.innerHTML = "";

        // Initialize Quill
        quillInstance.current = new Quill(container, quillConfig);
        isInitialized.current = true;

        // Set initial content
        if (field.value) {
          quillInstance.current.root.innerHTML = field.value;
        }

        // Handle text changes
        const handleTextChange = () => {
          if (isUpdatingContent.current || !quillInstance.current) return;

          const html = quillInstance.current.root.innerHTML || "";
          const isEmpty = quillInstance.current.getText().trim().length === 0;
          field.onChange(isEmpty ? "" : html);
        };

        // Handle blur event for validation
        const handleSelectionChange = (range: any) => {
          if (!range) {
            field.onBlur();
          }
        };

        quillInstance.current.on("text-change", handleTextChange);
        quillInstance.current.on("selection-change", handleSelectionChange);
      } catch (error) {
        console.error("Failed to load Quill:", error);
      }
    };

    initializeQuill();

    // Cleanup function
    return () => {
      if (quillInstance.current) {
        try {
          quillInstance.current.off("text-change");
          quillInstance.current.off("selection-change");
        } catch (error) {
          // Ignore cleanup errors
          throw error;
        }
        quillInstance.current = null;
      }
      if (container) {
        container.innerHTML = "";
      }
      isInitialized.current = false;
    };
  }, []); // Empty dependency array - only run once

  // Update Quill content when field value changes externally
  useEffect(() => {
    if (
      quillInstance.current &&
      field.value !== quillInstance.current.root.innerHTML
    ) {
      isUpdatingContent.current = true;
      const selection = quillInstance.current.getSelection();
      quillInstance.current.root.innerHTML = field.value || "";
      if (selection) {
        quillInstance.current.setSelection(selection);
      }
      isUpdatingContent.current = false;
    }
  }, [field.value]);

  // Dynamic border styling based on field state
  const borderClass = useMemo(() => {
    if (fieldState?.error) {
      return "quill-error";
    }
    if (fieldState.isDirty && !fieldState.error) {
      return "quill-success";
    }
    return "";
  }, [fieldState?.error, fieldState.isDirty]);

  return (
    <div className="mb-3 block w-full">
      {props.showlabel && (
        <div className="my-3">
          <Label htmlFor={field.name}>{props.label}</Label>
        </div>
      )}

      <div className={`quill-wrapper ${borderClass}`}>
        <div ref={quillRef} style={{ minHeight: "150px" }} />
      </div>

      {fieldState.error && (
        <Alert variant={"destructive"} className="mt-2">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>{fieldState.error.message}</AlertTitle>
        </Alert>
      )}

      <style jsx>{`
        .quill-wrapper .ql-editor {
          min-height: 120px;
        }

        .quill-wrapper.quill-error .ql-container {
          border-color: #ef4444 !important;
        }

        .quill-wrapper.quill-success .ql-container {
          border-color: #10b981 !important;
        }

        .quill-wrapper .ql-container {
          border-color: #d1d5db;
          transition: border-color 0.2s ease-in-out;
        }

        .quill-wrapper:focus-within .ql-container {
          border-color: #3b82f6;
          box-shadow: 0 0 0 1px #3b82f6;
        }
      `}</style>
    </div>
  );
}
