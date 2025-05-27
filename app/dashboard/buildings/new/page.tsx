"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  MapPin,
  Building2,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Building,
  CheckCircle2,
  CircleDashed,
  Upload,
  Sparkles,
} from "lucide-react";
import { BUILDING_STATUS, PAYMENT_FREQUENCY } from "@/types";
import { errorToast, successToast } from "@/components/custom/toasts";
import PageWrapper from "@/components/custom/page-wrapper";
import { Stack } from "@/components/custom/stack";
import { buildingSchema, BuildingSchema } from "./_validations";
import { Group } from "@/components/custom/group";
import {
  CheckboxFormField,
  NumberFormField,
  SelectFormField,
  TextareaFormField,
  TextFormField,
} from "@/components/custom/form-field";
import { FileUploader } from "@/components/custom/file-upload";
import { useRouter, useSearchParams } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import PageHeader from "@/components/custom/page-header";
import { AccessibilityFeatures, CommercialAmenities } from "./_constants";
import { DataListInput } from "@/components/custom/data-list-input";
import { useEffect, useState } from "react";
import {
  useCreateBuildingMutation,
  useGetBuildingQuery,
  useUpdateBuildingMutation,
} from "@/app/quries/useBuildings";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Form } from "@/components/ui/form";
import LogJSON from "@/components/custom/log-json";

