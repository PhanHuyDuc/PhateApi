"use client";

import { useBannerStore } from "@/hooks/useBannerStore";
import { useParamsStore } from "@/hooks/useParamsStore";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import qs from "query-string";
import {
  deleteBanner,
  getBanner,
  toggleBanner,
} from "@/lib/actions/banner.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import DeleteDialog from "@/components/shared/delete-dialog";
import AppPagination from "@/components/shared/app-pagination";
import Search from "@/components/shared/search";
import BannerFilter from "@/components/shared/banner/banner-filter";
import ToggleButton from "@/components/shared/toggle-active-button";
import EmptyData from "@/components/shared/empty-data";
import { usePathname } from "next/navigation";

export default function AdminBannerPage() {
  const [loading, setLoading] = useState(true);

  const params = useParamsStore(
    useShallow((state) => ({
      pageNumber: state.pageNumber,
      pageSize: state.pageSize,
      searchTerm: state.searchTerm,
      orderBy: state.orderBy,
    }))
  );

  const data = useBannerStore(
    useShallow((state) => ({
      banners: state.banners,
      totalCount: state.totalCount,
      pageCount: state.pageCount,
    }))
  );

  const setData = useBannerStore((state) => state.setData);

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
    getBanner(currentUrl).then((data) => setData(data));
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
    getBanner(url).then((data) => {
      setData(data);
      setLoading(false);
    });
  }, [url, setData, params]);
  if (loading) return <h3>Loading...</h3>;
  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Banners</h1>
        <Button asChild variant={"default"}>
          <Link href={"/admin/banners/create"}>Create Banner</Link>
        </Button>
      </div>
      <div className="text-sm text-gray-500 p-2 rounded w-full flex flex-col">
        <BannerFilter />
        <Search />
      </div>
      {data.banners && data.banners.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">NUM</TableHead>
                <TableHead className="text-center">TITLE</TableHead>
                <TableHead className="text-center">DESCRIPTION</TableHead>
                <TableHead className="text-center">LINK</TableHead>
                <TableHead className="text-center">CATEGORY</TableHead>
                <TableHead className="text-center">BANNER</TableHead>
                <TableHead className="w-[100px]">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.banners.map((banner, index) => (
                <TableRow key={banner.id}>
                  <TableCell className="text-center">
                    {/* Calculate correct row number based on current page */}
                    {(params.pageNumber - 1) * params.pageSize + index + 1}
                  </TableCell>
                  <TableCell>{banner.title}</TableCell>
                  <TableCell className="text-center">
                    {banner.description}
                  </TableCell>
                  <TableCell>{banner.link}</TableCell>
                  <TableCell className="text-center">
                    {banner.bannerCategory.name}
                  </TableCell>
                  <TableCell className="place-items-center">
                    <Image
                      src={banner.url}
                      height={48}
                      width={48}
                      alt={banner.title}
                    />
                  </TableCell>
                  <TableCell className="flex gap-1">
                    <ToggleButton
                      id={banner.id}
                      onSuccess={onSuccess}
                      action={toggleBanner}
                      isActive={banner.isActive}
                    />
                    <Button asChild variant={"outline"} size={"sm"}>
                      <Link href={`/admin/banners/${banner.id}`}>Edit</Link>
                    </Button>
                    <DeleteDialog
                      action={deleteBanner}
                      id={banner.id}
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
