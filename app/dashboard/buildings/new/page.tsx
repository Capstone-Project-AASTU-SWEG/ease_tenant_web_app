"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  MapPin,
  Building2,
  Calendar,
  Home,
  ChevronRight,
  ChevronLeft,
  BuildingIcon,
} from "lucide-react";
import { BUILDING_STATUS, PAYMENT_FREQUENCY } from "@/types";
import { errorToast, successToast } from "@/components/custom/toasts";
import PageWrapper from "@/components/custom/page-wrapper";
import { Stack } from "@/components/custom/stack";
import { buildingSchema, BuildingSchema } from "./_validations";
import { ClassValue } from "clsx";
import { Group } from "@/components/custom/group";
import {
  CheckboxFormField,
  NumberFormField,
  SelectFormField,
  TextareaFormField,
  TextFormField,
} from "@/components/custom/form-field";
import { FileUploader } from "@/components/custom/file-upload";
import { useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import PageHeader from "@/components/custom/page-header";
import { AccessibilityFeatures, CommercialAmenities } from "./_constants";
import { DataListInput } from "@/components/custom/data-list-input";
import { useEffect, useState } from "react";
import { useCreateBuildingMutation } from "@/app/quries/useBuildings";

const TAB_TYPES = {
  BASIC: "Basic Info",
  ADDRESS: "Address",
  DETAILS: "Details",
  LEASE_TERMS: "Lease Terms",
} as const;

type TabType = keyof typeof TAB_TYPES;
const TAB_TYPES_LIST = Object.keys(TAB_TYPES) as TabType[];

const Page = () => {
  const [activeTab, setActiveTab] = useState<TabType>("BASIC");
  const router = useRouter();

  const createBuildingMutation = useCreateBuildingMutation();

  const form = useForm<BuildingSchema>({
    resolver: zodResolver(buildingSchema),
    defaultValues: {
      name: "",
      description: "",
      address: {
        country: "",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        latitude: 0,
        longitude: 0,
      },
      managerId: "",
      totalFloors: 1,
      totalUnits: 1,
      amenities: [],
      accessibilityFeatures: [],
      elevators: 0,
      emergencyExits: 0,
      fireSafetyCertified: false,
      status: BUILDING_STATUS.ACTIVE,
      yearBuilt: 2010,
      operatingHours: "",
      parkingSpaces: 0,
      leaseTerms: {
        minLeasePeriodMonths: 1,
        maxLeasePeriodMonths: 1,
        latePaymentPenalty: 0,
        leaseRenewalPolicy: "",
        paymentFrequency: PAYMENT_FREQUENCY.MONTHLY,
        securityDeposit: 0,
        petPolicy: "",
      },
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

  const handleSubmit = async () => {
    const data: BuildingSchema = form.getValues();
    console.log("Form data before appending:", data);
    const formData = new FormData();

    // do appending for each fields
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    if (data.managerId) {
      formData.append("managerId", data.managerId);
    }

    formData.append("totalFloors", data.totalFloors.toString());
    formData.append("totalUnits", data.totalUnits.toString());
    formData.append("status", data.status);
    formData.append("operatingHours", data.operatingHours || "");
    formData.append("elevators", data.elevators.toString());
    formData.append("parkingSpaces", data.parkingSpaces.toString());
    formData.append("emergencyExits", data.emergencyExits.toString());
    formData.append(
      "fireSafetyCertified",
      data.fireSafetyCertified ? "true" : "false",
    );

    formData.append(
      "address",
      JSON.stringify({
        ...data.address,
        latitude: data.address.latitude || 0,
        longitude: data.address.longitude || 0,
      }),
    );
    formData.append("leaseTerms", JSON.stringify(data.leaseTerms));

    data.images?.forEach((file) => {
      formData.append(`images`, file);
    });

    formData.append(
      "accessibilityFeatures",
      JSON.stringify(data.accessibilityFeatures),
    );
    formData.append("amenities", JSON.stringify(data.amenities));

    data.regulationDocuments?.forEach((file) => {
      formData.append("regulationDocuments", file.file);
    });

    formData.append("buildingType", "commercial");

    console.log("Form data:", formData);

    createBuildingMutation.mutate(formData);
  };

  const validateCurrentTab = async () => {
    switch (activeTab) {
      case "BASIC":
        return await form.trigger(["name", "description", "managerId"]);
      case "ADDRESS":
        return await form.trigger([
          "address.street",
          "address.city",
          "address.state",
          "address.country",
          "address.postalCode",
        ]);
      case "DETAILS":
        return await form.trigger([
          "totalFloors",
          "totalUnits",
          "yearBuilt",
          "status",
          "amenities",
          "accessibilityFeatures",
          "elevators",
          "emergencyExits",
        ]);
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

  // Show error toast if error occured
  useEffect(() => {
    if (createBuildingMutation.isError) {
      errorToast(createBuildingMutation.error.message);
    }
  }, [createBuildingMutation.error?.message, createBuildingMutation.isError]);

  useEffect(() => {
    if (createBuildingMutation.isSuccess) {
      successToast("Building created successfully");
      router.push("/dashboard/buildings");
    }
  }, [createBuildingMutation.isSuccess, router]);

  return (
    <PageWrapper className="py-0">
      <PageHeader
        title="Create New Building"
        description="Add a new building to your property management system"
        withBackButton
      />

      <main className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(12rem,1fr)_4fr]">
        <Stack spacing="lg" className="p-2">
          <LeftSection activeTab={activeTab} onTabClick={handleTabClick} />
        </Stack>
        <ScrollArea>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex min-h-[calc(100vh-12rem)] flex-col gap-6 p-2"
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
                    <TextFormField<BuildingSchema>
                      control={form.control}
                      name="name"
                      label="Building Name"
                      placeholder="Building #1"
                    />
                    <SelectFormField<BuildingSchema>
                      control={form.control}
                      name="managerId"
                      label="Select manager"
                      placeholder="e.g Nesredin Getahun"
                      options={[
                        { label: "Nesredin Getahun", value: "01" },
                        { label: "Hassen Getahun", value: "02" },
                      ]}
                    />
                  </Group>

                  <TextareaFormField<BuildingSchema>
                    control={form.control}
                    name="description"
                    rows={5}
                    label="Description"
                    placeholder="Enter building description"
                  />

                  <FileUploader
                    acceptedFormats={["image/png", "image/jpg", "image/jpeg"]}
                    onFilesChange={handleFiles}
                    showPreview
                  />
                </TabsContent>

                <TabsContent value="ADDRESS" className="space-y-4">
                  <TextFormField<BuildingSchema>
                    control={form.control}
                    name="address.country"
                    label="Country"
                    placeholder="e.g. Ethiopia"
                  />
                  <Group
                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                    align="start"
                  >
                    <TextFormField<BuildingSchema>
                      control={form.control}
                      name="address.street"
                      label="Street Address"
                      placeholder="e.g. O Block"
                    />
                    <TextFormField<BuildingSchema>
                      control={form.control}
                      name="address.city"
                      label="Enter City"
                      placeholder="Addis Ababa"
                    />
                  </Group>

                  <Group
                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                    align="start"
                  >
                    <TextFormField<BuildingSchema>
                      control={form.control}
                      name="address.state"
                      label="Enter state/province"
                      placeholder="AASTU"
                    />
                    <TextFormField<BuildingSchema>
                      control={form.control}
                      name="address.postalCode"
                      label="Postal Code"
                      placeholder="e.g. 12345"
                    />
                  </Group>

                  <Group>
                    <NumberFormField
                      control={form.control}
                      name="address.latitude"
                      label="Latitude"
                    />
                    <NumberFormField
                      control={form.control}
                      label="Longitude"
                      name="address.longitude"
                    />
                  </Group>

                  <div className="mt-4 rounded-md border bg-muted/30 p-4">
                    <h4 className="mb-2 text-sm font-medium">Map Preview</h4>
                    <div className="flex h-[200px] items-center justify-center rounded-md bg-muted">
                      <MapPin className="h-8 w-8 text-muted-foreground" />
                      <p className="ml-2 text-sm text-muted-foreground">
                        Address map preview will appear here
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Map will update when you save the building information
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="DETAILS" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <NumberFormField<BuildingSchema>
                      control={form.control}
                      name="totalFloors"
                      label="Total Floors"
                      placeholder="10"
                    />
                    <NumberFormField<BuildingSchema>
                      control={form.control}
                      name="totalUnits"
                      label="Total Rooms"
                      placeholder="30"
                    />
                  </div>

                  <Group
                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                    align="start"
                  >
                    <NumberFormField<BuildingSchema>
                      control={form.control}
                      name="yearBuilt"
                      label="Year Built"
                      placeholder="e.g. 2010"
                    />
                    <SelectFormField<BuildingSchema>
                      control={form.control}
                      name="status"
                      label="Building Status"
                      options={[
                        { value: BUILDING_STATUS.ACTIVE, label: "Active" },
                        {
                          value: BUILDING_STATUS.UNDER_RENOVATION,
                          label: "Under Renovation",
                        },
                        {
                          value: BUILDING_STATUS.DEMOLISHED,
                          label: "Demolished",
                        },
                      ]}
                    />
                  </Group>

                  <Group className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <NumberFormField<BuildingSchema>
                      control={form.control}
                      name="elevators"
                      label="Number of Elevators"
                      placeholder="e.g. 2"
                    />
                    <NumberFormField<BuildingSchema>
                      control={form.control}
                      name="parkingSpaces"
                      label="Parking Spaces"
                      placeholder="e.g. 20"
                    />
                  </Group>

                  <Group className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <NumberFormField<BuildingSchema>
                      control={form.control}
                      name="emergencyExits"
                      label="Emergency Exits"
                      placeholder="e.g. 2"
                    />
                    <CheckboxFormField
                      control={form.control}
                      name="fireSafetyCertified"
                      label="Fire Safety Certified"
                    />
                  </Group>

                  <TextFormField<BuildingSchema>
                    control={form.control}
                    name="operatingHours"
                    label="Operating Hours"
                    placeholder="e.g. 9 AM - 5 PM"
                  />

                  <DataListInput
                    label="Accessibility Features"
                    items={AccessibilityFeatures.map((f) => ({
                      label: f,
                      value: f,
                    }))}
                    placeholder="e.g. Wheelchair Accessible"
                    onChange={(tags) => {
                      form.setValue(
                        "accessibilityFeatures",
                        tags.map((tag) => tag.value),
                      );
                    }}
                    selectedItems={form
                      .watch("accessibilityFeatures")
                      .map((f) => ({
                        label: f,
                        value: f,
                      }))}
                  />

                  <DataListInput
                    label="Amenities"
                    items={CommercialAmenities.map((f) => ({
                      label: f,
                      value: f,
                    }))}
                    placeholder="e.g. Swimming Pool"
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
                </TabsContent>

                <TabsContent value="LEASE_TERMS" className="space-y-4">
                  <Group
                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                    align="start"
                  >
                    <NumberFormField
                      control={form.control}
                      name="leaseTerms.minLeasePeriodMonths"
                      label="Minimum Lease Period (months)"
                    />
                    <NumberFormField
                      control={form.control}
                      name="leaseTerms.maxLeasePeriodMonths"
                      label="Maximum Lease Period (months)"
                    />
                  </Group>

                  <SelectFormField<BuildingSchema>
                    control={form.control}
                    name="leaseTerms.paymentFrequency"
                    label="Payment Frequency*"
                    options={[
                      { value: PAYMENT_FREQUENCY.MONTHLY, label: "Monthly" },
                      {
                        value: PAYMENT_FREQUENCY.QUARTERLY,
                        label: "Quarterly",
                      },
                      {
                        value: PAYMENT_FREQUENCY.SEMI_ANNUALLY,
                        label: "Semi-Annually",
                      },
                    ]}
                  />

                  <Group className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <NumberFormField
                      control={form.control}
                      name="leaseTerms.latePaymentPenalty"
                      label="Late Payment Penalty (%)"
                      placeholder="e.g. 5"
                    />
                    <NumberFormField
                      control={form.control}
                      name="leaseTerms.securityDeposit"
                      label="Security Deposit"
                      placeholder="e.g. 5"
                    />
                  </Group>

                  <TextareaFormField<BuildingSchema>
                    control={form.control}
                    name="leaseTerms.leaseRenewalPolicy"
                    label="Lease Renewal Policy"
                    placeholder="Enter lease renewal policy details"
                    rows={5}
                  />

                  <TextareaFormField<BuildingSchema>
                    control={form.control}
                    name="leaseTerms.petPolicy"
                    label="Pet Policy"
                    placeholder="Enter pet policy details"
                    rows={5}
                  />

                  <FileUploader
                    onFilesChange={(files) => {
                      const regulationDocuments = Array.from(files).map(
                        (file) => ({
                          name: file.name,
                          file,
                        }),
                      );
                      form.setValue("regulationDocuments", [
                        ...regulationDocuments,
                      ]);
                    }}
                    showPreview
                    label="Regulation Documents"
                    acceptedFormats={["application/pdf"]}
                  />
                </TabsContent>
              </Tabs>
              <Group justify="between" className="mt-auto">
                {activeTab !== "BASIC" ? (
                  <Button type="button" variant="ghost" onClick={handlePrev}>
                    <ChevronLeft /> Previous
                  </Button>
                ) : (
                  <span />
                )}

                {activeTab !== "LEASE_TERMS" ? (
                  <Button type="button" onClick={handleNext}>
                    Next <ChevronRight />
                  </Button>
                ) : (
                  <Button type="submit" onClick={handleSubmit}>
                    Submit <BuildingIcon />
                  </Button>
                )}
              </Group>
            </form>
          </Form>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
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
        icon={MapPin}
        tabType="ADDRESS"
        activeTab={activeTab}
        onClick={() => onTabClick("ADDRESS")}
      />
      <LeftSectionItem
        icon={Home}
        tabType="DETAILS"
        activeTab={activeTab}
        onClick={() => onTabClick("DETAILS")}
      />
      <LeftSectionItem
        icon={Calendar}
        tabType="LEASE_TERMS"
        activeTab={activeTab}
        onClick={() => onTabClick("LEASE_TERMS")}
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
  const hintClassName: ClassValue =
    "text-sm text-neutral-500 font-light transition-all duration-300";
  const iconClassName: ClassValue =
    "mr-2 h-6 w-6 text-neutral-500 transition-all duration-300";

  return (
    <div className="flex cursor-pointer items-center gap-3" onClick={onClick}>
      <Icon
        className={cn(iconClassName, {
          "scale-[1.2] text-primary": activeTab === tabType,
        })}
      />
      <span
        className={cn(hintClassName, {
          "scale-[1.2] text-primary": activeTab === tabType,
        })}
      >
        {TAB_TYPES[tabType]}
      </span>
    </div>
  );
};

export default Page;
