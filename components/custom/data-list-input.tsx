"use client";

import * as React from "react";
import { X, Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export type DataListItem = {
  value: string;
  label: string;
};

interface DataListInputProps {
  placeholder?: string;
  emptyMessage?: string;
  items: DataListItem[];
  selectedItems?: DataListItem[];
  onChange?: (items: DataListItem[]) => void;
  disabled?: boolean;
  maxItems?: number;
  className?: string;
}

export function DataListInput({
  placeholder = "Select items...",
  emptyMessage = "No items found.",
  items,
  selectedItems = [],
  onChange,
  disabled = false,
  maxItems,
  className,
}: DataListInputProps) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<DataListItem[]>(selectedItems);
  const [inputValue, setInputValue] = React.useState("");

  const handleSelect = React.useCallback(
    (item: DataListItem) => {
      const isSelected = selected.some((i) => i.value === item.value);

      let updatedItems: DataListItem[];

      if (isSelected) {
        updatedItems = selected.filter((i) =>
          i.value === item.value ? false : true,
        );
      } else {
        if (maxItems && selected.length >= maxItems) {
          updatedItems = [...selected.slice(1), item];
        } else {
          updatedItems = [...selected, item];
        }
      }

      setSelected(updatedItems);
      onChange?.(updatedItems);
      setInputValue("");
    },
    [selected, maxItems, onChange],
  );

  const handleRemove = React.useCallback(
    (item: DataListItem) => {
      const updatedItems = selected.filter((i) => i.value !== item.value);
      setSelected(updatedItems);
      onChange?.(updatedItems);
    },
    [selected, onChange],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Backspace" && !inputValue && selected.length > 0) {
        handleRemove(selected[selected.length - 1]);
      }
    },
    [inputValue, selected, handleRemove],
  );

  const availableItems = React.useMemo(() => {
    return items.filter(
      (item) =>
        !selected.some((selectedItem) => selectedItem.value === item.value),
    );
  }, [items, selected]);

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              selected.length > 0 ? "h-auto min-h-10" : "h-10",
            )}
            onClick={() => setOpen(!open)}
            disabled={disabled}
          >
            <div className="flex flex-wrap gap-1">
              {selected.length > 0 ? (
                selected.map((item) => (
                  <Badge
                    key={item.value}
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-0"
                  >
                    {item.label}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-muted"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item);
                      }}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {item.label}</span>
                    </Button>
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command onKeyDown={handleKeyDown}>
            <CommandInput
              placeholder="Search items..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {availableItems.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => {
                      handleSelect(item);
                      setOpen(true);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected.some((i) => i.value === item.value)
                          ? "opacity-100"
                          : "opacity-0",
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
    </div>
  );
}
