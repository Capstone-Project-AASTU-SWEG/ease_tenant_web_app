"use client";

import type React from "react";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Download,
  FileText,
  Calendar,
  DollarSign,
  User,
  Clock,
  AlertCircle,
  Send,
  MoreHorizontal,
  Printer,
  Building,
  Briefcase,
  ChevronRight,
  CheckCircle2,
  Shield,
  CreditCard,
  ArrowRight,
  FileSignature,
  Home,
  Tag,
  Layers,
  Landmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PageWrapper from "@/components/custom/page-wrapper";
import PageHeader from "@/components/custom/page-header";
import { getLastDateAfterMonth } from "@/utils";
import { useGetLeaseQuery } from "@/app/quries/useLeases";
import { PageLoader } from "@/components/custom/page-loader";
import { PageError } from "@/components/custom/page-error";
import type { Lease, RentalApplication, Tenant, Unit } from "@/types";
import type { LeaseTemplate } from "../_schema";
import { formatDateTime } from "../../applications/_utils";
import LeasePreviewMinimal from "@/components/custom/lease-preview";
import { generateLeaseDataValues } from "@/utils/lease-data-mapper";
import ENV from "@/config/env";

export default function LeaseDetailsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "details" | "document" | "payments"
  >("details");

  const params = useParams();
  const leaseId = params["id"] as string;
  const getLeaseQuery = useGetLeaseQuery(leaseId);

  // Using the provided lease data
  const lease = getLeaseQuery.data as Lease & {
    tenant: Tenant;
    unit: Unit;
    application: RentalApplication;
    leaseTemplate: LeaseTemplate;
  };

  if (getLeaseQuery.isPending) {
    return <PageLoader isLoading={true} text="Getting lease detail..." />;
  }

  if (getLeaseQuery.isError) {
    return <PageError description={getLeaseQuery.error.message} fullPage />;
  }

  if (!lease) {
    return null;
  }

  // Get status badge for lease
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return (
          <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Active
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:from-amber-500 hover:to-amber-600">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:from-rose-600 hover:to-rose-700">
            <AlertCircle className="mr-1 h-3 w-3" /> Expired
          </Badge>
        );
      case "terminated":
        return (
          <Badge className="bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:from-rose-600 hover:to-rose-700">
            <AlertCircle className="mr-1 h-3 w-3" /> Terminated
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Handle downloading the contract
  const handleDownloadContract = async () => {
    console.log("Downloading contract:", lease.contractFile);
    const filePath = `${ENV.NEXT_PUBLIC_BACKEND_BASE_URL}/${lease.contractFile}`;
    window.open(
      filePath,
      "contractWindow",
      "width=800,height=600,scrollbars=yes",
    );
  };

  // Handle printing the lease
  const handlePrintLease = () => {
    window.print();
  };

  // Handle sending a reminder
  const handleSendReminder = () => {
    console.log("Sending reminder for lease:", lease.id);
    // Implement API call to send reminder
  };

  const leaseEndDate = getLastDateAfterMonth(
    lease.application.leaseDetails.requestedStartDate.toString(),
    lease.application.leaseDetails.requestedDuration,
  );

  // Check if lease is expiring soon (within 30 days)
  const isExpiringSoon = () => {
    const today = new Date();
    const daysUntilExpiration = Math.ceil(
      (leaseEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysUntilExpiration <= 30 && daysUntilExpiration > 0;
  };

  // Calculate days remaining in lease
  const getDaysRemaining = () => {
    const today = new Date();
    return Math.max(
      0,
      Math.ceil(
        (leaseEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      ),
    );
  };

  // Calculate lease progress percentage
  const getLeaseProgressPercentage = () => {
    const startDate = new Date(
      lease.application.leaseDetails.requestedStartDate.toString(),
    );
    const totalDuration = leaseEndDate.getTime() - startDate.getTime();
    const elapsed = new Date().getTime() - startDate.getTime();
    return Math.min(
      100,
      Math.max(0, Math.floor((elapsed / totalDuration) * 100)),
    );
  };

  const daysRemaining = getDaysRemaining();
  const leaseProgress = getLeaseProgressPercentage();

  return (
    <PageWrapper className="py-0">
      <div className="mb-6 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 p-6 shadow-sm">
        <PageHeader
          title="Lease Detail"
          description={`Lease agreement for ${lease.tenant.userId?.firstName} ${lease.tenant.userId?.lastName}`}
          withBackButton
          rightSection={
            <div className="flex items-center gap-2">
              {getStatusBadge(lease.status)}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-white shadow-sm"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem
                    onClick={handleDownloadContract}
                    className="cursor-pointer"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Contract
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handlePrintLease}
                    className="cursor-pointer"
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Print Lease
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSendReminder}
                    className="cursor-pointer"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send Reminder
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push(`/leases/${lease.id}/renew`)}
                    className="cursor-pointer"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Renew Lease
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-destructive">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Terminate Lease
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          }
        />
      </div>

      <main className="space-y-6">
        {isExpiringSoon() && (
          <Alert className="border-b-0 border-l-4 border-r-0 border-t-0 border-l-amber-500 bg-gradient-to-r from-amber-50 to-amber-100/50 shadow-sm">
            <AlertDescription className="flex items-center text-amber-800">
              <Clock className="mr-2 h-4 w-4" />
              This lease is expiring in {daysRemaining} days. Consider
              initiating a renewal process soon.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <Card className="overflow-hidden border-0 md:col-span-4 lg:col-span-3">
            <CardHeader className="bg-gradient-to-r from-primary to-primary/90 pb-6 pt-6 text-white">
              <div className="flex flex-col items-center text-center">
                <Avatar className="mb-3 h-16 w-16 border-4 border-white/20 shadow-md">
                  <AvatarFallback className="bg-white/10 text-white">
                    {lease.tenant.userId?.firstName.charAt(0)}
                    {lease.tenant.userId?.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">
                  {lease.tenant.userId?.firstName}{" "}
                  {lease.tenant.userId?.lastName}
                </CardTitle>
                <CardDescription className="text-white/70">
                  {lease.tenant.businessName}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-b px-5 py-4">
                <h3 className="mb-2 text-sm font-medium text-primary">
                  Contact Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium">
                        {lease.tenant.userId?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-medium">
                        {lease.tenant.userId?.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-b px-5 py-4">
                <h3 className="mb-2 text-sm font-medium text-primary">
                  Business Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">
                        Business Type
                      </p>
                      <p className="font-medium capitalize">
                        {lease.tenant.businessType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Landmark className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Tax ID</p>
                      <p className="font-medium">{lease.tenant.taxId}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-5 py-4">
                <h3 className="mb-2 text-sm font-medium text-primary">
                  Lease Status
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Lease Progress
                      </span>
                      <span className="font-medium">{leaseProgress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/80"
                        style={{ width: `${leaseProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-muted/30 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Days Remaining
                      </span>
                      <span className="font-medium">{daysRemaining} days</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6 md:col-span-8 lg:col-span-9">
            <Card className="overflow-hidden border-0 shadow-sm">
              <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/10 pb-4 pt-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-base">
                    <Building className="mr-2 h-4 w-4 text-primary" />
                    Unit {lease.unit.unitNumber} • {lease.unit.type}
                  </CardTitle>
                  <Badge variant="outline" className="bg-white">
                    Floor {lease.unit.floorNumber} • {lease.unit.sizeSqFt} sq ft
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 p-4">
                    <div className="mb-1 flex items-center text-xs text-muted-foreground">
                      <Calendar className="mr-1 h-3.5 w-3.5 text-primary" />
                      Lease Start Date
                    </div>
                    <p className="font-medium">
                      {formatDateTime(
                        lease.application.leaseDetails.requestedStartDate?.toString(),
                      )}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 p-4">
                    <div className="mb-1 flex items-center text-xs text-muted-foreground">
                      <Calendar className="mr-1 h-3.5 w-3.5 text-primary" />
                      Lease End Date
                    </div>
                    <p className="font-medium">
                      {formatDateTime(leaseEndDate.toString())}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 p-4">
                    <div className="mb-1 flex items-center text-xs text-muted-foreground">
                      <DollarSign className="mr-1 h-3.5 w-3.5 text-primary" />
                      Monthly Rent
                    </div>
                    <p className="text-lg font-medium">
                      ${lease.unit.monthlyRent}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs
              defaultValue="details"
              value={activeTab}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onValueChange={(value) => setActiveTab(value as any)}
              className="w-full"
            >
              <TabsList className="grid w-full max-w-md grid-cols-3 rounded-full bg-muted p-1">
                <TabsTrigger value="details" className="rounded-full">
                  <Home className="mr-2 h-4 w-4" />
                  Details
                </TabsTrigger>
                <TabsTrigger value="document" className="rounded-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Document
                </TabsTrigger>
                <TabsTrigger value="payments" className="rounded-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payments
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-6 space-y-6">
                <Card className="overflow-hidden border-0 shadow-sm">
                  <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/10 pb-4 pt-4">
                    <CardTitle className="flex items-center text-base">
                      <Building className="mr-2 h-4 w-4 text-primary" />
                      Unit Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <h4 className="mb-3 flex items-center text-sm font-medium text-primary">
                          <ChevronRight className="mr-1 h-4 w-4" />
                          Unit Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2">
                            <span className="text-muted-foreground">Size</span>
                            <span className="font-medium">
                              {lease.unit.sizeSqFt} sq ft
                            </span>
                          </div>
                          <div className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2">
                            <span className="text-muted-foreground">Type</span>
                            <span className="font-medium">
                              {lease.unit.type}
                            </span>
                          </div>
                          <div className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2">
                            <span className="text-muted-foreground">Floor</span>
                            <span className="font-medium">
                              {lease.unit.floorNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="mb-3 flex items-center text-sm font-medium text-primary">
                          <ChevronRight className="mr-1 h-4 w-4" />
                          Amenities
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {lease.unit.amenities.map((amenity, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="border-primary/20 bg-primary/5 py-1 text-xs"
                            >
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-0 shadow-sm">
                  <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/10 pb-4 pt-4">
                    <CardTitle className="flex items-center text-base">
                      <Briefcase className="mr-2 h-4 w-4 text-primary" />
                      Business Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2">
                          <span className="text-muted-foreground">
                            Business Name
                          </span>
                          <span className="font-medium">
                            {lease.tenant.businessName}
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2">
                          <span className="text-muted-foreground">
                            Business Type
                          </span>
                          <span className="font-medium capitalize">
                            {lease.tenant.businessType}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2">
                          <span className="text-muted-foreground">Tax ID</span>
                          <span className="font-medium">
                            {lease.tenant.taxId}
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2">
                          <span className="text-muted-foreground">
                            Registration #
                          </span>
                          <span className="font-medium">
                            {lease.tenant.businessRegistrationNumber}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="document" className="mt-6">
                <Card className="overflow-hidden border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b bg-gradient-to-r from-primary/5 to-primary/10 pb-4 pt-4">
                    <CardTitle className="flex items-center text-base">
                      <FileSignature className="mr-2 h-4 w-4 text-primary" />
                      Lease Agreement
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrintLease}
                        className="rounded-full bg-white shadow-sm"
                      >
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadContract}
                        className="rounded-full bg-white shadow-sm"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5">
                    <div className="overflow-hidden rounded-lg border shadow-sm">
                      <LeasePreviewMinimal
                        leaseTitle={lease.templateId}
                        leaseDescription={lease.leaseTemplate.description}
                        sections={lease.leaseTemplate.sections}
                        dataValues={generateLeaseDataValues(lease.application)}
                        maxHeight={600}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payments" className="mt-6">
                <Card className="overflow-hidden border-0 shadow-sm">
                  <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/10 pb-4 pt-4">
                    <CardTitle className="flex items-center text-base">
                      <CreditCard className="mr-2 h-4 w-4 text-primary" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 p-4">
                        <div className="mb-1 flex items-center text-xs text-muted-foreground">
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-green-500" />
                          Payment Status
                        </div>
                        <p className="font-medium text-green-700">Up to date</p>
                      </div>
                      <div className="rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 p-4">
                        <div className="mb-1 flex items-center text-xs text-muted-foreground">
                          <Calendar className="mr-1 h-3.5 w-3.5 text-primary" />
                          Next Payment Due
                        </div>
                        <p className="font-medium">June 1, 2025</p>
                      </div>
                      <div className="rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 p-4">
                        <div className="mb-1 flex items-center text-xs text-muted-foreground">
                          <DollarSign className="mr-1 h-3.5 w-3.5 text-primary" />
                          Amount Due
                        </div>
                        <p className="text-lg font-medium">
                          ${lease.unit.monthlyRent}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="mb-3 text-sm font-medium">
                        Recent Payments
                      </h3>
                      <div className="rounded-lg border">
                        <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2 text-xs font-medium text-muted-foreground">
                          <span>Date</span>
                          <span>Amount</span>
                          <span>Status</span>
                        </div>
                        <div className="divide-y">
                          <div className="flex items-center justify-between px-4 py-3">
                            <span className="text-sm">May 1, 2025</span>
                            <span className="text-sm font-medium">
                              ${lease.unit.monthlyRent}
                            </span>
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700"
                            >
                              Paid
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between px-4 py-3">
                            <span className="text-sm">Apr 1, 2025</span>
                            <span className="text-sm font-medium">
                              ${lease.unit.monthlyRent}
                            </span>
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700"
                            >
                              Paid
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between px-4 py-3">
                            <span className="text-sm">Mar 1, 2025</span>
                            <span className="text-sm font-medium">
                              ${lease.unit.monthlyRent}
                            </span>
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700"
                            >
                              Paid
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button className="rounded-full">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Make a Payment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="overflow-hidden border-0 shadow-sm md:col-span-1">
            <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/10 pb-4 pt-4">
              <CardTitle className="flex items-center text-base">
                <Shield className="mr-2 h-4 w-4 text-primary" />
                Security Deposit
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="flex items-center justify-between rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-xl font-medium">
                    ${lease.unit.monthlyRent}
                  </p>
                </div>
                <Badge variant="outline" className="bg-white">
                  Held in Escrow
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 shadow-sm md:col-span-2">
            <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/10 pb-4 pt-4">
              <CardTitle className="flex items-center text-base">
                <Tag className="mr-2 h-4 w-4 text-primary" />
                Key Lease Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Lease Duration
                    </p>
                    <p className="font-medium">
                      {lease.application.leaseDetails.requestedDuration} months
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Renewal Option
                    </p>
                    <p className="font-medium">Available</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Layers className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Payment Frequency
                    </p>
                    <p className="font-medium">Monthly</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <AlertCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Late Fee</p>
                    <p className="font-medium">5% after 5 days</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </PageWrapper>
  );
}

// Phone icon component
function Phone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
