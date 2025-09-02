"use client";

import { useParamsStore } from "@/hooks/useParamsStore";
import { useState, useEffect } from "react";
import { useShallow } from "zustand/shallow";
import qs from "query-string";

import { useArtistStore } from "@/hooks/useArtistStore";
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
import EmptyData from "@/components/shared/empty-data";
import { usePathname } from "next/navigation";
import { deleteArtist, getArtist } from "@/lib/actions/artist.actions";

export default function AdminArtistPage() {
  const [loading, setLoading] = useState(true);

  const params = useParamsStore(
    useShallow((state) => ({
      pageNumber: state.pageNumber,
      pageSize: state.pageSize,
      searchTerm: state.searchTerm,
    }))
  );

  const data = useArtistStore(
    useShallow((state) => ({
      artists: state.artists,
      totalCount: state.totalCount,
      pageCount: state.pageCount,
    }))
  );

  const setData = useArtistStore((state) => state.setData);

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
    getArtist(currentUrl).then((data) => setData(data));
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
    getArtist(url).then((data) => {
      setData(data);
      setLoading(false);
    });
  }, [url, setData, params]);
  if (loading) return <h3>Loading...</h3>;
  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Artist List</h1>
        <Button asChild variant={"default"}>
          <Link href={"/admin/artists/create"}>Create Artist</Link>
        </Button>
      </div>
      <div className="text-sm text-gray-500 p-2 rounded w-full grid grid-cols-1">
        <Search />
      </div>
      {data.artists && data.artists.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">NUM</TableHead>
                <TableHead className="text-center">NAME</TableHead>
                <TableHead className="w-[100px]">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.artists.map((artist, index) => (
                <TableRow key={artist.id}>
                  <TableCell className="text-center">
                    {/* Calculate correct row number based on current page */}
                    {(params.pageNumber - 1) * params.pageSize + index + 1}
                  </TableCell>
                  <TableCell>{artist.name}</TableCell>
                  <TableCell className="flex gap-1">
                    <Button asChild variant={"outline"} size={"sm"}>
                      <Link href={`/admin/artists/${artist.id}`}>Edit</Link>
                    </Button>
                    <DeleteDialog
                      action={deleteArtist}
                      id={artist.id}
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
