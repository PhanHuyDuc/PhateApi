import ProductForm from "@/components/admin/product-form";
import { getProductBySlug } from "@/lib/actions/product.actions";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Update Product",
};

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function AdminProductUpdatePage({ params }: Props) {
  const { slug } = await params;
  const data = await getProductBySlug(slug);
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">Update Product</h1>
      <div className="grid grid-cols-5 gap-3">
        {data.multiImages.map((img) => (
          <Image
            key={img.id}
            src={img.url || ""}
            alt="Product Image"
            height={100}
            width={100}
          />
        ))}
      </div>
      <ProductForm product={data} />
    </div>
  );
}
