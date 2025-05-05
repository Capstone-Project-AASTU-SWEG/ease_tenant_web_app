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
  FileText,
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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UNIT_STATUS } from "@/types";
import Image from "next/image";
import { StatusBadgeStyles, UnitTypeIcons } from "@/constants/icons";
import SearchInput from "@/components/custom/search-input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetBuildingQuery } from "@/app/quries/useBuildings";
import { useDeleteUnitMutation, type UnitWithId } from "@/app/quries/useUnits";
import {
  UnitDetailsSheet,
  type UnitAction,
} from "@/components/custom/unit-details-sheet";
import LogJSON from "@/components/custom/log-json";
import { errorToast, warningToast } from "@/components/custom/toasts";

const FloorPlan = ({ buildingID }: { buildingID: string }) => {
  const isAdmin = true;

  const getBuildingQuery = useGetBuildingQuery(buildingID);

  const router = useRouter();

  // State management
  const [selectedFloor, setSelectedFloor] = useState("1");
  const [isEditFloorPlanOpen, setIsEditFloorPlanOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<UnitWithId | null>(null);
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
        onClick: () => console.log("Edit clicked"),
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

  const filterUnits = (units: UnitWithId[]) => {
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

  const handleUnitClick = (unit: UnitWithId) => {
    setSelectedUnit(unit);
    setIsUnitDetailsDrawerOpen(true);
  };

  if (!building) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border bg-muted/50">
        <div className="flex flex-col items-center gap-2 text-center">
          <AlertTriangle className="h-8 w-8 text-muted-foreground" />
          <h3 className="text-lg font-medium">Building not found</h3>
          <p className="text-sm text-muted-foreground">
            The building with ID {buildingID} could not be loaded
          </p>
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
      <LogJSON data={filterUnits} />
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SearchInput
          searchQuery={searchQuery}
          onSearchQuery={(searchQuery) => {
            setSearchQuery(searchQuery);
          }}
        />

        <div className="flex items-center gap-3">
          <Tabs
            defaultValue="grid"
            onValueChange={(v) => setViewMode(v as "grid" | "list")}
          >
            <TabsList className="">
              <TabsTrigger value="grid" className="">
                <Grid />
              </TabsTrigger>
              <TabsTrigger value="list" className="">
                <List />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val as UNIT_STATUS | "ALL")}
          >
            <SelectTrigger className="w-[160px] gap-1 rounded-md">
              <Filter className="h-4 w-4" />
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
            onValueChange={(val) => setSelectedFloor(val)}
          >
            <SelectTrigger className="w-[180px] rounded-md">
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
        </div>
      </section>
      {/* Floor plan visualization */}
      <Card className="overflow-hidden border-none bg-white shadow-sm dark:bg-slate-900">
        <CardContent className="p-0">
          {filteredUnits.length === 0 ? (
            units.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center gap-3 p-6 text-center">
                <div className="rounded-full bg-muted p-4">
                  <XCircle className="h-8 w-8 text-muted-foreground/70" />
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
                  <Button asChild className="mt-2 rounded-full">
                    <Link href={`/dashboard/buildings/${buildingID}/units/new`}>
                      <Plus className="mr-1 h-4 w-4" />
                      Add New Unit
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center gap-3 p-6 text-center">
                <div className="rounded-full bg-muted p-4">
                  <FilterX className="h-8 w-8 text-muted-foreground/70" />
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
                  className="mt-2 rounded-full"
                  onClick={() => {
                    setStatusFilter("ALL");
                    setSearchQuery("");
                  }}
                >
                  <RefreshCw className="mr-1 h-4 w-4" />
                  Reset All Filters
                </Button>
              </div>
            )
          ) : viewMode === "grid" ? (
            // Grid view of commercial units
            <div className="relative w-full overflow-hidden rounded-lg bg-muted/5">
              <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
                        className="group flex cursor-pointer flex-col overflow-hidden rounded-md border bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80"
                        onClick={() => handleUnitClick(unit)}
                      >
                        {/* Unit image preview */}
                        <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                          {hasImages ? (
                            <Image
                              src={unitImages[0] || "/placeholder.svg"}
                              alt={unitImages[0]}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
                              <ImageIcon className="h-8 w-8 text-slate-400" />
                              <p className="text-sm text-slate-500">
                                No images available
                              </p>
                            </div>
                          )}
                          <Badge
                            className={cn(
                              "absolute left-3 top-3 border",
                              StatusBadgeStyles[unitStatus],
                            )}
                          >
                            {unitStatus}
                          </Badge>
                        </div>

                        {/* Unit details */}
                        <div className="flex flex-1 flex-col p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <h3 className="text-lg font-medium">
                              Unit {unitNumber}
                            </h3>
                            <div
                              className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-full",
                                isOccupied
                                  ? "bg-primary/10"
                                  : "bg-slate-100 dark:bg-slate-800",
                              )}
                            >
                              {UnitTypeIcons[unit.type]}
                            </div>
                          </div>

                          <p className="mb-3 text-sm font-medium text-muted-foreground">
                            {unitType}
                          </p>

                          <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <div className="flex items-center gap-1.5">
                              <SquareFoot className="h-4 w-4 text-slate-500" />
                              <span>{unit.sizeSqFt} sq ft</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <DollarSign className="h-4 w-4 text-slate-500" />
                              <span>{unit.monthlyRent}/month</span>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/dashboard/rent?buildingID=${buildingID}&unitID=${unit.id}`,
                                );
                              }}
                            >
                              <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
                              Rent
                            </Button>
                            {isAdmin && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log("Edit clicked", unit);
                                }}
                              >
                                <Edit className="mr-1 h-3.5 w-3.5" />
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
            <div className="relative w-full overflow-hidden rounded-lg bg-muted/5">
              <div className="grid gap-2 p-4">
                {/* Header row */}
                <div className="hidden grid-cols-12 gap-2 px-4 py-2 text-xs font-medium text-muted-foreground md:grid">
                  <div className="col-span-2">Unit</div>
                  <div className="col-span-3">Type</div>
                  <div className="col-span-2">Size</div>
                  <div className="col-span-2">Rate</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1"></div>
                </div>

                {/* Unit rows */}
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
                        className={cn(
                          "grid grid-cols-1 gap-2 rounded-lg p-4 md:grid-cols-12 md:gap-2 md:px-4 md:py-3",
                          isOccupied
                            ? "bg-blue-50/50 hover:bg-blue-50 dark:bg-blue-950/10 dark:hover:bg-blue-950/20"
                            : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-900/80",
                        )}
                      >
                        {/* Mobile view */}
                        <div className="flex items-center justify-between md:hidden">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-full",
                                isOccupied
                                  ? "bg-primary/10"
                                  : "bg-slate-200 dark:bg-slate-800",
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
                              "border",
                              StatusBadgeStyles[unitStatus],
                            )}
                          >
                            {unitStatus}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 md:hidden">
                          <div className="text-sm">
                            <span className="text-muted-foreground">
                              Size:{" "}
                            </span>
                            {unit.sizeSqFt} sq ft
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">
                              Rate:{" "}
                            </span>
                            {unit.monthlyRent}
                          </div>
                        </div>
                        <div className="flex justify-end md:hidden">
                          <div className="flex gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              className="gap-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/dashboard/rent?buildingID=${buildingID}&unitID=${unit.id}`,
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
                                }}
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Desktop view */}
                        <div className="col-span-2 hidden font-medium md:block">
                          Unit {unitNumber}
                        </div>
                        <div className="col-span-3 hidden items-center gap-2 md:flex">
                          <div
                            className={cn(
                              "flex h-6 w-6 items-center justify-center rounded-full",
                              isOccupied
                                ? "bg-primary/10"
                                : "bg-slate-200 dark:bg-slate-800",
                            )}
                          >
                            {UnitTypeIcons[unit.type]}
                          </div>
                          <span>{unitType}</span>
                        </div>
                        <div className="col-span-2 hidden md:block">
                          {unit.sizeSqFt} sq ft
                        </div>
                        <div className="col-span-2 hidden md:block">
                          {unit.monthlyRent}
                        </div>
                        <div className="col-span-2 hidden md:block">
                          <Badge
                            className={cn(
                              "border",
                              StatusBadgeStyles[unitStatus],
                            )}
                          >
                            {unitStatus}
                          </Badge>
                        </div>
                        <div className="col-span-1 hidden md:flex md:justify-end md:gap-1">
                          <Button
                            variant="default"
                            size="sm"
                            className="h-8 gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(
                                `/dashboard/rent?buildingID=${buildingID}&unitID=${unit.id}`,
                              );
                            }}
                          >
                            <ArrowUpRight className="h-3.5 w-3.5" />
                            Rent
                          </Button>
                          {isAdmin && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log("Edit clicked", unit);
                              }}
                            >
                              <Edit className="h-3.5 w-3.5" />
                              Edit
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Floor Plan Dialog */}
      <Dialog open={isEditFloorPlanOpen} onOpenChange={setIsEditFloorPlanOpen}>
        <DialogContent className="border-none sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Commercial Floor Plan</DialogTitle>
            <DialogDescription>
              Modify the layout and units of Floor {selectedFloor}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="floor-name">Floor Name</Label>
                <Input
                  id="floor-name"
                  defaultValue={`Floor ${selectedFloor}`}
                  className="bg-background/60"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="floor-units">Number of Units</Label>
                <Input
                  id="floor-units"
                  type="number"
                  defaultValue="12"
                  className="bg-background/60"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Floor Layout</Label>
              <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-muted/10 p-4">
                <p className="text-center text-muted-foreground">
                  <FileText className="mx-auto mb-2 h-8 w-8" />
                  Drag and drop a floor plan image or click to upload
                </p>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="floor-notes">Notes</Label>
              <Textarea
                id="floor-notes"
                placeholder="Add any notes about this commercial floor..."
                className="bg-background/60"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditFloorPlanOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

export default FloorPlan;
