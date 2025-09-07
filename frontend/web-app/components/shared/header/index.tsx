import { APP_NAME } from "@/lib/constants";
import Link from "next/link";
import Menu from "./menu";
import MenuDrawer from "./menu-drawer";
import { getBanner } from "@/lib/actions/banner.actions";
import Search from "../search";
import ProductFilter from "../product/product-fiilter";
import ImageLoader from "../image-loader";

const Header = async () => {
  const banner = await getBanner("");
  const logo = banner.results.find((x) => x.title === "Logo");
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <MenuDrawer />
          <Link href={"/"} className="flex-start ml-4">
            {logo && (
              <ImageLoader
                src={logo.url}
                alt={`${APP_NAME} logo`}
                height={72}
                width={72}
              />
            )}

            <span className="hidden lg:block font-bold text-2xl ml-3">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <div className="hidden md:flex">
          <ProductFilter />
          <Search />
        </div>
        <Menu />
      </div>
    </header>
  );
};

export default Header;
