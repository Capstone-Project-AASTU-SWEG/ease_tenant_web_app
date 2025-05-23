"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Building2,
  Check,
  Calendar,
  FileText,
  Users,
  Clipboard,
  Star,
  ArchiveIcon,
  MapPin,
  Clock,
  CheckCircle2,
  Shield,
  BadgeCheck,
  CreditCard,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Image from "next/image";

import PageWrapper from "@/components/custom/page-wrapper";
import PageHeader from "@/components/custom/page-header";
import { Group } from "@/components/custom/group";

import { DateFormField, NumberFormField } from "@/components/custom/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  errorToast,
  successToast,
  warningToast,
} from "@/components/custom/toasts";
import { USER_TYPE, type RentalApplication } from "@/types";
import { useGetBuildingQuery } from "@/app/quries/useBuildings";
import { cn } from "@/lib/utils";
import { useCreateRentalApplicationMutation } from "@/app/quries/useApplications";
import LogJSON from "@/components/custom/log-json";
import { PageError } from "@/components/custom/page-error";
import { PageLoader } from "@/components/custom/page-loader";
import { useVerifyUserQuery } from "@/app/quries/useAuth";
import { ScrollArea } from "@/components/ui/scroll-area";
import ENV from "@/config/env";

// Define the rental application schema (simplified since user identity is already in the system)
const rentalApplicationSchema = z.object({
  moveInDate: z.date(),
  numberOfEmployees: z.coerce
    .number()
    .min(1, "Number of employees is required"),
  leaseDuration: z.coerce.number().min(1, "Lease duration is required"),
  specialRequirements: z.string().optional(),
  additionalNotes: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  requestTour: z.boolean().default(false),
});

type RentalApplicationSchema = z.infer<typeof rentalApplicationSchema>;

const RentUnitPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const buildingID = searchParams.get("buildingId");
  const unitID = searchParams.get("unitId");

  const [activeTab, setActiveTab] = useState<string>("unit-details");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Get building and unit data
  const getBuildingQuery = useGetBuildingQuery(buildingID!);
  const building = getBuildingQuery.data;
  const unit = building?.units.find((unit) => unit.id === unitID);

  const createRentalApplicationMutation = useCreateRentalApplicationMutation();

  // Get current authenticated user
  const verifyUserQuery = useVerifyUserQuery();
  const currentUser = verifyUserQuery.data;

  // Form setup
  const form = useForm<RentalApplicationSchema>({
    resolver: zodResolver(rentalApplicationSchema),
    defaultValues: {
      moveInDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Default to 2 weeks from now
      numberOfEmployees: 1,
      leaseDuration: building?.leaseTerms?.minLeasePeriodMonths || 12,
      specialRequirements: "",
      additionalNotes: "",
      agreeToTerms: false,
      requestTour: false,
    },
  });

  // Redirect if building or unit not found
  useEffect(() => {
    if (!buildingID || !unitID) {
      router.push("/dashboard/buildings");
    }
  }, [buildingID, unitID, router]);

  // Handle form submission
  const onSubmit = (data: RentalApplicationSchema) => {
    if (!currentUser) {
      warningToast("Please log in to submit your application.");
      return;
    }

    if (!building || !unit) {
      warningToast("Building or unit not found.");
      return;
    }

    const buildingManager = building.manager;
    if (!buildingManager) {
      warningToast("Building manager not found.");
      return;
    }

    const rentalApplication: Omit<RentalApplication, "building"> = {
      id: Math.floor(Math.random() * 1000000).toString(),
      status: "pending",
      unit: unit,
      documentsMetadata: [],
      documents: [],
      leaseDetails: {
        numberOfEmployees: data.numberOfEmployees,
        requestedDuration: data.leaseDuration,
        requestedStartDate: data.moveInDate,
        specialRequirements: data.specialRequirements,
      },

      lastUpdated: new Date().toISOString(),
      priority: "high",
      submittedAt: new Date().toISOString(),
      submittedBy: {
        ...currentUser.tenant!,
        role: USER_TYPE.TENANT,
        password: "***",
      },
      notes: data.additionalNotes,
      type: "rental",
      assignedTo: {
        ...buildingManager,
        role: USER_TYPE.MANAGER,
        password: "***",
      },
    };

    const formData = new FormData();

    // Add simple fields
    formData.append("status", rentalApplication.status);
    formData.append("priority", rentalApplication.priority);
    formData.append("type", rentalApplication.type);
    formData.append("notes", rentalApplication.notes || "");
    formData.append("buildingId", building.id);

    // Add nested objects as JSON strings
    formData.append("unitId", rentalApplication.unit.id);
    formData.append(
      "leaseDetails",
      JSON.stringify(rentalApplication.leaseDetails),
    );
    formData.append("submittedById", rentalApplication.submittedBy.id);
    formData.append("assignedToId", rentalApplication.assignedTo.id);

    // Add arrays (empty in this case, but showing how it would work)
    rentalApplication.documentsMetadata.forEach((metadata) => {
      formData.append(`documentsMetadata`, JSON.stringify(metadata));
    });

    rentalApplication.documents.forEach((doc) => {
      formData.append(`documents`, doc);
    });
    createRentalApplicationMutation.mutate(formData);
  };

  // Calculate monthly cost
  const calculateMonthlyCost = () => {
    if (!unit) return 0;

    const baseCost = unit.monthlyRent || 0;

    return baseCost;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  useEffect(() => {
    if (createRentalApplicationMutation.isSuccess) {
      // Show success message and redirect
      successToast("Rental application submitted successfully.");
      router.push("/dashboard/tenant");
    }
  }, [createRentalApplicationMutation.isSuccess, router]);

  useEffect(() => {
    if (createRentalApplicationMutation.isError) {
      // Show error message
      errorToast("Failed to submit rental application.");
    }
  }, [createRentalApplicationMutation.isError]);

  if (getBuildingQuery.isPending) {
    return (
      <PageLoader
        isLoading={getBuildingQuery.isPending}
        variant="minimal"
        loaderVariant="progress"
      />
    );
  }

  if (!building || !unit) {
    return (
      <PageError variant="404" message="Building or Unit not found" fullPage />
    );
  }

  return (
    <PageWrapper className="py-0">
      {/* Header */}
      <PageHeader
        title="Renting Process"
        description="Staring by providing additional information to finish renting process."
        withBackButton
      />

      <LogJSON data={{ building, currentUser }} />

      {/* Main Content */}
      <main className="mt-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Building & Unit Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Monthly Cost Breakdown */}
              <Card className="overflow-hidden rounded-md border-none">
                <div className="bg-gradient-to-r from-primary to-primary/90 p-6 text-white">
                  <h3 className="text-lg font-semibold">
                    Monthly Cost Estimate
                  </h3>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm opacity-90">Base Rent</span>
                    <span className="font-medium">
                      {formatCurrency(unit.monthlyRent)}
                    </span>
                  </div>

                  <Separator className="my-4 bg-white/20" />
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Monthly</span>
                    <span className="text-xl font-bold">
                      {formatCurrency(calculateMonthlyCost())}
                    </span>
                  </div>
                </div>
                <div className="bg-white p-3 dark:bg-slate-900">
                  <div className="text-xs text-muted-foreground">
                    *Estimate only. Final costs may vary based on specific terms
                    and additional services.
                  </div>
                </div>
              </Card>

              <Card className="overflow-hidden rounded-md border-none">
                <div className="relative">
                  <div className="relative h-56 bg-slate-200">
                    {unit.images && unit.images.length > 0 ? (
                      <>
                        <Image
                          src={
                            unit.images[activeImageIndex]
                              ? `${ENV.NEXT_PUBLIC_BACKEND_BASE_URL_WITHOUT_PREFIX}/${unit.images[activeImageIndex]}`
                              : "/placeholder.svg?height=224&width=384"
                          }
                          alt={`${building.name} - Unit ${unit.unitNumber}`}
                          className="h-full w-full object-cover"
                          fill
                        />
                        {unit.images.length > 1 && (
                          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                            {unit.images.map((_, index) => (
                              <button
                                key={index}
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full bg-white/50 transition-all",
                                  activeImageIndex === index && "w-4 bg-white",
                                )}
                                onClick={() => setActiveImageIndex(index)}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                        <Building2 className="h-16 w-16 text-slate-400" />
                      </div>
                    )}
                    <Badge className="absolute right-4 top-4 bg-primary/90 px-3 py-1 text-sm font-medium shadow-md">
                      {unit.status}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="px-2 py-0.5 text-xs font-normal"
                    >
                      {unit.type}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="px-2 py-0.5 text-xs font-normal"
                    >
                      {unit.sizeSqFt} sq ft
                    </Badge>
                  </div>
                  <CardTitle className="mt-2 flex items-center justify-between">
                    <span className="text-xl">Unit {unit.unitNumber}</span>
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(unit.monthlyRent)}/mo
                    </span>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {building.name}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                      <p className="text-xs text-muted-foreground">Floor</p>
                      <p className="font-medium">{unit.floorNumber}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                      <p className="text-xs text-muted-foreground">
                        Min. Lease
                      </p>
                      <p className="font-medium">
                        {building.leaseTerms.minLeasePeriodMonths} months
                      </p>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <p className="mb-2 text-sm font-medium">Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {unit.amenities &&
                        unit.amenities.map((amenity, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-slate-50 dark:bg-slate-800/50"
                          >
                            {amenity}
                          </Badge>
                        ))}
                      {(!unit.amenities || unit.amenities.length === 0) && (
                        <p className="text-sm text-slate-500">
                          No amenities listed
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Building Address */}
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/30">
                    <h3 className="mb-1 text-sm font-medium">
                      Building Address
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {building.address.street}, {building.address.city},{" "}
                      {building.address.country}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Application Form */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden rounded-md border-none">
              <Tabs
                defaultValue="unit-details"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <div className="border-b px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-3 gap-4">
                    <TabsTrigger
                      value="unit-details"
                      className="data-[state=active]:bg-primary data-[state=active]:text-white"
                    >
                      <span className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Unit Details</span>
                        <span className="sm:hidden">Details</span>
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="lease-terms"
                      className="data-[state=active]:bg-primary data-[state=active]:text-white"
                    >
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="hidden sm:inline">Lease Terms</span>
                        <span className="sm:hidden">Terms</span>
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="review"
                      className="data-[state=active]:bg-primary data-[state=active]:text-white"
                    >
                      <span className="flex items-center gap-2">
                        <Clipboard className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          Review & Submit
                        </span>
                        <span className="sm:hidden">Review</span>
                      </span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="p-6">
                      {/* Unit Details Tab */}
                      <TabsContent
                        value="unit-details"
                        className="mt-0 space-y-6"
                      >
                        <div className="space-y-6">
                          {/* <div className="flex items-center gap-2 rounded-lg bg-primary/5 p-4 text-primary">
                            <Building2 className="h-5 w-5" />
                            <h3 className="text-lg font-medium">
                              Unit Information
                            </h3>
                          </div> */}

                          {/* Unit Description */}
                          <div className="space-y-6">
                            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
                              <p className="text-slate-600 dark:text-slate-300">
                                {`You're`} applying for Unit {unit.unitNumber}{" "}
                                on Floor {unit.floorNumber} of {building.name}.
                                This {unit.sizeSqFt} sq ft{" "}
                                {unit.type.toLowerCase()} space is available for{" "}
                                {formatCurrency(unit.monthlyRent)} per month
                                with a minimum lease term of{" "}
                                {building.leaseTerms.minLeasePeriodMonths}{" "}
                                months.
                              </p>
                            </div>

                            {/* Building Features */}
                            <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                              <h4 className="mb-4 flex items-center gap-2 font-medium text-primary">
                                <BadgeCheck className="h-5 w-5" />
                                Building Features
                              </h4>
                              {building.amenities.length > 0 ? (
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                  {building.amenities.map((amenity, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center rounded-md bg-slate-50 p-2 dark:bg-slate-800/50"
                                    >
                                      <Check className="mr-2 h-4 w-4 text-green-500" />
                                      <span className="text-sm capitalize">
                                        {amenity}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <Group spacing="md">
                                  <ArchiveIcon />
                                  <p className="text-sm">
                                    No building features
                                  </p>
                                </Group>
                              )}
                            </div>

                            {/* Unit Gallery */}
                            {unit.images && unit.images.length > 0 && (
                              <div className="space-y-3">
                                <h4 className="flex items-center gap-2 font-medium text-primary">
                                  <FileText className="h-5 w-5" />
                                  Unit Gallery
                                </h4>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                  {unit.images.map((url, index) => (
                                    <div
                                      key={index}
                                      className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 shadow-sm transition-all hover:shadow-md dark:border-slate-700"
                                    >
                                      <Image
                                        src={
                                          url
                                            ? `${ENV.NEXT_PUBLIC_BACKEND_BASE_URL_WITHOUT_PREFIX}/${url}`
                                            : "/placeholder.svg?height=100&width=100"
                                        }
                                        alt={`Unit ${unit.unitNumber} - Image ${index + 1}`}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        fill
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Last Renovation */}
                            {unit.lastRenovationDate && (
                              <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-800/30 dark:text-slate-300">
                                <Clock className="h-4 w-4 text-primary" />
                                Last renovated:{" "}
                                {new Date(
                                  unit.lastRenovationDate,
                                ).toLocaleDateString()}
                              </div>
                            )}
                          </div>

                          {/* Unit Notes */}
                          {unit.description && (
                            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
                              <p className="mb-2 text-sm font-medium text-primary">
                                Additional Notes
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-300">
                                {unit.description}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Request Tour Option */}
                        <div className="rounded-lg border border-primary/10 bg-primary/5 p-5 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="flex items-center gap-2 font-medium text-primary">
                                <Calendar className="h-5 w-5" />
                                Request In-Person Tour
                              </h3>
                              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                Schedule a tour before making your decision
                              </p>
                            </div>
                            <Switch
                              checked={form.watch("requestTour")}
                              onCheckedChange={(checked) =>
                                form.setValue("requestTour", checked)
                              }
                              className="data-[state=checked]:bg-primary"
                            />
                          </div>
                        </div>
                      </TabsContent>

                      {/* Lease Terms Tab */}
                      <TabsContent
                        value="lease-terms"
                        className="mt-0 space-y-6"
                      >
                        <div className="space-y-6">
                          {/* <div className="flex items-center gap-2 rounded-lg bg-primary/5 p-4 text-primary">
                            <Calendar className="h-5 w-5" />
                            <h3 className="text-lg font-medium">
                              Lease Preferences
                            </h3>
                          </div> */}

                          <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="grid grid-cols-1 gap-5">
                              <Group align={"start"}>
                                <NumberFormField
                                  control={form.control}
                                  label={`Lease Duration [${building.leaseTerms.minLeasePeriodMonths} - ${building.leaseTerms.maxLeasePeriodMonths}]`}
                                  name="leaseDuration"
                                  min={1}
                                  placeholder={`${building.leaseTerms.minLeasePeriodMonths} month`}
                                />
                                <NumberFormField
                                  control={form.control}
                                  label="Number of Employees"
                                  name="numberOfEmployees"
                                  min={1}
                                  placeholder={`1 employee`}
                                />
                              </Group>

                              <DateFormField
                                control={form.control}
                                name="moveInDate"
                                label="Desired Move-In Date"
                              />

                              <div className="space-y-2">
                                <label
                                  htmlFor="specialRequirements"
                                  className="text-sm font-medium"
                                >
                                  Special Requirements or Modifications
                                </label>
                                <Textarea
                                  id="specialRequirements"
                                  rows={4}
                                  className="resize-none"
                                  placeholder="Describe any special requirements or modifications you need for the space..."
                                  {...form.register("specialRequirements")}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Lease Terms Information */}
                        <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                          <h3 className="mb-4 flex items-center gap-2 font-medium text-primary">
                            <Shield className="h-5 w-5" />
                            Lease Terms Overview
                          </h3>
                          <div className="space-y-4 text-sm">
                            <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/30">
                              <Check className="mt-0.5 h-4 w-4 text-green-500" />
                              <div>
                                <span className="font-medium">
                                  Payment Schedule:
                                </span>{" "}
                                <span className="text-slate-600 dark:text-slate-300">
                                  Rent is due on the 1st of each month with a
                                  5-day grace period.
                                </span>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/30">
                              <Check className="mt-0.5 h-4 w-4 text-green-500" />
                              <div>
                                <span className="font-medium">
                                  Security Deposit:
                                </span>{" "}
                                <span className="text-slate-600 dark:text-slate-300">
                                  Equal to one {`month's`} rent, refundable upon
                                  lease completion.
                                </span>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/30">
                              <Check className="mt-0.5 h-4 w-4 text-green-500" />
                              <div>
                                <span className="font-medium">
                                  Maintenance:
                                </span>{" "}
                                <span className="text-slate-600 dark:text-slate-300">
                                  Building maintenance is included in the
                                  service fee. Tenant is responsible for
                                  unit-specific maintenance.
                                </span>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/30">
                              <Check className="mt-0.5 h-4 w-4 text-green-500" />
                              <div>
                                <span className="font-medium">Insurance:</span>{" "}
                                <span className="text-slate-600 dark:text-slate-300">
                                  Tenant must maintain commercial liability
                                  insurance with minimum coverage of $1,000,000.
                                </span>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/30">
                              <Check className="mt-0.5 h-4 w-4 text-green-500" />
                              <div>
                                <span className="font-medium">Renewal:</span>{" "}
                                <span className="text-slate-600 dark:text-slate-300">
                                  Option to renew with 60-day notice before
                                  lease expiration.
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                          <label
                            htmlFor="additionalNotes"
                            className="mb-2 block text-sm font-medium"
                          >
                            Additional Notes for Property Manager
                          </label>
                          <Textarea
                            id="additionalNotes"
                            rows={4}
                            className="resize-none"
                            placeholder="Any additional information you'd like to share with the property manager..."
                            {...form.register("additionalNotes")}
                          />
                        </div>
                      </TabsContent>

                      {/* Review & Submit Tab */}
                      <TabsContent value="review" className="mt-0 space-y-6">
                        <div className="space-y-6">
                          {/* <div className="flex items-center gap-2 rounded-lg bg-primary/5 p-4 text-primary">
                            <Clipboard className="h-5 w-5" />
                            <h3 className="text-lg font-medium">
                              Review Your Application
                            </h3>
                          </div> */}

                          <ScrollArea>
                            <div className="flex flex-col gap-6">
                              {/* Tenant Information Summary */}
                              <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <h4 className="mb-4 flex items-center gap-2 font-medium text-primary">
                                  <Users className="h-5 w-5" />
                                  Tenant Information
                                </h4>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                  <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/30">
                                    <p className="text-xs text-muted-foreground">
                                      Business Name
                                    </p>
                                    <p className="font-medium">
                                      {currentUser?.tenant?.businessName ||
                                        "Not provided"}
                                    </p>
                                  </div>
                                  <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/30">
                                    <p className="text-xs text-muted-foreground">
                                      Business Type
                                    </p>
                                    <p className="font-medium">
                                      {currentUser?.tenant?.businessType ||
                                        "Not provided"}
                                    </p>
                                  </div>
                                  <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/30">
                                    <p className="text-xs text-muted-foreground">
                                      Contact Name
                                    </p>
                                    <p className="font-medium">
                                      {currentUser?.user?.firstName}{" "}
                                      {currentUser?.user?.lastName}
                                    </p>
                                  </div>
                                  <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/30">
                                    <p className="text-xs text-muted-foreground">
                                      Contact Email
                                    </p>
                                    <p className="font-medium">
                                      {currentUser?.user?.email}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Unit Information Summary */}
                              <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <h4 className="mb-4 flex items-center gap-2 font-medium text-primary">
                                  <Building2 className="h-5 w-5" />
                                  Unit Information
                                </h4>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                  <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/30">
                                    <p className="text-xs text-muted-foreground">
                                      Building
                                    </p>
                                    <p className="font-medium">
                                      {building.name}
                                    </p>
                                  </div>
                                  <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/30">
                                    <p className="text-xs text-muted-foreground">
                                      Unit
                                    </p>
                                    <p className="font-medium">
                                      {unit.unitNumber}
                                    </p>
                                  </div>
                                  <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/30">
                                    <p className="text-xs text-muted-foreground">
                                      Size
                                    </p>
                                    <p className="font-medium">
                                      {unit.sizeSqFt} sq ft
                                    </p>
                                  </div>
                                  <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/30">
                                    <p className="text-xs text-muted-foreground">
                                      Type
                                    </p>
                                    <p className="font-medium">{unit.type}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Lease Terms Summary */}
                              <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <h4 className="mb-4 flex items-center gap-2 font-medium text-primary">
                                  <Calendar className="h-5 w-5" />
                                  Lease Terms
                                </h4>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                  <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/30">
                                    <p className="text-xs text-muted-foreground">
                                      Move-In Date
                                    </p>
                                    <p className="font-medium">
                                      {form.watch("moveInDate")
                                        ? new Date(
                                            form.watch("moveInDate"),
                                          ).toLocaleDateString()
                                        : "Not provided"}
                                    </p>
                                  </div>
                                  <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/30">
                                    <p className="text-xs text-muted-foreground">
                                      Lease Duration
                                    </p>
                                    <p className="font-medium">
                                      {form.watch("leaseDuration") ||
                                        "Not provided"}{" "}
                                      months
                                    </p>
                                  </div>
                                  <div className="col-span-1 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/30 sm:col-span-2">
                                    <p className="text-xs text-muted-foreground">
                                      Special Requirements
                                    </p>
                                    <p className="font-medium">
                                      {form.watch("specialRequirements") ||
                                        "None specified"}
                                    </p>
                                  </div>
                                  <div className="col-span-1 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/30 sm:col-span-2">
                                    <p className="text-xs text-muted-foreground">
                                      Additional Notes
                                    </p>
                                    <p className="font-medium">
                                      {form.watch("additionalNotes") ||
                                        "None specified"}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Financial Summary */}
                              <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <h4 className="mb-4 flex items-center gap-2 font-medium text-primary">
                                  <CreditCard className="h-5 w-5" />
                                  Financial Summary
                                </h4>
                                <div className="overflow-hidden rounded-lg">
                                  <div className="space-y-3 bg-gradient-to-r from-primary to-primary/90 p-5 text-white">
                                    <div className="flex items-center justify-between">
                                      <span>Monthly Rent</span>
                                      <span className="font-medium">
                                        {formatCurrency(unit.monthlyRent)}
                                      </span>
                                    </div>

                                    <Separator className="bg-white/20" />
                                    <div className="flex items-center justify-between">
                                      <span>Total Monthly</span>
                                      <span className="text-lg font-bold">
                                        {formatCurrency(calculateMonthlyCost())}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span>Security Deposit</span>
                                      <span className="font-medium">
                                        {formatCurrency(unit.monthlyRent)}
                                      </span>
                                    </div>
                                    <Separator className="bg-white/20" />
                                    <div className="flex items-center justify-between">
                                      <span>Due at Signing</span>
                                      <span className="text-lg font-bold">
                                        {formatCurrency(
                                          unit.monthlyRent +
                                            calculateMonthlyCost(),
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Last components */}
                              <section className="space-y-6">
                                {/* Request Tour */}
                                {form.watch("requestTour") && (
                                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-300">
                                    <div className="flex items-center gap-2">
                                      <Star className="h-5 w-5 text-amber-500" />
                                      <p className="font-medium">
                                        In-Person Tour Requested
                                      </p>
                                    </div>
                                    <p className="mt-2 text-sm">
                                      A property manager will contact you within
                                      1-2 business days to schedule your tour.
                                    </p>
                                  </div>
                                )}

                                {/* Terms and Conditions */}
                                <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                  <div className="flex items-start gap-3">
                                    <Checkbox
                                      onCheckedChange={(checked) => {
                                        form.setValue(
                                          "agreeToTerms",
                                          checked ? true : false,
                                        );
                                      }}
                                      checked={form.watch("agreeToTerms")}
                                      id="agreeToTerms"
                                      className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                    />

                                    <Label
                                      htmlFor="agreeToTerms"
                                      className="text-sm leading-relaxed"
                                    >
                                      I confirm that all information provided is
                                      accurate and complete. I understand that
                                      providing false information may result in
                                      the rejection of my application or
                                      termination of my lease. I authorize the
                                      property management to verify all
                                      information provided and conduct
                                      background and credit checks as necessary.
                                    </Label>
                                  </div>
                                  {form.formState.errors.agreeToTerms && (
                                    <p className="ml-9 mt-2 text-xs text-red-500">
                                      {
                                        form.formState.errors.agreeToTerms
                                          .message
                                      }
                                    </p>
                                  )}
                                </div>
                              </section>
                            </div>
                          </ScrollArea>
                        </div>
                      </TabsContent>
                    </CardContent>

                    <CardFooter className="flex justify-between border-t p-6">
                      {activeTab !== "unit-details" ? (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() =>
                            setActiveTab(
                              activeTab === "review"
                                ? "lease-terms"
                                : "unit-details",
                            )
                          }
                          className="gap-2"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Back
                        </Button>
                      ) : (
                        <div></div>
                      )}

                      {activeTab !== "review" ? (
                        <Button
                          type="button"
                          onClick={async () => {
                            if (activeTab === "lease-terms") {
                              const isValid = await form.trigger([
                                "leaseDuration",
                                "numberOfEmployees",
                                "moveInDate",
                              ]);

                              const formValues = form.getValues();

                              if (
                                formValues.leaseDuration <
                                  building.leaseTerms.minLeasePeriodMonths ||
                                formValues.leaseDuration >
                                  building.leaseTerms.maxLeasePeriodMonths
                              ) {
                                form.setError("leaseDuration", {
                                  type: "manual",
                                  message: `Lease duration must be between ${building.leaseTerms.minLeasePeriodMonths} and ${building.leaseTerms.maxLeasePeriodMonths} months.`,
                                });
                                return;
                              }

                              if (isValid) {
                                setActiveTab("review");
                              }
                            } else {
                              setActiveTab("lease-terms");
                            }
                          }}
                          className="gap-2"
                        >
                          Continue
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <Button
                                  type="submit"
                                  className="gap-2 bg-primary hover:bg-primary/90"
                                  disabled={
                                    createRentalApplicationMutation.isPending
                                  }
                                >
                                  {createRentalApplicationMutation.isPending ? (
                                    "Submitting..."
                                  ) : (
                                    <>
                                      Submit Application
                                      <CheckCircle2 className="h-4 w-4" />
                                    </>
                                  )}
                                </Button>
                              </div>
                            </TooltipTrigger>
                            {!form.formState.isValid && (
                              <TooltipContent>
                                <p>Please complete all required fields</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </CardFooter>
                  </form>
                </Form>
              </Tabs>
            </Card>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default RentUnitPage;
