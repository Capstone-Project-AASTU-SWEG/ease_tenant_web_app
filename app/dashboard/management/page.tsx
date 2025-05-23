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
  MapPin,
  Clock,
  TrendingUp,
  DollarSign,
  CheckCircle,
  MoreHorizontalIcon,
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
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { warningToast } from "@/components/custom/toasts";

// Mock data for charts
const occupancyTrendData = [
  { month: "Jan", occupancy: 85 },
  { month: "Feb", occupancy: 88 },
  { month: "Mar", occupancy: 90 },
  { month: "Apr", occupancy: 92 },
  { month: "May", occupancy: 95 },
  { month: "Jun", occupancy: 98 },
  { month: "Jul", occupancy: 100 },
  { month: "Aug", occupancy: 100 },
  { month: "Sep", occupancy: 98 },
  { month: "Oct", occupancy: 97 },
  { month: "Nov", occupancy: 95 },
  { month: "Dec", occupancy: 100 },
];

const revenueData = [
  { month: "Jan", revenue: 12500 },
  { month: "Feb", revenue: 12500 },
  { month: "Mar", revenue: 12800 },
  { month: "Apr", revenue: 13000 },
  { month: "May", revenue: 13200 },
  { month: "Jun", revenue: 13500 },
  { month: "Jul", revenue: 13500 },
  { month: "Aug", revenue: 13500 },
  { month: "Sep", revenue: 13200 },
  { month: "Oct", revenue: 13000 },
  { month: "Nov", revenue: 12800 },
  { month: "Dec", revenue: 13500 },
];

const maintenanceData = [
  { name: "Plumbing", value: 8 },
  { name: "Electrical", value: 5 },
  { name: "HVAC", value: 3 },
  { name: "Structural", value: 1 },
  { name: "Other", value: 4 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const Page = () => {
  const auth = useAuth();
  const userData = auth.data;
  const building = userData?.building;
  const router = useRouter();

  return (
    <PageWrapper className="py-0">
      <PageHeader
        title="Manager Dashboard"
        description={`Welcome back, ${getFullNameFromObj(userData?.user)}`}
        rightSection={
          <section>
            {/* Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreHorizontalIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom">
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
                <DropdownMenuItem>Generate Reports</DropdownMenuItem>
                <DropdownMenuItem>Maintenance</DropdownMenuItem>
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

  // Calculate monthly revenue based on occupancy
  const estimatedMonthlyRevenue = building.occupiedUnits * 3000; // Assuming $3000 per unit

  return (
    <div className="space-y-6">
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

      {/* New Premium Dashboard Overview Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1 overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <DollarSign className="mr-2 h-5 w-5 text-primary" />
              Estimated Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2 flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold">
                  ${estimatedMonthlyRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Based on current occupancy
                </p>
              </div>
              <Badge variant="outline" className="mb-1 bg-primary/10">
                <TrendingUp className="mr-1 h-3 w-3" />
                {building.occupancyRate}% Efficiency
              </Badge>
            </div>
            <div className="mt-4 h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 overflow-hidden bg-gradient-to-br from-green-500/5 to-green-500/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              Occupancy Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2 flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold">{building.occupancyRate}%</p>
                <p className="text-sm text-muted-foreground">
                  Current occupancy rate
                </p>
              </div>
              <Badge
                variant="outline"
                className="mb-1 bg-green-500/10 text-green-600"
              >
                <TrendingUp className="mr-1 h-3 w-3" />
                Stable
              </Badge>
            </div>
            <div className="mt-4 h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={occupancyTrendData}>
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="occupancy"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 0 }}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
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
              <Button variant="outline" className="w-full">
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
                <div className="flex flex-col items-center justify-center py-6 text-center">
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
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">
                    Historical Maintenance Issues
                  </h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={maintenanceData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {maintenanceData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))",
                          }}
                          formatter={(value) => [`${value} issues`]}
                        />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
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
            <div className="flex h-[200px] items-center justify-center overflow-hidden rounded-md border bg-muted">
              <MapPin className="h-8 w-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">
                Map view unavailable
              </span>
            </div>
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
