"use client";

import type React from "react";

import {
  type UnitWithBuilding,
  useGetAllUnitsOfBuildingQuery,
} from "@/app/quries/useUnits";
import PageHeader from "@/components/custom/page-header";
import PageWrapper from "@/components/custom/page-wrapper";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Edit,
  MoreHorizontal,
  Trash,
  Eye,
  Building,
  Home,
  Plus,
  Filter,
  LayoutGrid,
  Table,
  Search,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { formatCurrency } from "@/utils";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Group } from "@/components/custom/group";
import LogJSON from "@/components/custom/log-json";

const Page = () => {
  const params = useParams();
  const buildingId = params["id"] as string;
  const {
    data: units,
    isLoading,
    isError,
    error,
  } = useGetAllUnitsOfBuildingQuery(buildingId);

  // State for filters and view
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentView, setCurrentView] = useState<"grid" | "table">("grid");

  // Filter units based on search and filters
  const filteredUnits = units
    ? units.filter((unit) => {
        // Search filter
        const matchesSearch =
          searchQuery === "" ||
          unit.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          unit.type.toLowerCase().includes(searchQuery.toLowerCase());

        // Status filter
        const matchesStatus =
          statusFilter === "all" || unit.status === statusFilter;

        // Type filter
        const matchesType = typeFilter === "all" || unit.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
      })
    : [];

  // Calculate stats
  const calculateStats = () => {
    if (!units)
      return {
        total: 0,
        available: 0,
        occupied: 0,
        maintenance: 0,
        avgRent: 0,
      };

    const available = units.filter((u) => u.status === "Available").length;
    const occupied = units.filter((u) => u.status === "Occupied").length;
    const maintenance = units.filter(
      (u) => u.status === "Under Maintenance",
    ).length;
    const totalRent = units.reduce((sum, unit) => sum + unit.monthlyRent, 0);
    const avgRent = units.length > 0 ? totalRent / units.length : 0;

    return {
      total: units.length,
      available,
      occupied,
      maintenance,
      avgRent,
    };
  };

  const stats = calculateStats();

  return (
    <PageWrapper className="py-0">
      <LogJSON data={{ units }} />
      <PageHeader
        title="Unit Management"
        description="View and manage all units in this building"
      />
      <div className="mb-6">
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Units"
            value={stats.total}
            icon={<Building className="h-5 w-5 text-primary" />}
            description={`${stats.available} available`}
          />
          <StatsCard
            title="Available"
            value={`${stats.available} units`}
            icon={<CheckCircle className="h-5 w-5 text-emerald-500" />}
            trend={{ value: 5, isPositive: true }}
            className="border-emerald-100"
          />
          <StatsCard
            title="Occupied"
            value={`${stats.occupied} units`}
            icon={<Calendar className="h-5 w-5 text-blue-500" />}
            className="border-blue-100"
          />
          <StatsCard
            title="Average Rent"
            value={formatCurrency(stats.avgRent)}
            icon={<Home className="h-5 w-5 text-amber-500" />}
            description="per month"
            className="border-amber-100"
          />
        </div>
      </div>

      {isError && <ErrorDisplay message={error.message} />}

      {!isError && (
        <>
          <FilterBar
            onSearch={setSearchQuery}
            onStatusFilter={setStatusFilter}
            onTypeFilter={setTypeFilter}
            onViewChange={setCurrentView}
            currentView={currentView}
          />

          {isLoading ? (
            <LoadingSkeleton />
          ) : filteredUnits.length === 0 ? (
            <EmptyState />
          ) : currentView === "grid" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredUnits.map((unit) => (
                <UnitCard key={unit.id} unit={unit} />
              ))}
            </div>
          ) : (
            <UnitsTable units={filteredUnits} />
          )}
        </>
      )}

      {!isLoading && !isError && filteredUnits.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredUnits.length} of {units?.length} units
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Unit
            </Button>
            <Button size="sm">Export Data</Button>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

// Types
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

interface FilterBarProps {
  onSearch: (value: string) => void;
  onStatusFilter: (value: string) => void;
  onTypeFilter: (value: string) => void;
  onViewChange: (value: "grid" | "table") => void;
  currentView: "grid" | "table";
}

