"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  DollarSign,
  Wrench,
  MapPin,
  Clock,
  CheckCircle2,
  Eye,
  FileText,
  Settings,
} from "lucide-react";
import PageWrapper from "@/components/custom/page-wrapper";
import {
  BuildingWithStat,
  useGetAllBuildingsQuery,
} from "../quries/useBuildings";
import { useGetAllLeaseQuery } from "../quries/useLeases";
import { useGetAllManagers, useGetAllTenants } from "../quries/useUsers";
import {
  ApplicationWithId,
  ApplicationWithIdAndTS,
  useGetApplicationsQuery,
} from "../quries/useApplications";
import { useGetAllMaintenanceRequestsQuery } from "../quries/useMaintenance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Lease, MaintenanceRequest } from "@/types";
import { getFullNameFromObj } from "@/utils";
import PageHeader from "@/components/custom/page-header";

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch all data
  const getBuildingsQuery = useGetAllBuildingsQuery();
  const getLeasesQuery = useGetAllLeaseQuery();
  const getManagers = useGetAllManagers();
  const getTenantsQuery = useGetAllTenants();
  const getApplicationsQuery = useGetApplicationsQuery();
  const getMaintenanceRequestQuery = useGetAllMaintenanceRequestsQuery();

  // Show loading state
  if (
    getBuildingsQuery.isLoading ||
    getLeasesQuery.isLoading ||
    getManagers.isLoading ||
    getTenantsQuery.isLoading ||
    getApplicationsQuery.isLoading ||
    getMaintenanceRequestQuery.isLoading
  ) {
    return (
      <PageWrapper className="flex min-h-[400px] items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </PageWrapper>
    );
  }

  // Show error state
  if (
    getBuildingsQuery.isError ||
    getLeasesQuery.isError ||
    getManagers.isError ||
    getTenantsQuery.isError ||
    getApplicationsQuery.isError ||
    getMaintenanceRequestQuery.isError
  ) {
    return (
      <PageWrapper className="flex min-h-[400px] items-center justify-center">
        <div className="space-y-4 text-center">
          <p className="text-destructive">Error loading dashboard data</p>
          <p className="text-muted-foreground">
            Please try refreshing the page
          </p>
        </div>
      </PageWrapper>
    );
  }

  const buildings = getBuildingsQuery.data || [];
  const leases = getLeasesQuery.data || [];
  const managers = getManagers.data || [];
  const tenants = getTenantsQuery.data || [];
  const applications = getApplicationsQuery.data || [];
  const maintenanceRequests = getMaintenanceRequestQuery.data || [];

  // Calculate real metrics
  const totalBuildings = buildings.length;
  const totalUnits = buildings.reduce(
    (sum, building) => sum + building.totalUnits,
    0,
  );
  const occupiedUnits = leases.filter(
    (lease) => lease.status === "Active",
  ).length;
  const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;
  const totalRevenue = leases
    .filter((lease) => lease.status === "Active")
    .reduce((sum, lease) => sum + (lease.unit?.monthlyRent || 0), 0);
  const activeLeases = leases.filter(
    (lease) => lease.status === "Active",
  ).length;

  const pendingApplications = applications.filter(
    (app) => app.status === "pending",
  ).length;

  const openMaintenanceRequests = maintenanceRequests.filter(
    (req) => req.status === "Open",
  ).length;

  console.log({ totalBuildings, pendingApplications, managers, tenants });

  return (
    <PageWrapper className="flex flex-col gap-6 py-0">
      <PageHeader
        title="Analytics Dashboard"
        description="Here we can visualize all data related to commercial buildings you have."
      />
      {/* Header */}

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <MetricCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          description="Monthly recurring revenue"
          color="green"
        />
        <MetricCard
          title="Occupancy Rate"
          value={`${occupancyRate.toFixed(1)}%`}
          icon={Building2}
          description={`${occupiedUnits}/${totalUnits} units occupied`}
          color="blue"
        />
        <MetricCard
          title="Active Leases"
          value={activeLeases.toString()}
          icon={FileText}
          description="Currently active contracts"
          color="purple"
        />
        <MetricCard
          title="Open Requests"
          value={openMaintenanceRequests.toString()}
          icon={Wrench}
          description="Maintenance requests"
          color="orange"
        />
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="buildings">Buildings</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="overview" className="space-y-4">
                <OverviewTab
                  buildings={buildings}
                  leases={leases}
                  applications={applications}
                  maintenanceRequests={maintenanceRequests}
                />
              </TabsContent>

              <TabsContent value="buildings" className="space-y-4">
                <BuildingsTab buildings={buildings} leases={leases} />
              </TabsContent>

              <TabsContent value="applications" className="space-y-4">
                <ApplicationsTab applications={applications} />
              </TabsContent>

              <TabsContent value="maintenance" className="space-y-4">
                <MaintenanceTab requests={maintenanceRequests} />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </PageWrapper>
  );
}

