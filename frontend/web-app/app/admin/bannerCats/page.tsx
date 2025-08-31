"use client";

import { useParamsStore } from "@/hooks/useParamsStore";
import { useState, useEffect } from "react";
import { useShallow } from "zustand/shallow";
import qs from "query-string";
import {
  deleteBannerCat,
  getAdminBannerCat,
} from "@/lib/actions/bannerCategory.actions";
import { useBannerCatStore } from "@/hooks/useBannerCatStore";
import AppPagination from "@/components/shared/app-pagination";
import DeleteDialog from "@/components/shared/delete-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Link from "next/link";
import Search from "@/components/shared/search";
import BannerCategoryFilter from "@/components/shared/bannerCategory/bannerCat-filter";
import EmptyData from "@/components/shared/empty-data";
import { usePathname } from "next/navigation";

export default function AdminBannerCategoryPage() {
  const [loading, setLoading] = useState(true);

  const params = useParamsStore(
    useShallow((state) => ({
      pageNumber: state.pageNumber,
      pageSize: state.pageSize,
      searchTerm: state.searchTerm,
    }))
  );

  const data = useBannerCatStore(
    useShallow((state) => ({
      bannerCats: state.bannerCats,
      totalCount: state.totalCount,
      pageCount: state.pageCount,
    }))
  );

  const setData = useBannerCatStore((state) => state.setData);

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
    getAdminBannerCat(currentUrl).then((data) => setData(data));
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
    getAdminBannerCat(url).then((data) => {
      setData(data);
      setLoading(false);
    });
  }, [url, setData, params]);
  if (loading) return <h3>Loading...</h3>;
  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Banner Categories</h1>
        <Button asChild variant={"default"}>
          <Link href={"/admin/bannerCats/create"}>Create Banner Category</Link>
        </Button>
      </div>
      <div className="text-sm text-gray-500 p-2 rounded w-full grid grid-cols-2">
        <BannerCategoryFilter />
        <Search />
      </div>
      {data.bannerCats && data.bannerCats.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">NUM</TableHead>
                <TableHead className="text-center">NAME</TableHead>
                <TableHead className="text-center">DESCRIPTION</TableHead>
                <TableHead className="w-[100px]">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.bannerCats.map((bannerCat, index) => (
                <TableRow key={bannerCat.id}>
                  <TableCell className="text-center">
                    {/* Calculate correct row number based on current page */}
                    {(params.pageNumber - 1) * params.pageSize + index + 1}
                  </TableCell>
                  <TableCell>{bannerCat.name}</TableCell>
                  <TableCell className="text-center">
                    {bannerCat.description}
                  </TableCell>
                  <TableCell className="flex gap-1">
                    <Button asChild variant={"outline"} size={"sm"}>
                      <Link href={`/admin/bannerCats/${bannerCat.id}`}>
                        Edit
                      </Link>
                    </Button>
                    <DeleteDialog
                      action={deleteBannerCat}
                      id={bannerCat.id}
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