// Components
const StatsCard = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
}: StatsCardProps) => (
  <Card className={`overflow-hidden ${className}`}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="mt-1 flex items-baseline">
            <h3 className="text-2xl font-semibold tracking-tight">{value}</h3>
            {trend && (
              <span
                className={`ml-2 text-xs font-medium ${trend.isPositive ? "text-green-500" : "text-red-500"}`}
              >
                {trend.isPositive ? "+" : "-"}
                {trend.value}%
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="rounded-full bg-primary/10 p-3">{icon}</div>
      </div>
    </CardContent>
  </Card>
);

const FilterBar = ({
  onSearch,
  onStatusFilter,
  onTypeFilter,
  onViewChange,
  currentView,
}: FilterBarProps) => (
  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="relative flex-1 sm:max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search units..."
        className="pl-9"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select onValueChange={onStatusFilter} defaultValue="all">
          <SelectTrigger className="h-9 w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="Occupied">Occupied</SelectItem>
            <SelectItem value="Under Maintenance">Maintenance</SelectItem>
            <SelectItem value="Reserved">Reserved</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Select onValueChange={onTypeFilter} defaultValue="all">
        <SelectTrigger className="h-9 w-[130px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="Office">Office</SelectItem>
          <SelectItem value="Retail">Retail</SelectItem>
          <SelectItem value="Studio">Studio</SelectItem>
          <SelectItem value="Apartment">Apartment</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex items-center rounded-md border">
        <Button
          variant="ghost"
          className={`h-9 px-3 ${currentView === "grid" ? "bg-muted" : "bg-transparent"}`}
          onClick={() => onViewChange("grid")}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className={`h-9 px-3 ${currentView === "table" ? "bg-muted" : "bg-transparent"}`}
          onClick={() => onViewChange("table")}
        >
          <Table className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
);

const UnitCard = ({ unit }: { unit: UnitWithBuilding }) => {
  const statusConfig = {
    Available: {
      color: "bg-emerald-500",
      hoverColor: "hover:bg-emerald-600",
      icon: <CheckCircle className="mr-1.5 h-3.5 w-3.5" />,
    },
    Occupied: {
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      icon: <Calendar className="mr-1.5 h-3.5 w-3.5" />,
    },
    "Under Maintenance": {
      color: "bg-amber-500",
      hoverColor: "hover:bg-amber-600",
      icon: <Loader2 className="mr-1.5 h-3.5 w-3.5" />,
    },
    Reserved: {
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      icon: <Eye className="mr-1.5 h-3.5 w-3.5" />,
    },
  };

  const statusStyle = statusConfig[
    unit.status as keyof typeof statusConfig
  ] || {
    color: "bg-gray-500",
    hoverColor: "hover:bg-gray-600",
    icon: null,
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="h-1.5 w-full bg-gradient-to-r from-primary to-primary/70"></div>
      <CardHeader className="p-5 pb-0">
        <Group justify={"between"}>
          <Group spacing={"sm"}>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Home className="h-4 w-4 text-primary" />
            </div>
            <div>
              <span className="font-semibold leading-none">
                Unit {unit.unitNumber}
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Floor {unit.floorNumber}
              </p>
            </div>
          </Group>

          <Group spacing={"sm"}>
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/10 text-xs font-medium text-primary"
            >
              {unit.type}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Unit Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  View Unit Details
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Calendar className="mr-2 h-4 w-4" />
                  Manage Bookings
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Unit Information
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Unit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Group>
        </Group>
      </CardHeader>
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold tracking-tight text-primary">
              {formatCurrency(unit.monthlyRent)}
            </div>
            <div className="text-xs text-muted-foreground">per month</div>
          </div>
          <Badge
            className={`flex items-center ${statusStyle.color} ${statusStyle.hoverColor} py-1 text-xs text-white`}
          >
            {statusStyle.icon}
            {unit.status}
          </Badge>
        </div>

        <div className="mb-3 grid grid-cols-2 gap-y-2 text-sm">
          <div>
            <span className="text-xs text-muted-foreground">Size</span>
            <p className="font-medium">{unit.sizeSqFt} sq ft</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Building</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="truncate font-medium">
                    {unit.buildingId?.name}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{unit.buildingId?.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Amenities</span>
            <span className="font-medium">{unit.amenities.length}</span>
          </div>
          <Progress
            value={(unit.amenities.length / 10) * 100}
            className="h-1.5"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-1.5 bg-muted/30 p-3">
        {unit.amenities.slice(0, 3).map((amenity, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="bg-background text-xs"
          >
            {amenity}
          </Badge>
        ))}
        {unit.amenities.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{unit.amenities.length - 3} more
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
};

const UnitsTable = ({ units }: { units: UnitWithBuilding[] }) => (
  <div className="relative overflow-x-auto rounded-md border shadow-sm">
    <table className="w-full text-left text-sm">
      <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
        <tr>
          <th className="px-4 py-3">Unit Number</th>
          <th className="px-4 py-3">Type</th>
          <th className="px-4 py-3">Size</th>
          <th className="px-4 py-3">Monthly Rent</th>
          <th className="px-4 py-3">Status</th>
          <th className="px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {units.map((unit) => (
          <tr key={unit.id} className="border-b bg-white hover:bg-muted/20">
            <td className="px-4 py-3 font-medium">
              Unit {unit.unitNumber} <br />
              <span className="text-xs text-muted-foreground">
                Floor {unit.floorNumber}
              </span>
            </td>
            <td className="px-4 py-3">
              <Badge variant="outline">{unit.type}</Badge>
            </td>
            <td className="px-4 py-3">{unit.sizeSqFt} sq ft</td>
            <td className="px-4 py-3 font-medium text-primary">
              {formatCurrency(unit.monthlyRent)}
            </td>
            <td className="px-4 py-3">
              <Badge
                className={
                  unit.status === "Available"
                    ? "bg-emerald-500"
                    : unit.status === "Occupied"
                      ? "bg-blue-500"
                      : unit.status === "Under Maintenance"
                        ? "bg-amber-500"
                        : unit.status === "Reserved"
                          ? "bg-purple-500"
                          : "bg-gray-500"
                }
              >
                {unit.status}
              </Badge>
            </td>
            <td className="px-4 py-3 text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-muted to-muted/70"></div>
        <CardHeader className="p-5 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div>
                <Skeleton className="h-5 w-24" />
                <Skeleton className="mt-1 h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-24" />
              <Skeleton className="mt-1 h-3 w-16" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="mb-3 grid grid-cols-2 gap-y-2">
            <div>
              <Skeleton className="h-3 w-8" />
              <Skeleton className="mt-1 h-5 w-16" />
            </div>
            <div>
              <Skeleton className="h-3 w-8" />
              <Skeleton className="mt-1 h-5 w-16" />
            </div>
          </div>
          <Skeleton className="mt-4 h-6 w-full" />
        </CardContent>
        <CardFooter className="flex flex-wrap gap-1.5 bg-muted/30 p-3">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </CardFooter>
      </Card>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center">
    <div className="mb-3 rounded-full bg-primary/10 p-3">
      <Building className="h-10 w-10 text-primary/60" />
    </div>
    <h3 className="mb-1 text-lg font-medium">No Units Available</h3>
    <p className="mb-5 max-w-sm text-muted-foreground">
      This building {`doesn't`} have any units yet. Add your first unit to get
      started managing your property.
    </p>
    <Button>
      <Plus className="mr-2 h-4 w-4" /> Add New Unit
    </Button>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <Card className="border-red-200 bg-red-50/50 p-6">
    <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
      <div className="rounded-full bg-red-100 p-3">
        <XCircle className="h-6 w-6 text-red-600" />
      </div>
      <div className="flex-1">
        <h3 className="text-base font-medium text-red-800">
          Error Loading Units
        </h3>
        <p className="mt-1 text-sm text-red-700">{message}</p>
      </div>
      <Button variant="outline" className="border-red-300 hover:bg-red-100">
        Try Again
      </Button>
    </div>
  </Card>
);

export default Page;
