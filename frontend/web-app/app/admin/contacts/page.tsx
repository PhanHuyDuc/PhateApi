"use client";

import { useContactStore } from "@/hooks/useContactStore";
import { useParamsStore } from "@/hooks/useParamsStore";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import qs from "query-string";
import { useEffect } from "react";
import {
  getAdminContact,
  resolvedContact,
} from "@/lib/actions/contact.actions";
import Search from "@/components/shared/search";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AppPagination from "@/components/shared/app-pagination";
import EmptyData from "@/components/shared/empty-data";
import ResolvedButton from "@/components/shared/resolved-button";
import { usePathname } from "next/navigation";

export default function AdminContactPage() {
  const [loading, setLoading] = useState(true);

  const params = useParamsStore(
    useShallow((state) => ({
      pageNumber: state.pageNumber,
      pageSize: state.pageSize,
      searchTerm: state.searchTerm,
    }))
  );

  const data = useContactStore(
    useShallow((state) => ({
      contacts: state.contacts,
      totalCount: state.totalCount,
      pageCount: state.pageCount,
    }))
  );

  const setData = useContactStore((state) => state.setData);

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
    getAdminContact(currentUrl).then((data) => setData(data));
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
    getAdminContact(url).then((data) => {
      setData(data);
      setLoading(false);
    });
  }, [url, setData, params]);
  if (loading) return <h3>Loading...</h3>;
  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Contact List</h1>
      </div>
      {data.contacts && data.contacts.length > 0 ? (
        <>
          <div className="text-sm text-gray-500 p-2 rounded w-full grid ">
            <Search />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">NUM</TableHead>
                <TableHead className="text-center">NAME</TableHead>
                <TableHead className="text-center">EMAIL</TableHead>
                <TableHead className="text-center">PHONE NUMBER</TableHead>
                <TableHead className="text-center">DESCRIPTION</TableHead>
                <TableHead className="w-[100px]">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.contacts.map((contact, index) => (
                <TableRow key={contact.id}>
                  <TableCell className="text-center">
                    {/* Calculate correct row number based on current page */}
                    {(params.pageNumber - 1) * params.pageSize + index + 1}
                  </TableCell>
                  <TableCell className="text-center">{contact.name}</TableCell>
                  <TableCell className="text-center">{contact.email}</TableCell>
                  <TableCell className="text-center">
                    {contact.phoneNumber}
                  </TableCell>
                  <TableCell className="text-center">
                    {contact.description}
                  </TableCell>
                  <TableCell className="flex gap-1">
                    <ResolvedButton
                      action={resolvedContact}
                      id={contact.id.toString()}
                      Resolved={contact.isResolve}
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
