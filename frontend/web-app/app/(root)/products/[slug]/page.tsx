import ProductImages from "@/components/shared/product/product-images";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getProductBySlug } from "@/lib/actions/product.actions";
import { numberWithCommas } from "@/lib/numberWithCommas";
import { MultiImage } from "@/types";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailsPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return notFound(); // Assuming notFound is a function that handles 404 responses
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5">
        {/*Image column*/}
        <div className="col-span-2">
          <ProductImages multiImage={product.multiImages} />
        </div>
        {/*Details column*/}
        <div className="col-span-2 p-5">
          <div className="flex flex-col gap-6">
            <p>
              {product.brand} {product.type}
            </p>
            <h1 className="h3-bold">{product.name}</h1>
            <p>
              {product.rating} of {product.numReview} Reviews
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <p className=" rounded-full bg-green-100 text-green-700 px-5 py-2">
                {numberWithCommas(product.price)} VND
              </p>
            </div>
          </div>
          <div className="mt-10">
            <p className="font-semibold">Description</p>
            <p className="text-gray-600">{product.description}</p>
          </div>
        </div>
        <div>
          <Card>
            <CardContent className="p-4">
              <div className="mb-2 flex justify-between">
                <div>Price</div>
                <div>{numberWithCommas(product.price)} VND</div>
              </div>
              <div className="mb-2 flex justify-between">
                <div>Status</div>
                {product.quantityInStock > 0 ? (
                  <Badge variant={`outline`}>In Stock</Badge>
                ) : (
                  <Badge variant={"destructive"}>Out of Stock</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
