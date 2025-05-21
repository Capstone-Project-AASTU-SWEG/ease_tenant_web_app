"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from "framer-motion";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { errorToast, successToast } from "@/components/custom/toasts";
import PageWrapper from "@/components/custom/page-wrapper";
import PageHeader from "@/components/custom/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Wrench,
  AlertTriangle,
  UploadCloud,
  Info,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Schema
const maintenanceRequestSchema = z.object({
  property: z.string({
    required_error: "Please select a property.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  priority: z.enum(["low", "medium", "high"], {
    required_error: "Please select a priority level.",
  }),
  accessInstructions: z.string().optional(),
});

type FormValues = z.infer<typeof maintenanceRequestSchema>;

// Constants
const properties = [
  { id: "tt-201", name: "Office #201, Tech Tower" },
  { id: "ep-405", name: "Suite #405, Eastside Plaza" },
  { id: "wp-102", name: "Store #102, West Point" },
];

const categories = [
  { id: "plumbing", name: "Plumbing" },
  { id: "electrical", name: "Electrical" },
  { id: "hvac", name: "HVAC/Air Conditioning" },
  { id: "structural", name: "Structural" },
  { id: "appliance", name: "Appliance" },
  { id: "security", name: "Security/Access" },
  { id: "cleaning", name: "Cleaning" },
  { id: "other", name: "Other" },
];

