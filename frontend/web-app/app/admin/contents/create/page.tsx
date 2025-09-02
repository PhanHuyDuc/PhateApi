import ContentForm from "@/components/admin/content-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Content",
};

export default function CreateContentPage() {
  return (
    <>
      <h2 className="h2-bold">Create Content</h2>
      <div className="my-8">
        <ContentForm />
      </div>
    </>
  );
}
