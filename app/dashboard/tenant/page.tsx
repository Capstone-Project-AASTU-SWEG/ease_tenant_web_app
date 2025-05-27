"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import PageWrapper from "@/components/custom/page-wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  CreditCard,
  Edit,
  FileText,
  Home,
  Loader,
  Plus,
  PenToolIcon as Tool,
  Wrench,
  Search,
  MapPin,
  Users,
  Square,
  ImageIcon,
  UserCog,
} from "lucide-react";

import Stack from "@/components/custom/stack";
import { Group } from "@/components/custom/group";
import PageHeader from "@/components/custom/page-header";
import {
  useAuth,
  type UserDetail,
  useVerifyUserQuery,
} from "@/app/quries/useAuth";
import { PageLoader } from "@/components/custom/page-loader";
import { PageError } from "@/components/custom/page-error";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { genUUID, getFullFileURL } from "@/utils";
import { warningToast } from "@/components/custom/toasts";
import type { MaintenanceRequest, RentalApplication, Unit } from "@/types";
import { formatDate } from "../applications/_utils";
import ChapaPayment from "@/components/custom/chapa/chapa-payment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Helper function to calculate lease progress
const calculateLeaseProgress = (userData: UserDetail) => {
  const application = userData?.application as RentalApplication;
  if (!application?.leaseDetails) {
    return { progress: 0, daysRemaining: 0, status: "no-lease" };
  }

  const startDate = new Date(application.leaseDetails.requestedStartDate);
  const durationMonths = application.leaseDetails.requestedDuration;
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + durationMonths);

  const currentDate = new Date();
  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  // If lease hasn't started yet
  if (currentDate < startDate) {
    const daysUntilStart = Math.ceil(
      (startDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    return {
      progress: 0,
      daysRemaining: totalDays,
      status: "not-started",
      daysUntilStart,
    };
  }

  // If lease has ended
  if (currentDate > endDate) {
    return {
      progress: 100,
      daysRemaining: 0,
      status: "ended",
    };
  }

  // Active lease
  const daysPassed = Math.ceil(
    (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const progress = Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100);
  const daysRemaining = Math.max(totalDays - daysPassed, 0);

  return {
    progress: Math.round(progress),
    daysRemaining,
    status: "active",
  };
};

// Unit Information Component
const UnitInformation = ({ userData }: { userData: UserDetail }) => {
  const application = userData.application as RentalApplication;
  const unit = application?.unit;
  const building = application?.building;

  if (!unit || !building) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="my-6"
    >
      <Card className="overflow-hidden rounded-lg border border-neutral-200/50 bg-background/70 backdrop-blur-md">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            Your Assigned Unit
          </CardTitle>
          <CardDescription>
            Unit details and building information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Unit Image */}
            <div className="relative h-auto overflow-hidden rounded-lg bg-muted">
              {unit.images && unit.images.length > 0 ? (
                <Image
                  src={
                    getFullFileURL(unit.images[0]) ||
                    "/placeholder.svg?height=200&width=300" ||
                    "/placeholder.svg"
                  }
                  alt={`Unit ${unit.unitNumber}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div className="absolute bottom-2 left-2">
                <Badge>Unit {unit.unitNumber}</Badge>
              </div>
            </div>

            {/* Unit Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Unit Number
                  </p>
                  <p className="text-lg font-semibold">{unit.unitNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Type
                  </p>
                  <p className="text-lg font-semibold">{unit.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Size
                  </p>
                  <p className="text-lg font-semibold">{unit.sizeSqFt} sq ft</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Floor
                  </p>
                  <p className="text-lg font-semibold">
                    Floor {unit.floorNumber}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Monthly Rent
                </p>
                <p className="text-2xl font-bold text-primary">
                  ${unit.monthlyRent}
                </p>
              </div>

              {/* Building Info */}
              <div className="rounded-lg bg-muted/50 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{building.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {building.address?.street}, {building.address?.city},{" "}
                    {building.address?.country}
                  </span>
                </div>
              </div>

              {/* Unit Amenities */}
              {unit.amenities && unit.amenities.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    Unit Amenities
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {unit.amenities.slice(0, 4).map((amenity, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {unit.amenities.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{unit.amenities.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Application Status Component
const ApplicationStatus = ({ userData }: { userData: UserDetail }) => {
  const application = userData.application as RentalApplication;

  if (!application) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600";
      case "pending":
        return "text-amber-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-amber-600" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="mb-6"
    >
      <Card className="overflow-hidden rounded-lg border border-neutral-200/50 bg-background/70 backdrop-blur-md">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(application.status)}
            Application Status
          </CardTitle>
          <CardDescription>Your rental application details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Status</span>
              <Badge
                variant={"secondary"}
                className={`capitalize ${getStatusColor(application.status)}`}
              >
                {application.status}
              </Badge>
            </div>

            {application.leaseDetails && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Requested Start Date</p>
                  <p className="font-medium">
                    {new Date(
                      application.leaseDetails.requestedStartDate,
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {application.leaseDetails.requestedDuration} months
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Employees</p>
                  <p className="font-medium">
                    {application.leaseDetails.numberOfEmployees}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Priority</p>
                  <Badge variant="outline" className="text-xs capitalize">
                    {application.priority}
                  </Badge>
                </div>
              </div>
            )}

            {application.leaseDetails?.specialRequirements && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Special Requirements
                </p>
                <p className="mt-1 rounded bg-muted/50 p-2 text-sm">
                  {application.leaseDetails.specialRequirements}
                </p>
              </div>
            )}

            {application.assignedTo && (
              <div className="flex items-center gap-2 rounded bg-muted/50 p-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Assigned to: {application.assignedTo.firstName}{" "}
                  {application.assignedTo.lastName}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ===== MAIN PAGE COMPONENT =====
const Page = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const verifyUserQuery = useVerifyUserQuery();
  const router = useRouter();
  const { isManager } = useAuth();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [tx, setTx] = useState(() => {
    return genUUID("tx-");
  });

  if (isManager) {
    router.push("/dashboard/buildings");
  }

  if (verifyUserQuery.isLoading) {
    return (
      <PageLoader variant="minimal" isLoading={true} loaderVariant={"dots"} />
    );
  }

  if (verifyUserQuery.isError) {
    return (
      <PageError
        variant="generic"
        message={verifyUserQuery.error.message}
        fullPage
        size="xl"
      />
    );
  }

  const userData = verifyUserQuery.data;

  const userUnit = userData?.unit;

  const maintenanceRequests = userData?.maintenanceRequests || [];

  // Check if user has a unit assigned
  const hasUnit = !!userData?.tenant?.unit;
  const hasApplication = userData?.application !== null;

  const handleSuccessfulPayment = () => {};

  return (
    <PageWrapper className="relative py-0">
      {/* Dashboard Header with Title and Actions */}
      {userData && (
        <PageHeader
          title="Tenant Dashboard"
          description="Manage your commercial space and services"
          rightSection={<TenantProfileSummary userData={userData} />}
        />
      )}

      {hasUnit && (
        <>
          {/* Building overview and quick actions cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 grid gap-6 md:grid-cols-3"
          >
            {/* Tenant Overview Card */}
            <Card className="overflow-hidden rounded-lg border border-neutral-200/50 bg-background/70 backdrop-blur-md transition-all duration-300 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Tenant Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {/* Dynamic Lease Progress indicator */}
                  {(() => {
                    const leaseProgress = calculateLeaseProgress(userData);
                    const progressColor =
                      leaseProgress.status === "ended"
                        ? "text-amber-600"
                        : leaseProgress.status === "not-started"
                          ? "text-gray-600"
                          : "text-green-600";
                    const barColor =
                      leaseProgress.status === "ended"
                        ? "bg-amber-500"
                        : leaseProgress.status === "not-started"
                          ? "bg-gray-400"
                          : "bg-green-500";

                    return (
                      <>
                        <div className="flex items-center justify-between text-sm">
                          <span>Lease Progress</span>
                          <span className={`font-medium ${progressColor}`}>
                            {leaseProgress.status === "not-started"
                              ? "Not Started"
                              : leaseProgress.status === "ended"
                                ? "Ended"
                                : `${leaseProgress.progress}%`}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${leaseProgress.progress}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className={`h-full ${barColor}`}
                          />
                        </div>
                      </>
                    );
                  })()}

                  {/* Tenant statistics */}
                  <div className="mt-4 grid gap-4">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center gap-2"
                    >
                      <div className="rounded-full bg-primary/10 p-1.5">
                        <Home className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Active</span> Lease Status
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center gap-2"
                    >
                      <div className="rounded-full bg-blue-500/10 p-1.5">
                        <Square className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">
                          {(userData?.application as RentalApplication)?.unit
                            ?.sizeSqFt || 0}{" "}
                          sq ft
                        </span>{" "}
                        Unit Size
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-center gap-2"
                    >
                      <div className="rounded-full bg-green-500/10 p-1.5">
                        <CircleDollarSign className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">$0.00</span> Current
                        Balance
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                      className="flex items-center gap-2"
                    >
                      <div className="rounded-full bg-amber-500/10 p-1.5">
                        <Tool className="h-4 w-4 text-amber-500" />
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">
                          {maintenanceRequests.length} Open
                        </span>{" "}
                        Maintenance Request
                        {maintenanceRequests.length !== 1 ? "s" : ""}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="overflow-hidden rounded-lg border border-neutral-200/50 bg-background/70 backdrop-blur-md transition-all duration-300 hover:shadow-md md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 lg:grid-cols-3">
                  <QuickActionButton
                    icon={<CreditCard className="h-5 w-5" />}
                    label="Pay Rent"
                    variant="default"
                    onClick={() => {
                      setIsPaymentOpen(true);
                    }}
                    index={0}
                  />

                  <QuickActionButton
                    icon={<UserCog className="h-5 w-5" />}
                    label="Request Maintenance"
                    variant="outline"
                    onClick={() => {
                      const unitId = userUnit?.id;

                      if (!unitId) {
                        warningToast("We don't find unit info, try again.");
                      }

                      router.push(
                        "/dashboard/maintenance/new?unitId=" + unitId,
                      );
                    }}
                    index={1}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}

      {/* Show Application Status */}
      {!hasUnit && hasApplication && userData && (
        <ApplicationStatus userData={userData} />
      )}

      {/* Main Content Tabs */}
      {hasUnit && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6"
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="relative z-10"
          >
            <TabsList className="rounded-full bg-background/50 backdrop-blur-sm">
              <TabsTrigger
                value="overview"
                className="rounded-full px-5 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="maintenance"
                className="rounded-full px-5 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                Maintenance
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Overview Tab Content */}
                <TabsContent value="overview" className="mt-4">
                  {userData && <LeaseInformation userData={userData} />}
                </TabsContent>

                {/* Maintenance Tab Content */}
                <TabsContent value="maintenance" className="mt-4">
                  {userUnit ? (
                    <MaintenanceRequests
                      unit={userUnit}
                      maintenanceRequests={maintenanceRequests}
                    />
                  ) : (
                    <section className="rounded-lg bg-red-100 p-4">
                      <p>Unit Info not found</p>
                    </section>
                  )}
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      )}

      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogHeader>
          <DialogTitle />
        </DialogHeader>

        <DialogContent>
          {userData?.unit && (
            <ChapaPayment
              amount={userData?.unit?.monthlyRent}
              currency="ETB"
              onClose={() => {}}
              txRef={tx}
              onSuccessfulPayment={() => {
                handleSuccessfulPayment();
              }}
              setNewTxRef={() => {
                setTx(genUUID("tx-"));
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Show Unit Information if unit is assigned */}
      {hasUnit && userData && <UnitInformation userData={userData} />}

      {/* Show different content based on tenant status */}
      {!hasUnit && !hasApplication && (
        <NoApplicationStatus userData={userData} />
      )}
    </PageWrapper>
  );
};

// Component for no application status
const NoApplicationStatus = ({ userData }: { userData: UserDetail }) => {
  console.log({ userData });
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mt-6"
    >
      <Card className="border-none shadow-none">
        <CardContent className="px-0">
          <div className="rounded-lg bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-primary">
                  No Units Currently Assigned
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {"You're"} registered as a tenant in our system, but you{" "}
                  {"don't"} have any commercial spaces assigned yet. Browse our
                  available units and submit an application to get started.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button className="rounded-full" asChild>
                    <Link href="/dashboard/buildings">
                      <Search className="mr-2 h-4 w-4" />
                      Browse Available Units
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Helper component for Quick Action buttons
const QuickActionButton = ({
  icon,
  label,
  variant = "outline",
  onClick,
  index = 0,
}: {
  icon: React.ReactNode;
  label: string;
  variant?: "default" | "outline";
  onClick?: () => void;
  index?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
    >
      <Button
        variant={variant}
        className={`h-auto w-full flex-col items-center justify-center gap-2 rounded-md py-4 ${
          variant === "outline"
            ? "border-neutral-200/50 bg-background/60 backdrop-blur-sm hover:bg-primary/10"
            : "bg-primary hover:bg-primary/90"
        }`}
        onClick={onClick}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </motion.div>
  );
};

// Tenant Profile Summary for the header
const TenantProfileSummary = ({ userData }: { userData: UserDetail }) => {
  if (!userData || !userData.user) {
    return <Loader className="h-5 w-5" />;
  }

  const { user, tenant } = userData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex items-center gap-3 rounded-full border border-neutral-200/30 bg-background/70 px-1.5 py-1.5 pr-3 backdrop-blur-lg"
    >
      <Avatar className="h-8 w-8 border border-primary/10">
        <AvatarImage src="/placeholder.svg?height=32&width=32" />
        <AvatarFallback className="uppercase">
          {user.firstName.at(0)}
          {user.lastName.at(0)}
        </AvatarFallback>
      </Avatar>
      <div className="hidden md:block">
        <p className="text-sm font-medium">
          {tenant?.businessName || `${user.firstName} ${user.lastName}`}
        </p>
        <p className="text-xs text-muted-foreground">
          {tenant?.businessType || "USER ROLE"}
        </p>
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="ml-1 h-7 w-7 rounded-full md:ml-2"
      >
        <Edit className="h-3.5 w-3.5" />
      </Button>
    </motion.div>
  );
};

// ===== COMPONENT: Lease Information =====
const LeaseInformation = ({ userData }: { userData: UserDetail }) => {
  const application = userData.application as RentalApplication;
  const unit = application?.unit;

  return (
    <Card className="overflow-hidden rounded-lg border border-neutral-200/50 bg-background/70 backdrop-blur-md transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <Group justify={"between"}>
          <Stack spacing={"xs"}>
            <CardTitle className="text-base">Lease Information</CardTitle>
            <CardDescription>
              Details about your current lease agreement
            </CardDescription>
          </Stack>

          <Button
            size="sm"
            variant="outline"
            className="rounded-full border-neutral-200/50 bg-background/60 backdrop-blur-sm hover:bg-background/80"
          >
            <FileText className="mr-2 h-4 w-4" />
            View Lease
          </Button>
        </Group>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="space-y-1"
          >
            <p className="text-sm font-medium text-muted-foreground">
              Lease Duration
            </p>
            <p>{application?.leaseDetails?.requestedDuration || 0} months</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="space-y-1"
          >
            <p className="text-sm font-medium text-muted-foreground">
              Monthly Rent
            </p>
            <p>${unit?.monthlyRent || 0}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="space-y-1"
          >
            <p className="text-sm font-medium text-muted-foreground">Space</p>
            <p>
              Unit {unit?.unitNumber || "N/A"} ({unit?.sizeSqFt || 0} sq ft)
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="space-y-1"
          >
            <p className="text-sm font-medium text-muted-foreground">
              Start Date
            </p>
            <p>
              {application?.leaseDetails?.requestedStartDate
                ? new Date(
                    application.leaseDetails.requestedStartDate,
                  ).toLocaleDateString()
                : "TBD"}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="space-y-1"
          >
            <p className="text-sm font-medium text-muted-foreground">
              Employees
            </p>
            <p>{application?.leaseDetails?.numberOfEmployees || 0}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="space-y-1"
          >
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <Badge variant="outline" className="capitalize">
              {application?.status || "pending"}
            </Badge>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

// ===== COMPONENT: Maintenance Requests =====
const MaintenanceRequests = ({
  unit,
  maintenanceRequests,
}: {
  unit: Unit;
  maintenanceRequests: MaintenanceRequest[];
}) => {
  const router = useRouter();

  return (
    <Card className="overflow-hidden rounded-lg border border-neutral-200/50 bg-background/70 backdrop-blur-md transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Maintenance Requests</CardTitle>
            <CardDescription>
              Track the status of your maintenance tickets
            </CardDescription>
          </div>
          <Button
            className="rounded-full"
            onClick={() => {
              const unitId = unit?.id;

              if (!unitId) {
                warningToast("We don't find unit info, try again.");
              }

              router.push("/dashboard/maintenance/new?unitId=" + unitId);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {maintenanceRequests.map((request, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              className="rounded-lg border p-4 transition-all duration-200 hover:border-primary/20 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{request.id}</span>
                </div>
                <Badge>{request.status}</Badge>
              </div>
              <h4 className="mt-2 text-base font-semibold">
                {request.description}
              </h4>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Unit Number</p>
                  <p> {unit.unitNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Submitted</p>
                  <p>{formatDate(request.createdAt)}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-neutral-200/50 bg-background/60 backdrop-blur-sm hover:bg-background/80"
                >
                  View Details
                </Button>
                {request.status !== "Completed" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-neutral-200/50 bg-background/60 backdrop-blur-sm hover:bg-background/80"
                  >
                    Update
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Page;
