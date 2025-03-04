"use client";

import {
  FormControl,
  FormField as HookFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Icons for password toggle
import { cn } from "@/lib/utils"; // Utility for merging class names
import { ClassValue } from "clsx";

interface FormFieldProps<T extends FieldValues> {
  control: UseFormReturn<T>["control"];
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  textarea?: boolean; // Add support for textarea
  classNames?: {
    formItem?: ClassValue;
    formLabel?: ClassValue;
    formControl?: ClassValue;
    input?: ClassValue;
  };
}

export const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  textarea = false, // Default to false
  classNames,
}: FormFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  return (
    <HookFormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={cn("w-full", classNames?.formItem)}>
          <FormLabel
            className={cn("mb-2 block font-normal", classNames?.formLabel)}
          >
            {label}
          </FormLabel>
          <FormControl className={cn("relative", classNames?.formControl)}>
            <>
              {textarea ? (
                <Textarea
                  placeholder={placeholder}
                  className={cn("resize-y", classNames?.input)}
                  {...field}
                />
              ) : (
                <div className="relative">
                  <Input
                    placeholder={placeholder}
                    type={
                      type === "password" && !showPassword ? "password" : "text"
                    }
                    className={cn("pr-10", classNames?.input)}
                    {...field}
                  />
                  {type === "password" && (
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  )}
                </div>
              )}
            </>
          </FormControl>
          {error && (
            <FormMessage className="font-light">{error.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
};
