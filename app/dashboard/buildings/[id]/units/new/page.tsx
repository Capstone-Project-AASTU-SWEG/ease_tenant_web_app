"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  CircleDashed,
  Upload,
  Sparkles,
  Building,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { errorToast, successToast } from "@/components/custom/toasts";
import PageWrapper from "@/components/custom/page-wrapper";
import { Stack } from "@/components/custom/stack";
import { Group } from "@/components/custom/group";
import {
  NumberFormField,
  SelectFormField,
  TextareaFormField,
  TextFormField,
  DateFormField,
} from "@/components/custom/form-field";
import { FileUploader } from "@/components/custom/file-upload";
import { DataListInput } from "@/components/custom/data-list-input";

import { UNIT_STATUS, UNIT_TYPE } from "@/types";
import { unitSchema, UnitSchema } from "./_validations";
import PageHeader from "@/components/custom/page-header";
import {
  useCreateUnitMutation,
  useUpdateUnitMutation,
} from "@/app/quries/useUnits";
import { useGetBuildingQuery } from "@/app/quries/useBuildings";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

const TAB_TYPES = {
  BASIC: "Basic Info",
  FEATURES: "Features",
  MEDIA: "Media",
} as const;

type TabType = keyof typeof TAB_TYPES;
const TAB_TYPES_LIST = Object.keys(TAB_TYPES) as TabType[];

