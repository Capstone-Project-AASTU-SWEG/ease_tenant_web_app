"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Building2,
  Check,
  Info,
  Calendar,
  FileText,
  Users,
  DollarSign,
  Clipboard,
  Star,
  ArchiveIcon,
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
import { getBuildingByID } from "../buildings/_hooks/useBuildings";
import { getUnitById } from "../buildings/_hooks/useUnits";
import { authUser } from "@/app/auth/_hooks/useAuth";
import PageWrapper from "@/components/custom/page-wrapper";
import PageHeader from "@/components/custom/page-header";
import { Group } from "@/components/custom/group";

import { DateFormField, NumberFormField } from "@/components/custom/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  infoToast,
  successToast,
  warningToast,
} from "@/components/custom/toasts";
import { addApplication } from "../buildings/_hooks/useApplications";
import { RentalApplication } from "@/types";
import { useGetBuildingManager } from "@/app/auth/_hooks/useUser";

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
  const buildingID = searchParams.get("buildingID");
  const unitID = searchParams.get("unitID");

  const [activeTab, setActiveTab] = useState<string>("unit-details");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get building and unit data
  const building = buildingID ? getBuildingByID(buildingID) : undefined;
  const unit = unitID ? getUnitById(unitID) : undefined;
  const buildingManager = useGetBuildingManager();

  // Get current authenticated user
  const currentUser = authUser();
  // const userType = authUserType();

  // console.log({ userType });

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
    setIsSubmitting(true);
    if (!currentUser) {
      warningToast("Please log in to submit your application.");
      setIsSubmitting(false);
      return;
    }

    if (!building || !unit) {
      warningToast("Building or unit not found.");
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      console.log("Application submitted:", {
        tenant: currentUser,
        building: building?.id,
        unit: unit?.id,
        ...data,
      });

      const rentalApplication: RentalApplication = {
        id: Math.floor(Math.random() * 1000000).toString(),
        status: "pending",
        businessDetails: {
          employees: data.numberOfEmployees,
          name: currentUser.businessName,
          type: currentUser.businessType,
        },
        documents: [],
        leaseDetails: {
          specialRequirements: data.specialRequirements,
          requestedStartDate: data.moveInDate.toISOString(),
          requestedDuration: data.leaseDuration,
        },
        unitDetails: unit,
        lastUpdated: new Date().toISOString(),
        priority: "high",
        submittedAt: new Date().toISOString(),
        submittedBy: currentUser,
        notes: data.additionalNotes,
        type: "rental",
        assignedTo: buildingManager,
      };

      addApplication(rentalApplication);

      // Show success message and redirect
      successToast(
        "Your rental application has been submitted successfully! Reference #: " +
          Math.floor(Math.random() * 1000000),
      );

      // Redirect to dashboard or another page
      router.push("/dashboard/applications");
      setIsSubmitting(false);
    }, 1500);
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

  if (!building || !unit) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Unit Not Found</CardTitle>
            <CardDescription>
              The building or unit {`you're`} looking for could not be found.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={() => router.push("/buildings")}
              className="w-full"
            >
              Browse Available Units
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <PageWrapper>
      {/* Header */}
      <PageHeader
        title="Renting Process"
        description="Staring by providing additional information to finish renting process."
        withBackButton
      />

      {/* Main Content */}
      <main className="mt-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Building & Unit Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Monthly Cost Breakdown */}
              <Card className="rounded-lg bg-primary text-white shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    Monthly Cost Estimate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Base Rent</span>
                    <span className="font-medium">
                      {formatCurrency(unit.monthlyRent)}
                    </span>
                  </div>

                  <Separator />
                  <div className="flex items-center justify-between font-medium">
                    <span>Total Monthly</span>
                    <span className="text-lg text-primary">
                      {formatCurrency(calculateMonthlyCost())}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    *Estimate only. Final costs may vary based on specific terms
                    and additional services.
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden shadow-sm">
                <div className="relative h-48 bg-slate-200">
                  {unit.imageUrls && unit.imageUrls.length > 0 ? (
                    <Image
                      src={
                        unit.imageUrls[0] ||
                        "/placeholder.svg?height=192&width=384"
                      }
                      alt={`${building.name} - Unit ${unit.unitNumber}`}
                      className="h-full w-full object-cover"
                      fill
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                      <Building2 className="h-16 w-16 text-slate-400" />
                    </div>
                  )}
                  <Badge className="absolute right-4 top-4 bg-primary">
                    {unit.status}
                  </Badge>
                </div>

                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Unit {unit.unitNumber}</span>
                    <span className="text-primary">
                      {formatCurrency(unit.monthlyRent)}/mo
                    </span>
                  </CardTitle>
                  <CardDescription>{building.name}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Floor</p>
                      <p className="font-medium">{unit.floorNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Size</p>
                      <p className="font-medium">{unit.sizeSqFt} sq ft</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Type</p>
                      <p className="font-medium">{unit.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Min. Lease</p>
                      <p className="font-medium">
                        {building.leaseTerms.minLeasePeriodMonths} months
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Amenities */}
                  <div>
                    <p className="mb-2 text-sm font-medium">Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {unit.amenities &&
                        unit.amenities.map((amenity, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-slate-50"
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

                  {/* Allowed Uses */}
                  <div>
                    <p className="mb-2 text-sm font-medium">Allowed Uses</p>
                    <div className="flex flex-wrap gap-2">
                      {unit.allowedUses &&
                        unit.allowedUses.map((use, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-slate-50"
                          >
                            {use}
                          </Badge>
                        ))}
                      {(!unit.allowedUses || unit.allowedUses.length === 0) && (
                        <p className="text-sm text-slate-500">
                          No specific uses listed
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* //TODO: FIGURE THIS OUT */}
              {/* Download Lease Documents */}
              {/* <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Lease Agreement Template
                    <Download className="ml-auto h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Building Rules & Regulations
                    <Download className="ml-auto h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Floor Plan
                    <Download className="ml-auto h-4 w-4" />
                  </Button>
                </CardContent>
              </Card> */}
            </div>
          </div>

          {/* Right Column - Application Form */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-none">
              <Tabs
                defaultValue="unit-details"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <div className="px-0">
                  <TabsList className="grid w-full grid-cols-3 gap-4">
                    <TabsTrigger value="unit-details">Unit Details</TabsTrigger>
                    <TabsTrigger value="lease-terms">Lease Terms</TabsTrigger>
                    <TabsTrigger value="review">Review & Submit</TabsTrigger>
                  </TabsList>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="p-0">
                      {/* Unit Details Tab */}
                      <TabsContent value="unit-details" className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="flex items-center pt-2 text-lg font-medium">
                            <Building2 className="mr-2 h-5 w-5 text-primary" />
                            Unit Information
                          </h3>

                          {/* Unit Description */}
                          <div className="space-y-4">
                            <p className="text-slate-600">
                              {`You're`} applying for Unit {unit.unitNumber} on
                              Floor {unit.floorNumber} of {building.name}. This{" "}
                              {unit.sizeSqFt} sq ft {unit.type.toLowerCase()}{" "}
                              space is available for{" "}
                              {formatCurrency(unit.monthlyRent)} per month with
                              a minimum lease term of{" "}
                              {building.leaseTerms.minLeasePeriodMonths} months.
                            </p>

                            {/* Building Features */}
                            <div className="rounded-lg border border-slate-200 bg-white p-4">
                              <h4 className="mb-3 font-medium">
                                Building Features
                              </h4>
                              {building.amenities.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3">
                                  {building.amenities.map((amenity, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center"
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
                            {unit.imageUrls && unit.imageUrls.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="font-medium">Unit Gallery</h4>
                                <div className="grid grid-cols-3 gap-2">
                                  {unit.imageUrls.map((url, index) => (
                                    <div
                                      key={index}
                                      className="relative aspect-square overflow-hidden rounded-md"
                                    >
                                      <Image
                                        src={
                                          url ||
                                          "/placeholder.svg?height=100&width=100"
                                        }
                                        alt={`Unit ${unit.unitNumber} - Image ${index + 1}`}
                                        className="h-full w-full object-cover"
                                        fill
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Last Renovation */}
                            {unit.lastRenovationDate && (
                              <div className="flex items-center text-sm text-slate-600">
                                <Info className="mr-2 h-4 w-4 text-slate-400" />
                                Last renovated:{" "}
                                {new Date(
                                  unit.lastRenovationDate,
                                ).toLocaleDateString()}
                              </div>
                            )}
                          </div>

                          {/* Unit Notes */}
                          {unit.notes && (
                            <div className="mt-4 rounded border border-slate-200 bg-slate-100 p-3">
                              <p className="text-sm font-medium">
                                Additional Notes
                              </p>
                              <p className="mt-1 text-sm text-slate-600">
                                {unit.notes}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Building Address */}
                        <div className="rounded-lg border border-slate-200 bg-white p-4">
                          <h3 className="mb-2 font-medium">Building Address</h3>
                          <p className="text-slate-600">
                            {building.address.street}, {building.address.city},{" "}
                            {building.address.country}
                          </p>
                        </div>

                        {/* Request Tour Option */}
                        <div className="rounded-lg border border-slate-200 bg-white p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">
                                Request In-Person Tour
                              </h3>
                              <p className="text-sm text-slate-500">
                                Schedule a tour before making your decision
                              </p>
                            </div>
                            <Switch
                              checked={form.watch("requestTour")}
                              onCheckedChange={(checked) =>
                                form.setValue("requestTour", checked)
                              }
                            />
                          </div>
                        </div>
                      </TabsContent>

                      {/* Lease Terms Tab */}
                      <TabsContent
                        value="lease-terms"
                        className="space-y-6 pt-2"
                      >
                        <div className="space-y-4">
                          <h3 className="flex items-center text-lg font-medium">
                            <Calendar className="mr-2 h-5 w-5 text-primary" />
                            Lease Preferences
                          </h3>

                          <div className="grid grid-cols-1 gap-4">
                            <Group>
                              <NumberFormField
                                control={form.control}
                                label="Lease Duration(month)"
                                name="leaseDuration"
                                min={1}
                                placeholder={`${building.leaseTerms.minLeasePeriodMonths + 1} month`}
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

                        {/* Lease Terms Information */}
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                          <h3 className="mb-3 flex items-center font-medium">
                            <FileText className="mr-2 h-5 w-5 text-primary" />
                            Lease Terms Overview
                          </h3>
                          <div className="space-y-3 text-sm">
                            <div className="flex items-start">
                              <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" />
                              <p>
                                <span className="font-medium">
                                  Payment Schedule:
                                </span>{" "}
                                Rent is due on the 1st of each month with a
                                5-day grace period.
                              </p>
                            </div>
                            <div className="flex items-start">
                              <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" />
                              <p>
                                <span className="font-medium">
                                  Security Deposit:
                                </span>{" "}
                                Equal to one {`month's`} rent, refundable upon
                                lease completion.
                              </p>
                            </div>
                            <div className="flex items-start">
                              <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" />
                              <p>
                                <span className="font-medium">
                                  Maintenance:
                                </span>{" "}
                                Building maintenance is included in the service
                                fee. Tenant is responsible for unit-specific
                                maintenance.
                              </p>
                            </div>
                            <div className="flex items-start">
                              <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" />
                              <p>
                                <span className="font-medium">Insurance:</span>{" "}
                                Tenant must maintain commercial liability
                                insurance with minimum coverage of $1,000,000.
                              </p>
                            </div>
                            <div className="flex items-start">
                              <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" />
                              <p>
                                <span className="font-medium">Renewal:</span>{" "}
                                Option to renew with 60-day notice before lease
                                expiration.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="additionalNotes"
                            className="text-sm font-medium"
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
                      <TabsContent value="review" className="space-y-6 pt-2">
                        <div className="space-y-0">
                          <h3 className="flex items-center text-lg font-medium">
                            <Clipboard className="mr-2 h-5 w-5 text-primary" />
                            Review Your Application
                          </h3>

                          <div className="flex flex-col gap-1">
                            {/* Tenant Information Summary */}
                            <Card className="border-none shadow-none">
                              <CardHeader className="px-0 pb-2">
                                <CardTitle className="flex items-center text-base">
                                  <Users className="mr-2 h-4 w-4" />
                                  Tenant Information
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="grid grid-cols-2 gap-3 px-0 text-sm">
                                <div>
                                  <p className="font-medium">Business Name</p>
                                  <p className="text-slate-600">
                                    {currentUser?.businessName ||
                                      "Not provided"}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-medium">Business Type</p>
                                  <p className="text-slate-600">
                                    {currentUser?.businessType ||
                                      "Not provided"}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-medium">Contact Name</p>
                                  <p className="text-slate-600">
                                    {currentUser?.firstName}{" "}
                                    {currentUser?.lastName}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-medium">Contact Email</p>
                                  <p className="text-slate-600">
                                    {currentUser?.email}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Unit Information Summary */}
                            <Card className="border-none shadow-none">
                              <CardHeader className="px-0 pb-2">
                                <CardTitle className="flex items-center text-base">
                                  <Building2 className="mr-2 h-4 w-4" />
                                  Unit Information
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="grid grid-cols-2 gap-3 px-0 text-sm">
                                <div>
                                  <p className="font-medium">Building</p>
                                  <p className="text-slate-600">
                                    {building.name}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-medium">Unit</p>
                                  <p className="text-slate-600">
                                    {unit.unitNumber}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-medium">Size</p>
                                  <p className="text-slate-600">
                                    {unit.sizeSqFt} sq ft
                                  </p>
                                </div>
                                <div>
                                  <p className="font-medium">Type</p>
                                  <p className="text-slate-600">{unit.type}</p>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Lease Terms Summary */}
                            <Card className="border-none shadow-none">
                              <CardHeader className="px-0 pb-2">
                                <CardTitle className="flex items-center text-base">
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Lease Terms
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="grid grid-cols-2 gap-3 px-0 text-sm">
                                <div>
                                  <p className="font-medium">Move-In Date</p>
                                  <p className="text-slate-600">
                                    {form.watch("moveInDate")
                                      ? new Date(
                                          form.watch("moveInDate"),
                                        ).toLocaleDateString()
                                      : "Not provided"}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-medium">Lease Duration</p>
                                  <p className="text-slate-600">
                                    {form.watch("leaseDuration") ||
                                      "Not provided"}{" "}
                                    months
                                  </p>
                                </div>
                                <div className="col-span-2">
                                  <p className="font-medium">
                                    Special Requirements
                                  </p>
                                  <p className="text-slate-600">
                                    {form.watch("specialRequirements") ||
                                      "None specified"}
                                  </p>
                                </div>
                                <div className="col-span-2">
                                  <p className="font-medium">
                                    Additional Notes
                                  </p>
                                  <p className="text-slate-600">
                                    {form.watch("additionalNotes") ||
                                      "None specified"}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Financial Summary */}
                            <Card className="border-none shadow-none">
                              <CardHeader className="px-0 pb-2">
                                <CardTitle className="flex items-center text-base">
                                  <DollarSign className="mr-2 h-4 w-4" />
                                  Financial Summary
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3 rounded-lg bg-primary pt-4 text-sm text-white">
                                <div className="flex items-center justify-between">
                                  <span>Monthly Rent</span>
                                  <span className="font-medium">
                                    {formatCurrency(unit.monthlyRent)}
                                  </span>
                                </div>

                                <Separator />
                                <div className="flex items-center justify-between font-medium">
                                  <span>Total Monthly</span>
                                  <span className="text-primary">
                                    {formatCurrency(calculateMonthlyCost())}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Security Deposit</span>
                                  <span className="font-medium">
                                    {formatCurrency(unit.monthlyRent)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between font-medium">
                                  <span>Due at Signing</span>
                                  <span className="text-primary">
                                    {formatCurrency(
                                      unit.monthlyRent + calculateMonthlyCost(),
                                    )}
                                  </span>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Last components */}
                            <section className="mt-6">
                              {/* Request Tour */}
                              {form.watch("requestTour") && (
                                <div className="rounded border border-amber-200 bg-amber-50 p-4 text-amber-800">
                                  <div className="flex items-center">
                                    <Star className="mr-2 h-5 w-5 text-amber-500" />
                                    <p className="font-medium">
                                      In-Person Tour Requested
                                    </p>
                                  </div>
                                  <p className="mt-1 text-sm">
                                    A property manager will contact you within
                                    1-2 business days to schedule your tour.
                                  </p>
                                </div>
                              )}

                              {/* Terms and Conditions */}
                              <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <div className="flex items-start space-x-3">
                                  <Checkbox
                                    onCheckedChange={(checked) => {
                                      infoToast(
                                        JSON.stringify(
                                          { form: form.getValues(), checked },
                                          null,
                                          2,
                                        ),
                                      );

                                      form.setValue(
                                        "agreeToTerms",
                                        checked ? true : false,
                                      );
                                    }}
                                    checked={form.watch("agreeToTerms")}
                                    id="agreeToTerms"
                                  />

                                  <Label
                                    htmlFor="agreeToTerms"
                                    className="text-sm"
                                  >
                                    I confirm that all information provided is
                                    accurate and complete. I understand that
                                    providing false information may result in
                                    the rejection of my application or
                                    termination of my lease. I authorize the
                                    property management to verify all
                                    information provided and conduct background
                                    and credit checks as necessary.
                                  </Label>
                                </div>
                                {form.formState.errors.agreeToTerms && (
                                  <p className="ml-6 mt-2 text-xs text-red-500">
                                    {form.formState.errors.agreeToTerms.message}
                                  </p>
                                )}
                              </div>
                            </section>
                          </div>
                        </div>
                      </TabsContent>
                    </CardContent>

                    <CardFooter className="flex justify-between px-2 py-6">
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
                        >
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
                        >
                          Continue
                        </Button>
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <Button
                                  type="submit"
                                  className="bg-primary"
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting
                                    ? "Submitting..."
                                    : "Submit Application"}
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
