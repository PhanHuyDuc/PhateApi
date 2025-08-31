import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParamsStore } from "@/hooks/useParamsStore";
import { ArrowUp01, ArrowUpAZ } from "lucide-react";

const pageSizeButton = [4, 8, 12];

const orderButton = [
  { label: "A-Z", icon: ArrowUpAZ, value: "default" },
  { label: "Z-A", icon: ArrowUp01, value: "titleDesc" },
];

export default function BannerFilter() {
  const pageSize = useParamsStore((state) => state.pageSize);
  const setParams = useParamsStore((state) => state.setParams);
  const orderBy = useParamsStore((state) => state.orderBy);

  // Handler functions for each select
  const handleOrderByChange = (value: string) => {
    setParams({ orderBy: value });
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
