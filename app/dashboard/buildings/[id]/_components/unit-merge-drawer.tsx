"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Combine,
  Save,
  X,
  ChevronRight,
  Building,
  LayoutGrid,
  ArrowRight,
  Layers,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Form } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import {
  TextFormField,
  NumberFormField,
  SelectFormField,
  TextareaFormField,
} from "@/components/custom/form-field";
import { Group } from "@/components/custom/group";
import { UNIT_STATUS, UNIT_TYPE } from "@/types";

// Schema for the merged unit
const mergedUnitSchema = z.object({
  unitNumber: z.string().min(1, "Unit number is required"),
  sizeSqFt: z.number().min(1, "Size must be greater than 0"),
  type: z.nativeEnum(UNIT_TYPE),
  status: z.nativeEnum(UNIT_STATUS),
  notes: z.string().optional(),
});

type MergedUnitFormValues = z.infer<typeof mergedUnitSchema>;

interface UnitMergeSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  buildingId: string;
  units: {
    id: string;
    unitNumber: string;
    sizeSqFt: number;
    floorNumber: number;
  }[];
  onMergeUnits: (unitIds: string[], mergedUnit: MergedUnitFormValues) => void;
}

export function UnitMergeSheet({
  isOpen,
  onOpenChange,
  units,
  onMergeUnits,
}: UnitMergeSheetProps) {
  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);
  const [selectedUnits, setSelectedUnits] = useState<typeof units>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [activeTab, setActiveTab] = useState<"select" | "configure">("select");

  // Group units by floor for better organization
  const unitsByFloor = units.reduce(
    (acc, unit) => {
      const floor = unit.floorNumber;
      if (!acc[floor]) acc[floor] = [];
      acc[floor].push(unit);
      return acc;
    },
    {} as Record<number, typeof units>,
  );

  // Sort floors for consistent display
  const sortedFloors = Object.keys(unitsByFloor)
    .map(Number)
    .sort((a, b) => a - b);

  // Form for the merged unit details
  const form = useForm<MergedUnitFormValues>({
    resolver: zodResolver(mergedUnitSchema),
    defaultValues: {
      unitNumber: "",
      sizeSqFt: 0,
      type: UNIT_TYPE.OFFICE,
      status: UNIT_STATUS.AVAILABLE,
      notes: "",
    },
  });

  // Update selected units when selection changes
  useEffect(() => {
    const selected = units.filter((unit) => selectedUnitIds.includes(unit.id));
    setSelectedUnits(selected);

    const size = selected.reduce((sum, unit) => sum + unit.sizeSqFt, 0);
    setTotalSize(size);

    // Update the form with the total size
    form.setValue("sizeSqFt", size);

    // Suggest a unit number based on selected units
    if (selected.length > 0) {
      const sortedUnits = [...selected].sort((a, b) =>
        a.unitNumber.localeCompare(b.unitNumber),
      );
      const firstUnit = sortedUnits[0].unitNumber;
      const lastUnit = sortedUnits[sortedUnits.length - 1].unitNumber;
      form.setValue("unitNumber", `${firstUnit}-${lastUnit}`);
    }
  }, [selectedUnitIds, units, form]);

  // Toggle unit selection
  const toggleUnitSelection = (unitId: string) => {
    setSelectedUnitIds((prev) =>
      prev.includes(unitId)
        ? prev.filter((id) => id !== unitId)
        : [...prev, unitId],
    );
  };

  // Handle form submission
  const onSubmit = (data: MergedUnitFormValues) => {
    if (selectedUnitIds.length < 2) return;
    onMergeUnits(selectedUnitIds, data);
    resetSheet();
    onOpenChange(false);
  };

  // Reset sheet state
  const resetSheet = () => {
    form.reset();
    setSelectedUnitIds([]);
    setSelectedUnits([]);
    setTotalSize(0);
    setActiveTab("select");
  };

  // Handle sheet close
  const handleOpenChange = (open: boolean) => {
    if (!open) resetSheet();
    onOpenChange(open);
  };

  // Proceed to configuration step
  const proceedToConfiguration = () => {
    if (selectedUnitIds.length >= 2) {
      setActiveTab("configure");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        className="flex w-full flex-col border-none p-0 shadow-xl sm:max-w-md md:max-w-lg lg:max-w-xl"
        side="right"
      >
        <SheetHeader className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Combine className="h-5 w-5 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-xl">Merge Units</SheetTitle>
                <SheetDescription className="text-sm">
                  Combine multiple units into a single larger unit
                </SheetDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "select" | "configure")}
          className="flex-1"
        >
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-[calc(100vh-10rem)]">
              <TabsContent value="select" className="m-0 p-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key="select"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="overflow-hidden border-none shadow-sm">
                      <CardContent className="p-0">
                        <div className="mx-5 mb-4 mt-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-900/50">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                              <Building className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">
                                Select at least 2 units to merge
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Units must be on the same floor to be merged
                              </p>
                            </div>
                          </div>
                        </div>

                        {selectedUnits.length > 0 && (
                          <div className="mx-5 mb-4 rounded-lg border bg-white p-4 dark:bg-slate-900">
                            <h4 className="mb-3 flex items-center gap-2 font-medium">
                              <LayoutGrid className="h-4 w-4 text-primary" />
                              Selected Units ({selectedUnits.length})
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedUnits.map((unit) => (
                                <Badge
                                  key={unit.id}
                                  variant="secondary"
                                  className="flex items-center gap-1 rounded-full px-3 py-1.5"
                                >
                                  Unit {unit.unitNumber}
                                  <span className="mx-1 text-xs text-muted-foreground">
                                    ({unit.sizeSqFt} sq ft)
                                  </span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="ml-1 h-5 w-5 rounded-full p-0 hover:bg-slate-200 dark:hover:bg-slate-700"
                                    onClick={() => toggleUnitSelection(unit.id)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </Badge>
                              ))}
                            </div>

                            <div className="mt-4">
                              <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                  Total Size
                                </span>
                                <span className="font-medium">
                                  {totalSize} sq ft
                                </span>
                              </div>
                              <Progress
                                value={
                                  (selectedUnits.length /
                                    Math.max(
                                      Object.values(unitsByFloor).flat().length,
                                      1,
                                    )) *
                                  100
                                }
                                className="h-2"
                              />
                            </div>
                          </div>
                        )}

                        <div className="px-5 pb-5">
                          {sortedFloors.map((floor) => (
                            <div key={floor} className="mb-6 last:mb-0">
                              <div className="mb-3 flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                  <Layers className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                </div>
                                <h4 className="font-medium">Floor {floor}</h4>
                              </div>
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {unitsByFloor[floor].map((unit) => (
                                  <div
                                    key={unit.id}
                                    className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                                      selectedUnitIds.includes(unit.id)
                                        ? "border-primary/30 bg-primary/5"
                                        : "hover:border-slate-300 dark:hover:border-slate-700"
                                    }`}
                                  >
                                    <Checkbox
                                      id={`unit-${unit.id}`}
                                      checked={selectedUnitIds.includes(
                                        unit.id,
                                      )}
                                      onCheckedChange={() =>
                                        toggleUnitSelection(unit.id)
                                      }
                                      className="h-5 w-5 rounded-md"
                                    />
                                    <label
                                      htmlFor={`unit-${unit.id}`}
                                      className="flex flex-1 cursor-pointer items-center justify-between"
                                    >
                                      <span className="font-medium">
                                        Unit {unit.unitNumber}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="font-normal"
                                      >
                                        {unit.sizeSqFt} sq ft
                                      </Badge>
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              </TabsContent>

              <TabsContent value="configure" className="m-0 p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key="configure"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="overflow-hidden border-none shadow-sm">
                      <CardHeader className="bg-slate-50 px-5 py-4 dark:bg-slate-900/50">
                        <CardTitle className="text-base">
                          New Merged Unit Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-5 py-4">
                        <div className="mb-6 rounded-lg bg-primary/5 p-4">
                          <h4 className="mb-3 font-medium">
                            Merging {selectedUnits.length} Units
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedUnits.map((unit) => (
                              <Badge
                                key={unit.id}
                                variant="outline"
                                className="rounded-full"
                              >
                                Unit {unit.unitNumber}
                              </Badge>
                            ))}
                          </div>
                          <Separator className="my-3" />
                          <div className="flex items-center justify-between text-sm">
                            <span>Total Size:</span>
                            <span className="font-medium">
                              {totalSize} sq ft
                            </span>
                          </div>
                        </div>

                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                          >
                            <TextFormField
                              control={form.control}
                              name="unitNumber"
                              label="New Unit Number"
                              placeholder="e.g., 101-102"
                            />

                            <NumberFormField
                              control={form.control}
                              name="sizeSqFt"
                              label="Total Size (sq ft)"
                            />

                            <Group className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <SelectFormField
                                control={form.control}
                                name="type"
                                label="Unit Type"
                                options={Object.values(UNIT_TYPE).map(
                                  (type) => ({
                                    label:
                                      type.charAt(0).toUpperCase() +
                                      type.slice(1).replace("_", " "),
                                    value: type,
                                  }),
                                )}
                              />

                              <SelectFormField
                                control={form.control}
                                name="status"
                                label="Unit Status"
                                options={Object.values(UNIT_STATUS).map(
                                  (status) => ({
                                    label:
                                      status.charAt(0).toUpperCase() +
                                      status.slice(1).replace("_", " "),
                                    value: status,
                                  }),
                                )}
                              />
                            </Group>

                            <TextareaFormField
                              control={form.control}
                              name="notes"
                              label="Notes"
                              placeholder="Add any notes about this merge operation"
                              rows={3}
                            />
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              </TabsContent>
            </ScrollArea>
          </div>
        </Tabs>

        <SheetFooter className="border-t px-6 py-4">
          {activeTab === "select" ? (
            <div className="flex w-full justify-between">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={proceedToConfiguration}
                disabled={selectedUnitIds.length < 2}
                className="gap-2"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex w-full justify-between">
              <Button
                variant="outline"
                onClick={() => setActiveTab("select")}
                className="gap-2"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Back
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)} className="gap-2">
                <Save className="h-4 w-4" />
                Merge Units
              </Button>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
