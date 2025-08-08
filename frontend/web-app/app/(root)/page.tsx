import ProductList from "@/components/shared/product/product-list";
import { getData } from "@/lib/actions/product.actions";

export const metadata = {
  title: "Home",
};

const Homepage = async () => {
  const products = await getData("");
  return (
    <>
      <ProductList products={products} />
    </>
  );
};

export default Homepage;
