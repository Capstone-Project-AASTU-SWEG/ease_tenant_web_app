"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useAnimation,
  useInView,
} from "framer-motion";
import {
  Plus,
  Building2,
  ArrowUpRight,
  Layers,
  Users,
  Edit,
  Heart,
  MapPin,
  MoreVertical,
  Home,
  Calendar,
  Clock,
  Star,
  Settings,
  Ruler,
  Wrench,
  Trash,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import PageWrapper from "@/components/custom/page-wrapper";
import SearchInput from "@/components/custom/search-input";

import { Group } from "@/components/custom/group";

import { getBuildings, setBuildings } from "./_hooks/useBuildings";
import ASSETS from "@/app/auth/_assets";
import { USER_TYPE } from "@/types";
import PageHeader from "@/components/custom/page-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@radix-ui/react-select";
// import { Progress } from "@/components/custom/progress";
import { authUserType } from "@/app/auth/_hooks/useAuth";
import {
  BuildingWithStat,
  useDeleteBuildingMutation,
  useGetAllBuildingsQuery,
} from "@/app/quries/useBuildings";
import LogJSON from "@/components/custom/log-json";
import { errorToast } from "@/components/custom/toasts";
import { useRouter } from "next/navigation";
import { storeBuildingId } from "@/utils";

// Extended building type with calculated fields
type ExtendedBuilding = BuildingWithStat & {
  formattedAddress: string;
};

export default function BuildingsPage() {
  const buildings = getBuildings();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const getAllBuildings = useGetAllBuildingsQuery();

  const userRole = authUserType();

  const isAdmin =
    !!userRole && [USER_TYPE.MANAGER, USER_TYPE.OWNER].includes(userRole);

  const [favoriteBuildings, setFavoriteBuildings] = useState<string[]>([]);

  // Calculate occupancy rate and format address for each building
  const extendedBuildings: ExtendedBuilding[] = useMemo(() => {
    if (!getAllBuildings.data) {
      return [];
    }
    return getAllBuildings.data?.map((building) => {
      return {
        ...building,
        formattedAddress: `${building.address.street}, ${building.address.city}, ${building.address.state}`,
      };
    });
  }, [getAllBuildings.data]);

  // Filter buildings based on search query and active tab
  const filteredBuildings = useMemo(
    () =>
      extendedBuildings.filter((building) => {
        // Filter by search query
        const matchesSearch =
          building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          building.formattedAddress
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        // Filter by tab
        const matchesTab =
          activeTab === "all" ||
          (activeTab === "high" && building.occupancy >= 70) ||
          (activeTab === "low" && building.occupancy < 70);

        return matchesSearch && matchesTab;
      }),
    [activeTab, extendedBuildings, searchQuery],
  );

  // Toggle favorite status
  const toggleFavorite = (buildingId: string) => {
    setFavoriteBuildings((prev) => {
      if (prev.includes(buildingId)) {
        return prev.filter((id) => id !== buildingId);
      } else {
        return [...prev, buildingId];
      }
    });
  };

  useEffect(() => {
    if (getAllBuildings.isSuccess) {
      setBuildings(getAllBuildings.data || []);
    }
  }, [getAllBuildings.data, getAllBuildings.isSuccess]);

  useEffect(() => {
    if (getAllBuildings.isError) {
      errorToast(getAllBuildings.error.message);
    }
  }, [getAllBuildings.error?.message, getAllBuildings.isError]);

  return (
    <PageWrapper className="py-0">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        {/* Background elements */}
        <PageHeader
          title="Buildings"
          description={
            isAdmin
              ? "Manage your property portfolio"
              : "Explore available properties"
          }
          rightSection={
            <div className="flex items-center gap-4">
              {/* Add Building Button (Admin only) */}
              {isAdmin && (
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    asChild
                    className="bg-gradient-to-r from-primary to-primary/80 shadow-lg"
                  >
                    <Link href="/dashboard/buildings/new">
                      <Plus className="mr-2 h-4 w-4" /> Add Building
                    </Link>
                  </Button>
                </motion.div>
              )}
            </div>
          }
        />

        <LogJSON
          data={{
            buildings: getAllBuildings.data,
            error: getAllBuildings.error,
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8"
        >
          <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            <SearchInput
              searchQuery={searchQuery}
              onSearchQuery={(sq) => setSearchQuery(sq)}
            />
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all" className="">
                  All
                </TabsTrigger>
                <TabsTrigger value="high" className="">
                  High Occupancy
                </TabsTrigger>
                <TabsTrigger value="low" className="">
                  Low Occupancy
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + searchQuery + (isAdmin ? "admin" : "tenant")}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filteredBuildings.length > 0 ? (
                  filteredBuildings.map((building, index) => (
                    <BuildingCard
                      key={building.id}
                      building={building}
                      index={index}
                      isAdmin={isAdmin}
                      isFavorite={favoriteBuildings.includes(building.id)}
                      onToggleFavorite={() => toggleFavorite(building.id)}
                    />
                  ))
                ) : (
                  <EmptyBuildings isAdmin={isAdmin} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            Showing {filteredBuildings.length} of {buildings.length} buildings
          </motion.div>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}

type BuildingCardProps = {
  building: ExtendedBuilding;
  index: number;
  isAdmin: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

const BuildingCard = ({
  building,
  index,
  isAdmin,
  isFavorite,
  onToggleFavorite,
}: BuildingCardProps) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const router = useRouter();

  const deleteBuildingMutation = useDeleteBuildingMutation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy >= 90) return "from-emerald-500/80 to-emerald-600/80";
    if (occupancy >= 70) return "from-blue-500/80 to-blue-600/80";
    if (occupancy >= 50) return "from-amber-500/80 to-amber-600/80";
    return "from-rose-500/80 to-rose-600/80";
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      },
    },
  };

  useEffect(() => {
    if (deleteBuildingMutation.isError) {
      errorToast(deleteBuildingMutation.error.message);
    }
  }, [deleteBuildingMutation.error?.message, deleteBuildingMutation.isError]);

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={controls}
      className="h-full"
    >
      <Card
        className="group relative h-full overflow-hidden rounded-lg border-none bg-white/5 shadow-md backdrop-blur-sm transition-all duration-300 dark:bg-black/5"
        onDoubleClick={() => {
          storeBuildingId(building.id);
          router.push(`/dashboard/buildings/${building.id}`);
        }}
      >
        {/* Image with overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={building.imageUrls?.[0] || ASSETS.IMAGES.BUILDING_IMAGE}
            alt={building.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-primary/20" />
        </div>

        <CardContent className="relative z-10 flex h-full flex-col p-5 pt-6">
          {/* Top section */}
          <div className="mb-auto space-y-3">
            <Group justify="between">
              <Badge
                variant="secondary"
                className="bg-white/10 text-white backdrop-blur-md"
              >
                {building.occupancy}% Occupied
              </Badge>

              {/* Dropdown menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20"
                  >
                    <MoreVertical className="h-4 w-4 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/dashboard/buildings/${building.id}`}
                      className="cursor-pointer"
                    >
                      <ArrowUpRight className="mr-2 h-4 w-4" />
                      Go to building
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      onToggleFavorite();
                    }}
                    className="cursor-pointer"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    {isFavorite ? "Remove favorite" : "Add favorite"}
                  </DropdownMenuItem>

                  {isAdmin && (
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit building
                    </DropdownMenuItem>
                  )}
                  {isAdmin && (
                    <DropdownMenuItem
                      className="cursor-pointer text-red-500"
                      disabled={deleteBuildingMutation.isPending}
                      onClick={() => {
                        deleteBuildingMutation.mutate(building.id);
                      }}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete building
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </Group>

            <h2 className="text-2xl font-bold tracking-tight text-white">
              {building.name}
            </h2>

            <div className="flex items-center text-sm text-white/80">
              <MapPin className="mr-1.5 h-3.5 w-3.5" />
              {building.formattedAddress}
            </div>
          </div>

          {/* Occupancy indicator */}
          <div className="my-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-white/80">Occupancy</span>
              <span className="font-medium text-white">
                {building.occupancy}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${building.occupancy}%` }}
                transition={{ duration: 0.8, delay: index * 0.05 + 0.2 }}
                className={`h-full bg-gradient-to-r ${getOccupancyColor(building.occupancy)}`}
              />
            </div>
          </div>

          {/* Stats section */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center rounded-lg bg-white/5 p-3 backdrop-blur-md">
              <span className="text-lg font-semibold text-white">
                {building.totalUnits}
              </span>
              <div className="flex items-center text-xs text-white/60">
                <Building2 className="mr-1 h-3 w-3" />
                Units
              </div>
            </div>

            <div className="flex flex-col items-center rounded-lg bg-white/5 p-3 backdrop-blur-md">
              <span className="text-lg font-semibold text-white">
                {building.totalFloors}
              </span>
              <div className="flex items-center text-xs text-white/60">
                <Layers className="mr-1 h-3 w-3" />
                Floors
              </div>
            </div>

            <div className="flex flex-col items-center rounded-lg bg-white/5 p-3 backdrop-blur-md">
              <span className="text-lg font-semibold text-white">
                {building.availableUnits}
              </span>
              <div className="flex items-center text-xs text-white/60">
                <Users className="mr-1 h-3 w-3" />
                Vacant
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const EmptyBuildings = ({ isAdmin }: { isAdmin: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="col-span-full flex flex-col items-center justify-center rounded-md border border-dashed border-neutral-200 bg-background/50 p-20 text-center backdrop-blur-sm"
    >
      <Building2 className="mb-4 h-12 w-12 text-muted-foreground/50" />
      <h3 className="text-lg font-medium">No buildings found</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        No buildings match your current filters.{" "}
        {isAdmin
          ? "Try adjusting your search or add a new building."
          : "Try adjusting your search criteria."}
      </p>
      {isAdmin && (
        <Button asChild className="mt-6">
          <Link href="/dashboard/buildings/new">
            <Plus className="mr-2 h-4 w-4" /> Add Building
          </Link>
        </Button>
      )}
    </motion.div>
  );
};

interface BuildingInfoProps {
  building: BuildingWithStat;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "excellent":
      return "bg-emerald-500";
    case "good":
      return "bg-teal-500";
    case "fair":
      return "bg-amber-500";
    case "poor":
      return "bg-rose-500";
    case "critical":
      return "bg-red-700";
    default:
      return "bg-slate-500";
  }
};

export const BuildingInfo = ({ building }: BuildingInfoProps) => {
  const statusColor = getStatusColor(building.status);

  const formatCurrency = (value: string | number) => {
    if (typeof value === "string") return value;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <ScrollArea className="h-[calc(100vh-5rem)]">
      <div className="">
        {/* Main Building Info */}
        <Card className="border-0 bg-white/50 shadow-sm backdrop-blur-sm md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  {building.name}
                </CardTitle>
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {building.address.street}, {building.address.city},{" "}
                    {building.address.state}
                  </span>
                </div>
              </div>
              <Badge className={`${statusColor} font-medium text-white`}>
                {building.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Description */}
            {building.description && (
              <div className="mb-6">
                <p className="leading-relaxed text-muted-foreground">
                  {building.description}
                </p>
              </div>
            )}

            <Separator className="my-5" />

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Layers className="mr-2 h-4 w-4 text-slate-500" />
                  <span>Floors</span>
                </div>
                <p className="text-2xl font-semibold">{building.totalFloors}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Home className="mr-2 h-4 w-4 text-slate-500" />
                  <span>Total Units</span>
                </div>
                <p className="text-2xl font-semibold">{building.totalUnits}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Home className="mr-2 h-4 w-4 text-slate-500" />
                  <span>Available</span>
                </div>
                <p className="text-2xl font-semibold">
                  {building.availableUnits}
                </p>
              </div>
            </div>

            <Separator className="my-5" />

            {/* Construction and Financial Info */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {building.yearBuilt && (
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4 text-slate-500" />
                    <span>Built</span>
                  </div>
                  <p className="text-lg font-medium">{building.yearBuilt}</p>
                </div>
              )}

              {/* {building.monthlyRevenue !== undefined && (
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="mr-2 h-4 w-4 text-slate-500" />
                    <span>Monthly Revenue</span>
                  </div>
                  <p className="text-lg font-medium">
                    {formatCurrency(building.monthlyRevenue)}
                  </p>
                </div>
              )} */}

              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4 text-slate-500" />
                  <span>Last Updated</span>
                </div>
                <p className="text-lg font-medium">
                  {formatDate(building.updatedAt)}
                </p>
              </div>
            </div>

            {/* Amenities */}
            {building.amenities.length > 0 && (
              <>
                <Separator className="my-5" />
                <div>
                  <h3 className="mb-3 flex items-center text-lg font-semibold">
                    <Star className="mr-2 h-5 w-5 text-amber-500" />
                    Amenities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {building.amenities.map((amenity) => (
                      <Badge
                        key={amenity}
                        variant="outline"
                        className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 transition-colors hover:bg-slate-100"
                      >
                        <Settings className="h-3 w-3 text-slate-500" />
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Sidebar with Lease Terms and Media */}
        <div className="space-y-6">
          {/* Lease Terms Card */}
          <Card className="overflow-hidden border-0 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Ruler className="mr-2 h-5 w-5 text-slate-700" />
                Lease Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Min. Lease
                </span>
                <span className="font-medium text-slate-900">
                  {building.leaseTerms.minLeasePeriodMonths} months
                </span>
              </div>
              <Separator className="my-1" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Max. Lease
                </span>
                <span className="font-medium text-slate-900">
                  {building.leaseTerms.maxLeasePeriodMonths} months
                </span>
              </div>
              <Separator className="my-1" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Deposit</span>
                <span className="font-medium text-slate-900">
                  {formatCurrency(building.leaseTerms.securityDeposit)}
                </span>
              </div>
              <Separator className="my-1" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Pet Policy
                </span>
                <span className="font-medium text-slate-900">
                  {building.leaseTerms.petPolicy || "No pets"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Card */}
          <Card className="overflow-hidden border-0 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Wrench className="mr-2 h-5 w-5 text-slate-700" />
                Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1 flex items-center">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${statusColor} mr-2`}
                    ></div>
                    <p className="font-medium text-slate-900">
                      {building.status}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media Preview */}
          {building.imageUrls && building.imageUrls.length > 0 && (
            <Card className="overflow-hidden border-0 bg-white/50 shadow-sm backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Users className="mr-2 h-5 w-5 text-slate-700" />
                  Media ({building.imageUrls.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-md">
                  <Image
                    src={building.imageUrls[0] || "/placeholder.svg"}
                    alt={`Preview of ${building.name}`}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-medium">Building Preview</p>
                    <p className="text-sm">
                      {building.imageUrls.length} photos available
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="mt-4 w-full border-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  View All Media
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};
