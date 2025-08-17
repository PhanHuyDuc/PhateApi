import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { numberWithCommas } from "@/lib/numberWithCommas";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
type Props = {
  product: Product;
};
const ProductCard = ({ product }: Props) => {
  const mainImage =
    product.multiImages && product.multiImages.length > 0
      ? product.multiImages.find((img) => img.isMain)?.url ||
        product.multiImages[0].url
      : "https://pixabay.com/photos/coffee-cup-cookies-mug-coffee-cup-1869599/"; // Fallback image
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0 place-content-center">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={mainImage || ""}
            alt={product.name}
            height={300}
            width={300}
            priority={true}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <div className="text-xs">{product.brand}</div>
        <Link href={`/products/${product.slug}`}>
          <h2 className="text-sm font-medium">{product.name}</h2>
        </Link>
        <div className="flex-between gap-4">
          <p>{product.rating} Stars</p>
          {(product.quantityInStock ?? 0) > 0 ? (
            <p className="font-bold">{numberWithCommas(product.price)} VND</p>
          ) : (
            <p className="text-destructive">Out of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