// Metric Card Component
function MetricCard({
  title,
  value,
  icon: Icon,
  description,
  color,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: "green" | "blue" | "purple" | "orange";
}) {
  const colorClasses = {
    green: "from-green-500/10 to-emerald-500/10 border-green-200/50",
    blue: "from-blue-500/10 to-cyan-500/10 border-blue-200/50",
    purple: "from-purple-500/10 to-violet-500/10 border-purple-200/50",
    orange: "from-orange-500/10 to-amber-500/10 border-orange-200/50",
  };

  const iconColors = {
    green: "text-green-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
  };

  return (
    <Card className={`bg-gradient-to-br ${colorClasses[color]}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className={`h-5 w-5 ${iconColors[color]}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Overview Tab Component
function OverviewTab({
  buildings,
  leases,
  applications,
  maintenanceRequests,
}: {
  buildings: BuildingWithStat[];
  leases: Lease[];
  applications: ApplicationWithIdAndTS[];
  maintenanceRequests: MaintenanceRequest[];
}) {
  // Prepare chart data
  const buildingData = buildings.map((building) => {
    const buildingLeases = leases.filter((lease) =>
      building.units?.some(
        (unit) => unit.unitNumber === lease.unit?.unitNumber,
      ),
    );
    const revenue = buildingLeases.reduce(
      (sum, lease) => sum + (lease.unit?.monthlyRent || 0),
      0,
    );
    const occupied = buildingLeases.filter(
      (lease) => lease.status === "Active",
    ).length;

    return {
      name: building.name,
      units: building.totalUnits,
      occupied: occupied,
      revenue: revenue,
    };
  });

  const applicationStatusData = [
    {
      name: "Approved",
      value: applications.filter((app) => app.status === "approved").length,
      color: "#10b981",
    },
    {
      name: "Pending",
      value: applications.filter((app) => app.status === "pending").length,
      color: "#f59e0b",
    },
    {
      name: "Rejected",
      value: applications.filter((app) => app.status === "rejected").length,
      color: "#ef4444",
    },
  ];

  const maintenanceData = [
    {
      name: "Open",
      value: maintenanceRequests.filter((req) => req.status === "Open").length,
      color: "#ef4444",
    },
    {
      name: "In Progress",
      value: maintenanceRequests.filter((req) => req.status === "In Progress")
        .length,
      color: "#f59e0b",
    },
    {
      name: "Completed",
      value: maintenanceRequests.filter((req) => req.status === "Completed")
        .length,
      color: "#10b981",
    },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Building Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Building Performance</CardTitle>
          <CardDescription>Units and occupancy by building</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={buildingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="units" fill="#3b82f6" name="Total Units" />
              <Bar dataKey="occupied" fill="#10b981" name="Occupied" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Application Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Application Status</CardTitle>
          <CardDescription>Current application pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={applicationStatusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {applicationStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Revenue by Building</CardTitle>
          <CardDescription>Monthly revenue breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={buildingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Maintenance Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Maintenance Overview</CardTitle>
          <CardDescription>Current maintenance request status</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={maintenanceData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {maintenanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

// Buildings Tab Component
function BuildingsTab({
  buildings,
  leases,
}: {
  buildings: BuildingWithStat[];
  leases: Lease[];
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Buildings ({buildings.length})
        </h3>
        <Button className="gap-2">
          <Building2 className="h-4 w-4" />
          Add Building
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {buildings.map((building, index) => {
          const buildingLeases = leases.filter((lease) =>
            building.units?.some(
              (unit) => unit.unitNumber === lease.unit?.unitNumber,
            ),
          );
          const occupiedUnits = buildingLeases.filter(
            (lease) => lease.status === "Active",
          ).length;
          const occupancyRate =
            building.totalUnits > 0
              ? (occupiedUnits / building.totalUnits) * 100
              : 0;

          return (
            <motion.div
              key={building.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">
                        {building.name}
                      </CardTitle>
                      <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {building.address.city}, {building.address.country}
                      </div>
                    </div>
                    <Badge
                      variant={
                        building.status === "Active" ? "default" : "secondary"
                      }
                    >
                      {building.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Units</span>
                      <p className="font-semibold">
                        {occupiedUnits}/{building.totalUnits}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Floors</span>
                      <p className="font-semibold">{building.totalFloors}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Occupancy</span>
                      <span className="font-medium">
                        {Math.round(occupancyRate)}%
                      </span>
                    </div>
                    <Progress value={occupancyRate} className="h-2" />
                  </div>

                  <div className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Settings className="h-3 w-3" />
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Applications Tab Component
function ApplicationsTab({
  applications,
}: {
  applications: ApplicationWithId[];
}) {
  const statusColors = {
    approved: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Applications ({applications.length})
        </h3>
        <Badge variant="outline">
          {applications.filter((app) => app.status === "pending").length}{" "}
          Pending
        </Badge>
      </div>

      <div className="space-y-3">
        {applications.map((application, index) => (
          <motion.div
            key={application.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold">
                        {getFullNameFromObj(application.submittedBy)}
                      </h4>
                      <Badge
                        className={
                          statusColors[
                            application.status as keyof typeof statusColors
                          ]
                        }
                      >
                        {application.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {application.priority} priority
                      </Badge>
                    </div>
                    {application.type === "rental" && (
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Unit {application.unit.unitNumber}</span>
                        <span>•</span>
                        <span>
                          Start:{" "}
                          {new Date(
                            application.leaseDetails.requestedStartDate,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                    {application.status === "pending" && (
                      <Button size="sm">Approve</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Maintenance Tab Component
function MaintenanceTab({ requests }: { requests: MaintenanceRequest[] }) {
  const statusColors = {
    Open: "bg-red-100 text-red-800",
    "In Progress": "bg-yellow-100 text-yellow-800",
    Completed: "bg-green-100 text-green-800",
  };

  const priorityColors = {
    High: "bg-red-100 text-red-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-green-100 text-green-800",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Maintenance Requests ({requests.length})
        </h3>
        <Badge className="bg-red-100 text-red-800">
          {requests.filter((req) => req.status === "Open").length} Open
        </Badge>
      </div>

      <div className="space-y-3">
        {requests.map((request, index) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold capitalize">
                        {request.category} Issue
                      </h4>
                      <Badge
                        className={
                          statusColors[
                            request.status as keyof typeof statusColors
                          ]
                        }
                      >
                        {request.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          priorityColors[
                            request.priority as keyof typeof priorityColors
                          ]
                        }
                      >
                        {request.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {request.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Unit {request.unit.unitNumber}</span>
                      <span>•</span>
                      <span>Tenant: {request.tenant.businessName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Clock className="h-3 w-3" />
                      Schedule
                    </Button>
                    <Button size="sm" className="gap-2">
                      <CheckCircle2 className="h-3 w-3" />
                      Assign
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
