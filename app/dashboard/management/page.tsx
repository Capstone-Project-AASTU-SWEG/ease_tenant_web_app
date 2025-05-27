"use client";
import { useAuth } from "@/app/quries/useAuth";
import { Skeleton } from "@/components/custom/loader";
import PageHeader from "@/components/custom/page-header";
import PageWrapper from "@/components/custom/page-wrapper";
import Stack from "@/components/custom/stack";
import { getFullNameFromObj } from "@/utils";

import {
  BuildingIcon,
  Home,
  PieChart,
  Plus,
  FileText,
  AlertTriangle,
  Clock,
  MoreVerticalIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BuildingFromAPI } from "@/types";
import Stat from "@/components/custom/stat";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { warningToast } from "@/components/custom/toasts";
import LogJSON from "@/components/custom/log-json";
import { useGetAllMaintenanceRequestsQuery } from "@/app/quries/useMaintenance";
import { Group } from "@/components/custom/group";
import { Title } from "@/components/custom/title";
import MapWrapper from "@/components/custom/map-location-wrapper";

const Page = () => {
  const auth = useAuth();
  const userData = auth.data;
  const building = userData?.building;
  const router = useRouter();

  return (
    <PageWrapper className="py-0">
      {/* <LogJSON
        data={{
          isManager: auth.isManager,
          isOwner: auth.isOwner,
          data: auth.data,
        }}
      /> */}
      <PageHeader
        title="Manager Dashboard"
        description={`Welcome back, ${getFullNameFromObj(userData?.user)}`}
        rightSection={
          <section>
            {/* Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVerticalIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => {
                    if (!building) {
                      warningToast("Building info not found.");
                      return;
                    }
                    router.push(`/dashboard/buildings/${building.id}`);
                  }}
                >
                  Building Detail
                </DropdownMenuItem>
                <DropdownMenuItem>Manage Tenants</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    if (!building) {
                      warningToast("Building info not found.");
                      return;
                    }
                    router.push(
                      `/dashboard/buildings/new?buildingId=${building.id}`,
                    );
                  }}
                >
                  Edit Building Detail
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </section>
        }
      />
      <section className="mt-4">
        {building ? (
          <BuildingAnalytics building={building} />
        ) : (
          <Stack>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </Stack>
        )}
      </section>
      {/* Analytics of managers building */}
    </PageWrapper>
  );
};

const BuildingAnalytics = ({ building }: { building: BuildingFromAPI }) => {
  const formattedDate = new Date(building.updatedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  const router = useRouter();

  const getAllMaintenanceRequestsQuery = useGetAllMaintenanceRequestsQuery();

  const buildingMaintenanceRequests =
    getAllMaintenanceRequestsQuery.data?.filter(
      (r) => r.unit?.buildingId === building.id,
    ) || [];

  return (
    <div className="space-y-6">
      <LogJSON
        data={{
          buildingMaintenanceRequests,
        }}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Stat
          layout="horizontal"
          title="Occupancy Rate"
          value={`${building.occupancyRate}%`}
          moreInfo="Current building occupancy"
          icon={PieChart}
        />
        <Stat
          layout="horizontal"
          title="Total Units"
          value={building.totalUnits}
          moreInfo={`${building.occupiedUnits} occupied, ${building.vacantUnits} vacant`}
          icon={Home}
        />
        <Stat
          layout="horizontal"
          title="Building Type"
          value={
            building.buildingType.charAt(0).toUpperCase() +
            building.buildingType.slice(1)
          }
          moreInfo={`${building.totalFloors} ${building.totalFloors > 1 ? "floors" : "floor"}`}
          icon={BuildingIcon}
        />

        <Stat
          layout="horizontal"
          title="Last Updated"
          value={formattedDate}
          moreInfo="Building information"
          icon={Clock}
        />
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Building Details</TabsTrigger>
          <TabsTrigger value="lease">Lease Information</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Building Information</CardTitle>
              <CardDescription>
                Detailed information about {building.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Building Type</p>
                  <p className="text-sm capitalize text-muted-foreground">
                    {building.buildingType}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Status</p>
                  <Badge
                    variant={
                      building.status === "Active" ? "default" : "secondary"
                    }
                  >
                    {building.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Total Floors</p>
                  <p className="text-sm text-muted-foreground">
                    {building.totalFloors}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Parking Spaces</p>
                  <p className="text-sm text-muted-foreground">
                    {building.parkingSpaces || "None"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Elevators</p>
                  <p className="text-sm text-muted-foreground">
                    {building.elevators || "None"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Emergency Exits</p>
                  <p className="text-sm text-muted-foreground">
                    {building.emergencyExits || "None"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Fire Safety</p>
                  <Badge
                    variant={
                      building.fireSafetyCertified ? "default" : "destructive"
                    }
                  >
                    {building.fireSafetyCertified
                      ? "Certified"
                      : "Not Certified"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Operating Hours</p>
                  <p className="text-sm text-muted-foreground">
                    {building.operatingHours || "Not specified"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="lease" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lease Terms</CardTitle>
              <CardDescription>
                Lease information for {building.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Minimum Lease Period</p>
                  <p className="text-sm text-muted-foreground">
                    {building.leaseTerms.minLeasePeriodMonths}{" "}
                    {building.leaseTerms.minLeasePeriodMonths === 1
                      ? "month"
                      : "months"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Maximum Lease Period</p>
                  <p className="text-sm text-muted-foreground">
                    {building.leaseTerms.maxLeasePeriodMonths}{" "}
                    {building.leaseTerms.maxLeasePeriodMonths === 1
                      ? "month"
                      : "months"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Payment Frequency</p>
                  <p className="text-sm capitalize text-muted-foreground">
                    {building.leaseTerms.paymentFrequency.toLowerCase()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Security Deposit</p>
                  <p className="text-sm text-muted-foreground">
                    {building.leaseTerms.securityDeposit
                      ? `$${building.leaseTerms.securityDeposit}`
                      : "None required"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Late Payment Penalty</p>
                  <p className="text-sm text-muted-foreground">
                    {building.leaseTerms.latePaymentPenalty
                      ? `$${building.leaseTerms.latePaymentPenalty}`
                      : "None"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Pet Policy</p>
                  <p className="text-sm text-muted-foreground">
                    {building.leaseTerms.petPolicy || "Not specified"}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  router.push(
                    `/dashboard/buildings/new?buildingId=${building.id}`,
                  );
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                Update Lease Terms
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="maintenance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Status</CardTitle>
              <CardDescription>
                Maintenance information for {building.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <section className="flex flex-col items-center justify-center py-6 text-center">
                  <AlertTriangle className="mb-4 h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-medium">
                    No active maintenance requests
                  </h3>
                  <p className="mb-4 mt-1 text-sm text-muted-foreground">
                    There are currently no active maintenance requests for this
                    building.
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Maintenance Request
                  </Button>
                </section>
                <Stack>
                  {buildingMaintenanceRequests.length > 0 ? (
                    buildingMaintenanceRequests.map((mr) => (
                      <Group
                        key={mr.id}
                        justify={"between"}
                        className="rounded-md bg-primary/5 p-2"
                      >
                        <p>{mr.description}</p>
                        <Badge>{mr.status}</Badge>
                      </Group>
                    ))
                  ) : (
                    <section className="rounded-md bg-primary/5 p-4">
                      <Title size={"h5"}>
                        No maintenace requests found yet.
                      </Title>
                    </section>
                  )}
                </Stack>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <section className="">
        <Card className="overflow-hidden bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <CardTitle>Building Address</CardTitle>
            <CardDescription>Location information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <section>
              <MapWrapper
                position={[
                  building.address.latitude || 0,
                  building.address.longitude || 0,
                ]}
              />
            </section>

            <div className="mt-4 space-y-1">
              <p className="text-sm font-medium">Address</p>
              <p className="text-sm text-muted-foreground">
                {building.address.street}
              </p>
              <p className="text-sm text-muted-foreground">
                {building.address.city}, {building.address.state}{" "}
                {building.address.postalCode}
              </p>
              <p className="text-sm text-muted-foreground">
                {building.address.country}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Page;
