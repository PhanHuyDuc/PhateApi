import ProductForm from "@/components/admin/product-form";
import { getProductBySlug } from "@/lib/actions/product.actions";
import { Metadata } from "next";
import ProductManageImages from "./product-manage-images";

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
      <ProductManageImages images={data.multiImages} />
      <ProductForm product={data} />
    </div>
  );
}