const Page = () => {
  const [activeTab, setActiveTab] = useState<TabType>("BASIC");
  const params = useParams();
  const buildingID = params["id"] as string;
  const createUnitMutation = useCreateUnitMutation();
  const updateUnitMutation = useUpdateUnitMutation();
  const router = useRouter();

  const searchParams = useSearchParams();

  const unitId = searchParams.get("unitId") as string;
  const buildingId = searchParams.get("buildingId") as string;

  const getBuildingQuery = useGetBuildingQuery(buildingId);
  const building = getBuildingQuery.data;

  const unitToBeUpdated = building?.units.find((u) => u.id === unitId);

  const form = useForm<UnitSchema>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      buildingId: buildingID,
      floorNumber: unitToBeUpdated?.floorNumber || 1,
      unitNumber: unitToBeUpdated?.unitNumber || "001",
      sizeSqFt: unitToBeUpdated?.sizeSqFt || 100,
      type: unitToBeUpdated?.type || UNIT_TYPE.OFFICE,
      status: unitToBeUpdated?.status || UNIT_STATUS.AVAILABLE,
      lastRenovationDate: unitToBeUpdated?.lastRenovationDate || new Date(),
      monthlyRent: 100,
      amenities: unitToBeUpdated?.amenities || [],
      description: unitToBeUpdated?.description || "",
    },
  });

  // Drived states
  const isEditting = !!unitToBeUpdated;

  const handleFiles = (files: File[]) => {
    const images: File[] = [];
    const videos: File[] = [];

    const getFileType = (file: File): "image" | "video" | "document" => {
      if (file.type.startsWith("image/")) return "image";
      if (file.type.startsWith("video/")) return "video";
      return "document";
    };

    Array.from(files).forEach((file) => {
      if (getFileType(file) === "image") {
        images.push(file);
      } else if (getFileType(file) === "video") {
        videos.push(file);
      }
    });

    form.setValue("images", [...images]);
  };

  const handleSubmit = () => {
    const data: UnitSchema = form.getValues();

    if (isEditting) {
      updateUnitMutation.mutate({
        buildingId: buildingID,
        unit: { ...data, id: unitId },
      });

      successToast("Unit updated successfully");
      router.push(`/dashboard/buildings/${buildingID}/units`);

      return;
    }
    createUnitMutation.mutate({
      buildingId: buildingID,
      unit: data,
    });
  };

  const validateCurrentTab = async () => {
    switch (activeTab) {
      case "BASIC":
        return await form.trigger([
          "buildingId",
          "floorNumber",
          "unitNumber",
          "type",
          "status",
          "sizeSqFt",
          "monthlyRent",
        ]);
      case "FEATURES":
        return await form.trigger(["amenities"]);
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

  useEffect(() => {
    if (createUnitMutation.isSuccess) {
      successToast("Unit created successfully");
      router.push(`/dashboard/buildings/${buildingID}/units`);
    }
  }, [buildingID, createUnitMutation.isSuccess, router]);

  useEffect(() => {
    if (createUnitMutation.isError) {
      errorToast(createUnitMutation.error.message);
    }
  }, [createUnitMutation.error?.message, createUnitMutation.isError]);

  if (!buildingID) {
    return (
      <section>
        <p>No Building ID provided.</p>
      </section>
    );
  }

  return (
    <PageWrapper className="py-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageHeader
          title={isEditting ? "Updating a Unit" : `Create New Unit`}
          description={
            isEditting
              ? "Updating a unit **********"
              : "Add a new unit to your property management system"
          }
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
              <h3 className="mb-6 text-lg font-semibold">Unit Setup</h3>
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
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="flex min-h-[calc(100vh-10rem)] flex-col gap-6"
                  >
                    <Tabs
                      defaultValue="BASIC"
                      value={activeTab}
                      onValueChange={(tab) => setActiveTab(tab as TabType)}
                    >
                      <TabsContent value="BASIC" className="space-y-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <Building2 className="h-5 w-5" />
                            </div>
                            <div>
                              <h2 className="text-xl font-semibold">
                                Basic Information
                              </h2>
                              <p className="text-sm text-muted-foreground">
                                Enter the basic details of your unit
                              </p>
                            </div>
                          </div>

                          <div className="rounded-lg border bg-slate-50 p-6 dark:bg-slate-900/50">
                            <h3 className="mb-4 text-base font-medium">
                              Unit Specifications
                            </h3>
                            <Stack spacing={"lg"}>
                              <Group
                                className="grid grid-cols-1 gap-4 md:grid-cols-2"
                                align="start"
                              >
                                <NumberFormField<UnitSchema>
                                  control={form.control}
                                  name="floorNumber"
                                  label="Floor Number"
                                  placeholder="1"
                                />
                                <TextFormField<UnitSchema>
                                  control={form.control}
                                  name="unitNumber"
                                  label="Unit Number"
                                  placeholder="e.g. 101"
                                />
                              </Group>

                              <Group
                                className="grid grid-cols-1 gap-4 md:grid-cols-2"
                                align="start"
                              >
                                <SelectFormField<UnitSchema>
                                  control={form.control}
                                  name="type"
                                  label="Unit Type"
                                  options={[
                                    {
                                      label: "Office",
                                      value: UNIT_TYPE.OFFICE,
                                    },
                                    {
                                      label: "Retail",
                                      value: UNIT_TYPE.RETAIL,
                                    },
                                    {
                                      label: "Warehouse",
                                      value: UNIT_TYPE.WAREHOUSE,
                                    },
                                    {
                                      label: "Restaurant",
                                      value: UNIT_TYPE.RESTAURANT,
                                    },
                                    { label: "Café", value: UNIT_TYPE.CAFE },
                                    {
                                      label: "Medical",
                                      value: UNIT_TYPE.MEDICAL,
                                    },
                                    {
                                      label: "Fitness/Gym",
                                      value: UNIT_TYPE.FITNESS,
                                    },
                                    {
                                      label: "Salon/Spa",
                                      value: UNIT_TYPE.SALON,
                                    },
                                    {
                                      label: "Bank/Financial",
                                      value: UNIT_TYPE.BANK,
                                    },
                                    {
                                      label: "Pharmacy",
                                      value: UNIT_TYPE.PHARMACY,
                                    },
                                    {
                                      label: "Convenience Store",
                                      value: UNIT_TYPE.CONVENIENCE,
                                    },
                                    {
                                      label: "Other Commercial",
                                      value: UNIT_TYPE.OTHER,
                                    },
                                  ]}
                                />
                                <SelectFormField<UnitSchema>
                                  control={form.control}
                                  name="status"
                                  label="Unit Status"
                                  options={[
                                    {
                                      label: "Available",
                                      value: UNIT_STATUS.AVAILABLE,
                                    },
                                    {
                                      label: "Reserved",
                                      value: UNIT_STATUS.RESERVED,
                                    },
                                    {
                                      label: "Under Maintenance",
                                      value: UNIT_STATUS.UNDER_MAINTENANCE,
                                    },
                                  ]}
                                />
                              </Group>

                              <Group
                                className="grid grid-cols-1 gap-4 md:grid-cols-2"
                                align="start"
                              >
                                <NumberFormField<UnitSchema>
                                  control={form.control}
                                  name="sizeSqFt"
                                  label="Size (sq ft)"
                                  placeholder="1000"
                                />
                                <NumberFormField<UnitSchema>
                                  control={form.control}
                                  name="monthlyRent"
                                  label="Monthly Rent ($)"
                                  placeholder="2500"
                                />
                              </Group>

                              <DateFormField<UnitSchema>
                                control={form.control}
                                name="lastRenovationDate"
                                label="Last Renovation Date"
                              />

                              <TextareaFormField<UnitSchema>
                                control={form.control}
                                name="description"
                                label="Description"
                                placeholder="Enter a description of the unit"
                                rows={3}
                              />
                            </Stack>
                          </div>
                        </motion.div>
                      </TabsContent>

                      <TabsContent value="FEATURES" className="space-y-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <Building className="h-5 w-5" />
                            </div>
                            <div>
                              <h2 className="text-xl font-semibold">
                                Features & Media
                              </h2>
                              <p className="text-sm text-muted-foreground">
                                Add amenities and upload images of your unit
                              </p>
                            </div>
                          </div>

                          <div className="rounded-lg border bg-slate-50 p-6 dark:bg-slate-900/50">
                            <h3 className="mb-4 text-base font-medium">
                              Unit Amenities
                            </h3>
                            <Stack spacing={"lg"}>
                              <DataListInput
                                label="Amenities"
                                items={[
                                  { label: "Windows", value: "Windows" },
                                  {
                                    label: "Private Bathroom",
                                    value: "Private Bathroom",
                                  },
                                  {
                                    label: "Kitchenette",
                                    value: "Kitchenette",
                                  },
                                  {
                                    label: "Network Ready",
                                    value: "Network Ready",
                                  },
                                  { label: "HVAC", value: "HVAC" },
                                  {
                                    label: "Security System",
                                    value: "Security System",
                                  },
                                  {
                                    label: "Elevator Access",
                                    value: "Elevator Access",
                                  },
                                  {
                                    label: "Conference Room",
                                    value: "Conference Room",
                                  },
                                  {
                                    label: "Reception Area",
                                    value: "Reception Area",
                                  },
                                  {
                                    label: "Storage Space",
                                    value: "Storage Space",
                                  },
                                ]}
                                placeholder="Add amenities (e.g., Windows, Private Bathroom)"
                                onChange={(tags) => {
                                  form.setValue(
                                    "amenities",
                                    tags.map((tag) => tag.value),
                                  );
                                }}
                                selectedItems={form
                                  .watch("amenities")
                                  .map((f) => ({
                                    label: f,
                                    value: f,
                                  }))}
                              />
                            </Stack>
                          </div>

                          <div className="mt-6 rounded-lg border border-dashed border-primary/20 bg-primary/5 p-6">
                            <div className="mb-4 flex items-center gap-3">
                              <Upload className="h-5 w-5 text-primary" />
                              <h3 className="text-base font-medium">
                                Unit Images
                              </h3>
                            </div>
                            <p className="mb-4 text-sm text-muted-foreground">
                              Upload high-quality images of your unit. These
                              will be displayed to potential tenants.
                            </p>
                            <FileUploader
                              onFilesChange={handleFiles}
                              showPreview
                              maxFiles={10}
                              acceptedFormats={[
                                "image/png",
                                "image/jpeg",
                                "image/jpg",
                              ]}
                            />
                          </div>
                        </motion.div>
                      </TabsContent>
                    </Tabs>
                    <Group justify="between" className="mt-auto border-t pt-6">
                      {activeTab !== "BASIC" ? (
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

                      {activeTab !== "FEATURES" ? (
                        <Button
                          type="button"
                          onClick={handleNext}
                          className="gap-2"
                        >
                          Next <ChevronRight className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={handleSubmit}
                          disabled={createUnitMutation.isPending}
                          className="gap-2 bg-gradient-to-r from-primary to-primary/80 transition-all hover:from-primary/90 hover:to-primary"
                        >
                          {createUnitMutation.isPending
                            ? "Submitting..."
                            : isEditting
                              ? "Edit Unit"
                              : "Create Unit"}
                          <Sparkles className="h-4 w-4" />
                        </Button>
                      )}
                    </Group>
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
};

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
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full transition-all",
                isActive
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-400 dark:bg-slate-800",
              )}
            >
              {isActive ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <CircleDashed className="h-4 w-4" />
              )}
            </div>
            <span
              className={cn(
                "text-sm font-medium transition-all",
                isCurrentTab
                  ? "text-primary"
                  : isActive
                    ? "text-slate-700 dark:text-slate-200"
                    : "text-slate-400 dark:text-slate-500",
              )}
            >
              {TAB_TYPES[tab]}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Page;
