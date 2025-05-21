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
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { errorToast, successToast } from "@/components/custom/toasts";
import PageWrapper from "@/components/custom/page-wrapper";
import PageHeader from "@/components/custom/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Wrench,
  AlertTriangle,
  UploadCloud,
  Calendar,
  Info,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  CircleDashed,
  Sparkles,
} from "lucide-react";

// Schema
const maintenanceRequestSchema = z.object({
  property: z.string({
    required_error: "Please select a property.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  priority: z.enum(["low", "medium", "high"], {
    required_error: "Please select a priority level.",
  }),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
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

// Tab types
const TAB_TYPES = {
  DETAILS: "Request Details",
  SCHEDULE: "Scheduling",
  PHOTOS: "Photos & Access",
} as const;

type TabType = keyof typeof TAB_TYPES;
const TAB_TYPES_LIST = Object.keys(TAB_TYPES) as TabType[];

export default function NewMaintenanceRequestPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("DETAILS");

  const form = useForm<FormValues>({
    resolver: zodResolver(maintenanceRequestSchema),
    defaultValues: {
      accessInstructions: "",
      preferredDate: "",
      preferredTime: "",
    },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  }

  const validateCurrentTab = async () => {
    switch (activeTab) {
      case "DETAILS":
        return await form.trigger([
          "property",
          "category",
          "title",
          "description",
          "priority",
        ]);
      case "SCHEDULE":
        return true; // Optional fields
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isValid = await validateCurrentTab();
    if (isValid) {
      const currentIndex = TAB_TYPES_LIST.indexOf(activeTab);
      if (currentIndex < TAB_TYPES_LIST.length - 1) {
        setActiveTab(TAB_TYPES_LIST[currentIndex + 1]);
      }
    }
  };

  const handlePrev = () => {
    const currentIndex = TAB_TYPES_LIST.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(TAB_TYPES_LIST[currentIndex - 1]);
    }
  };

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    try {
      // In a real app, submit the form data to your API here
      console.log(values);
      // Upload files if needed
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
              <h3 className="mb-6 text-lg font-semibold">Request Progress</h3>

              <ProgressIndicator activeTab={activeTab} />
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
                    <Tabs
                      defaultValue="DETAILS"
                      value={activeTab}
                      onValueChange={(tab) => setActiveTab(tab as TabType)}
                    >
                      <TabsContent value="DETAILS" className="space-y-6">
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
                                Request Details
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
                                    <FormLabel>Property</FormLabel>
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
                                      <FormLabel>Category</FormLabel>
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
                                      <FormLabel>Priority</FormLabel>
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
                                name="title"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Brief summary of the issue"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Provide a short, descriptive title for
                                      your maintenance request
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description</FormLabel>
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
                            </div>
                          </div>
                        </motion.div>
                      </TabsContent>

                      <TabsContent value="SCHEDULE" className="space-y-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                              <h2 className="text-xl font-semibold">
                                Scheduling Preferences
                              </h2>
                              <p className="text-sm text-muted-foreground">
                                Let us know when {`you'd`} prefer the
                                maintenance to be done
                              </p>
                            </div>
                          </div>

                          <div className="rounded-lg border bg-slate-50 p-6 dark:bg-slate-900/50">
                            <div className="mb-4 rounded-lg bg-primary/5 p-4">
                              <p className="text-sm text-muted-foreground">
                                While we cannot guarantee specific times, your
                                preferences help us schedule maintenance more
                                efficiently.
                              </p>
                            </div>

                            <div className="grid gap-6">
                              <div className="grid gap-6 md:grid-cols-2">
                                <FormField
                                  control={form.control}
                                  name="preferredDate"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>
                                        Preferred Date (Optional)
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          type="date"
                                          min={
                                            new Date()
                                              .toISOString()
                                              .split("T")[0]
                                          }
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormDescription>
                                        Select a preferred date for the
                                        maintenance visit
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="preferredTime"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>
                                        Preferred Time (Optional)
                                      </FormLabel>
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select a time range" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="morning">
                                            Morning (8AM - 12PM)
                                          </SelectItem>
                                          <SelectItem value="afternoon">
                                            Afternoon (12PM - 4PM)
                                          </SelectItem>
                                          <SelectItem value="evening">
                                            Evening (4PM - 8PM)
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormDescription>
                                        Select a preferred time range
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 rounded-lg border bg-slate-50 p-6 dark:bg-slate-900/50">
                            <h3 className="mb-4 text-base font-medium">
                              Response Time Guidelines
                            </h3>
                            <div className="grid gap-4 md:grid-cols-3">
                              <div className="rounded-lg bg-white p-4 shadow-sm">
                                <div className="mb-2 flex items-center">
                                  <div className="mr-2 rounded-full bg-green-100 p-1">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  </div>
                                  <span className="font-medium">
                                    Low Priority
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Typically 3-5 business days
                                </p>
                              </div>
                              <div className="rounded-lg bg-white p-4 shadow-sm">
                                <div className="mb-2 flex items-center">
                                  <div className="mr-2 rounded-full bg-amber-100 p-1">
                                    <Wrench className="h-4 w-4 text-amber-600" />
                                  </div>
                                  <span className="font-medium">
                                    Medium Priority
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Typically 1-2 business days
                                </p>
                              </div>
                              <div className="rounded-lg bg-white p-4 shadow-sm">
                                <div className="mb-2 flex items-center">
                                  <div className="mr-2 rounded-full bg-red-100 p-1">
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                  </div>
                                  <span className="font-medium">
                                    High Priority
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Same day or next business day
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </TabsContent>

                      <TabsContent value="PHOTOS" className="space-y-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <UploadCloud className="h-5 w-5" />
                            </div>
                            <div>
                              <h2 className="text-xl font-semibold">
                                Photos & Access Instructions
                              </h2>
                              <p className="text-sm text-muted-foreground">
                                Upload photos of the issue and provide access
                                instructions
                              </p>
                            </div>
                          </div>

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

                          <div className="mt-6 rounded-lg border bg-slate-50 p-6 dark:bg-slate-900/50">
                            <h3 className="mb-4 text-base font-medium">
                              Access Instructions
                            </h3>
                            <FormField
                              control={form.control}
                              name="accessInstructions"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Instructions for maintenance personnel"
                                      className="resize-none"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Provide any special instructions for
                                    accessing the property or area that needs
                                    maintenance
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </motion.div>
                      </TabsContent>
                    </Tabs>

                    <div className="mt-auto flex justify-between border-t pt-6">
                      {activeTab !== "DETAILS" ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePrev}
                          className="gap-2"
                        >
                          <ChevronLeft className="h-4 w-4" /> Previous
                        </Button>
                      ) : (
                        <span />
                      )}

                      {activeTab !== "PHOTOS" ? (
                        <Button
                          type="button"
                          onClick={handleNext}
                          className="gap-2"
                        >
                          Next <ChevronRight className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="gap-2 bg-gradient-to-r from-primary to-primary/80 transition-all hover:from-primary/90 hover:to-primary"
                        >
                          {isSubmitting ? "Submitting..." : "Submit Request"}
                          <Sparkles className="h-4 w-4" />
                        </Button>
                      )}
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

const ProgressIndicator = ({ activeTab }: { activeTab: TabType }) => {
  const activeIndex = TAB_TYPES_LIST.indexOf(activeTab);

  return (
    <div className="relative flex flex-col gap-2">
      {TAB_TYPES_LIST.map((tab, index) => {
        const isActive = index <= activeIndex;
        const isCurrentTab = tab === activeTab;

        return (
          <div key={tab} className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-400 dark:bg-slate-800"
              }`}
            >
              {isActive ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <CircleDashed className="h-4 w-4" />
              )}
            </div>
            <span
              className={`text-sm font-medium transition-all ${
                isCurrentTab
                  ? "text-primary"
                  : isActive
                    ? "text-slate-700 dark:text-slate-200"
                    : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {TAB_TYPES[tab]}
            </span>
          </div>
        );
      })}
    </div>
  );
};
