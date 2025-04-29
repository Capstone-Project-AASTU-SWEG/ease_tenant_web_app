"use client";

import { useEffect } from "react";
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
import { infoToast, successToast } from "@/components/custom/toasts";
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
import { TagInput } from "@/components/custom/tag-input";

import { Unit, UNIT_STATUS, UNIT_TYPE } from "@/types";
import { TAB_TYPES, TAB_TYPES_LIST, useCreateUnitContext } from "./_contexts";
import { unitSchema, UnitSchema } from "./_validations";
import {
  getSelectedBuilding,
  useBuildingStore,
} from "../../../_hooks/useBuildings";
import { addUnit } from "../../../_hooks/useUnits";
import PageHeader from "@/components/custom/page-header";

const Page = () => {
  const { activeTab, onTabChange } = useCreateUnitContext();
  // const router = useRouter();

  // Get building ID from URL parameters
  const params = useParams();
  const buildingID = params["id"] as string;

  // Get building store actions
  const { setSelectedBuilding } = useBuildingStore();

  const router = useRouter();

  // Set selected building on component mount
  useEffect(() => {
    if (buildingID) setSelectedBuilding(buildingID);
  }, [buildingID, setSelectedBuilding]);

  // Get the selected building
  const building = getSelectedBuilding();

  const form = useForm<UnitSchema>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      buildingId: building?.id,
      floorNumber: 1,
      unitNumber: "001",
      sizeSqFt: 100,
      type: UNIT_TYPE.OFFICE,
      status: UNIT_STATUS.AVAILABLE,
      monthlyRent: 100,
      amenities: [],
      allowedUses: [],
      notes: "",
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
    form.setValue("videos", [...videos]);
  };

  const onSubmit = (data: UnitSchema) => {
    console.log("Form submitted:", data);
  };

  const handleSubmit = () => {
    const data: UnitSchema = form.getValues();

    // create binary data
    const imageUrls =
      data.images?.map((file) => URL.createObjectURL(file)) || [];
    const videoUrls =
      data.videos?.map((file) => URL.createObjectURL(file)) || [];

    // Create the final unit object
    const unitData: Unit = {
      ...data,
      id: crypto.randomUUID(),
      imageUrls,
      videoUrls,
      status: UNIT_STATUS.AVAILABLE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("Unit added:", unitData);

    addUnit(unitData);

    successToast("Unit Added", {
      description: `Unit ${data.unitNumber} has been successfully added to the system.`,
    });

    // TODO: Make API request to add unit
    router.push(`/dashboard/buildings/${buildingID}?unit=${unitData.id}`);
  };

  const handleNext = async () => {
    // Validate current tab fields before proceeding
    switch (activeTab) {
      case TAB_TYPES.BASIC: {
        const isValid = await form.trigger([
          "buildingId",
          "floorNumber",
          "unitNumber",
          "type",
          "status",
          "sizeSqFt",
          "monthlyRent",
        ]);
        if (isValid) {
          onTabChange(TAB_TYPES.FEATURES);
        }
        return;
      }

      case TAB_TYPES.FEATURES: {
        const isValid = await form.trigger(["amenities", "allowedUses"]);
        if (isValid) {
          onTabChange(TAB_TYPES.MEDIA);
        }
        return;
      }
      default: {
        infoToast(activeTab);
      }
    }
  };

  const handlePrev = () => {
    const currentIndex = TAB_TYPES_LIST.indexOf(activeTab);
    if (currentIndex > 0) {
      onTabChange(TAB_TYPES_LIST[currentIndex - 1]);
    }
  };

  return (
    <PageWrapper className="py-0">
      <PageHeader
        title={`Add Unit to ${building?.name}`}
        description=" Add a new unit to your property management system"
        withBackButton
      />

      <main className="mt-4 grid grid-cols-1 gap-6 pb-6 lg:grid-cols-[minmax(12rem,1fr)_4fr]">
        <Stack spacing="lg">
          {/* Tabs */}
          <LeftSection />
        </Stack>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex min-h-[calc(100vh-12rem)] flex-col gap-6 px-1"
          >
            <Tabs
              defaultValue={TAB_TYPES.BASIC}
              value={activeTab}
              onValueChange={(tab) => onTabChange(tab as TAB_TYPES)}
            >
              <TabsContent value={TAB_TYPES.BASIC} className="space-y-4">
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

                {/* Add more here */}
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
                  name="notes"
                  label="Notes"
                  placeholder="Enter any additional notes about this unit"
                  rows={3}
                />
              </TabsContent>

              <TabsContent value={TAB_TYPES.FEATURES} className="space-y-4">
                <TagInput
                  label="Amenities"
                  placeholder="Add amenities (e.g., Windows, Private Bathroom)"
                  onChange={(tags) => {
                    form.setValue("amenities", tags);
                  }}
                  tags={form.watch("amenities")}
                  suggestions={[
                    "Windows",
                    "Private Bathroom",
                    "Kitchenette",
                    "Network Ready",
                    "HVAC",
                    "Security System",
                    "Elevator Access",
                    "Conference Room",
                    "Reception Area",
                    "Storage Space",
                  ]}
                />

                <TagInput
                  label="Allowed Uses"
                  placeholder="Add allowed uses (e.g., Office, Retail)"
                  onChange={(tags) => {
                    form.setValue("allowedUses", tags);
                  }}
                  tags={form.watch("allowedUses") || []}
                  suggestions={[
                    "Office",
                    "Retail",
                    "Food Service",
                    "Medical",
                    "Educational",
                    "Storage",
                    "Manufacturing",
                    "Creative",
                    "Technology",
                  ]}
                />
                <FileUploader
                  onFilesChange={handleFiles}
                  showPreview
                  maxFiles={10}
                />
              </TabsContent>
            </Tabs>
            <Group justify={"between"} className="mt-auto">
              {activeTab !== TAB_TYPES.BASIC ? (
                <Button type="button" variant="ghost" onClick={handlePrev}>
                  <ChevronLeft className="mr-1" /> Previous
                </Button>
              ) : (
                <span />
              )}

              {activeTab !== TAB_TYPES.FEATURES ? (
                <Button type="button" onClick={handleNext}>
                  Next <ChevronRight className="ml-1" />
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit}>
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

// Left section with navigation tabs
const LeftSection = () => {
  return (
    <Stack className="grid grid-cols-4 gap-4 px-0 lg:grid-cols-1 lg:px-4">
      <LeftSectionItem icon={Building2} tabType={TAB_TYPES.BASIC} />
      <LeftSectionItem icon={Calendar} tabType={TAB_TYPES.FEATURES} />
    </Stack>
  );
};

type LeftSectionItemProps = {
  tabType: TAB_TYPES;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

const LeftSectionItem = ({ tabType, icon: Icon }: LeftSectionItemProps) => {
  const { activeTab, onTabChange } = useCreateUnitContext();

  return (
    <div
      className="flex cursor-pointer items-center gap-3"
      onClick={() => {
        const tabIndex = TAB_TYPES_LIST.findIndex((tab) => tab === tabType);
        const activeTabIndex = TAB_TYPES_LIST.findIndex(
          (tab) => tab === activeTab,
        );
        if (tabIndex === -1 || activeTabIndex === -1) {
          return;
        }

        if (tabIndex > activeTabIndex) {
          return;
        }

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

export default Page;
