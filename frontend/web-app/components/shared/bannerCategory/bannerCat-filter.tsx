import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParamsStore } from "@/hooks/useParamsStore";

const pageSizeButton = [4, 8, 12];

export default function BannerCategoryFilter() {
  const pageSize = useParamsStore((state) => state.pageSize);
  const setParams = useParamsStore((state) => state.setParams);

  const handlePageSizeChange = (value: string) => {
    setParams({ pageSize: parseInt(value) });
  };

  return (
    <div className=" gap-4 mb-4">
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
