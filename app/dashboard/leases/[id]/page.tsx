"use client";

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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
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
  const [activeTab, setActiveTab] = useState<"details" | "document">("details");

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
          <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">
            Active
          </Badge>
        );
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "expired":
        return <Badge variant="destructive">Expired</Badge>;
      case "terminated":
        return <Badge variant="destructive">Terminated</Badge>;
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

  return (
    <PageWrapper className="py-0">
      <PageHeader
        title="Lease Detail"
        description="Lease detail page ***"
        withBackButton
        rightSection={
          <div className="flex items-center gap-2">
            {getStatusBadge(lease.status)}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="shadow-sm">
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

      <main className="space-y-6">
        {isExpiringSoon() && (
          <Alert className="border-amber-200 bg-amber-50 shadow-sm">
            <AlertDescription className="flex items-center text-amber-800">
              <Clock className="mr-2 h-4 w-4" />
              This lease is expiring soon. Consider initiating a renewal.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="overflow-hidden border-0 shadow-md">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-2">
              <CardTitle className="flex items-center text-base">
                <User className="mr-2 h-4 w-4 text-primary" />
                Tenant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="mb-4 flex items-center space-x-3">
                <Avatar className="h-12 w-12 border-2 border-primary/10">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                    {lease.tenant.userId?.firstName.charAt(0)}
                    {lease.tenant.userId?.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {lease.tenant.userId?.firstName}{" "}
                    {lease.tenant.userId?.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {lease.tenant.businessName}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2">
                  <span className="text-muted-foreground">Email</span>
                  <span className="max-w-[150px] truncate font-medium">
                    {lease.tenant.userId?.email}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">
                    {lease.tenant.userId?.phone}
                  </span>
                </div>
              </div>
              <CardFooter className="px-0 pt-4">
                {/* <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-primary/20 bg-primary/5 hover:bg-primary/10"
                  onClick={() => router.push(`/dashboard/tenant`)}
                >
                  <User className="mr-2 h-4 w-4" />
                  View Tenant Profile
                </Button> */}
              </CardFooter>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 shadow-md md:col-span-2">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-2">
              <CardTitle className="flex items-center text-base">
                <Building className="mr-2 h-4 w-4 text-primary" />
                Unit {lease.unit.unitNumber} • {lease.unit.type}
              </CardTitle>
              <CardDescription>
                Floor {lease.unit.floorNumber} • {lease.unit.sizeSqFt} sq ft
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-muted/30 p-4">
                  <div className="mb-1 flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-3.5 w-3.5 text-primary" />
                    Lease Period
                  </div>
                  <p className="font-medium">
                    {formatDateTime(
                      lease.application.leaseDetails.requestedStartDate?.toString(),
                    )}{" "}
                    - {formatDateTime(leaseEndDate.toString())}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/30 p-4">
                  <div className="mb-1 flex items-center text-sm text-muted-foreground">
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
        </div>

        <Tabs
          defaultValue="details"
          value={activeTab}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onValueChange={(value) => setActiveTab(value as any)}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2 rounded-xl p-1">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="document">
              <FileText className="mr-2 h-4 w-4" />
              Document
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6 space-y-6">
            <Card className="overflow-hidden border-0 shadow-md">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-2">
                <CardTitle className="flex items-center text-base">
                  <Building className="mr-2 h-4 w-4 text-primary" />
                  Unit Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-3 flex items-center text-sm font-medium">
                      <ChevronRight className="mr-1 h-4 w-4 text-primary" />
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
                        <span className="font-medium">{lease.unit.type}</span>
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
                    <h4 className="mb-3 flex items-center text-sm font-medium">
                      <ChevronRight className="mr-1 h-4 w-4 text-primary" />
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

            <Card className="overflow-hidden border-0 shadow-md">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-2">
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
                      <span className="font-medium">{lease.tenant.taxId}</span>
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
            <Card className="overflow-hidden border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-gradient-to-r from-primary/10 to-primary/5 pb-2">
                <CardTitle className="flex items-center text-base">
                  <FileText className="mr-2 h-4 w-4 text-primary" />
                  Lease Agreement
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrintLease}
                    className="bg-white shadow-sm"
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadContract}
                    className="bg-white shadow-sm"
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
        </Tabs>
      </main>
    </PageWrapper>
  );
}
