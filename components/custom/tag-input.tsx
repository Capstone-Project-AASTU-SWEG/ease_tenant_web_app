"use client";

import type React from "react";
import { useState, useRef, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Group } from "./group";
import { Label } from "../ui/label";
import Stack from "./stack";
import { cn } from "@/lib/utils";

interface TagInputProps {
  label?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}

export const TagInput: React.FC<TagInputProps> = ({
  label = "Tags",
  tags,
  onChange,
  placeholder = "Add a tag",
  suggestions = [],
}) => {
  const [tag, setTag] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Memoize the filtered suggestions to prevent unnecessary recalculations
  const filteredSuggestions = useMemo(() => {
    if (tag.trim()) {
      return suggestions.filter(
        (suggestion) =>
          suggestion.toLowerCase().includes(tag.toLowerCase()) &&
          !tags.includes(suggestion),
      );
    }
    return suggestions.filter((s) => !tags?.includes(s));
  }, [tag, suggestions, tags]);

  useEffect(() => {
    // Close suggestions dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const addTag = (tagToAdd = tag) => {
    if (tagToAdd.trim() && !tags.includes(tagToAdd.trim())) {
      onChange([...tags, tagToAdd.trim()]);
      setTag("");
      setShowSuggestions(false);
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion);
    setShowSuggestions(true);
  };

  return (
    <Stack spacing="sm">
      <Label className="block font-normal">{label}</Label>
      <div className="relative">
        <Group>
          <Input
            ref={inputRef}
            placeholder={placeholder}
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              } else if (e.key === "Escape") {
                setShowSuggestions(false);
              }
            }}
          />
          <Button
            type="button"
            onClick={() => addTag()}
            className="size-[2.25rem]"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </Group>

        {/* Suggestions dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-background shadow-md"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className={cn(
                  "cursor-pointer px-3 py-2 text-sm hover:bg-muted",
                  index === 0 && "rounded-t-md",
                  index === filteredSuggestions.length - 1 && "rounded-b-md",
                )}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((item, index) => (
            <div
              key={index}
              className="flex items-center rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
            >
              {item}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="ml-1 h-5 w-5 rounded-full hover:bg-destructive/20"
                onClick={() => removeTag(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Stack>
  );
};
