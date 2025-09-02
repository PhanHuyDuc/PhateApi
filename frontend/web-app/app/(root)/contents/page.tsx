"use client";

import ContentList from "@/components/shared/content/content-list";
import { useContentStore } from "@/hooks/useContentStore";
import { useParamsStore } from "@/hooks/useParamsStore";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import qs from "query-string";
import { getContent } from "@/lib/actions/content.actions";
import EmptyData from "@/components/shared/empty-data";
import AppPagination from "@/components/shared/app-pagination";
import Search from "@/components/shared/search";

export default function ContentPage() {
  const [loading, setLoading] = useState(true);

  const params = useParamsStore(
    useShallow((state) => ({
      pageNumber: state.pageNumber,
      pageSize: state.pageSize,
      searchTerm: state.searchTerm,
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

  const url = qs.stringifyUrl(
    {
      url: "",
      query: params,
    },
    { skipEmptyString: true, skipNull: true }
  );

  useEffect(() => {
    getContent(url).then((data) => {
      setData(data);
      setLoading(false);
    });
  }, [url, setData]);

  function setPageNumber(pageNumber: number) {
    setParams({ pageNumber });
  }

  if (loading) return <h3>Loading...</h3>;
  return (
    <>
      <Search />
      {data.contents && data.contents.length > 0 ? (
        <>
          <ContentList contents={data.contents} />
          <AppPagination
            currentPage={params.pageNumber}
            pageCount={data.pageCount}
            pageChanged={setPageNumber}
          />
        </>
      ) : (
        <EmptyData showReset />
      )}
    </>
  );
}