export default function NewMaintenanceRequestPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(maintenanceRequestSchema),
    defaultValues: {
      accessInstructions: "",
    },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  }

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    try {
      console.log(values);
      console.log(files);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      successToast("", {
        title: "Request Submitted!",
        description:
          "Your maintenance request has been successfully submitted.",
      });

      router.push("/dashboard/maintenance?success=true");
    } catch (error) {
      const isErrorInstance = error instanceof Error;
      errorToast("", {
        title: "Error",
        description: isErrorInstance
          ? error.message
          : "There was a problem submitting your request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageWrapper className="py-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageHeader
          title="New Maintenance Request"
          description="Submit a maintenance request for your property"
          withBackButton
        />
      </motion.div>

      <main className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(16rem,1fr)_4fr]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="sticky top-24 overflow-hidden rounded-lg border bg-gradient-to-br from-slate-50 to-white shadow-none dark:from-slate-900 dark:to-slate-950">
            <CardContent className="p-6">
              <h3 className="mb-6 text-lg font-semibold">Request Form</h3>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Fields marked with <span className="text-red-500">*</span> are required
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <section className="overflow-hidden">
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-8rem)] max-h-[calc(100vh-8rem)] pr-4">
                <Form {...form}>
                  <form
                    id="maintenance-request-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex min-h-[calc(100vh-10rem)] flex-col gap-6"
                  >
                    <div className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="mb-6 flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Info className="h-5 w-5" />
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold">
                              Maintenance Request
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              Provide information about the maintenance issue
                            </p>
                          </div>
                        </div>

                        <div className="rounded-lg border bg-slate-50 p-6 dark:bg-slate-900/50">
                          <h3 className="mb-4 text-base font-medium">
                            Issue Information
                          </h3>
                          <div className="space-y-6">
                            <FormField
                              control={form.control}
                              name="property"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Property <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a property" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {properties.map((property) => (
                                        <SelectItem
                                          key={property.id}
                                          value={property.id}
                                        >
                                          {property.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormDescription>
                                    Select the property that needs maintenance
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid gap-6 md:grid-cols-2">
                              <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      Category <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {categories.map((category) => (
                                          <SelectItem
                                            key={category.id}
                                            value={category.id}
                                          >
                                            {category.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                  <FormItem className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <FormLabel>
                                        Priority <span className="text-red-500">*</span>
                                      </FormLabel>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-4 w-4 p-0"
                                          >
                                            <Info className="h-3 w-3" />
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80">
                                          <div className="grid gap-4">
                                            <h4 className="font-medium leading-none">
                                              Response Time Guidelines
                                            </h4>
                                            <div className="grid gap-2">
                                              <div className="flex items-center gap-3">
                                                <div className="rounded-full bg-green-100 p-1">
                                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                </div>
                                                <div>
                                                  <p className="text-sm font-medium">
                                                    Low Priority
                                                  </p>
                                                  <p className="text-xs text-muted-foreground">
                                                    Typically 3-5 business days
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-3">
                                                <div className="rounded-full bg-amber-100 p-1">
                                                  <Wrench className="h-4 w-4 text-amber-600" />
                                                </div>
                                                <div>
                                                  <p className="text-sm font-medium">
                                                    Medium Priority
                                                  </p>
                                                  <p className="text-xs text-muted-foreground">
                                                    Typically 1-2 business days
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-3">
                                                <div className="rounded-full bg-red-100 p-1">
                                                  <AlertTriangle className="h-4 w-4 text-red-600" />
                                                </div>
                                                <div>
                                                  <p className="text-sm font-medium">
                                                    High Priority
                                                  </p>
                                                  <p className="text-xs text-muted-foreground">
                                                    Same day or next business day
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </PopoverContent>
                                      </Popover>
                                    </div>
                                    <FormControl>
                                      <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0"
                                      >
                                        <FormItem className="flex items-center space-x-2 space-y-0 rounded-lg border border-muted bg-white/20 px-4 py-2 transition-colors hover:bg-white/30">
                                          <FormControl>
                                            <RadioGroupItem value="low" />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            Low
                                          </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-2 space-y-0 rounded-lg border border-muted bg-white/20 px-4 py-2 transition-colors hover:bg-white/30">
                                          <FormControl>
                                            <RadioGroupItem value="medium" />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            Medium
                                          </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-2 space-y-0 rounded-lg border border-muted bg-white/20 px-4 py-2 transition-colors hover:bg-white/30">
                                          <FormControl>
                                            <RadioGroupItem value="high" />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            High
                                          </FormLabel>
                                        </FormItem>
                                      </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Description <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Detailed description of the issue"
                                      className="min-h-32 resize-none"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Please describe the issue in detail.
                                    Include when it started, any
                                    troubleshooting
                                    {"you've"} tried, etc.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="rounded-lg border bg-slate-50 p-6 dark:bg-slate-900/50">
                              <h3 className="mb-4 text-base font-medium">
                                Upload Photos
                              </h3>
                              <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 bg-white px-6 py-10 transition-colors hover:bg-white/90">
                                <div className="text-center">
                                  <UploadCloud className="mx-auto h-12 w-12 text-gray-300" />
                                  <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                                    <label
                                      htmlFor="file-upload"
                                      className="relative cursor-pointer rounded-md bg-transparent text-primary hover:text-primary/80"
                                    >
                                      <span>Upload files</span>
                                      <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only"
                                        multiple
                                        onChange={handleFileChange}
                                      />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                  </div>
                                  <p className="text-xs leading-5 text-muted-foreground">
                                    PNG, JPG, PDF up to 10MB each
                                  </p>
                                </div>
                              </div>
                              {files.length > 0 && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-4 rounded-lg bg-white p-4 shadow-sm"
                                >
                                  <p className="text-sm font-medium">
                                    Selected files:
                                  </p>
                                  <ul className="mt-2 space-y-1">
                                    {files.map((file, index) => (
                                      <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center text-sm text-muted-foreground"
                                      >
                                        <div className="mr-2 rounded-full bg-emerald-100 p-1">
                                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                        </div>
                                        {file.name}
                                      </motion.li>
                                    ))}
                                  </ul>
                                </motion.div>
                              )}
                            </div>
                            
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    <div className="mt-auto flex justify-end border-t pt-6">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="gap-2 bg-gradient-to-r from-primary to-primary/80 transition-all hover:from-primary/90 hover:to-primary"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Request"}
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </Form>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </CardContent>
          </section>
        </motion.div>
      </main>
    </PageWrapper>
  );
}