"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Edit,
  DollarSign,
  SquareIcon as SquareFoot,
  XCircle,
  Grid,
  List,
  FileSignature,
  AlertTriangle,
  Wrench,
  ImageIcon,
  Filter,
  RefreshCw,
  FilterX,
  Plus,
  Trash,
  Layers,
  Search,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UNIT_STATUS } from "@/types";
import Image from "next/image";
import { StatusBadgeStyles, UnitTypeIcons } from "@/constants/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetBuildingQuery } from "@/app/quries/useBuildings";
import { UnitWithIdOnly, useDeleteUnitMutation } from "@/app/quries/useUnits";
import {
  UnitDetailsSheet,
  type UnitAction,
} from "@/components/custom/unit-details-sheet";
// import LogJSON from "@/components/custom/log-json";
import { errorToast, warningToast } from "@/components/custom/toasts";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/app/quries/useAuth";
import ENV from "@/config/env";

const FloorPlan = ({ buildingID }: { buildingID: string }) => {
  const { isManager, isOwner } = useAuth();

  const isAdmin = isManager || isOwner;

  const getBuildingQuery = useGetBuildingQuery(buildingID);

  const router = useRouter();

  // State management
  const [selectedFloor, setSelectedFloor] = useState("1");
  const [selectedUnit, setSelectedUnit] = useState<UnitWithIdOnly | null>(null);
  const [isUnitDetailsDrawerOpen, setIsUnitDetailsDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<UNIT_STATUS | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const building = getBuildingQuery.data;
  const units = building?.units || [];
  const deleteUnitMutation = useDeleteUnitMutation();

  // DEBUG: Log when building or floor changes
  useEffect(() => {
    console.log("Building ID:", buildingID);
    console.log("Selected Floor:", selectedFloor);
  }, [buildingID, selectedFloor]);

  const getUnitActions = (): UnitAction[] => {
    const commonActions = [
      {
        icon: <ArrowUpRight className="h-4 w-4" />,
        label: "Rent",
        onClick: () => {
          if (!selectedUnit) {
            warningToast("Unit not found.");
            return;
          }
          router.push(
            `/dashboard/rent?buildingId=${buildingID}&unitId=${selectedUnit.id}`,
          );
          console.log({ selectedUnit });
        },
        variant: "default" as const,
      },
    ];

    const adminOnlyActions = [
      {
        icon: <Edit className="h-4 w-4" />,
        label: "Edit",
        onClick: () => {
          if (!selectedUnit) {
            warningToast("Unit not found.");
            return;
          }
          router.push(
            `/dashboard/buildings/${buildingID}/units/new?unitId=${selectedUnit.id}&buildingId=${buildingID}`,
          );
        },
        variant: "outline" as const,
      },
      {
        icon: <FileSignature className="h-4 w-4" />,
        label: "Lease",
        onClick: () => console.log("Lease clicked"),
        variant: "outline" as const,
      },
      {
        icon: <Wrench className="h-4 w-4" />,
        label: "Maintenance",
        onClick: () => console.log("Maintenance clicked"),
        variant: "outline" as const,
      },
      {
        icon: <Trash className="h-4 w-4" />,
        label: "Delete",
        onClick: async () => {
          const unitId = selectedUnit?.id;
          if (!unitId) {
            errorToast("Unit Id not found to delete a unit.");
            return;
          }

          await deleteUnitMutation.mutateAsync({
            unitId,
            buildingId: buildingID,
          });
          setIsUnitDetailsDrawerOpen(false);
          setSelectedUnit(null);
        },
        variant: "destructive" as const,
      },
    ];

    return isAdmin ? [...commonActions, ...adminOnlyActions] : commonActions;
  };

  const filterUnits = (units: UnitWithIdOnly[]) => {
    console.log({ units });
    return units.filter((unit) => {
      const unitStatus = unit.status;
      const unitType = unit.type;

      // Apply status filter
      if (statusFilter !== "ALL" && unitStatus !== statusFilter) {
        return false;
      }

      // Apply search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          unit.unitNumber.toLowerCase().includes(searchLower) ||
          unitType.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  };

  const handleUnitClick = (unit: UnitWithIdOnly) => {
    setSelectedUnit(unit);
    setIsUnitDetailsDrawerOpen(true);
  };

  if (getBuildingQuery.isLoading) {
    return <FloorPlanSkeleton />;
  }

  if (!building) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border bg-slate-50 dark:bg-slate-900/50">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/30">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
          </div>
          <h3 className="text-lg font-medium">Building not found</h3>
          <p className="max-w-md text-sm text-muted-foreground">
            The building with ID {buildingID} could not be loaded. Please check
            the building ID and try again.
          </p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => router.push("/dashboard/buildings")}
          >
            Return to Buildings
          </Button>
        </div>
      </div>
    );
  }

  const filteredUnits = filterUnits(units);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* <LogJSON data={filterUnits} position="top-right" /> */}

      {/* Filters and controls */}
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search units by number or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Tabs
            defaultValue="grid"
            value={viewMode}
            onValueChange={(v) => setViewMode(v as "grid" | "list")}
            className="mr-1"
          >
            <TabsList className="h-9 border border-primary/60 bg-transparent p-1.5">
              <TabsTrigger
                value="grid"
                className="h-7 px-3 data-[state=active]:bg-primary dark:data-[state=active]:bg-slate-950"
              >
                <Grid className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="h-7 px-3 data-[state=active]:bg-primary dark:data-[state=active]:bg-slate-950"
              >
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val as UNIT_STATUS | "ALL")}
          >
            <SelectTrigger className="h-9 w-[160px] gap-1">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Units</SelectItem>
              {Object.values(UNIT_STATUS).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            defaultValue="1"
            value={selectedFloor}
            onValueChange={(val) => setSelectedFloor(val)}
          >
            <SelectTrigger className="h-9 w-[180px]">
              <Layers className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Select floor" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: building.totalFloors || 0 }, (_, i) => (
                <SelectItem value={(i + 1).toString()} key={i + 1}>
                  Floor {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isAdmin && (
            <Button asChild size="sm" className="h-9 gap-1">
              <Link href={`/dashboard/buildings/${buildingID}/units/new`}>
                <Plus className="h-4 w-4" />
                <span>Add Unit</span>
              </Link>
            </Button>
          )}
        </div>
      </section>

      {/* Floor plan visualization */}
      <section className="overflow-hidden dark:bg-slate-900">
        <CardContent className="p-0">
          {filteredUnits.length === 0 ? (
            units.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center gap-4 p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                  <XCircle className="h-8 w-8 text-slate-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold tracking-tight">
                    No units available
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get started by adding your first commercial unit
                  </p>
                </div>
                {isAdmin && (
                  <Button asChild className="mt-2 gap-1.5">
                    <Link href={`/dashboard/buildings/${buildingID}/units/new`}>
                      <Plus className="h-4 w-4" />
                      Add New Unit
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center gap-4 p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                  <FilterX className="h-8 w-8 text-slate-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold tracking-tight">
                    No matching units found
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your current filters {`don't`} match any units in this
                    building
                  </p>
                </div>
                <Button
                  className="mt-2 gap-1.5"
                  onClick={() => {
                    setStatusFilter("ALL");
                    setSearchQuery("");
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset All Filters
                </Button>
              </div>
            )
          ) : viewMode === "grid" ? (
            // Grid view of commercial units
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <AnimatePresence>
                  {filteredUnits.map((unit, i) => {
                    const unitNumber = unit.unitNumber;
                    const unitType = unit.type;
                    const unitStatus = unit.status;
                    const isOccupied = unitStatus === UNIT_STATUS.OCCUPIED;
                    const unitImages = unit.images || [];
                    const hasImages = unitImages.length > 0;

                    return (
                      <motion.div
                        key={unit.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: i * 0.03 }}
                        onClick={() => handleUnitClick(unit)}
                        className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900"
                      >
                        {/* Unit image preview */}

                        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                          {hasImages ? (
                            <Image
                              src={
                                `${ENV.NEXT_PUBLIC_BACKEND_BASE_URL_WITHOUT_PREFIX}/${unitImages[0]}` ||
                                "/placeholder.svg"
                              }
                              alt={unitImages[0]}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
                              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
                                <ImageIcon className="h-8 w-8 text-slate-400" />
                              </div>
                              <p className="text-sm text-slate-500">
                                No images available
                              </p>
                            </div>
                          )}
                          <Badge
                            className={cn(
                              "absolute left-3 top-3 border px-2.5 py-1 shadow-sm backdrop-blur-sm",
                              StatusBadgeStyles[unitStatus],
                            )}
                          >
                            {unitStatus}
                          </Badge>
                        </div>

                        {/* Unit details */}
                        <div className="flex flex-1 flex-col p-5">
                          <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-lg font-semibold tracking-tight">
                              Unit {unitNumber}
                            </h3>
                            <div
                              className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-full",
                                isOccupied
                                  ? "bg-primary/10 text-primary"
                                  : "bg-slate-100 text-slate-500 dark:bg-slate-800",
                              )}
                            >
                              {UnitTypeIcons[unit.type]}
                            </div>
                          </div>

                          <p className="mb-4 text-sm font-medium text-muted-foreground">
                            {unitType}
                          </p>

                          <div className="mb-4 grid grid-cols-2 gap-y-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                            <div className="flex items-center gap-1.5">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                <SquareFoot className="h-3.5 w-3.5 text-slate-500" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Size
                                </p>
                                <p className="text-sm font-medium">
                                  {unit.sizeSqFt} sq ft
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                <DollarSign className="h-3.5 w-3.5 text-slate-500" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Rate
                                </p>
                                <p className="text-sm font-medium">
                                  ${unit.monthlyRent}/mo
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-auto flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              className="flex-1 gap-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/dashboard/rent?buildingId=${buildingID}&unitId=${unit.id}`,
                                );
                              }}
                            >
                              <ArrowUpRight className="h-3.5 w-3.5" />
                              Rent
                            </Button>
                            {isAdmin && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 gap-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log("Edit clicked", unit);
                                  router.push(
                                    `/dashboard/buildings/${buildingID}/units/new?unitId=${unit.id}&buildingId=${buildingID}`,
                                  );
                                }}
                              >
                                <Edit className="h-3.5 w-3.5" />
                                Edit
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            // List view of commercial units
            <div className="p-6">
              <Card className="overflow-hidden border-none shadow-sm">
                {/* Header row */}
                <div className="hidden border-b bg-slate-50 px-6 py-3 dark:bg-slate-800/50 md:block">
                  <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground">
                    <div className="col-span-2">Unit</div>
                    <div className="col-span-3">Type</div>
                    <div className="col-span-2">Size</div>
                    <div className="col-span-2">Rate</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1"></div>
                  </div>
                </div>

                {/* Unit rows */}
                <div className="divide-y">
                  <AnimatePresence>
                    {filteredUnits.map((unit, i) => {
                      const unitNumber = unit.unitNumber;
                      const unitType = unit.type;
                      const unitStatus = unit.status;
                      const isOccupied = unitStatus === UNIT_STATUS.OCCUPIED;

                      return (
                        <motion.div
                          key={unit.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2, delay: i * 0.02 }}
                          onClick={() => handleUnitClick(unit)}
                          className={cn(
                            "cursor-pointer px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50",
                          )}
                        >
                          {/* Mobile view */}
                          <div className="flex items-center justify-between md:hidden">
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "flex h-10 w-10 items-center justify-center rounded-full",
                                  isOccupied
                                    ? "bg-primary/10 text-primary"
                                    : "bg-slate-100 text-slate-500 dark:bg-slate-800",
                                )}
                              >
                                {UnitTypeIcons[unit.type]}
                              </div>
                              <div>
                                <div className="font-medium">
                                  Unit {unitNumber}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {unitType}
                                </div>
                              </div>
                            </div>
                            <Badge
                              className={cn(
                                "border px-2.5 py-1",
                                StatusBadgeStyles[unitStatus],
                              )}
                            >
                              {unitStatus}
                            </Badge>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-3 md:hidden">
                            <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                              <p className="text-xs text-muted-foreground">
                                Size
                              </p>
                              <p className="font-medium">
                                {unit.sizeSqFt} sq ft
                              </p>
                            </div>
                            <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                              <p className="text-xs text-muted-foreground">
                                Rate
                              </p>
                              <p className="font-medium">
                                ${unit.monthlyRent}/mo
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex justify-end gap-2 md:hidden">
                            <Button
                              variant="default"
                              size="sm"
                              className="gap-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/dashboard/rent?buildingId=${buildingID}&unitId=${unit.id}`,
                                );
                              }}
                            >
                              <ArrowUpRight className="h-4 w-4" />
                              Rent
                            </Button>
                            {isAdmin && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log("Edit clicked", unit);
                                  router.push(
                                    `/dashboard/buildings/${buildingID}/units/new?unitId=${unit.id}&buildingId=${buildingID}`,
                                  );
                                }}
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </Button>
                            )}
                          </div>

                          {/* Desktop view */}
                          <div className="hidden md:grid md:grid-cols-12 md:items-center md:gap-2">
                            <div className="col-span-2 font-medium">
                              Unit {unitNumber}
                            </div>
                            <div className="col-span-3 flex items-center gap-2">
                              <div
                                className={cn(
                                  "flex h-7 w-7 items-center justify-center rounded-full",
                                  isOccupied
                                    ? "bg-primary/10 text-primary"
                                    : "bg-slate-100 text-slate-500 dark:bg-slate-800",
                                )}
                              >
                                {UnitTypeIcons[unit.type]}
                              </div>
                              <span>{unitType}</span>
                            </div>
                            <div className="col-span-2">
                              {unit.sizeSqFt} sq ft
                            </div>
                            <div className="col-span-2">
                              ${unit.monthlyRent}/mo
                            </div>
                            <div className="col-span-2">
                              <Badge
                                className={cn(
                                  "border px-2.5 py-1",
                                  StatusBadgeStyles[unitStatus],
                                )}
                              >
                                {unitStatus}
                              </Badge>
                            </div>
                            <div className="col-span-1 flex justify-end gap-1">
                              <Button
                                variant="default"
                                size="sm"
                                className="h-8 w-8 p-0"
                                title="Rent"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(
                                    `/dashboard/rent?buildingId=${buildingID}&unitId=${unit.id}`,
                                  );
                                }}
                              >
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </Button>
                              {isAdmin && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  title="Edit"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("Edit clicked", unit);
                                    router.push(
                                      `/dashboard/buildings/${buildingID}/units/new?unitId=${unit.id}&buildingId=${buildingID}`,
                                    );
                                  }}
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </Card>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t bg-slate-50 px-6 py-3 dark:bg-slate-800/50">
          <div className="flex w-full items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredUnits.length} of {units.length} units on Floor{" "}
              {selectedFloor}
            </p>
          </div>
        </CardFooter>
      </section>

      {/* Unit Details Sheet - Using the new reusable component */}
      {selectedUnit && (
        <UnitDetailsSheet
          unit={selectedUnit}
          isOpen={isUnitDetailsDrawerOpen}
          onOpenChange={setIsUnitDetailsDrawerOpen}
          building={building}
          actions={getUnitActions()}
        />
      )}
    </motion.div>
  );
};

const FloorPlanSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="mb-6 flex flex-col gap-2 rounded-lg bg-gradient-to-r from-slate-50 to-white p-6 shadow-sm dark:from-slate-900 dark:to-slate-800">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-2 h-4 w-32" />
          </div>
        </div>
      </div>

      {/* Controls skeleton */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Skeleton className="h-10 w-full md:max-w-md" />
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-[160px]" />
          <Skeleton className="h-9 w-[180px]" />
        </div>
      </div>

      {/* Grid skeleton */}
      <Card className="overflow-hidden border-none bg-white shadow-md dark:bg-slate-900">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-slate-900"
              >
                <Skeleton className="h-48 w-full" />
                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-9 w-9 rounded-full" />
                  </div>
                  <Skeleton className="mb-4 h-4 w-20" />
                  <Skeleton className="mb-4 h-20 w-full rounded-lg" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t bg-slate-50 px-6 py-3 dark:bg-slate-800/50">
          <div className="flex w-full items-center justify-between">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-9 w-32" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FloorPlan;
