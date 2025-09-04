"use client";

import { useContentStore } from "@/hooks/useContentStore";
import { useParamsStore } from "@/hooks/useParamsStore";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import qs from "query-string";
import { deleteContent, getContent } from "@/lib/actions/content.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Search from "@/components/shared/search";
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
import EmptyData from "@/components/shared/empty-data";

export default function AdminContentPage() {
  const [loading, setLoading] = useState(true);

  const params = useParamsStore(
    useShallow((state) => ({
      pageNumber: state.pageNumber,
      pageSize: state.pageSize,
      searchTerm: state.searchTerm,
      orderBy: state.orderBy,
      tags: state.tags,
    }))
  );

  const data = useContentStore(
    useShallow((state) => ({
      contents: state.contents,
      totalCount: state.totalCount,
      pageCount: state.pageCount,
    }))
  );

  const setData = useContentStore((state) => state.setData);

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
    getContent(currentUrl).then((data) => setData(data));
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
    getContent(url).then((data) => {
      setData(data);
      setLoading(false);
    });
  }, [url, setData, params]);
  if (loading) return <h3>Loading...</h3>;
  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Contents</h1>
        <Button asChild variant={"default"}>
          <Link href={"/admin/contents/create"}>Create Content</Link>
        </Button>
      </div>
      <div className="text-sm text-gray-500 p-2 rounded w-full flex flex-col">
        <Search />
      </div>
      {data.contents && data.contents.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">NUM</TableHead>
                <TableHead className="text-center">NAME</TableHead>
                <TableHead className="text-center">DESCRIPTION</TableHead>
                <TableHead className="text-center">TAG</TableHead>
                <TableHead className="text-center">ARTIST</TableHead>
                <TableHead className="text-center">MAIN IMAGE</TableHead>
                <TableHead className="w-[100px]">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.contents.map((content, index) => (
                <TableRow key={content.id}>
                  <TableCell className="text-center">
                    {/* Calculate correct row number based on current page */}
                    {(params.pageNumber - 1) * params.pageSize + index + 1}
                  </TableCell>
                  <TableCell>{content.name}</TableCell>
                  <TableCell className="text-center">
                    {content.description}
                  </TableCell>
                  <TableCell>{content.tag}</TableCell>
                  <TableCell className="text-center">
                    {content.artist}
                  </TableCell>
                  <TableCell className="place-items-center">
                    <Image
                      src={
                        content.contentImages.find((img) => img.isMain)?.url ||
                        ""
                      }
                      height={48}
                      width={48}
                      alt={content.slug || ""}
                    />
                  </TableCell>
                  <TableCell className="flex gap-1">
                    <Button asChild variant={"outline"} size={"sm"}>
                      <Link href={`/admin/contents/${content.slug}`}>Edit</Link>
                    </Button>
                    <DeleteDialog
                      action={deleteContent}
                      id={content.id.toLocaleString()}
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
