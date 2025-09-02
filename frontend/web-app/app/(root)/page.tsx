"use client";

import MainCarousel from "@/components/shared/main-carousel";
import ProductList from "@/components/shared/product/product-list";
import ScrollToTopButton from "@/components/shared/scroll-to-top-button";
import { useParamsStore } from "@/hooks/useParamsStore";
import { useProductStore } from "@/hooks/useProductStore";
import { Banner } from "@/types";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import qs from "query-string";
import { getAdminProduct } from "@/lib/actions/product.actions";
import { usePathname } from "next/navigation";
import { getBanner } from "@/lib/actions/banner.actions";
import EmptyData from "@/components/shared/empty-data";
import AppPagination from "@/components/shared/app-pagination";

export default function Homepage() {
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<Banner[]>([]);

  const params = useParamsStore(
    useShallow((state) => ({
      pageNumber: state.pageNumber,
      pageSize: state.pageSize,
      searchTerm: state.searchTerm,
      orderBy: state.orderBy,
      types: state.types,
    }))
  );

  const data = useProductStore(
    useShallow((state) => ({
      products: state.products,
      totalCount: state.totalCount,
      pageCount: state.pageCount,
    }))
  );
  const setData = useProductStore((state) => state.setData);

  const setParams = useParamsStore((state) => state.setParams);

  const pathName = usePathname();

  const reset = useParamsStore((state) => state.reset);

  useEffect(() => {
    reset();
  }, [pathName, reset]);

  const url = qs.stringifyUrl(
    {
      url: "",
      query: params,
    },
    { skipEmptyString: true, skipNull: true }
  );

  useEffect(() => {
    getAdminProduct(url).then((data) => {
      setData(data);
      setLoading(false);
    });
    // Fetch banners
    getBanner("?orderBy=mainCat").then((banner) => {
      setBanners(
        Array.isArray(banner.results) ? banner.results : [banner.results]
      );
    });
  }, [url, setData]);

  function setPageNumber(pageNumber: number) {
    setParams({ pageNumber });
  }

  if (loading) return <h3>Loading...</h3>;

  return (
    <>
      {banners && <MainCarousel data={banners} />}

      {data.products && data.products.length > 0 ? (
        <>
          <ProductList products={data.products} />
          <AppPagination
            currentPage={params.pageNumber}
            pageCount={data.pageCount}
            pageChanged={setPageNumber}
          />
        </>
      ) : (
        <EmptyData showReset />
      )}
      <ScrollToTopButton />
    </>
  );
}