import MapWrapper from "@/components/custom/map-location-wrapper";

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
  const updateBuildingMutation = useUpdateBuildingMutation();

  const searchParams = useSearchParams();
  const buildingId = searchParams.get("buildingId") as string;

  const getBuildingQuery = useGetBuildingQuery(buildingId);
  const buildingToBeUpdated = getBuildingQuery.data;

  const form = useForm<BuildingSchema>({
    resolver: zodResolver(buildingSchema),
    defaultValues: {
      name: buildingToBeUpdated?.name || "",
      description: buildingToBeUpdated?.description || "",
      address: {
        country: buildingToBeUpdated?.address.country || "",
        street: buildingToBeUpdated?.address.street || "",
        city: buildingToBeUpdated?.address.city || "",
        state: buildingToBeUpdated?.address.state || "",
        postalCode: buildingToBeUpdated?.address.postalCode || "",
        latitude: buildingToBeUpdated?.address.latitude || 0,
        longitude: buildingToBeUpdated?.address.longitude || 0,
      },
      managerId: buildingToBeUpdated?.managerId || "",
      totalFloors: buildingToBeUpdated?.totalFloors || 1,
      totalUnits: buildingToBeUpdated?.totalUnits || 1,
      amenities: buildingToBeUpdated?.amenities || [],
      accessibilityFeatures: buildingToBeUpdated?.accessibilityFeatures || [],
      elevators: buildingToBeUpdated?.elevators || 0,
      emergencyExits: buildingToBeUpdated?.emergencyExits || 0,
      fireSafetyCertified: buildingToBeUpdated?.fireSafetyCertified || false,
      status: buildingToBeUpdated?.status || BUILDING_STATUS.ACTIVE,
      yearBuilt: buildingToBeUpdated?.yearBuilt || 2010,
      operatingHours: buildingToBeUpdated?.operatingHours || "",
      parkingSpaces: buildingToBeUpdated?.parkingSpaces || 0,
      leaseTerms: {
        minLeasePeriodMonths:
          buildingToBeUpdated?.leaseTerms.minLeasePeriodMonths || 1,
        maxLeasePeriodMonths:
          buildingToBeUpdated?.leaseTerms.maxLeasePeriodMonths || 1,
        latePaymentPenalty:
          buildingToBeUpdated?.leaseTerms.latePaymentPenalty || 0,
        leaseRenewalPolicy: "",
        paymentFrequency:
          buildingToBeUpdated?.leaseTerms.paymentFrequency ||
          PAYMENT_FREQUENCY.MONTHLY,
        securityDeposit: buildingToBeUpdated?.leaseTerms.securityDeposit || 0,
        petPolicy: buildingToBeUpdated?.leaseTerms.petPolicy || "",
      },
    },
  });

  // Drived states
  const isEditting = !!buildingToBeUpdated;

  const handleFiles = (files: File[]) => {
    const images: File[] = [];

    const getFileType = (file: File): "image" | "video" | "document" => {
      if (file.type.startsWith("image/")) return "image";
      if (file.type.startsWith("video/")) return "video";
      return "document";
    };

    Array.from(files).forEach((file) => {
      if (getFileType(file) === "image") {
        images.push(file);
      }
    });

    form.setValue("images", [...images]);
    // form.setValue("videos", [...videos]);
  };

  const handleAddingBuilding = () => {
    const data: BuildingSchema = form.getValues();
    const formData = new FormData();

    // do appending for each fields
    formData.append("name", data.name);
    formData.append("description", data.description || "");

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

    createBuildingMutation.mutate(formData);
  };
  const handleBuildingUpdate = () => {
    const data: BuildingSchema = form.getValues();
    const formData = new FormData();

    // do appending for each fields
    formData.append("name", data.name);
    formData.append("description", data.description || "");

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
    formData.append("buildingId", buildingId);

    updateBuildingMutation.mutate(formData);
  };

  const handleSubmit = async () => {
    if (isEditting) {
      handleBuildingUpdate();
    } else {
      handleAddingBuilding();
      return;
    }
  };

  const validateCurrentTab = async () => {
    switch (activeTab) {
      case "BASIC":
        return await form.trigger(["name", "description"]);
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

  // Show error toast if error occured
  useEffect(() => {
    if (updateBuildingMutation.isError) {
      errorToast(updateBuildingMutation.error.message);
    }
  }, [updateBuildingMutation.error?.message, updateBuildingMutation.isError]);

  useEffect(() => {
    if (updateBuildingMutation.isSuccess) {
      successToast("Building updated successfully");
      router.push("/dashboard/buildings");
    }
  }, [updateBuildingMutation.isSuccess, router]);

  useEffect(() => {
    if (isEditting) {
      form.reset({
        name: buildingToBeUpdated?.name || "",
        description: buildingToBeUpdated?.description || "",
        address: {
          country: buildingToBeUpdated?.address.country || "",
          street: buildingToBeUpdated?.address.street || "",
          city: buildingToBeUpdated?.address.city || "",
          state: buildingToBeUpdated?.address.state || "",
          postalCode: buildingToBeUpdated?.address.postalCode || "",
          latitude: buildingToBeUpdated?.address.latitude || 0,
          longitude: buildingToBeUpdated?.address.longitude || 0,
        },
        managerId: buildingToBeUpdated?.managerId || "",
        totalFloors: buildingToBeUpdated?.totalFloors || 1,
        totalUnits: buildingToBeUpdated?.totalUnits || 1,
        amenities: buildingToBeUpdated?.amenities || [],
        accessibilityFeatures: buildingToBeUpdated?.accessibilityFeatures || [],
        elevators: buildingToBeUpdated?.elevators || 0,
        emergencyExits: buildingToBeUpdated?.emergencyExits || 0,
        fireSafetyCertified: buildingToBeUpdated?.fireSafetyCertified || false,
        status: buildingToBeUpdated?.status || BUILDING_STATUS.ACTIVE,
        yearBuilt: buildingToBeUpdated?.yearBuilt || 2010,
        operatingHours: buildingToBeUpdated?.operatingHours || "",
        parkingSpaces: buildingToBeUpdated?.parkingSpaces || 0,
        leaseTerms: {
          minLeasePeriodMonths:
            buildingToBeUpdated?.leaseTerms.minLeasePeriodMonths || 1,
          maxLeasePeriodMonths:
            buildingToBeUpdated?.leaseTerms.maxLeasePeriodMonths || 1,
          latePaymentPenalty:
            buildingToBeUpdated?.leaseTerms.latePaymentPenalty || 0,
          leaseRenewalPolicy: "",
          paymentFrequency:
            buildingToBeUpdated?.leaseTerms.paymentFrequency ||
            PAYMENT_FREQUENCY.MONTHLY,
          securityDeposit: buildingToBeUpdated?.leaseTerms.securityDeposit || 0,
          petPolicy: buildingToBeUpdated?.leaseTerms.petPolicy || "",
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditting]);

  return (
    <PageWrapper className="py-0">
      <PageHeader
        title={isEditting ? "Update Building" : "Create New Building"}
        description={
          isEditting
            ? "Update building **********"
            : "Add a new building to your property management system"
        }
        withBackButton
      />

      <LogJSON
        data={{
          buildingToBeUpdated,
        }}
      />

      <main className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(16rem,1fr)_4fr]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="sticky top-24 overflow-hidden border-none bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
            <CardContent className="p-6">
              <h3 className="mb-6 text-lg font-semibold">Building Setup</h3>
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
                                Enter the basic details of your building
                              </p>
                            </div>
                          </div>
                          <Stack spacing={"lg"}>
                            <TextFormField<BuildingSchema>
                              control={form.control}
                              name="name"
                              label="Building Name"
                              placeholder="Enter building name"
                            />

                            <TextareaFormField<BuildingSchema>
                              control={form.control}
                              name="description"
                              rows={5}
                              label="Description"
                              placeholder="Enter building description"
                            />

                            <div className="rounded-lg border border-dashed border-primary/20 bg-primary/5 p-6">
                              <div className="mb-4 flex items-center gap-3">
                                <Upload className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-medium">
                                  Building Images
                                </h3>
                              </div>
                              <p className="mb-4 text-sm text-muted-foreground">
                                Upload high-quality images of your building.
                                These will be displayed to potential tenants.
                              </p>
                              <FileUploader
                                acceptedFormats={[
                                  "image/png",
                                  "image/jpg",
                                  "image/jpeg",
                                ]}
                                onFilesChange={handleFiles}
                                showPreview
                              />
                            </div>
                          </Stack>
                        </motion.div>
                      </TabsContent>

                      <TabsContent value="ADDRESS" className="space-y-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                              <h2 className="text-xl font-semibold">
                                Location Details
                              </h2>
                              <p className="text-sm text-muted-foreground">
                                Specify where your building is located
                              </p>
                            </div>
                          </div>

                          <Stack spacing={"lg"}>
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

                            <div className="overflow-hidden rounded-lg border bg-slate-50 shadow-sm dark:bg-slate-900/50">
                              <div className="border-b bg-white p-4 dark:bg-slate-900">
                                <h4 className="font-medium">Map Preview</h4>
                              </div>
                              <section>
                                <MapWrapper
                                  position={[
                                    form.watch("address.latitude") || 0,
                                    form.watch("address.longitude") || 0,
                                  ]}
                                  onClick={(pos) => {
                                    form.setValue("address.latitude", pos[0]);
                                    form.setValue("address.longitude", pos[1]);
                                  }}
                                  interactive
                                />
                              </section>
                            </div>
                          </Stack>
                        </motion.div>
                      </TabsContent>

                      <TabsContent value="DETAILS" className="space-y-6">
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
                                Building Details
                              </h2>
                              <p className="text-sm text-muted-foreground">
                                Provide specific information about your building
                              </p>
                            </div>
                          </div>

                          <div className="rounded-lg border bg-slate-50 p-6 dark:bg-slate-900/50">
                            <h3 className="mb-4 text-base font-medium">
                              Building Specifications
                            </h3>

                            <Stack spacing={"lg"}>
                              <Group
                                className="grid grid-cols-1 gap-4 md:grid-cols-2"
                                align="start"
                              >
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
                              </Group>

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
                            </Stack>
                          </div>

                          <div className="mt-6 rounded-lg border bg-slate-50 p-6 dark:bg-slate-900/50">
                            <h3 className="mb-4 text-base font-medium">
                              Facilities & Safety
                            </h3>
                            <Stack spacing={"lg"}>
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
                                  title="Fire Safety Certified"
                                  description="Is this building fire safety certified"
                                />
                              </Group>

                              <TextFormField<BuildingSchema>
                                control={form.control}
                                name="operatingHours"
                                label="Operating Hours"
                                placeholder="e.g. 9 AM - 5 PM"
                              />
                            </Stack>
                          </div>

                          <div className="mt-6 rounded-lg border bg-slate-50 p-6 dark:bg-slate-900/50">
                            <h3 className="mb-4 text-base font-medium">
                              Features & Amenities
                            </h3>
                            <Stack spacing={"lg"}>
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
                                selectedItems={form
                                  .watch("amenities")
                                  .map((f) => ({
                                    label: f,
                                    value: f,
                                  }))}
                              />
                            </Stack>
                          </div>
                        </motion.div>
                      </TabsContent>

                      <TabsContent value="LEASE_TERMS" className="space-y-6">
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
                                Lease Terms
                              </h2>
                              <p className="text-sm text-muted-foreground">
                                Define the rental terms and conditions
                              </p>
                            </div>
                          </div>

                          <div className="rounded-lg border bg-slate-50 p-6 dark:bg-slate-900/50">
                            <h3 className="mb-4 text-base font-medium">
                              Lease Duration & Payments
                            </h3>
                            <Stack>
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

                              <Group
                                className="grid grid-cols-1 gap-4 md:grid-cols-2"
                                align={"start"}
                              >
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
                            </Stack>
                          </div>

                          <div className="mt-6 rounded-lg border bg-slate-50 p-6 dark:bg-slate-900/50">
                            <h3 className="mb-4 text-base font-medium">
                              Policies
                            </h3>
                            <Stack>
                              <TextareaFormField<BuildingSchema>
                                control={form.control}
                                name="leaseTerms.leaseRenewalPolicy"
                                label="Lease Renewal Policy"
                                placeholder="Enter lease renewal policy details"
                                rows={4}
                              />

                              <TextareaFormField<BuildingSchema>
                                control={form.control}
                                name="leaseTerms.petPolicy"
                                label="Pet Policy"
                                placeholder="Enter pet policy details"
                                rows={4}
                              />
                            </Stack>
                          </div>

                          <div className="mt-6 rounded-lg border border-dashed border-primary/20 bg-primary/5 p-6">
                            <div className="mb-4 flex items-center gap-3">
                              <Upload className="h-5 w-5 text-primary" />
                              <h3 className="text-base font-medium">
                                Regulation Documents
                              </h3>
                            </div>
                            <p className="mb-4 text-sm text-muted-foreground">
                              Upload any legal documents or regulations related
                              to leasing this building
                            </p>
                            <FileUploader
                              onFilesChange={(files) => {
                                const regulationDocuments = Array.from(
                                  files,
                                ).map((file) => ({
                                  name: file.name,
                                  file,
                                }));
                                form.setValue("regulationDocuments", [
                                  ...regulationDocuments,
                                ]);
                              }}
                              showPreview
                              label="Regulation Documents"
                              acceptedFormats={["application/pdf"]}
                            />
                          </div>
                        </motion.div>
                      </TabsContent>
                    </Tabs>
                    <Group justify="between" className="mt-auto border-t pt-6">
                      {activeTab !== "BASIC" ? (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={handlePrev}
                          className="gap-2"
                        >
                          <ChevronLeft className="h-4 w-4" /> Previous
                        </Button>
                      ) : (
                        <span />
                      )}

                      {activeTab !== "LEASE_TERMS" ? (
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
                          disabled={createBuildingMutation.isPending}
                          onClick={handleSubmit}
                          className="gap-2 bg-gradient-to-r from-primary to-primary/80 transition-all hover:from-primary/90 hover:to-primary"
                        >
                          {createBuildingMutation.isPending
                            ? "Submitting..."
                            : isEditting
                              ? "Edit Building"
                              : "Create Building"}
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

// const LeftSection = ({
//   activeTab,
//   onTabClick,
// }: {
//   activeTab: TabType;
//   onTabClick: (tabType: TabType) => void;
// }) => {
//   return (
//     <Stack className="mt-6 space-y-6">
//       <LeftSectionItem
//         icon={Building2}
//         tabType="BASIC"
//         activeTab={activeTab}
//         onClick={() => onTabClick("BASIC")}
//       />
//       <LeftSectionItem
//         icon={MapPin}
//         tabType="ADDRESS"
//         activeTab={activeTab}
//         onClick={() => onTabClick("ADDRESS")}
//       />
//       <LeftSectionItem
//         icon={Home}
//         tabType="DETAILS"
//         activeTab={activeTab}
//         onClick={() => onTabClick("DETAILS")}
//       />
//       <LeftSectionItem
//         icon={Calendar}
//         tabType="LEASE_TERMS"
//         activeTab={activeTab}
//         onClick={() => onTabClick("LEASE_TERMS")}
//       />
//     </Stack>
//   );
// };

// const LeftSectionItem = ({
//   tabType,
//   icon: Icon,
//   activeTab,
//   onClick,
// }: {
//   tabType: TabType;
//   icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
//   activeTab: TabType;
//   onClick: () => void;
// }) => {
//   const isActive = activeTab === tabType;

//   return (
//     <button
//       className={cn(
//         "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-all",
//         isActive
//           ? "bg-primary/10 text-primary"
//           : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50",
//       )}
//       onClick={onClick}
//     >
//       <Icon
//         className={cn(
//           "h-5 w-5 transition-all",
//           isActive ? "text-primary" : "text-slate-400",
//         )}
//         strokeWidth={isActive ? 2.5 : 2}
//       />
//       <span className="font-medium">{TAB_TYPES[tabType]}</span>
//     </button>
//   );
// };

export default Page;
