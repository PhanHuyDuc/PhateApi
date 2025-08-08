import { Product } from "@/types";
import ProductCard from "./product-card";
type Props = {
  products: Product[];
};
const ProductList = ({ products }: Props) => {
  return (
    <div className="my-10">
      <h2 className="h2-bold mb-4">List Data</h2>
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div>
          <p>No products found</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
