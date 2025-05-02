"use client";

import type React from "react";

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
import { Building, BUILDING_STATUS, PAYMENT_FREQUENCY } from "@/types";
import {
  errorToast,
  infoToast,
  successToast,
} from "@/components/custom/toasts";
import PageWrapper from "@/components/custom/page-wrapper";
import { Stack } from "@/components/custom/stack";
import { buildingSchema, BuildingSchema } from "./_validations";
import {
  TAB_TYPES,
  TAB_TYPES_LIST,
  useCreateBuildingContext,
} from "./_contexts";
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
import { TagInput } from "@/components/custom/tag-input";
import { addBuilding } from "../_hooks/useBuildings";
import { useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import PageHeader from "@/components/custom/page-header";
import { AccessibilityFeatures, CommercialAmenities } from "./_constants";
import { useCreateBuildingMutation } from "@/app/quries/useBuildings";
import { useEffect } from "react";

const Page = () => {
  const { activeTab, onTabChange } = useCreateBuildingContext();
  const createBuildingMutation = useCreateBuildingMutation();

  const router = useRouter();

  const form = useForm<BuildingSchema>({
    resolver: zodResolver(buildingSchema),
    defaultValues: {
      name: "#001",
      description: "",
      address: {
        country: "Ethiopia",
        street: "Kilinto",
        city: "Addis Ababa",
        state: "Addis Ababa",
        postalCode: "1000",
        latitude: 1,
        longitude: 1,
      },
      managerId: "",
      totalFloors: 2,
      totalUnits: 10,
      amenities: [],
      elevators: 0,
      accessibilityFeatures: [],
      emergencyExits: 0,
      fireSafetyCertified: false,
      status: BUILDING_STATUS.ACTIVE,
      operatingHours: "",
      parkingSpaces: 0,
      leaseTerms: {
        minLeasePeriodMonths: 3,
        maxLeasePeriodMonths: 12,
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
    // Convert File objects to URLs for the API

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

    data.accessibilityFeatures?.forEach((feature) => {
      formData.append(`accessibilityFeatures`, feature);
    });
    data.amenities?.forEach((amenity) => {
      formData.append(`amenities`, amenity);
    });

    data.regulationDocuments?.forEach((file) => {
      formData.append("regulationDocuments", file.file);
    });

    formData.append("buildingType", "commercial");

    console.log("Form data:", formData);

    await createBuildingMutation.mutateAsync(formData);
  };

  const handleNext = async () => {
    // make validation here
    switch (activeTab) {
      case TAB_TYPES.BASIC: {
        const isValid = await form.trigger([
          "name",
          "description",
          "managerId",
        ]);
        if (isValid) {
          onTabChange(TAB_TYPES.ADDRESS);
        }
        return;
      }
      case TAB_TYPES.ADDRESS: {
        const isValid = await form.trigger([
          "address.street",
          "address.city",
          "address.state",
          "address.country",
          "address.postalCode",
        ]);
        if (isValid) {
          onTabChange(TAB_TYPES.DETAILS);
        }

        return;
      }
      case TAB_TYPES.DETAILS: {
        const isValid = await form.trigger([
          "totalFloors",
          "totalUnits",
          "yearBuilt",
          "status",
          "amenities",
          "accessibilityFeatures",
          "elevators",
          "emergencyExits",
        ]);
        if (isValid) {
          onTabChange(TAB_TYPES.LEASE_TERMS);
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

  useEffect(() => {
    if (createBuildingMutation.isSuccess) {
      const data = form.getValues();
      const imageUrls =
        data.images?.map((file) => URL.createObjectURL(file)) || [];
      const videoUrls =
        data.videos?.map((file) => URL.createObjectURL(file)) || [];

      const regulationDocuments = data.regulationDocuments?.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file.file),
      }));

      const responseData = createBuildingMutation.data;
      console.log({ data });

      if (!responseData) {
        errorToast("Building creation failed");
        return;
      }

      // Create the final building object
      const buildingDataTemp: Building = {
        ...data,
        imageUrls,
        videoUrls,
        regulationDocuments,
        operatingHours: data.operatingHours || "",
        leaseTerms: {
          ...data.leaseTerms,
          maxLeasePeriodMonths: data.leaseTerms.maxLeasePeriodMonths || 0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        id: responseData._id,
      };

      successToast("Building created successfully");
      addBuilding(buildingDataTemp);
      router.push("/dashboard/buildings");
    }
  }, [
    createBuildingMutation.data,
    createBuildingMutation.isSuccess,
    form,
    router,
  ]);

  useEffect(() => {
    if (createBuildingMutation.isError) {
      errorToast(createBuildingMutation.error.message);
    }
  }, [createBuildingMutation.error?.message, createBuildingMutation.isError]);

  return (
    <PageWrapper className="py-0">
      <PageHeader
        title="Create New Building"
        description=" Add a new building to your property management system"
        withBackButton
      />

      <main className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(12rem,1fr)_4fr]">
        <Stack spacing="lg" className="p-2">
          {/* Taps */}
          <LeftSection />
        </Stack>
        <ScrollArea>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(() => {})}
              className="flex min-h-[calc(100vh-12rem)] flex-col gap-6 p-2"
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
                      ]} // Fetch options from API
                    />
                  </Group>

                  <TextareaFormField<BuildingSchema>
                    control={form.control}
                    name="description"
                    rows={5}
                    label="Description"
                    placeholder="Enter building description"
                  />

                  {/* Image Upload Section */}
                  <FileUploader
                    acceptedFormats={["image/png", "image/jpg", "image/jpeg"]}
                    onFilesChange={handleFiles}
                    showPreview
                  />
                </TabsContent>

                <TabsContent value={TAB_TYPES.ADDRESS} className="space-y-4">
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

                  {/* Map Preview (Simulated) */}
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

                <TabsContent value={TAB_TYPES.DETAILS} className="space-y-4">
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
                        {
                          value: BUILDING_STATUS.ACTIVE,
                          label: "Active",
                        },
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

                  <TagInput
                    label="Accessibility Features"
                    suggestions={AccessibilityFeatures}
                    onChange={(tags) => {
                      form.setValue("accessibilityFeatures", tags);
                    }}
                    tags={form.watch("accessibilityFeatures")}
                  />
                  {/* Amenities Section */}
                  <TagInput
                    label="Amenities"
                    suggestions={CommercialAmenities}
                    onChange={(tags) => {
                      form.setValue("amenities", tags);
                    }}
                    tags={form.watch("amenities")}
                  />
                </TabsContent>

                <TabsContent
                  value={TAB_TYPES.LEASE_TERMS}
                  className="space-y-4"
                >
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
                      {
                        value: PAYMENT_FREQUENCY.MONTHLY,
                        label: "Monthly",
                      },
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
              <Group justify={"between"} className="mt-auto">
                {activeTab !== TAB_TYPES.BASIC ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      handlePrev();
                    }}
                    // disabled={activeTab === TAB_TYPES.BASIC}
                  >
                    <ChevronLeft className="" /> Previous
                  </Button>
                ) : (
                  <span />
                )}

                {activeTab !== TAB_TYPES.LEASE_TERMS ? (
                  <Button
                    type="button"
                    onClick={() => {
                      handleNext();
                    }}
                  >
                    Next <ChevronRight className="" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled={createBuildingMutation.isPending}
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
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

// type LeftSectionProps = {};
const LeftSection = () => {
  return (
    <Stack className="grid grid-cols-4 gap-4 px-0 lg:grid-cols-1 lg:px-4">
      <LeftSectionItem icon={Building2} tabType={TAB_TYPES.BASIC} />
      <LeftSectionItem icon={MapPin} tabType={TAB_TYPES.ADDRESS} />
      <LeftSectionItem icon={Home} tabType={TAB_TYPES.DETAILS} />
      <LeftSectionItem icon={Calendar} tabType={TAB_TYPES.LEASE_TERMS} />
    </Stack>
  );
};

type LeftSectionItemProps = {
  tabType: TAB_TYPES;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

const LeftSectionItem = ({ tabType, icon: Icon }: LeftSectionItemProps) => {
  const { activeTab, onTabChange } = useCreateBuildingContext();
  const hintClassName: ClassValue =
    "text-sm text-neutral-500 font-light transition-all duration-300";
  const iconClassName: ClassValue =
    "mr-2 h-6 w-6 text-neutral-500 transition-all duration-300";

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
        className={cn(iconClassName, {
          "scale-[1.2] text-primary": activeTab === tabType,
        })}
      />
      <span
        className={cn(hintClassName, {
          "scale-[1.2] text-primary": activeTab === tabType,
        })}
      >
        {tabType}
      </span>
    </div>
  );
};

export default Page;
