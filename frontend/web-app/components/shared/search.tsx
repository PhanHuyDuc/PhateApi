"use client";

import { useParamsStore } from "@/hooks/useParamsStore";
import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SearchIcon } from "lucide-react";

export default function Search() {
  const setParams = useParamsStore((state) => state.setParams);
  const searchTerm = useParamsStore((state) => state.searchTerm);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (searchTerm === "") setValue("");
  }, [searchTerm]);
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }
  function handleSearch() {
    setParams({ searchTerm: value });
  }
  return (
    <div className="w-full flex">
      <Input
        type="search"
        placeholder="Search..."
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
        value={value}
        onChange={handleChange}
      />
      <Button onClick={handleSearch}>
        <SearchIcon size={10} />
      </Button>
    </div>
  );
}
