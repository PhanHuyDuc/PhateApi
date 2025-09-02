"use client";

import * as React from "react";
import { useController, UseControllerProps } from "react-hook-form";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

type Option = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  placeholder: string;
  showlabel?: boolean;
  data: Option[];
} & UseControllerProps;

export default function MultiSelectForm(props: Props) {
  const { field, fieldState } = useController({ ...props });
  const selectedValues: string[] = field.value || [];

  const [open, setOpen] = React.useState(false);

  function toggleValue(value: string) {
    let newValues;
    if (selectedValues.includes(value)) {
      newValues = selectedValues.filter((v) => v !== value);
    } else {
      newValues = [...selectedValues, value];
    }
    field.onChange(newValues);
  }

  return (
    <div className="mb-3 block w-full">
      {props.showlabel && (
        <div className="my-3">
          <Label htmlFor={field.name}>{props.label}</Label>
        </div>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {selectedValues.length > 0
              ? `${selectedValues.length} selected`
              : props.placeholder}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {props.data.map((item) => (
                  <CommandItem
                    key={item.value}
                    onSelect={() => toggleValue(item.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValues.includes(item.value)
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

      {fieldState.error && (
        <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
      )}
    </div>
  );
}
