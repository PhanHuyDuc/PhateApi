"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParamsStore } from "@/hooks/useParamsStore";
import { ArrowDown10, ArrowUp01, ArrowUpAZ, List } from "lucide-react";

const pageSizeButton = [4, 8, 12];

const orderButton = [
  { label: "A-Z", icon: ArrowUpAZ, value: "name" },
  { label: "Price low to high", icon: ArrowUp01, value: "price" },
  { label: "Price high to low", icon: ArrowDown10, value: "priceDesc" },
];

const filterButton = [
  { label: "SCIENCE", icon: List, value: "SCIENCE" },
  { label: "LITERATURE", icon: List, value: "LITERATURE" },
  { label: "RECOMMENDED", icon: List, value: "RECOMMENDED" },
  { label: "DEVELOPER", icon: List, value: "DEVELOPER" },
  { label: "DETECTIVE", icon: List, value: "DETECTIVE" },
  { label: "HORROR", icon: List, value: "HORROR" },
  { label: "LIGHT NOVEL", icon: List, value: "LIGHT NOVEL" },
];

export default function ProductFilter() {
  const pageSize = useParamsStore((state) => state.pageSize);
  const setParams = useParamsStore((state) => state.setParams);
  const orderBy = useParamsStore((state) => state.orderBy);
  const types = useParamsStore((state) => state.types);

  // Handler functions for each select
  const handleOrderByChange = (value: string) => {
    setParams({ orderBy: value });
  };

  const handleFilterByChange = (value: string) => {
    setParams({ types: value });
  };

  const handlePageSizeChange = (value: string) => {
    setParams({ pageSize: parseInt(value) });
  };

  return (
    <div className="flex gap-4 mb-4">
      {/* Order By Select */}
      <div className="w-full">
        <Select value={orderBy || ""} onValueChange={handleOrderByChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="--Order By--" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {orderButton.map(({ label, icon: Icon, value }) => (
                <SelectItem key={value} value={value}>
                  <div className="flex items-center">
                    <Icon className="mr-3 h-4 w-4" />
                    <span>{label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Filter By Select */}
      <div className="w-full">
        <Select value={types || ""} onValueChange={handleFilterByChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="--Filter By--" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {filterButton.map(({ label, icon: Icon, value }) => (
                <SelectItem key={value} value={value}>
                  <div className="flex items-center">
                    <Icon className="mr-3 h-4 w-4" />
                    <span>{label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Page Size Select */}
      <div className="w-full">
        <Select
          value={pageSize.toString() || ""}
          onValueChange={handlePageSizeChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Page Size">{pageSize} items</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {pageSizeButton.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size} items
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
