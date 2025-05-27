"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Edit,
  Home,
  Layers,
  Plus,
  Users,
  PenToolIcon as Tool,
  Merge,
  Scissors,
  BuildingIcon,
  FileSignature,
  ChevronRight,
  X,
  ImageIcon,
  UserCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

import { TenantsTable } from "../_components/tenants-table";
import { useParams, useRouter } from "next/navigation";

import { Group } from "@/components/custom/group";
import EnhancedFloorPlan from "../_components/floor-plan";
import { useGetBuildingQuery } from "@/app/quries/useBuildings";
import LogJSON from "@/components/custom/log-json";
import {
  getFullFileURL,
  getOccupancyColor,
  getOccupancyTextColor,
} from "@/utils";
import { PageLoader } from "@/components/custom/page-loader";
import { PageError } from "@/components/custom/page-error";
import {
  useMergeUnitsMutation,
  useSplitUnitMutation,
} from "@/app/quries/useUnits";
import { useAuth } from "@/app/quries/useAuth";
import { UnitSplitSheet } from "./_components/unit-split-drawer";
import { UnitMergeSheet } from "./_components/unit-merge-drawer";
import ASSETS from "@/app/auth/_assets";
import { warningToast } from "@/components/custom/toasts";

// Image Gallery Component
const ImageGallery = ({
  images,
  buildingName,
}: {
  images: string[];
  buildingName: string;
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <Card className="overflow-hidden rounded-xl border border-neutral-200/50 bg-background/70 backdrop-blur-md">
        <CardContent className="flex h-64 items-center justify-center">
          <div className="text-center text-muted-foreground">
            <ImageIcon className="mx-auto mb-2 h-12 w-12 opacity-50" />
            <p>No images available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <Card className="overflow-hidden rounded-xl border border-neutral-200/50 bg-background/70 backdrop-blur-md">
          <CardContent className="p-0">
            {images.length === 1 ? (
              // Single image display
              <motion.div
                className="group relative h-64 cursor-pointer md:h-80"
                onClick={() => setIsGalleryOpen(true)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={getFullFileURL(images[0])}
                  alt={`${buildingName} - Main Image`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                <div className="absolute bottom-4 right-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Badge
                    variant="secondary"
                    className="border-none bg-black/50 text-white"
                  >
                    View Full Size
                  </Badge>
                </div>
              </motion.div>
            ) : (
              // Multiple images grid
              <div className="grid grid-cols-4 gap-2 p-2">
                <motion.div
                  className="group relative col-span-2 row-span-2 h-64 cursor-pointer overflow-hidden rounded-lg"
                  onClick={() => {
                    setSelectedImageIndex(0);
                    setIsGalleryOpen(true);
                  }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src={
                      getFullFileURL(images[0]) || ASSETS.IMAGES.BUILDING_IMAGE
                    }
                    alt={`${buildingName} - Image 1`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                </motion.div>

                {images.slice(1, 5).map((path, index) => (
                  <motion.div
                    key={index + 1}
                    className="group relative h-[calc(50%-4px)] cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => {
                      setSelectedImageIndex(index + 1);
                      setIsGalleryOpen(true);
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Image
                      src={getFullFileURL(path) || ASSETS.IMAGES.BUILDING_IMAGE}
                      alt={`${buildingName} - Image ${index + 2}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                    {index === 3 && images.length > 5 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <span className="font-semibold text-white">
                          +{images.length - 5}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Full Screen Gallery Modal */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogTitle />
        <DialogContent className="h-[90vh] max-w-6xl border-none bg-black/95 p-0 backdrop-blur-xl">
          <div className="relative flex h-full items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 z-50 text-white hover:bg-white/20"
              onClick={() => setIsGalleryOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 z-50 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={() =>
                    setSelectedImageIndex(
                      (prev) => (prev - 1 + images.length) % images.length,
                    )
                  }
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 z-50 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={() =>
                    setSelectedImageIndex((prev) => (prev + 1) % images.length)
                  }
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative h-full max-h-[80vh] w-full max-w-5xl"
            >
              <Image
                src={
                  getFullFileURL(images[selectedImageIndex]) ||
                  `/placeholder.svg?height=800&width=1200`
                }
                alt={`${buildingName} - Image ${selectedImageIndex + 1}`}
                fill
                className="object-contain"
              />
            </motion.div>

            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index === selectedImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Main Page Component
const Page = () => {
  // Get building ID from URL parameters
  const params = useParams();
  const buildingID = params["id"] as string;
  const router = useRouter();

  const splitUnitMutation = useSplitUnitMutation();
  const mergeUnitMutation = useMergeUnitsMutation();
  const { isManager, isOwner } = useAuth();

  const isAdmin = isManager || isOwner;

  // Dialog state management
  const [isEditBuildingOpen, setIsEditBuildingOpen] = useState(false);

  const [isSplitUnitOpen, setIsSplitUnitOpen] = useState(false);
  const [isMergeUnitsOpen, setIsMergeUnitsOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("floors");

  const getBuildingQuery = useGetBuildingQuery(buildingID);

  if (!buildingID) {
    return <div className="p-8 text-center">Building ID not provided</div>;
  }

  if (getBuildingQuery.isPending) {
    return (
      <PageLoader
        isLoading={getBuildingQuery.isPending}
        loaderVariant="dots"
        variant="minimal"
        loaderSize={"full"}
      />
    );
  }

  if (getBuildingQuery.isError) {
    return <PageError fullPage message={getBuildingQuery.error.message} />;
  }

  const building = getBuildingQuery.data;

  // Calculate occupancy rate
  const occupancyRate = building
    ? Math.round((building.occupancy / building.totalUnits) * 100)
    : 0;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative flex-1 overflow-hidden p-4 md:p-6"
    >
      <LogJSON data={{ building }} />
      {/* Header with building name and back button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Group justify="between">
          <Group>
            <Button
              variant="outline"
              size="icon"
              asChild
              className="rounded-full border-neutral-200/50 bg-background/60 backdrop-blur-sm hover:bg-background/80"
            >
              <Link href="/dashboard/buildings">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{building.name}</h1>
              <p className="mt-1 flex items-center text-muted-foreground">
                <Home className="mr-1 h-3 w-3" /> {building.address?.street},{" "}
                {building.address?.city}, {building.address?.country}
              </p>
            </div>
          </Group>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => {
                router.push(
                  `/dashboard/buildings/new?buildingId=${buildingID}`,
                );
              }}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </motion.div>
        </Group>
      </motion.div>

      {/* Building Images Gallery */}
      <section className="my-4">
        <ImageGallery
          images={building.images || []}
          buildingName={building.name}
        />
      </section>

      {/* Building overview and quick actions cards */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 grid gap-6 md:grid-cols-3"
        >
          {/* Building Overview Card */}
          <Card className="overflow-hidden rounded-xl border border-neutral-200/50 bg-background/70 backdrop-blur-md transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Building Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {/* Occupancy indicator */}
                <div className="flex items-center justify-between text-sm">
                  <span>Occupancy</span>
                  <span
                    className={`font-medium ${getOccupancyTextColor(occupancyRate)}`}
                  >
                    {occupancyRate}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${occupancyRate}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className={`h-full ${getOccupancyColor(occupancyRate)}`}
                  />
                </div>

                {/* Building statistics */}
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
                      <span className="font-medium">{building.totalUnits}</span>{" "}
                      Total Units
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-2"
                  >
                    <div className="rounded-full bg-blue-500/10 p-1.5">
                      <Layers className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">
                        {building.totalFloors}
                      </span>{" "}
                      Floors
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-2"
                  >
                    <div className="rounded-full bg-green-500/10 p-1.5">
                      <Users className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">
                        {building.availableUnits}
                      </span>{" "}
                      Occupied Units
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
                      <span className="font-medium">{building.status}</span>{" "}
                      Building Status
                    </div>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="overflow-hidden rounded-xl border border-neutral-200/50 bg-background/70 backdrop-blur-md transition-all duration-300 hover:shadow-md md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                <QuickActionButton
                  icon={<Plus className="h-5 w-5" />}
                  label="Add Unit"
                  variant="default"
                  onClick={() => {
                    router.push(`/dashboard/buildings/${buildingID}/units/new`);
                  }}
                  index={0}
                />
                <QuickActionButton
                  icon={<Scissors className="h-5 w-5" />}
                  label="Split Unit"
                  variant="outline"
                  onClick={() => setIsSplitUnitOpen(true)}
                  index={1}
                />
                <QuickActionButton
                  icon={<Merge className="h-5 w-5" />}
                  label="Merge Units"
                  variant="outline"
                  onClick={() => setIsMergeUnitsOpen(true)}
                  index={2}
                />
                <QuickActionButton
                  icon={<Users className="h-5 w-5" />}
                  label="View Tenants"
                  variant="outline"
                  onClick={() => setActiveTab("tenants")}
                  index={3}
                />
                <QuickActionButton
                  icon={<FileSignature className="h-5 w-5" />}
                  label="Lease Mngt."
                  variant="outline"
                  onClick={() => {
                    router.push("/dashboard/leases");
                  }}
                  index={4}
                />
                {isOwner && (
                  <QuickActionButton
                    icon={<UserCheck2 className="h-5 w-5" />}
                    label="Assign Manager"
                    variant="outline"
                    onClick={() => {
                      router.push(`/auth/sign-up?type=manager`);
                    }}
                    index={4}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Building Description */}
      {building.description && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-6"
        >
          <Card className="overflow-hidden rounded-xl border border-neutral-200/50 bg-background/70 backdrop-blur-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">About This Building</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-muted-foreground">
                {building.description}
              </p>

              {/* Amenities */}
              {building.amenities && building.amenities.length > 0 && (
                <div className="mt-4">
                  <h4 className="mb-3 font-semibold">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {building.amenities.slice(0, 8).map((amenity, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {amenity}
                      </Badge>
                    ))}
                    {building.amenities.length > 8 && (
                      <Badge variant="outline" className="text-xs">
                        +{building.amenities.length - 8} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tabs for Floor Plans and Tenants */}
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
          <TabsList className="">
            <TabsTrigger value="floors" className="">
              Floor Plans
            </TabsTrigger>
            <TabsTrigger value="tenants" className="">
              Tenants
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
              <TabsContent value="floors" className="mt-4">
                <EnhancedFloorPlan buildingID={buildingID} />
              </TabsContent>

              <TabsContent value="tenants" className="mt-4">
                <TenantsTable buildingID={buildingID} />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </motion.div>

      {/* Edit Building Dialog */}
      <Dialog open={isEditBuildingOpen} onOpenChange={setIsEditBuildingOpen}>
        <DialogContent className="border-none bg-background/95 backdrop-blur-xl sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <BuildingIcon className="h-5 w-5 text-primary" />
              Edit Building
            </DialogTitle>
            <DialogDescription>
              Update the details for {building.name}
            </DialogDescription>
          </DialogHeader>
          <div>UPDATE BUILDING DIALOG</div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditBuildingOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => {
                alert("UPDATING BUILDING");
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Split Unit Dialog */}
      <UnitSplitSheet
        isOpen={isSplitUnitOpen}
        buildingId={buildingID}
        onOpenChange={(open) => {
          setIsSplitUnitOpen(open);
        }}
        onSplitUnit={(unitID, newUnits) => {
          console.log({ unitID, newUnits });
          splitUnitMutation.mutate({
            unitId: unitID,
            buildingId: buildingID,
            newUnits,
          });
        }}
      />

      <UnitMergeSheet
        isOpen={isMergeUnitsOpen}
        buildingId={buildingID}
        onOpenChange={(open) => {
          setIsMergeUnitsOpen(open);
        }}
        units={building.units.map((u) => ({
          unitNumber: u.unitNumber,
          floorNumber: u.floorNumber,
          id: u.id,
          sizeSqFt: u.sizeSqFt,
          monthlyRent: u.monthlyRent,
        }))}
        onMergeUnits={(unitIds, newUnit) => {
          console.log({ unitIds, newUnit });
          const buildingId = buildingID;
          if (!buildingId) {
            warningToast("Building info not found.");
            return;
          }
          mergeUnitMutation.mutate({
            buildingId,
            mergedUnit: {
              monthlyRent: 100,
              sizeSqFt: newUnit.sizeSqFt,
              status: newUnit.status,
              type: newUnit.type,
              unitNumber: newUnit.unitNumber,
            },
            unitIds: unitIds,
          });
        }}
      />
    </motion.main>
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

export default Page;
