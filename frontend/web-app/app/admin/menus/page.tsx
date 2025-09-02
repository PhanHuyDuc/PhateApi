"use client";

import { useParamsStore } from "@/hooks/useParamsStore";
import { useState, useEffect } from "react";
import { useShallow } from "zustand/shallow";
import qs from "query-string";
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
import { useMenuStore } from "@/hooks/useMenuStore";
import {
  deleteMenu,
  getAdminMenu,
  toggleMenu,
} from "@/lib/actions/menu.actions";
import ToggleButton from "@/components/shared/toggle-active-button";
import EmptyData from "@/components/shared/empty-data";
import { usePathname } from "next/navigation";

export default function AdminMenuPage() {
  const [loading, setLoading] = useState(true);

  const params = useParamsStore(
    useShallow((state) => ({
      pageNumber: state.pageNumber,
      pageSize: state.pageSize,
      searchTerm: state.searchTerm,
    }))
  );

  const data = useMenuStore(
    useShallow((state) => ({
      menus: state.menus,
      totalCount: state.totalCount,
      pageCount: state.pageCount,
    }))
  );

  const setData = useMenuStore((state) => state.setData);

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
    getAdminMenu(currentUrl).then((data) => setData(data));
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
    getAdminMenu(url).then((data) => {
      setData(data);
      setLoading(false);
    });
  }, [url, setData, params]);
  if (loading) return <h3>Loading...</h3>;
  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Menu</h1>
        <Button asChild variant={"default"}>
          <Link href={"/admin/menus/create"}>Create Menu</Link>
        </Button>
      </div>
      {data.menus && data.menus.length > 0 ? (
        <>
          <div className="text-sm text-gray-500 p-2 rounded w-full">
            <Search />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">NUM</TableHead>
                <TableHead className="text-center">TYPE</TableHead>
                <TableHead className="text-center">NAME</TableHead>
                <TableHead className="text-center">URL</TableHead>
                <TableHead className="text-center">PARENT</TableHead>
                <TableHead className="text-center">LEVEL</TableHead>
                <TableHead className="w-[100px]">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.menus.map((menu, index) => (
                <TableRow key={menu.id}>
                  <TableCell className="text-center">
                    {/* Calculate correct row number based on current page */}
                    {(params.pageNumber - 1) * params.pageSize + index + 1}
                  </TableCell>
                  <TableCell>{menu.type}</TableCell>
                  <TableCell className="text-center">{menu.name}</TableCell>
                  <TableCell className="text-center">{menu.url}</TableCell>
                  {/* Check if parentId !==null then show the parent name */}
                  <TableCell className="text-center">
                    {menu.parentName}
                  </TableCell>
                  <TableCell className="text-center">{menu.level}</TableCell>
                  <TableCell className="flex gap-1">
                    <ToggleButton
                      action={toggleMenu}
                      id={menu.id.toString()}
                      isActive={menu.isActive}
                      onSuccess={onSuccess}
                    />
                    <Button asChild variant={"outline"} size={"sm"}>
                      <Link href={`/admin/menus/${menu.id}`}>Edit</Link>
                    </Button>
                    <DeleteDialog
                      action={deleteMenu}
                      id={menu.id.toString()}
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
