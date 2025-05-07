"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  MapPin,
  Building,
  Tag,
  Check,
  ExternalLink,
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
import { BuildingWithStat } from "@/app/quries/useBuildings";
import { Center } from "./center";
import Stack from "./stack";

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
        className="w-full overflow-y-auto p-0 sm:max-w-md md:max-w-lg lg:max-w-xl"
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
              className="absolute left-4 top-4 h-8 w-8 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50"
              onClick={() => onOpenChange(false)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="absolute bottom-4 left-4 flex flex-col gap-1">
              <Badge
                className={cn("w-fit border", StatusBadgeStyles[unit.status])}
              >
                {unit.status}
              </Badge>
            </div>
          </div>

          {/* Unit title and info */}
          <div className="px-6 py-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">Unit {unit.unitNumber}</h2>
                <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                  <Building className="h-4 w-4" />
                  <span>{building.name}</span>
                </div>
              </div>
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  isOccupied
                    ? "bg-primary/10"
                    : "bg-slate-100 dark:bg-slate-800",
                )}
              >
                {UnitTypeIcons[unit.type]}
              </div>
            </div>

            {/* Key details */}
            <div className="mt-4 grid grid-cols-2 gap-4 rounded-lg bg-muted/30 p-3">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Size</span>
                <div className="flex items-center gap-1.5 font-medium">
                  <SquareFoot className="h-4 w-4 text-primary" />
                  {unit.sizeSqFt} sq ft
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  Monthly Rate
                </span>
                <div className="flex items-center gap-1.5 font-medium">
                  <Tag className="h-4 w-4 text-primary" />
                  {unit.monthlyRent}
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center flex-wrap gap-2 border-b border-t px-6 py-3">
            {unitActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                onClick={action.onClick}
                // className="flex-1"
              >
                {action.icon}
                <span className="ml-2">{action.label}</span>
              </Button>
            ))}
          </div>

          <ScrollArea className="flex-1">
            <div className="px-6 py-4">
              <div className="grid gap-6">
                {/* Unit type */}
                <div>
                  <h3 className="mb-2 font-semibold">Unit Type</h3>
                  <Group className="text-sm" spacing="xs">
                    {UnitTypeIcons[unit.type]} {unit.type}
                  </Group>
                </div>

                {/* Current tenant info (if occupied) */}
                {isOccupied && (
                  <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-50/50 p-4 dark:from-blue-950/20 dark:to-blue-950/10">
                    <h3 className="mb-3 font-semibold">Current Tenant</h3>
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

                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      <ExternalLink className="mr-2 h-3.5 w-3.5" />
                      View Tenant Details
                    </Button>
                  </div>
                )}

                {/* Unit features/amenities */}
                <div>
                  <h3 className="mb-2 font-semibold">Features & Amenities</h3>
                  <div className="grid gap-2">
                    {unit.amenities.length > 0 ? (
                      <div className="grid gap-1.5">
                        {unit.amenities.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Check className="h-4 w-4 text-primary" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No amenities listed
                      </p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="mb-2 font-semibold">Location</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>Floor {unit.floorNumber || 1}</span>
                  </div>
                </div>

                {/* Maintenance history */}
                <div>
                  <h3 className="mb-2 font-semibold">Maintenance History</h3>
                  <div className="space-y-3">
                    <div className="rounded-lg border p-3">
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
                      <Separator className="my-2" />
                      <p className="text-sm">
                        Replaced air conditioning unit and upgraded ventilation
                        system.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notes section */}
                <div>
                  <h3 className="mb-2 font-semibold">Unit Description</h3>
                  <div className="rounded-lg border border-dashed p-3">
                    <p className="text-sm text-muted-foreground">
                      {unit.description || "No additional notes for this unit."}
                    </p>
                  </div>
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
      <Center className="rounded-lg border bg-slate-50 h-[10rem] text-center dark:bg-slate-900">
        <Stack>
        <ImageIcon className="mx-auto mb-2 h-10 w-10 text-slate-400" />
        <p className="text-sm text-slate-500">No images available</p>

        </Stack>
      </Center>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-lg">
        <AspectRatio ratio={16 / 9} className="bg-slate-100 dark:bg-slate-800">
          <Image
            src={images[activeIndex] || "/placeholder.svg"}
            alt={"Unit image"}
            fill
            className="object-cover"
            unoptimized
          />
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50"
                onClick={handleNext}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full bg-white/50 transition-all",
                      activeIndex === index && "w-3 bg-white",
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
