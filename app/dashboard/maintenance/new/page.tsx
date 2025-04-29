"use client";

import type React from "react";

import { useState, useEffect, createContext, useContext } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { errorToast, successToast } from "@/components/custom/toasts";
import { Title } from "@/components/custom/title";
import { Text } from "@/components/custom/text";
import PageWrapper from "@/components/custom/page-wrapper";
import { Stack } from "@/components/custom/stack";
import { Group } from "@/components/custom/group";
import { cn } from "@/lib/utils";
import {
  Wrench,
  AlertTriangle,
  UploadCloud,
  Calendar,
  Info,
  ArrowLeft,
  CheckCircle2,
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
enum TAB_TYPES {
  DETAILS = "Request Details",
  SCHEDULE = "Scheduling",
  PHOTOS = "Photos & Access",
}

const TAB_TYPES_LIST = [
  TAB_TYPES.DETAILS,
  TAB_TYPES.SCHEDULE,
  TAB_TYPES.PHOTOS,
];

// Context
type MaintenanceRequestContextType = {
  activeTab: TAB_TYPES;
  onTabChange: (tab: TAB_TYPES) => void;
};

const MaintenanceRequestContext = createContext<
  MaintenanceRequestContextType | undefined
>(undefined);

const MaintenanceRequestProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeTab, setActiveTab] = useState<TAB_TYPES>(TAB_TYPES.DETAILS);

  const onTabChange = (tab: TAB_TYPES) => {
    setActiveTab(tab);
  };

  return (
    <MaintenanceRequestContext.Provider value={{ activeTab, onTabChange }}>
      {children}
    </MaintenanceRequestContext.Provider>
  );
};

const useMaintenanceRequestContext = () => {
  const context = useContext(MaintenanceRequestContext);
  if (!context) {
    throw new Error(
      "useMaintenanceRequestContext must be used within a MaintenanceRequestProvider",
    );
  }
  return context;
};

// Animation Variants
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Components
const LeftSection = ({
  activeTab,
  onTabChange,
}: {
  activeTab: TAB_TYPES;
  onTabChange: (tab: TAB_TYPES) => void;
}) => {
  return (
    <Stack>
      <LeftSectionItem
        icon={Info}
        tabType={TAB_TYPES.DETAILS}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
      <LeftSectionItem
        icon={Calendar}
        tabType={TAB_TYPES.SCHEDULE}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
      <LeftSectionItem
        icon={UploadCloud}
        tabType={TAB_TYPES.PHOTOS}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    </Stack>
  );
};

type LeftSectionItemProps = {
  tabType: TAB_TYPES;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  activeTab: TAB_TYPES;
  onTabChange: (tab: TAB_TYPES) => void;
};

const LeftSectionItem = ({
  tabType,
  icon: Icon,
  activeTab,
  onTabChange,
}: LeftSectionItemProps) => {
  return (
    <div
      className="flex cursor-pointer items-center gap-3"
      onClick={() => {
        onTabChange(tabType);
      }}
    >
      <Icon
        className={cn(
          "mr-2 h-6 w-6 text-neutral-500 transition-all duration-300",
          {
            "scale-[1.2] text-primary": activeTab === tabType,
          },
        )}
      />
      <span
        className={cn(
          "text-sm font-light text-neutral-500 transition-all duration-300",
          {
            "scale-[1.2] text-primary": activeTab === tabType,
          },
        )}
      >
        {tabType}
      </span>
    </div>
  );
};

const Navigation = ({
  activeTab,
  onTabChange,
}: {
  activeTab: TAB_TYPES;
  onTabChange: (tab: TAB_TYPES) => void;
}) => {
  const form = useForm<FormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Group justify="between" className="mt-auto">
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          const currentIndex = TAB_TYPES_LIST.indexOf(activeTab);
          if (currentIndex > 0) {
            onTabChange(TAB_TYPES_LIST[currentIndex - 1]);
          }
        }}
        disabled={activeTab === TAB_TYPES.DETAILS}
        className="rounded-full"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>

      {activeTab !== TAB_TYPES.PHOTOS ? (
        <Button
          type="button"
          className="rounded-full"
          onClick={() => {
            const currentIndex = TAB_TYPES_LIST.indexOf(activeTab);
            if (currentIndex < TAB_TYPES_LIST.length - 1) {
              onTabChange(TAB_TYPES_LIST[currentIndex + 1]);
            }
          }}
        >
          Next
          <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
        </Button>
      ) : (
        <Button
          type="submit"
          className="rounded-full bg-gradient-to-r from-primary to-primary/80"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
          <CheckCircle2 className="ml-2 h-4 w-4" />
        </Button>
      )}
    </Group>
  );
};

