import { Search } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";
import { ClassValue } from "clsx";
import { cn } from "@/lib/utils";

type Props = {
  searchQuery: string;
  onSearchQuery: (value: string) => void;
  placeholder?: string;
  classNames?: {
    wrapper?: ClassValue;
    icon?: ClassValue;
    input?: ClassValue;
  };
};

const SearchInput = ({
  searchQuery,
  onSearchQuery,
  placeholder,
  classNames,
}: Props) => {
  return (
    <div className={cn("relative max-w-[50rem] flex-1", classNames?.wrapper)}>
      <Search
        className={cn(
          "absolute left-3 top-1/2 z-[9] h-4 w-4 -translate-y-1/2 text-muted-foreground",
          classNames?.icon,
        )}
      />
      <Input
        type="search"
        placeholder={placeholder || "Search..."}
        className={cn("w-full pl-10 pr-4", classNames?.input)}
        value={searchQuery}
        onChange={(e) => onSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
