"use client";

import { useState, useEffect } from "react";
import { getBuildingByID } from "../_hooks/useBuildings";
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
  Clock,
  Edit,
  FileText,
  Store,
  DollarSign,
  Calendar,
  SquareIcon as SquareFoot,
  XCircle,
  Grid,
  List,
  FileSignature,
  AlertTriangle,
  Wrench,
  ImageIcon,
  Play,
  Filter,
  ChevronRight,
  MoreHorizontal,
  RefreshCw,
  FilterX,
  Plus,
  Trash,
  PlaySquare,
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { type Unit, UNIT_STATUS } from "@/types";
import Image from "next/image";
import { StatusBadgeStyles, UnitTypeIcons } from "@/constants/icons";
import SearchInput from "@/components/custom/search-input";
import { getUnitsByBuildingId } from "../_hooks/useUnits";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Group } from "@/components/custom/group";

interface ImageGalleryProps {
  images: string[];
  initialIndex?: number;
  onImageChange?: (index: number) => void;
}

const ImageGallery = ({
  images,
  initialIndex = 0,
  onImageChange,
}: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    if (onImageChange) {
      onImageChange(activeIndex);
    }
  }, [activeIndex, onImageChange]);

  if (!images || images.length === 0) {
    return (
      <div className="rounded-lg border bg-slate-50 p-6 text-center dark:bg-slate-900">
        <ImageIcon className="mx-auto mb-2 h-10 w-10 text-slate-400" />
        <p className="text-sm text-slate-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative overflow-hidden rounded-lg">
        <AspectRatio ratio={16 / 9} className="bg-slate-100 dark:bg-slate-800">
          <Image
            src={images[activeIndex] || "/placeholder.svg"}
            alt={"Unit image"}
            fill
            className="object-cover"
            unoptimized
          />
        </AspectRatio>
      </div>

      {images.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {images.map((url, index) => (
            <motion.button
              key={url}
              className={cn(
                "h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2",
                activeIndex === index
                  ? "border-primary"
                  : "border-transparent hover:border-primary/50",
              )}
              onClick={() => setActiveIndex(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src={url || "/placeholder.svg"}
                alt={`Thumbnail ${index + 1}`}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

interface VideoPlayerProps {
  videoUrl: string | null;
  onClose?: () => void;
}

const VideoPlayer = ({ videoUrl }: VideoPlayerProps) => {
  if (!videoUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
        No video URL provided
      </div>
    );
  }

  return (
    <div className="aspect-video bg-black">
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-white">Video would play here: {videoUrl}</p>
        {/* In a real implementation, you would use a video player component here */}
        <video src={videoUrl} controls className="h-full w-full" />
      </div>
    </div>
  );
};

const FloorPlan = ({ buildingID }: { buildingID: string }) => {
  const building = getBuildingByID(buildingID);
  const isAdmin = true;

  const router = useRouter();

  // State management
  const [selectedFloor, setSelectedFloor] = useState("1");
  const [isEditFloorPlanOpen, setIsEditFloorPlanOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [isUnitDetailsDrawerOpen, setIsUnitDetailsDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<UNIT_STATUS | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const units = getUnitsByBuildingId(buildingID);

  // DEBUG: Log when building or floor changes
  useEffect(() => {
    console.log("Building ID:", buildingID);
    console.log("Selected Floor:", selectedFloor);
  }, [buildingID, selectedFloor]);

  const getVisibleActions = () => {
    const commonActions = [
      {
        icon: <PlaySquare className="h-4 w-4" />,
        label: "Enquire",
        onClick: () => {
          router.push(
            `/dashboard/rent?buildingID=${buildingID}&unitID=${selectedUnit?.id}`,
          );
        },
      },
    ];

    const adminOnlyActions = [
      {
        icon: <Edit className="h-4 w-4" />,
        label: "Edit",
        onClick: () => console.log("Edit clicked"),
      },
      {
        icon: <FileSignature className="h-4 w-4" />,
        label: "Lease",
        onClick: () => console.log("Lease clicked"),
      },
      {
        icon: <Wrench className="h-4 w-4" />,
        label: "Maintenance",
        onClick: () => console.log("Maintenance clicked"),
      },
      {
        icon: <Trash className="h-4 w-4 text-red-500" />,
        label: "Delete",
        onClick: () => console.log("Maintenance clicked"),
      },
    ];

    return isAdmin ? [...commonActions, ...adminOnlyActions] : commonActions;
  };

  const filterUnits = (units: Unit[]) => {
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

  const handleUnitClick = (unit: Unit) => {
    setSelectedUnit(unit);
    setIsUnitDetailsDrawerOpen(true);
    setActiveImageIndex(0);
  };

  const handleVideoClick = (videoUrl: string) => {
    setActiveVideoUrl(videoUrl);
    setShowVideoModal(true);
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
              <div className="grid h-full grid-cols-1 gap-4  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <AnimatePresence>
                  {filteredUnits.map((unit, i) => {
                    const unitNumber = unit.unitNumber;
                    const unitType = unit.type;
                    const unitStatus = unit.status;
                    const isOccupied = unitStatus === UNIT_STATUS.OCCUPIED;
                    const unitImages = unit.imageUrls || [];
                    const hasImages = unitImages.length > 0;

                    return (
                      <motion.div
                        key={unitNumber}
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

                          <div className="mt-auto grid grid-cols-2 gap-y-2 text-sm">
                            <div className="flex items-center gap-1.5">
                              <SquareFoot className="h-4 w-4 text-slate-500" />
                              <span>{unit.sizeSqFt} sq ft</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <DollarSign className="h-4 w-4 text-slate-500" />
                              <span>{unit.monthlyRent}/month</span>
                            </div>
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
                        key={unitNumber}
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
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              onClick={() => handleUnitClick(unit)}
                            >
                              View Details
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-9 w-9 p-0"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                  Quick Actions
                                </DropdownMenuLabel>
                                {getVisibleActions().map((action, index) => (
                                  <DropdownMenuItem
                                    key={index}
                                    onClick={action.onClick}
                                    className="cursor-pointer"
                                  >
                                    {action.icon}
                                    <span className="ml-2">{action.label}</span>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
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
                        <div className="col-span-1 hidden text-right md:block">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 rounded-full p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleUnitClick(unit)}
                              >
                                <ArrowUpRight className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {getVisibleActions().map((action, index) => (
                                <DropdownMenuItem
                                  key={index}
                                  onClick={action.onClick}
                                >
                                  {action.icon}
                                  <span className="ml-2">{action.label}</span>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      {/* Unit Details Sheet */}
      <Sheet
        open={isUnitDetailsDrawerOpen}
        onOpenChange={setIsUnitDetailsDrawerOpen}
      >
        <SheetContent
          className="w-full overflow-y-auto sm:max-w-md md:max-w-lg lg:max-w-xl"
          side="right"
        >
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="flex h-full flex-col"
          >
            <SheetHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <SheetTitle className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full",
                      selectedUnit &&
                        selectedUnit.status === UNIT_STATUS.OCCUPIED
                        ? "bg-primary/10"
                        : "bg-slate-100 dark:bg-slate-800",
                    )}
                  >
                    {selectedUnit && UnitTypeIcons[selectedUnit.type]}
                  </div>
                  <span className="flex items-center gap-2">
                    {selectedUnit ? (
                      <>
                        Unit {selectedUnit.unitNumber}
                        {UnitTypeIcons[selectedUnit.type]}
                      </>
                    ) : (
                      "Loading..."
                    )}
                  </span>
                </SheetTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                    {selectedUnit &&
                      getVisibleActions().map((action, index) => (
                        <DropdownMenuItem key={index} onClick={action.onClick}>
                          {action.icon}
                          <span className="ml-2">{action.label}</span>
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <SheetDescription>
                Commercial unit details and management options
              </SheetDescription>
            </SheetHeader>

            <ScrollArea className="-mx-6 flex-1 px-6">
              <div className="py-4">
                {selectedUnit && (
                  <div className="grid gap-5">
                    {/* Status and size info */}
                    <div className="flex items-center justify-between">
                      <Badge
                        className={cn(
                          "border",
                          // TODO: MAKE BELOW CODE WORK
                          StatusBadgeStyles[selectedUnit.status],
                        )}
                      >
                        {selectedUnit.status}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <SquareFoot className="h-4 w-4" />
                        <span>{selectedUnit.sizeSqFt} sq ft</span>
                      </div>
                    </div>

                    {/* Unit images */}
                    <div className="space-y-3">
                      <Label>Images</Label>
                      <ImageGallery
                        images={selectedUnit.imageUrls || []}
                        initialIndex={activeImageIndex}
                        onImageChange={setActiveImageIndex}
                      />
                    </div>

                    {/* Unit videos */}
                    <div className="space-y-3">
                      <Label>Videos</Label>
                      {selectedUnit.videoUrls &&
                      selectedUnit.videoUrls.length > 0 ? (
                        <div className="grid gap-2">
                          {selectedUnit.videoUrls.map((url) => (
                            <Button
                              key={url}
                              variant="outline"
                              className="flex w-full items-center justify-center gap-2 rounded-lg border p-4 text-center"
                              onClick={() => handleVideoClick(url)}
                            >
                              <Play className="h-5 w-5" />
                              <span>{url}</span>
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-lg border bg-slate-50 p-6 text-center dark:bg-slate-900">
                          <Play className="mx-auto mb-2 h-10 w-10 text-slate-400" />
                          <p className="text-sm text-slate-500">
                            No videos available for this unit
                          </p>
                        </div>
                      )}
                    </div>

                    {/* //TODO: MAKE THIS WORK */}
                    {/* Current tenant info (if occupied) */}
                    {selectedUnit.status === UNIT_STATUS.OCCUPIED && (
                      <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-950/20">
                        <h3 className="mb-3 font-medium">Current Tenant</h3>
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                            <Store className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium">Acme Corporation</p>
                            <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Lease ends Dec 31, 2025</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Additional tenant details */}
                        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Contact</p>
                            <p>John Smith</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Phone</p>
                            <p>(555) 123-4567</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Unit details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Unit Type</Label>
                        <Group className="text-sm" spacing="xs">
                          {UnitTypeIcons[selectedUnit.type]} {selectedUnit.type}
                        </Group>
                      </div>
                      <div className="grid gap-2">
                        <Label>Monthly Rate</Label>
                        <p className="text-sm">
                          {selectedUnit.monthlyRent} /mo
                        </p>
                      </div>
                    </div>

                    {/* Unit features */}
                    <div className="grid gap-2">
                      <Label>Features</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedUnit.amenities.map((feature, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="rounded-full"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {/* //TODO: MAKE IT WORK */}
                    {/* Maintenance history */}
                    <div className="grid gap-2">
                      <Label>Last Maintenance</Label>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>HVAC System Upgrade - March 15, 2023</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </motion.div>
        </SheetContent>
      </Sheet>

      {/* Video Modal */}
      <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
        <DialogContent className="max-w-3xl border-none p-0">
          <DialogHeader className="p-4">
            <DialogTitle>Unit Video</DialogTitle>
          </DialogHeader>
          <VideoPlayer videoUrl={activeVideoUrl} />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default FloorPlan;