const FloatingParticles = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={`particle-${i}`}
        className="fixed h-2 w-2 rounded-full bg-primary/20"
        initial={{
          x: `${Math.random() * 100}vw`,
          y: `${Math.random() * 100}vh`,
          opacity: 0,
        }}
        animate={{
          y: [`${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
          opacity: [0, 0.7, 0],
          scale: [0, 1, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 10 + Math.random() * 20,
          delay: i * 2,
        }}
      />
    ))}
  </>
);

export default function NewMaintenanceRequestPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<TAB_TYPES>(TAB_TYPES.DETAILS);

  const onTabChange = (tab: TAB_TYPES) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(maintenanceRequestSchema),
    defaultValues: {
      accessInstructions: "",
      preferredDate: "",
      preferredTime: "",
    },
  });

  // Calculate form progress
  const calculateProgress = () => {
    const watchedValues = form.watch();
    const totalFields = Object.keys(maintenanceRequestSchema.shape).length;
    const filledFields = Object.entries(watchedValues).filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, value]) => {
        if (typeof value === "object" && value !== null) {
          return Object.values(value).some((v) => v !== "" && v !== undefined);
        }
        return value !== "" && value !== undefined;
      },
    ).length;

    const progress = Math.min(
      100,
      Math.round((filledFields / totalFields) * 100),
    );
    setFormProgress(progress);
  };

  // Update progress when form values change
  form.watch(() => calculateProgress());

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  }

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
      errorToast("", {
        title: "Error",
        description:
          "There was a problem submitting your request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageWrapper>
      <header className="mb-6">
        <Title size="h2">New Maintenance Request</Title>
        <Text variant="dimmed">
          Submit a maintenance request for your property
        </Text>
      </header>

      <main className="grid grid-cols-[minmax(12rem,1fr)_4fr] gap-6 p-4">
        <Stack spacing="lg">
          <Stack spacing="xs">
            <Group justify="between">
              <Text variant="dimmed" size="sm">
                Form completion
              </Text>
              <Text size="sm">{formProgress}%</Text>
            </Group>
            <Progress value={formProgress} className="h-2" />
          </Stack>

          {/* Tabs */}
          <LeftSection activeTab={activeTab} onTabChange={onTabChange} />
        </Stack>

        <div className="relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background/5 to-background/0"></div>
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl"></div>

          <Form {...form}>
            <form
              id="maintenance-request-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex h-[calc(100vh-12rem)] flex-col gap-6 rounded-xl bg-background/40 p-6 backdrop-blur-md"
            >
              <Tabs
                defaultValue={TAB_TYPES.DETAILS}
                value={activeTab}
                onValueChange={(tab) => onTabChange(tab as TAB_TYPES)}
              >
                <TabsContent value={TAB_TYPES.DETAILS} className="space-y-4">
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
                            <SelectTrigger className="bg-white/30 focus:bg-white/50">
                              <SelectValue placeholder="Select a property" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {properties.map((property) => (
                              <SelectItem key={property.id} value={property.id}>
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
                              <SelectTrigger className="bg-white/30 focus:bg-white/50">
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
                            className="bg-white/30 focus:bg-white/50"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a short, descriptive title for your
                          maintenance request
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
                            className="min-h-32 resize-none bg-white/30 focus:bg-white/50"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Please describe the issue in detail. Include when it
                          started, any troubleshooting {"you've"} tried, etc.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value={TAB_TYPES.SCHEDULE} className="space-y-4">
                  <div className="rounded-lg bg-white/20 p-4">
                    <p className="text-sm text-muted-foreground">
                      While we cannot guarantee specific times, your preferences
                      help us schedule maintenance more efficiently.
                    </p>
                  </div>

                  <div className="grid gap-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="preferredDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Date (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                className="bg-white/30 focus:bg-white/50"
                                min={new Date().toISOString().split("T")[0]}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Select a preferred date for the maintenance visit
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
                            <FormLabel>Preferred Time (Optional)</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-white/30 focus:bg-white/50">
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

                    <div className="space-y-4 rounded-lg bg-indigo-50/50 p-4">
                      <h4 className="font-medium">Typical Response Times</h4>
                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="rounded-lg bg-white/50 p-3">
                          <div className="mb-2 flex items-center">
                            <div className="mr-2 rounded-full bg-green-100 p-1">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </div>
                            <span className="font-medium">Low Priority</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Typically 3-5 business days
                          </p>
                        </div>
                        <div className="rounded-lg bg-white/50 p-3">
                          <div className="mb-2 flex items-center">
                            <div className="mr-2 rounded-full bg-amber-100 p-1">
                              <Wrench className="h-4 w-4 text-amber-600" />
                            </div>
                            <span className="font-medium">Medium Priority</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Typically 1-2 business days
                          </p>
                        </div>
                        <div className="rounded-lg bg-white/50 p-3">
                          <div className="mb-2 flex items-center">
                            <div className="mr-2 rounded-full bg-red-100 p-1">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            </div>
                            <span className="font-medium">High Priority</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Same day or next business day
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value={TAB_TYPES.PHOTOS} className="space-y-4">
                  <div>
                    <FormLabel>Photos/Documents (Optional)</FormLabel>
                    <div className="mt-2">
                      <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 bg-white/20 px-6 py-10 transition-colors hover:bg-white/30">
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
                          className="mt-4 rounded-lg bg-white/30 p-4"
                        >
                          <p className="text-sm font-medium">Selected files:</p>
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

                  <Separator className="my-6 bg-muted/50" />

                  <FormField
                    control={form.control}
                    name="accessInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Access Instructions (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Instructions for maintenance personnel"
                            className="resize-none bg-white/30 focus:bg-white/50"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide any special instructions for accessing the
                          property or area that needs maintenance
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
              <Navigation activeTab={activeTab} onTabChange={onTabChange} />
            </form>
          </Form>
        </div>
      </main>
      <FloatingParticles />
    </PageWrapper>
  );
}
