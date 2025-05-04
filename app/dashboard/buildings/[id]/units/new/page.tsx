"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Save,
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
import { useCreateUnitMutation } from "@/app/quries/useUnits";
import LogJSON from "@/components/custom/log-json";
import { useGetBuildingQuery } from "@/app/quries/useBuildings";

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
  const getBuildingQuery = useGetBuildingQuery(buildingID);
  const building = getBuildingQuery.data;
  const router = useRouter();

  const form = useForm<UnitSchema>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      buildingId: buildingID,
      floorNumber: 1,
      unitNumber: "001",
      sizeSqFt: 100,
      type: UNIT_TYPE.OFFICE,
      status: UNIT_STATUS.AVAILABLE,
      lastRenovationDate: new Date(),
      monthlyRent: 100,
      amenities: [],
      description: "",
    },
  });

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

  const onSubmit = (data: UnitSchema) => {
    console.log("Form submitted:", data);
  };

  const handleSubmit = () => {
    const data: UnitSchema = form.getValues();

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

  const handleTabClick = async (tabType: TabType) => {
    const tabIndex = TAB_TYPES_LIST.indexOf(tabType);
    const activeTabIndex = TAB_TYPES_LIST.indexOf(activeTab);

    if (tabIndex > activeTabIndex) {
      const isValid = await validateCurrentTab();
      if (!isValid) return;
    }
    setActiveTab(tabType);
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
      <LogJSON data={{ buildingID }} />
      <PageHeader
        title={`Add Unit to ${building?.name}`}
        description="Add a new unit to your property management system"
        withBackButton
      />

      <main className="mt-4 grid grid-cols-1 gap-6 pb-6 lg:grid-cols-[minmax(12rem,1fr)_4fr]">
        <Stack spacing="lg">
          <LeftSection activeTab={activeTab} onTabClick={handleTabClick} />
        </Stack>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex min-h-[calc(100vh-12rem)] flex-col gap-6 px-1"
          >
            <Tabs
              defaultValue="BASIC"
              value={activeTab}
              onValueChange={(tab) => setActiveTab(tab as TabType)}
            >
              <TabsContent value="BASIC" className="space-y-4">
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
                      { label: "Office", value: UNIT_TYPE.OFFICE },
                      { label: "Retail", value: UNIT_TYPE.RETAIL },
                      { label: "Warehouse", value: UNIT_TYPE.WAREHOUSE },
                      { label: "Restaurant", value: UNIT_TYPE.RESTAURANT },
                      { label: "Café", value: UNIT_TYPE.CAFE },
                      { label: "Medical", value: UNIT_TYPE.MEDICAL },
                      { label: "Fitness/Gym", value: UNIT_TYPE.FITNESS },
                      { label: "Salon/Spa", value: UNIT_TYPE.SALON },
                      { label: "Bank/Financial", value: UNIT_TYPE.BANK },
                      { label: "Pharmacy", value: UNIT_TYPE.PHARMACY },
                      {
                        label: "Convenience Store",
                        value: UNIT_TYPE.CONVENIENCE,
                      },
                      { label: "Other Commercial", value: UNIT_TYPE.OTHER },
                    ]}
                  />
                  <SelectFormField<UnitSchema>
                    control={form.control}
                    name="status"
                    label="Unit Status"
                    options={[
                      { label: "Available", value: UNIT_STATUS.AVAILABLE },
                      { label: "Reserved", value: UNIT_STATUS.RESERVED },
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
              </TabsContent>

              <TabsContent value="FEATURES" className="space-y-4">
                <DataListInput
                  label="Amenities"
                  items={[
                    { label: "Windows", value: "Windows" },
                    { label: "Private Bathroom", value: "Private Bathroom" },
                    { label: "Kitchenette", value: "Kitchenette" },
                    { label: "Network Ready", value: "Network Ready" },
                    { label: "HVAC", value: "HVAC" },
                    { label: "Security System", value: "Security System" },
                    { label: "Elevator Access", value: "Elevator Access" },
                    { label: "Conference Room", value: "Conference Room" },
                    { label: "Reception Area", value: "Reception Area" },
                    { label: "Storage Space", value: "Storage Space" },
                  ]}
                  placeholder="Add amenities (e.g., Windows, Private Bathroom)"
                  onChange={(tags) => {
                    form.setValue(
                      "amenities",
                      tags.map((tag) => tag.value),
                    );
                  }}
                  selectedItems={form.watch("amenities").map((f) => ({
                    label: f,
                    value: f,
                  }))}
                />

                <FileUploader
                  onFilesChange={handleFiles}
                  showPreview
                  maxFiles={10}
                  acceptedFormats={["image/png", "image/jpeg", "image/jpg"]}
                />
              </TabsContent>
            </Tabs>
            <Group justify="between" className="mt-auto">
              {activeTab !== "BASIC" ? (
                <Button type="button" variant="ghost" onClick={handlePrev}>
                  <ChevronLeft className="mr-1" /> Previous
                </Button>
              ) : (
                <span />
              )}

              {activeTab !== "FEATURES" ? (
                <Button type="button" onClick={handleNext}>
                  Next <ChevronRight className="ml-1" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={createUnitMutation.isPending}
                >
                  Submit <Save className="ml-2 h-4 w-4" />
                </Button>
              )}
            </Group>
          </form>
        </Form>
      </main>
    </PageWrapper>
  );
};

const LeftSection = ({
  activeTab,
  onTabClick,
}: {
  activeTab: TabType;
  onTabClick: (tabType: TabType) => void;
}) => {
  return (
    <Stack className="grid grid-cols-4 gap-4 px-0 lg:grid-cols-1 lg:px-4">
      <LeftSectionItem
        icon={Building2}
        tabType="BASIC"
        activeTab={activeTab}
        onClick={() => onTabClick("BASIC")}
      />
      <LeftSectionItem
        icon={Calendar}
        tabType="FEATURES"
        activeTab={activeTab}
        onClick={() => onTabClick("FEATURES")}
      />
    </Stack>
  );
};

const LeftSectionItem = ({
  tabType,
  icon: Icon,
  activeTab,
  onClick,
}: {
  tabType: TabType;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  activeTab: TabType;
  onClick: () => void;
}) => {
  return (
    <div className="flex cursor-pointer items-center gap-3" onClick={onClick}>
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
        {TAB_TYPES[tabType]}
      </span>
    </div>
  );
};

export default Page;
