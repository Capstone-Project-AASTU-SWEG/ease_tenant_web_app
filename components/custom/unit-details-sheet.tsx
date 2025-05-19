"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ArrowUpRight,
  Clock,
  Edit,
  Store,
  Calendar,
  SquareIcon as SquareFoot,
  FileSignature,
  ImageIcon,
  Trash,
  ChevronLeft,
  ChevronRight,
  Building,
  Check,
  ExternalLink,
  X,
  User,
  Phone,
  Banknote,
  Layers,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { UNIT_STATUS } from "@/types";
import { StatusBadgeStyles, UnitTypeIcons } from "@/constants/icons";
import { Group } from "@/components/custom/group";
import type { UnitWithId } from "@/app/quries/useUnits";
import { useRouter } from "next/navigation";
import type { BuildingWithStat } from "@/app/quries/useBuildings";
import { Center } from "./center";
import Stack from "./stack";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface UnitAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

export interface UnitDetailsSheetProps {
  unit: UnitWithId;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  building: BuildingWithStat;
  actions?: UnitAction[];
}

export function UnitDetailsSheet({
  unit,
  isOpen,
  onOpenChange,
  building,
  actions = [],
}: UnitDetailsSheetProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const router = useRouter();

  // Default actions if none provided
  const defaultActions: UnitAction[] = [
    {
      icon: <ArrowUpRight className="h-4 w-4" />,
      label: "Rent",
      onClick: () => {
        router.push(
          `/dashboard/rent?buildingId=${building.id}&unitId=${unit.id}`,
        );
      },
      variant: "default",
    },
    {
      icon: <Edit className="h-4 w-4" />,
      label: "Edit",
      onClick: () => console.log("Edit clicked"),
      variant: "outline",
    },
    {
      icon: <FileSignature className="h-4 w-4" />,
      label: "Lease",
      onClick: () => console.log("Lease clicked"),
      variant: "outline",
    },
    {
      icon: <Trash className="h-4 w-4" />,
      label: "Delete",
      onClick: () => console.log("Delete clicked"),
      variant: "destructive",
    },
  ];

  const unitActions = actions.length > 0 ? actions : defaultActions;

  if (!unit) return null;

  const isOccupied = unit.status === UNIT_STATUS.OCCUPIED;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full overflow-hidden p-0 sm:max-w-md md:max-w-lg lg:max-w-xl"
        side="right"
      >
        <SheetTitle className="sr-only">Unit Detail</SheetTitle>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="flex h-full flex-col"
        >
          {/* Header with image gallery */}
          <div className="relative">
            <ImageGallery
              images={unit.images || []}
              initialIndex={activeImageIndex}
              onImageChange={setActiveImageIndex}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-4 z-10 h-9 w-9 rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1">
              <Badge
                className={cn(
                  "w-fit border px-3 py-1 text-xs font-medium shadow-sm backdrop-blur-sm",
                  StatusBadgeStyles[unit.status],
                )}
              >
                {unit.status}
              </Badge>
            </div>
          </div>

          {/* Unit title and info */}
          <div className="px-6 py-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Unit {unit.unitNumber}
                </h2>
                <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                  <Building className="h-4 w-4" />
                  <span className="text-sm">{building.name}</span>
                </div>
              </div>
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full",
                  isOccupied
                    ? "bg-primary/10 text-primary"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800",
                )}
              >
                {UnitTypeIcons[unit.type]}
              </div>
            </div>

            {/* Key details */}
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <SquareFoot className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Size</p>
                    <p className="font-medium">{unit.sizeSqFt} sq ft</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Banknote className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Monthly Rate
                    </p>
                    <p className="font-medium">${unit.monthlyRent}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 border-b border-t px-6 py-3">
            {unitActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                onClick={action.onClick}
                className="flex-1 gap-1.5 shadow-sm"
                size="sm"
              >
                {action.icon}
                <span>{action.label}</span>
              </Button>
            ))}
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-6 px-6 py-5">
              {/* Unit type */}
              <div>
                <h3 className="mb-3 text-sm font-medium uppercase text-muted-foreground">
                  Unit Type
                </h3>
                <Group className="text-sm" spacing="xs">
                  <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-900/50">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                      {UnitTypeIcons[unit.type]}
                    </div>
                    <span className="font-medium">{unit.type}</span>
                  </div>
                </Group>
              </div>

              {/* Current tenant info (if occupied) */}
              {isOccupied && (
                <div>
                  <h3 className="mb-3 text-sm font-medium uppercase text-muted-foreground">
                    Current Tenant
                  </h3>
                  <Card className="overflow-hidden border-none bg-gradient-to-br from-blue-50 to-blue-50/50 shadow-sm dark:from-blue-950/20 dark:to-blue-950/10">
                    <CardHeader className="pb-2 pt-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                          <Store className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            Acme Corporation
                          </CardTitle>
                          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>Lease ends Dec 31, 2025</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      {/* Additional tenant details */}
                      <div className="mt-3 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 rounded-lg bg-white/50 px-3 py-2 dark:bg-slate-900/10">
                            <User className="h-4 w-4 text-blue-500" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Contact
                              </p>
                              <p className="text-sm font-medium">John Smith</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 rounded-lg bg-white/50 px-3 py-2 dark:bg-slate-900/10">
                            <Phone className="h-4 w-4 text-blue-500" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Phone
                              </p>
                              <p className="text-sm font-medium">
                                (555) 123-4567
                              </p>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 w-full bg-white/50 dark:bg-slate-900/10"
                        >
                          <ExternalLink className="mr-2 h-3.5 w-3.5" />
                          View Tenant Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Unit features/amenities */}
              <div>
                <h3 className="mb-3 text-sm font-medium uppercase text-muted-foreground">
                  Features & Amenities
                </h3>
                {unit.amenities.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {unit.amenities.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-900/50"
                      >
                        <Check className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-900/50">
                    <p className="text-sm text-muted-foreground">
                      No amenities listed
                    </p>
                  </div>
                )}
              </div>

              {/* Location */}
              <div>
                <h3 className="mb-3 text-sm font-medium uppercase text-muted-foreground">
                  Location
                </h3>
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-900/50">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Layers className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Floor</p>
                    <p className="font-medium">{unit.floorNumber || 1}</p>
                  </div>
                </div>
              </div>

              {/* Maintenance history */}
              <div>
                <h3 className="mb-3 text-sm font-medium uppercase text-muted-foreground">
                  Maintenance History
                </h3>
                <Card className="border-none shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">HVAC System Upgrade</div>
                      <Badge variant="outline" className="font-normal">
                        Completed
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>March 15, 2023</span>
                    </div>
                    <Separator className="my-3" />
                    <p className="text-sm">
                      Replaced air conditioning unit and upgraded ventilation
                      system.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Notes section */}
              <div>
                <h3 className="mb-3 text-sm font-medium uppercase text-muted-foreground">
                  Unit Description
                </h3>
                <div className="rounded-xl border border-dashed bg-slate-50/50 p-4 dark:bg-slate-900/20">
                  <p className="text-sm text-muted-foreground">
                    {unit.description || "No additional notes for this unit."}
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}

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

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="h-[240px] w-full bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <Center className="h-full w-full">
          <Stack className="items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
              <ImageIcon className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
              No images available
            </p>
          </Stack>
        </Center>
      </div>
    );
  }

  return (
    <div>
      <div className="relative overflow-hidden">
        <AspectRatio ratio={16 / 9} className="bg-slate-100 dark:bg-slate-800">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full"
            >
              <Image
                src={images[activeIndex] || "/placeholder.svg"}
                alt={"Unit image"}
                fill
                className="object-cover"
                unoptimized
              />
            </motion.div>
          </AnimatePresence>

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-3 top-1/2 z-10 h-9 w-9 -translate-y-1/2 rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 top-1/2 z-10 h-9 w-9 -translate-y-1/2 rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40"
                onClick={handleNext}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
              <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full bg-white/50 backdrop-blur-sm transition-all",
                      activeIndex === index && "w-4 bg-white",
                    )}
                    onClick={() => setActiveIndex(index)}
                  />
                ))}
              </div>
            </>
          )}
        </AspectRatio>
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto px-6 pb-1">
          {images.map((url, index) => (
            <motion.button
              key={url}
              className={cn(
                "relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg",
                activeIndex === index
                  ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-950"
                  : "opacity-70 hover:opacity-100",
              )}
              onClick={() => setActiveIndex(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src={url || "/placeholder.svg"}
                alt={`Thumbnail ${index + 1}`}
                width={80}
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
