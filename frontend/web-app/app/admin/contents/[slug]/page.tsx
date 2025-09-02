import ContentForm from "@/components/admin/content-form";
import ImageLoader from "@/components/shared/image-loader";
import { getContentBySlug } from "@/lib/actions/content.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Content",
};

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function AdminContentUpdatePage({ params }: Props) {
  const { slug } = await params;
  const data = await getContentBySlug(slug);
  return (
    <>
      <h1 className="h2-bold">Update Content</h1>
      <div className="grid grid-cols-2 w-full justify-between space-x-5">
        <ContentForm content={data} />
        <ImageLoader
          src={data.contentImages.find((img) => img.isMain)?.url || ""}
          alt={data.artist}
          height={400}
          width={400}
        />
      </div>
    </>
  );
}
