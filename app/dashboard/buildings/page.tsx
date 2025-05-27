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
  Edit,
  Heart,
  MapPin,
  MoreVertical,
  Calendar,
  Trash,
  CheckCircle2,
  Shield,
  Sparkles,
  ArrowRight,
  DollarSign,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import PageWrapper from "@/components/custom/page-wrapper";
import SearchInput from "@/components/custom/search-input";

import ASSETS from "@/app/auth/_assets";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  type BuildingWithStat,
  useDeleteBuildingMutation,
  useGetAllBuildingsQuery,
} from "@/app/quries/useBuildings";
import { errorToast } from "@/components/custom/toasts";
import { useRouter } from "next/navigation";
import { getFullFileURL, storeBuildingId } from "@/utils";
import { useAuth } from "@/app/quries/useAuth";

// Extended building type with calculated fields
type ExtendedBuilding = BuildingWithStat & {
  formattedAddress: string;
};

export default function BuildingsPage() {
  // const buildings = getBuildings();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const getAllBuildings = useGetAllBuildingsQuery();

  const buildings = getAllBuildings.data || [];

  const { isManager, isOwner } = useAuth();

  const isAdmin = isManager || isOwner;

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

  // useEffect(() => {
  //   if (getAllBuildings.isSuccess) {
  //     setBuildings(getAllBuildings.data || []);
  //   }
  // }, [getAllBuildings.data, getAllBuildings.isSuccess]);

  useEffect(() => {
    if (getAllBuildings.isError) {
      errorToast(getAllBuildings.error.message);
    }
  }, [getAllBuildings.error?.message, getAllBuildings.isError]);

  return (
    <PageWrapper className="">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        {/* Hero Banner */}
        <div className="relative mb-12 overflow-hidden rounded-xl bg-gradient-to-r from-primary/90 to-primary/70 shadow-xl">
          <div className="absolute inset-0 z-0 opacity-20">
            <Image
              src={
                ASSETS.IMAGES.BUILDING_IMAGE ||
                "/placeholder.svg?height=400&width=1200"
              }
              alt="Buildings background"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative z-10 px-6 py-12 text-white md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="mb-3 text-3xl font-bold md:text-4xl lg:text-5xl">
                Find Your Perfect Space
              </h1>
              <p className="mb-6 max-w-2xl text-lg text-white/90 md:text-xl">
                Discover premium commercial properties designed for success.
                Modern amenities, prime locations, and flexible lease terms to
                help your business thrive.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-white font-medium text-primary hover:bg-white/90 hover:text-primary/90"
                  onClick={() => {
                    const element = document.getElementById("buildings-list");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Explore Properties <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                >
                  Schedule a Tour <Calendar className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="border-none bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-sm dark:from-blue-950/20 dark:to-blue-900/10">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Premium Security</h3>
                  <p className="text-sm text-muted-foreground">
                    24/7 security systems and controlled access for your peace
                    of mind.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-gradient-to-br from-green-50 to-green-100/50 shadow-sm dark:from-green-950/20 dark:to-green-900/10">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                  <Sparkles className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Modern Amenities</h3>
                  <p className="text-sm text-muted-foreground">
                    State-of-the-art facilities designed for productivity and
                    comfort.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-gradient-to-br from-amber-50 to-amber-100/50 shadow-sm dark:from-amber-950/20 dark:to-amber-900/10">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/30">
                  <DollarSign className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Flexible Leasing</h3>
                  <p className="text-sm text-muted-foreground">
                    Customizable lease terms to accommodate your business needs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Buildings Section */}
        <div id="buildings-list">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold">Available Properties</h2>
              <p className="text-muted-foreground">
                Find the perfect space for your business
              </p>
            </div>
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
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
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
                    All Properties
                  </TabsTrigger>
                  <TabsTrigger value="high" className="">
                    High Demand
                  </TabsTrigger>
                  <TabsTrigger value="low" className="">
                    New Listings
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
                  className="grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3"
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
              Showing {filteredBuildings.length} of {buildings.length}{" "}
              properties
            </motion.div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-8 rounded-xl bg-gradient-to-r from-primary to-primary/80 p-8 text-center text-white shadow-xl"
        >
          <h2 className="mb-3 text-2xl font-bold md:text-3xl">
            Ready to Find Your Perfect Space?
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-white/90">
            Our team is ready to help you find the perfect property for your
            business needs. Schedule a tour today or contact us for more
            information.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-white font-medium text-primary hover:bg-white/90"
            >
              Schedule a Tour <Calendar className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            >
              Contact Us <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
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

  // const getOccupancyColor = (occupancy: number) => {
  //   if (occupancy >= 90) return "from-emerald-500/80 to-emerald-600/80";
  //   if (occupancy >= 70) return "from-blue-500/80 to-blue-600/80";
  //   if (occupancy >= 50) return "from-amber-500/80 to-amber-600/80";
  //   return "from-rose-500/80 to-rose-600/80";
  // };

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

  // Calculate availability percentage
  const availabilityPercentage = Math.round(
    (building.availableUnits / building.totalUnits) * 100,
  );

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={controls}
      whileHover={{ y: -5 }}
      // className="h-full"
    >
      <Card className="group relative h-full overflow-hidden rounded-lg border-none bg-white shadow-md transition-all duration-300 hover:shadow-lg dark:bg-slate-900">
        {/* Ribbon for special properties */}
        {building.availableUnits > 0 && building.occupancy < 90 && (
          <div className="absolute right-0 top-0 z-20 bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1 text-xs font-medium text-white shadow-md">
            Available Now
          </div>
        )}

        {/* Image with overlay */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={
              building.images?.[0]
                ? getFullFileURL(building.images?.[0])
                : ASSETS.IMAGES.BUILDING_IMAGE
            }
            alt={building.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Favorite button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-3 top-3 z-10 h-8 w-8 rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/30 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
          >
            <Heart
              className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
            />
          </Button>

          {/* Bottom image overlay content */}
          <div className="absolute bottom-0 left-0 w-full p-4 text-white">
            <h2 className="mb-1 text-xl font-bold tracking-tight">
              {building.name}
            </h2>
            <div className="flex items-center text-sm text-white/90">
              <MapPin className="mr-1.5 h-3.5 w-3.5" />
              {building.formattedAddress}
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Key stats */}
          <div className="mb-4 grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-slate-100 p-2 text-center dark:bg-slate-800">
              <p className="text-lg font-semibold">{building.totalUnits}</p>
              <p className="text-xs text-muted-foreground">Units</p>
            </div>
            <div className="rounded-lg bg-slate-100 p-2 text-center dark:bg-slate-800">
              <p className="text-lg font-semibold">{building.totalFloors}</p>
              <p className="text-xs text-muted-foreground">Floors</p>
            </div>
            <div className="rounded-lg bg-slate-100 p-2 text-center dark:bg-slate-800">
              <p className="text-lg font-semibold">{building.availableUnits}</p>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
          </div>

          {/* Availability indicator */}
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium">Availability</span>
              <Badge
                variant="outline"
                className={`${availabilityPercentage > 30 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"} dark:bg-opacity-20`}
              >
                {availabilityPercentage}% Available
              </Badge>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${availabilityPercentage}%` }}
                transition={{ duration: 0.8, delay: index * 0.05 + 0.2 }}
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
              />
            </div>
          </div>

          {/* Amenities preview */}
          {building.amenities && building.amenities.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 text-sm font-medium">Featured Amenities</p>
              <div className="flex flex-wrap gap-1">
                {building.amenities.slice(0, 3).map((amenity) => (
                  <Badge
                    key={amenity}
                    variant="outline"
                    className="bg-slate-100 text-xs dark:bg-slate-800"
                  >
                    <CheckCircle2 className="mr-1 h-3 w-3 text-green-500" />
                    {amenity}
                  </Badge>
                ))}
                {building.amenities.length > 3 && (
                  <Badge
                    variant="outline"
                    className="bg-slate-100 text-xs dark:bg-slate-800"
                  >
                    +{building.amenities.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Status indicator */}
          <div className="mb-4 flex items-center">
            <div
              className={`mr-2 h-2.5 w-2.5 rounded-full ${
                building.status.toLowerCase() === "excellent" ||
                building.status.toLowerCase() === "good"
                  ? "bg-green-500"
                  : building.status.toLowerCase() === "fair"
                    ? "bg-amber-500"
                    : "bg-red-500"
              }`}
            />
            <p className="text-sm text-muted-foreground">
              {building.status} Condition • Built {building.yearBuilt || "N/A"}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t p-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
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
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      router.push(
                        `/dashboard/buildings/new?buildingId=${building.id}`,
                      );
                    }}
                  >
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
          </div>

          <Button
            className="gap-1.5 bg-primary text-white shadow-sm hover:bg-primary/90"
            onClick={() => {
              storeBuildingId(building.id);
              router.push(`/dashboard/buildings/${building.id}`);
            }}
          >
            View Details <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
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
