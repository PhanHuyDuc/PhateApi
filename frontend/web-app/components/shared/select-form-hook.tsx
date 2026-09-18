import { useController, UseControllerProps } from "react-hook-form";
import { useState } from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Alert, AlertTitle } from "../ui/alert";
import { AlertCircleIcon, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  placeholder: string;
  showlabel?: boolean;
  data: Option[];
  searchable?: boolean;
  searchPlaceholder?: string;
} & UseControllerProps;

export default function SelectForm(props: Props) {
  const { field, fieldState } = useController({ ...props });
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-3 block w-full">
      {props.showlabel && (
        <div className="my-3">
          <Label htmlFor={field.name}>{props.label}</Label>
        </div>
      )}

      {props.searchable ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between font-normal"
            >
              {field.value
                ? props.data.find((item) => item.value === field.value)?.label
                : props.placeholder}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[--radix-popover-trigger-width] p-0"
            align="start"
          >
            <Command>
              <CommandInput
                placeholder={props.searchPlaceholder ?? "Search..."}
              />
              <CommandList className="max-h-[400px]">
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {props.data.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.label}
                      onSelect={() => {
                        field.onChange(item.value);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2",
                          field.value === item.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      ) : (
        <Select onValueChange={field.onChange} value={field.value || ""}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={props.placeholder} />
          </SelectTrigger>
          <SelectContent className="max-h-[400px] overflow-y-auto">
            {props.data.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {fieldState.error && (
        <Alert variant={"destructive"}>
          <AlertCircleIcon />
          <AlertTitle>{fieldState.error.message}</AlertTitle>
        </Alert>
      )}
    </div>
  );
}