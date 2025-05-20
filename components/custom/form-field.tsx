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
import { CalendarIcon, Eye, EyeOff } from "lucide-react"; // Icons for password toggle
import { cn } from "@/lib/utils"; // Utility for merging class names
import { ClassValue } from "clsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent } from "../ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";
import Stack from "./stack";

interface TextFormFieldProps<T extends FieldValues> {
  control: UseFormReturn<T>["control"];
  name: Path<T>;
  label: string;
  placeholder?: string;
  classNames?: {
    formItem?: ClassValue;
    formLabel?: ClassValue;
    formControl?: ClassValue;
    input?: ClassValue;
  };
}

export const TextFormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  classNames,
}: TextFormFieldProps<T>) => {
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
            <Input
              placeholder={placeholder}
              type="text"
              className={cn("pr-10", classNames?.input)}
              {...field}
            />
          </FormControl>
          {error && (
            <FormMessage className="font-light">{error.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
};

export const DateFormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  classNames,
}: TextFormFieldProps<T>) => {
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon />
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>{placeholder || " Pick a date"}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                />
              </PopoverContent>
            </Popover>
          </FormControl>
          {error && (
            <FormMessage className="font-light">{error.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
};

interface EmailFormFieldProps<T extends FieldValues> {
  control: UseFormReturn<T>["control"];
  name: Path<T>;
  label: string;
  placeholder?: string;
  classNames?: {
    formItem?: ClassValue;
    formLabel?: ClassValue;
    formControl?: ClassValue;
    input?: ClassValue;
  };
}

export const EmailFormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  classNames,
}: EmailFormFieldProps<T>) => {
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
            <Input
              placeholder={placeholder}
              type="email"
              className={cn("pr-10", classNames?.input)}
              {...field}
            />
          </FormControl>
          {error && (
            <FormMessage className="font-light">{error.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
};

interface NumberFormFieldProps<T extends FieldValues> {
  control: UseFormReturn<T>["control"];
  name: Path<T>;
  label?: string;
  min?: number;
  placeholder?: string;
  classNames?: {
    formItem?: ClassValue;
    formLabel?: ClassValue;
    formControl?: ClassValue;
    input?: ClassValue;
  };
}

export const NumberFormField = <T extends FieldValues>({
  control,
  name,
  label,
  min,
  placeholder,
  classNames,
}: NumberFormFieldProps<T>) => {
  return (
    <HookFormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={cn("w-full", classNames?.formItem)}>
          {label && (
            <FormLabel
              className={cn("mb-2 block font-normal", classNames?.formLabel)}
            >
              {label}
            </FormLabel>
          )}
          <FormControl className={cn("relative", classNames?.formControl)}>
            <Input
              placeholder={placeholder}
              type="number"
              min={min}
              className={cn("pr-4", classNames?.input)}
              {...field}
            />
          </FormControl>
          {error && (
            <FormMessage className="font-light">{error.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
};

interface SelectFormFieldProps<T extends FieldValues> {
  control: UseFormReturn<T>["control"];
  name: Path<T>;
  label: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  classNames?: {
    formItem?: ClassValue;
    formLabel?: ClassValue;
    formControl?: ClassValue;
    input?: ClassValue;
  };
}

export const SelectFormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  options,
  classNames,
}: SelectFormFieldProps<T>) => {
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
            <Select
              value={field.value}
              defaultValue={field.value}
              onValueChange={(value) => {
                field.onChange(value);
              }}
            >
              <SelectTrigger
                className={cn("w-full border p-2", classNames?.input)}
              >
                <SelectValue
                  placeholder={placeholder}
                  defaultValue={field.value || options[0]?.value}
                />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          {error && (
            <FormMessage className="font-light">{error.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
};

interface TextareaFormFieldProps<T extends FieldValues> {
  control: UseFormReturn<T>["control"];
  name: Path<T>;
  label: string;
  placeholder?: string;
  rows?: number;
  classNames?: {
    formItem?: ClassValue;
    formLabel?: ClassValue;
    formControl?: ClassValue;
    input?: ClassValue;
  };
}

export const TextareaFormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  rows = 4,
  classNames,
}: TextareaFormFieldProps<T>) => {
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
            <Textarea
              placeholder={placeholder}
              className={cn("resize-y", classNames?.input)}
              rows={rows}
              {...field}
            />
          </FormControl>
          {error && (
            <FormMessage className="font-light">{error.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
};

interface PasswordFormFieldProps<T extends FieldValues> {
  control: UseFormReturn<T>["control"];
  name: Path<T>;
  label: string;
  placeholder?: string;
  classNames?: {
    formItem?: ClassValue;
    formLabel?: ClassValue;
    formControl?: ClassValue;
    input?: ClassValue;
  };
}

export const PasswordFormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  classNames,
}: PasswordFormFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

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
            <div className="relative">
              <Input
                placeholder={placeholder}
                type={showPassword ? "text" : "password"}
                className={cn("pr-10", classNames?.input)}
                {...field}
              />
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
            </div>
          </FormControl>
          {error && (
            <FormMessage className="font-light">{error.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
};

interface CheckboxFormFieldProps<T extends FieldValues> {
  control: UseFormReturn<T>["control"];
  name: Path<T>;
  label?: string;
  title?: string;
  description?: string;
  placeholder?: string;
  classNames?: {
    formItem?: ClassValue;
    formLabel?: ClassValue;
    formControl?: ClassValue;
    input?: ClassValue;
  };
}

export const CheckboxFormField = <T extends FieldValues>({
  control,
  name,
  label,
  classNames,
  title,
  description,
}: CheckboxFormFieldProps<T>) => {
  return (
    <HookFormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={cn("w-full", classNames?.formItem)}>
          <FormControl
            className={cn(
              "relative flex items-center gap-3",
              classNames?.formControl,
            )}
          >
            <Checkbox
              className={cn("", classNames?.input)}
              // {...field}
              checked={field.value}
              onCheckedChange={(checked) => {
                field.onChange(checked ? true : false);
              }}
            />
            {label && (
              <span className={cn("font-normal", classNames?.formLabel)}>
                {label}
              </span>
            )}

            {(title || description) && (
              <Stack spacing={"xs"}>
                {title && (
                  <label
                    htmlFor="isDefault"
                    className="text-sm font-medium leading-none"
                  >
                    {title}
                  </label>
                )}
                {description && (
                  <p className="text-xs text-muted-foreground">{description}</p>
                )}
              </Stack>
            )}
          </FormControl>
          {error && (
            <FormMessage className="font-light">{error.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
};
