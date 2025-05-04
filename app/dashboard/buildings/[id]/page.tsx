"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
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
  Building as BuildingIcon,
  FileSignature,
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

import { TenantsTable } from "../_components/tenants-table";
import { useParams, useRouter } from "next/navigation";

import { Group } from "@/components/custom/group";
import EnhancedFloorPlan from "../_components/floor-plan";
import { UnitSplitDialog } from "./_components/unit-split-dialog";
import { UnitMergeDialog } from "./_components/unit-merge-dialog";
import { useGetBuildingQuery } from "@/app/quries/useBuildings";
import LogJSON from "@/components/custom/log-json";
import { getOccupancyColor, getOccupancyTextColor } from "@/utils";

// Main Page Component
const Page = () => {
  // Get building ID from URL parameters
  const params = useParams();
  const buildingID = params["id"] as string;
  const router = useRouter();

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
      <div>
        <p>Getting building data</p>
      </div>
    );
  }

  if (getBuildingQuery.isError) {
    return (
      <div>
        <p>{getBuildingQuery.error?.message}</p>
      </div>
    );
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
            <h1 className="text-2xl font-bold">{building.name}</h1>
          </Group>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => setIsEditBuildingOpen(true)}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </motion.div>
        </Group>
        <p className="mt-1 flex items-center text-muted-foreground">
          <Home className="mr-1 h-3 w-3" /> {building.address?.street},{" "}
          {building.address?.city}, {building.address?.country}
        </p>
      </motion.div>

      {/* Building overview and quick actions cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-6 grid gap-6 md:grid-cols-3"
      >
        {/* Building Overview Card */}
        <Card className="overflow-hidden rounded-md border border-neutral-200/50 bg-background/70 backdrop-blur-md transition-all duration-300 hover:shadow-md">
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
                    <span className="font-medium">{building.totalFloors}</span>{" "}
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
        <Card className="overflow-hidden rounded-md border border-neutral-200/50 bg-background/70 backdrop-blur-md transition-all duration-300 hover:shadow-md md:col-span-2">
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
                  // TODO: NESRU_DEBUG
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
                  // Redirect to lease mngt page for specific building
                }}
                index={4}
              />
              {/* <QuickActionButton
                icon={<Receipt className="h-5 w-5" />}
                label="Finacial Reports"
                variant="outline"
                onClick={() => setIsFinancialReportsOpen(true)}
                index={5}
              /> */}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs for Floor Plans and Tenants */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
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

      <UnitSplitDialog
        isOpen={isSplitUnitOpen}
        buildingId={buildingID}
        onOpenChange={(open) => {
          setIsSplitUnitOpen(open);
        }}
        units={[
          { id: "1", sizeSqFt: 100, unitNumber: "001" },
          { id: "2", sizeSqFt: 100, unitNumber: "002" },
          { id: "3", sizeSqFt: 100, unitNumber: "003" },
        ]}
        onSplitUnit={(unitID, newUnits) => {
          console.log({ unitID, newUnits });
        }}
      />

      <UnitMergeDialog
        isOpen={isMergeUnitsOpen}
        buildingId={buildingID}
        onOpenChange={(open) => {
          setIsMergeUnitsOpen(open);
        }}
        units={[
          { id: "1", sizeSqFt: 100, unitNumber: "001", floorNumber: 1 },
          { id: "2", sizeSqFt: 100, unitNumber: "002", floorNumber: 1 },
          { id: "3", sizeSqFt: 100, unitNumber: "001", floorNumber: 2 },
          { id: "4", sizeSqFt: 100, unitNumber: "002", floorNumber: 2 },
        ]}
        onMergeUnits={(unitID, newUnits) => {
          console.log({ unitID, newUnits });
        }}
      />

      {/* Merge Units Dialog */}

      {/* Reports Dialog */}
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
