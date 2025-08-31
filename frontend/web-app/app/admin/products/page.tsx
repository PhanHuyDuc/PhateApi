"use client";
import DeleteDialog from "@/components/shared/delete-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useParamsStore } from "@/hooks/useParamsStore";
import { useProductStore } from "@/hooks/useProductStore";
import { deleteProduct, getAdminProduct } from "@/lib/actions/product.actions";
import { numberWithCommas } from "@/lib/numberWithCommas";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import qs from "query-string";
import AppPagination from "@/components/shared/app-pagination";
import Search from "@/components/shared/search";
import ProductFilter from "@/components/shared/product/product-fiilter";
import EmptyData from "@/components/shared/empty-data";
import { usePathname } from "next/navigation";

export default function AdminProductPage() {
  const [loading, setLoading] = useState(true);

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

  const onSuccess = () => {
    // Refresh data after successful deletion
    const currentUrl = qs.stringifyUrl(
      { url: "", query: params },
      { skipEmptyString: true }
    );
    getAdminProduct(currentUrl).then((data) => setData(data));
  };

  const url = qs.stringifyUrl(
    {
      url: "",
      query: params,
    },
    { skipEmptyString: true, skipNull: true }
  );

  function setPageNumber(pageNumber: number) {
    setParams({ pageNumber });
  }

  useEffect(() => {
    getAdminProduct(url).then((data) => {
      setData(data);
      setLoading(false);
    });
  }, [url, setData, params]);
  if (loading) return <h3>Loading...</h3>;
  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Products</h1>
        <Button asChild variant={"default"}>
          <Link href={"/admin/products/create"}>Create Product</Link>
        </Button>
      </div>
      <div className="text-sm text-gray-500 p-2 rounded w-full flex flex-col">
        <ProductFilter />
        <Search />
      </div>
      {data.products && data.products.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">NUM</TableHead>
                <TableHead className="text-center">NAME</TableHead>
                <TableHead className="text-center">PRICE</TableHead>
                <TableHead className="text-center">TYPE</TableHead>
                <TableHead className="text-center">RATING</TableHead>
                <TableHead className="text-center">MAIN IMAGE</TableHead>
                <TableHead className="w-[100px]">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.products.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell className="text-center">
                    {/* Calculate correct row number based on current page */}
                    {(params.pageNumber - 1) * params.pageSize + index + 1}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell className="text-center">
                    {numberWithCommas(product.price)}
                  </TableCell>
                  <TableCell>{product.type}</TableCell>
                  <TableCell className="text-center">
                    {product.rating}
                  </TableCell>
                  <TableCell className="place-items-center">
                    <Image
                      src={
                        product.multiImages.find((img) => img.isMain)?.url || ""
                      }
                      height={48}
                      width={48}
                      alt={product.slug || ""}
                    />
                  </TableCell>
                  <TableCell className="flex gap-1">
                    <Button asChild variant={"outline"} size={"sm"}>
                      <Link href={`/admin/products/${product.slug}`}>Edit</Link>
                    </Button>
                    <DeleteDialog
                      action={deleteProduct}
                      id={product.id.toLocaleString()}
                      onSuccess={onSuccess}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/*Pagination*/}
          <AppPagination
            currentPage={params.pageNumber}
            pageCount={data.pageCount}
            pageChanged={setPageNumber}
          />
        </>
      ) : (
        <EmptyData showReset />
      )}
    </div>
  );
}
