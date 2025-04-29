"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
  Receipt,
  Shield,
  Coffee,
  ParkingMeterIcon as Parking,
  CableCarIcon as Elevator,
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TenantsTable } from "../_components/tenants-table";
import { useParams, useRouter } from "next/navigation";

import { Group } from "@/components/custom/group";
import EnhancedFloorPlan from "../_components/floor-plan";
import { MAINTENANCE_STATUS } from "@/types";
import {
  getBuildings,
  getSelectedBuilding,
  useBuildingStore,
} from "../_hooks/useBuildings";
import { UnitSplitDialog } from "./_components/unit-split-dialog";
import { UnitMergeDialog } from "./_components/unit-merge-dialog";

// Main Page Component
const Page = () => {
  // Get building ID from URL parameters
  const params = useParams();
  const buildingID = params["id"] as string;

  // Get building store actions
  const { setSelectedBuilding, updateBuilding } = useBuildingStore();

  const router = useRouter();

  // Set selected building on component mount
  useEffect(() => {
    if (buildingID) setSelectedBuilding(buildingID);
  }, [buildingID, setSelectedBuilding]);

  // Get the selected building
  const building = getSelectedBuilding();

  // Calculate occupancy rate
  const occupancyRate = building
    ? Math.round(
        ((building.totalUnits - building.availableUnits) /
          building.totalUnits) *
          100,
      )
    : 0;

  // Dialog state management
  const [isEditBuildingOpen, setIsEditBuildingOpen] = useState(false);

  const [isSplitUnitOpen, setIsSplitUnitOpen] = useState(false);
  const [isMergeUnitsOpen, setIsMergeUnitsOpen] = useState(false);
  const [isLeaseManagementOpen, setIsLeaseManagementOpen] = useState(false);
  const [isFinancialReportsOpen, setIsFinancialReportsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("floors");

  // Form state for edit building
  const [editForm, setEditForm] = useState({
    name: building?.name || "",
    description: building?.description || "",
    street: building?.address?.street || "",
    city: building?.address?.city || "",
    country: building?.address?.country || "",
    totalFloors: building?.totalFloors || 0,
    totalUnits: building?.totalUnits || 0,
    amenities: building?.amenities || [],
    maintenanceStatus: building?.maintenanceStatus || MAINTENANCE_STATUS.GOOD,
  });

  // Update form when building changes
  useEffect(() => {
    if (building) {
      setEditForm({
        name: building.name,
        description: building.description || "",
        street: building.address.street,
        city: building.address.city,
        country: building.address.country,
        totalFloors: building.totalFloors,
        totalUnits: building.totalUnits,
        amenities: building.amenities,
        maintenanceStatus: building.maintenanceStatus,
      });
    }
  }, [building]);

  // Handle building update
  const handleUpdateBuilding = () => {
    if (building) {
      updateBuilding(building.id, {
        name: editForm.name,
        description: editForm.description,
        address: {
          street: editForm.street,
          city: editForm.city,
          country: editForm.country,
        },
        totalFloors: editForm.totalFloors,
        totalUnits: editForm.totalUnits,
        amenities: editForm.amenities,
        maintenanceStatus: editForm.maintenanceStatus,
        updatedAt: new Date(),
      });
      setIsEditBuildingOpen(false);
    }
  };

  // Toggle amenity in edit form
  const toggleAmenity = (amenity: string) => {
    setEditForm((prev) => {
      const amenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities };
    });
  };

  if (!buildingID)
    return <div className="p-8 text-center">Building ID not provided</div>;

  if (!building) {
    return <div className="p-8 text-center">Building not found</div>;
  }

  console.log({ sb: getSelectedBuilding(), bg: getBuildings(), buildingID });

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative flex-1 overflow-hidden p-4 md:p-6"
    >
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
          <Home className="mr-1 h-3 w-3" /> {building.address.street},{" "}
          {building.address.city}, {building.address.country}
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
                      {building.totalUnits - building.availableUnits}
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
                    <span className="font-medium">
                      {building.maintenanceStatus}
                    </span>{" "}
                    Maintenance Status
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
              <QuickActionButton
                icon={<Receipt className="h-5 w-5" />}
                label="Finacial Reports"
                variant="outline"
                onClick={() => setIsFinancialReportsOpen(true)}
                index={5}
              />
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
          <TabsList className="rounded-full bg-background/50 backdrop-blur-sm">
            <TabsTrigger
              value="floors"
              className="rounded-full px-5 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Floor Plans
            </TabsTrigger>
            <TabsTrigger
              value="tenants"
              className="rounded-full px-5 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
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
          <div className="grid gap-4 py-4">
            {/* Basic Information Section */}
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Basic Information
              </h3>
              <div className="h-px w-full bg-border" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="building-name">Building Name</Label>
              <Input
                id="building-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="bg-background/60"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="building-description">Description</Label>
              <Textarea
                id="building-description"
                className="bg-background/60"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />
            </div>

            {/* Address Section */}
            <div className="space-y-1 pt-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Address
              </h3>
              <div className="h-px w-full bg-border" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="building-street">Street</Label>
              <Input
                id="building-street"
                value={editForm.street}
                onChange={(e) =>
                  setEditForm({ ...editForm, street: e.target.value })
                }
                className="bg-background/60"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="building-city">City</Label>
                <Input
                  id="building-city"
                  value={editForm.city}
                  onChange={(e) =>
                    setEditForm({ ...editForm, city: e.target.value })
                  }
                  className="bg-background/60"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="building-country">Country</Label>
                <Input
                  id="building-country"
                  value={editForm.country}
                  onChange={(e) =>
                    setEditForm({ ...editForm, country: e.target.value })
                  }
                  className="bg-background/60"
                />
              </div>
            </div>

            {/* Building Details Section */}
            <div className="space-y-1 pt-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Building Details
              </h3>
              <div className="h-px w-full bg-border" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="building-floors">Total Floors</Label>
                <Input
                  id="building-floors"
                  type="number"
                  value={editForm.totalFloors}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      totalFloors: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  className="bg-background/60"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="building-units">Total Units</Label>
                <Input
                  id="building-units"
                  type="number"
                  value={editForm.totalUnits}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      totalUnits: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  className="bg-background/60"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="building-maintenance">Maintenance Status</Label>
              <Select
                value={editForm.maintenanceStatus}
                onValueChange={(value) =>
                  setEditForm({
                    ...editForm,
                    maintenanceStatus: value as MAINTENANCE_STATUS,
                  })
                }
              >
                <SelectTrigger
                  id="building-maintenance"
                  className="bg-background/60"
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={MAINTENANCE_STATUS.GOOD}>Good</SelectItem>
                  <SelectItem value={MAINTENANCE_STATUS.NEEDS_REPAIR}>
                    Need Repair
                  </SelectItem>
                  <SelectItem value={MAINTENANCE_STATUS.UNDER_MAINTENANCE}>
                    Under Maintenance
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amenities Section */}
            <div className="space-y-1 pt-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Amenities
              </h3>
              <div className="h-px w-full bg-border" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="amenity-parking"
                  checked={editForm.amenities.includes("parking")}
                  onCheckedChange={() => toggleAmenity("parking")}
                />
                <Label
                  htmlFor="amenity-parking"
                  className="flex items-center gap-1.5"
                >
                  <Parking className="h-4 w-4 text-muted-foreground" />
                  Parking
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="amenity-elevator"
                  checked={editForm.amenities.includes("elevator")}
                  onCheckedChange={() => toggleAmenity("elevator")}
                />
                <Label
                  htmlFor="amenity-elevator"
                  className="flex items-center gap-1.5"
                >
                  <Elevator className="h-4 w-4 text-muted-foreground" />
                  Elevator
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="amenity-security"
                  checked={editForm.amenities.includes("security")}
                  onCheckedChange={() => toggleAmenity("security")}
                />
                <Label
                  htmlFor="amenity-security"
                  className="flex items-center gap-1.5"
                >
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  Security
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="amenity-cafeteria"
                  checked={editForm.amenities.includes("cafeteria")}
                  onCheckedChange={() => toggleAmenity("cafeteria")}
                />
                <Label
                  htmlFor="amenity-cafeteria"
                  className="flex items-center gap-1.5"
                >
                  <Coffee className="h-4 w-4 text-muted-foreground" />
                  Cafeteria
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditBuildingOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={handleUpdateBuilding}>
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

// Helper functions for occupancy indicators
const getOccupancyColor = (occupancy: number) => {
  if (occupancy >= 90) return "bg-green-500";
  if (occupancy >= 70) return "bg-blue-500";
  if (occupancy >= 50) return "bg-amber-500";
  return "bg-red-500";
};

const getOccupancyTextColor = (occupancy: number) => {
  if (occupancy >= 90) return "text-green-600";
  if (occupancy >= 70) return "text-blue-600";
  if (occupancy >= 50) return "text-amber-600";
  return "text-red-600";
};

export default Page;
