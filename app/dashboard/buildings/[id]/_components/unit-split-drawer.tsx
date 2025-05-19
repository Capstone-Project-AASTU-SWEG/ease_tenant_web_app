"use client";

import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scissors,
  Plus,
  Minus,
  Save,
  ArrowLeft,
  X,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Divide,
  LayoutGrid,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  SelectFormField,
  NumberFormField,
  TextFormField,
} from "@/components/custom/form-field";
import { Stack } from "@/components/custom/stack";
import { Group } from "@/components/custom/group";
import { UNIT_STATUS, UNIT_TYPE } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetBuilding } from "@/hooks/use-building";
import { getFloors } from "@/utils";

// Schema for the main form
const unitSplitSchema = z.object({
  unitId: z.string().min(1, "Please select a unit to split"),
  floor: z.string(),
  numberOfUnits: z.coerce
    .number()
    .min(2, "Must split into at least 2 units")
    .max(10, "Cannot split into more than 10 units"),
});

// Schema for each new unit
const newUnitSchema = z.object({
  unitNumber: z.string().min(1, "Unit number is required"),
  sizeSqFt: z.coerce.number().min(1, "Size must be greater than 0"),
  type: z.nativeEnum(UNIT_TYPE),
  status: z.nativeEnum(UNIT_STATUS).default(UNIT_STATUS.AVAILABLE),
});

type UnitSplitFormValues = z.infer<typeof unitSplitSchema>;
type NewUnitFormValues = z.infer<typeof newUnitSchema>;

interface UnitSplitSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  buildingId: string;
  onSplitUnit: (unitId: string, newUnits: NewUnitFormValues[]) => void;
}

export function UnitSplitSheet({
  isOpen,
  onOpenChange,
  onSplitUnit,
}: UnitSplitSheetProps) {
  const { getBuildingQuery } = useGetBuilding();
  const building = getBuildingQuery.data;
  const [step, setStep] = useState<"configure" | "details">("configure");
  const [selectedUnit, setSelectedUnit] = useState<{
    id: string;
    unitNumber: string;
    sizeSqFt: number;
  } | null>(null);
  const [remainingSqFt, setRemainingSqFt] = useState(0);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Main form for selecting unit and number of splits
  const form = useForm<UnitSplitFormValues>({
    resolver: zodResolver(unitSplitSchema),
    defaultValues: {
      unitId: "",
      numberOfUnits: 2,
    },
  });

  const newUnitForm = useForm<{ units: NewUnitFormValues[] }>({
    resolver: zodResolver(z.object({ units: z.array(newUnitSchema) })),
    defaultValues: {
      units: [],
    },
  });

  const { fields } = useFieldArray({
    control: newUnitForm.control,
    name: "units",
  });

  // Calculate remaining square footage whenever unit sizes change
  useEffect(() => {
    if (!selectedUnit) return;

    const subscription = newUnitForm.watch((value) => {
      if (!value.units) return;

      const totalAllocated = value.units.reduce(
        (sum, unit) => sum + (unit?.sizeSqFt || 0),
        0,
      );
      setRemainingSqFt(selectedUnit.sizeSqFt - totalAllocated);
    });

    return () => subscription.unsubscribe();
  }, [selectedUnit, newUnitForm]);

  // Handle proceeding to the next step
  const onConfigure = (data: UnitSplitFormValues) => {
    const unit = building?.units.find((u) => u.id === data.unitId);
    if (!unit) return;

    setSelectedUnit(unit);
    let remainingSqFt = unit.sizeSqFt;

    // Initialize new units with default values
    const initialUnits: NewUnitFormValues[] = Array.from(
      { length: data.numberOfUnits },
      (_, i) => {
        const sizeSqFt = Math.floor(unit.sizeSqFt / data.numberOfUnits);
        remainingSqFt -= sizeSqFt;
        return {
          unitNumber: `${unit.unitNumber}-${String.fromCharCode(65 + i)}`, // e.g., 101-A, 101-B
          sizeSqFt,
          type: UNIT_TYPE.OFFICE,
          status: UNIT_STATUS.AVAILABLE,
        };
      },
    );

    setRemainingSqFt(remainingSqFt);

    // Clear any existing units and append new ones
    newUnitForm.reset({ units: initialUnits });
    setActiveTabIndex(0);
    setStep("details");
  };

  // Handle size adjustment for a unit
  const adjustSize = (index: number, adjustment: number) => {
    const currentSize = +newUnitForm.getValues(`units.${index}.sizeSqFt`);
    const newSize = Math.max(1, currentSize + adjustment);
    newUnitForm.setValue(`units.${index}.sizeSqFt`, newSize);
  };

  // Handle final submission
  const handleSplitSubmit = () => {
    if (!selectedUnit) return;

    // Validate the form before submission
    newUnitForm.handleSubmit((data) => {
      onSplitUnit(selectedUnit.id, data.units);
      resetSheet();
      onOpenChange(false);
    })();
  };

  // Reset sheet state
  const resetSheet = () => {
    form.reset();
    newUnitForm.reset({ units: [] });
    setStep("configure");
    setSelectedUnit(null);
    setRemainingSqFt(0);
    setActiveTabIndex(0);
  };

  // Handle sheet close
  const handleOpenChange = (open: boolean) => {
    if (!open) resetSheet();
    onOpenChange(open);
  };

  // Navigate between tabs
  const navigateTab = (direction: "next" | "prev") => {
    if (direction === "next" && activeTabIndex < fields.length - 1) {
      setActiveTabIndex(activeTabIndex + 1);
    } else if (direction === "prev" && activeTabIndex > 0) {
      setActiveTabIndex(activeTabIndex - 1);
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
                <Scissors className="h-5 w-5 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-xl">Split Unit</SheetTitle>
                <SheetDescription className="text-sm">
                  Divide an existing unit into multiple smaller units
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

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="px-4 py-2">
              <AnimatePresence mode="wait">
                {step === "configure" ? (
                  <motion.div
                    key="configure"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onConfigure)}
                        className="space-y-6"
                      >
                        <Card className="overflow-hidden border-none shadow-sm">
                          <CardHeader className="bg-slate-50 px-5 py-4 dark:bg-slate-900/50">
                            <CardTitle className="text-base">
                              Select Unit to Split
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="px-5 py-4">
                            <Stack>
                              <SelectFormField
                                control={form.control}
                                name="floor"
                                label="Floor"
                                options={getFloors(
                                  building?.totalFloors || 0,
                                ).map((i) => ({
                                  label: `Floor ${i}`,
                                  value: i.toString(),
                                }))}
                              />
                              <SelectFormField
                                control={form.control}
                                name="unitId"
                                label="Unit"
                                options={
                                  building?.units.map((unit) => ({
                                    label: `${unit.unitNumber} (${unit.sizeSqFt} sq ft)`,
                                    value: unit.id,
                                  })) || []
                                }
                              />

                              <NumberFormField
                                control={form.control}
                                name="numberOfUnits"
                                label="Number of New Units"
                                placeholder="2"
                                min={2}
                              />
                            </Stack>
                          </CardContent>
                        </Card>

                        <div className="flex justify-end">
                          <Button type="submit" className="gap-2">
                            Continue
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Form {...newUnitForm}>
                      <form onSubmit={handleSplitSubmit} className="space-y-6">
                        <Card className="overflow-hidden border-none shadow-sm">
                          <CardContent className="p-0">
                            <div className="mb-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-900/50">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                                  <Divide className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">
                                    Splitting Unit {selectedUnit?.unitNumber} (
                                    {selectedUnit?.sizeSqFt} sq ft)
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Creating {fields.length} new units from the
                                    original space
                                  </p>
                                </div>
                              </div>
                            </div>

                            {remainingSqFt < 0 && (
                              <Alert variant="destructive" className="mb-4">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                  {`You've`} allocated more space than
                                  available. Please adjust the sizes of your new
                                  units.
                                </AlertDescription>
                              </Alert>
                            )}

                            <div className="mb-6">
                              <div className="mb-2 flex items-center justify-between">
                                <Label className="text-sm font-normal text-muted-foreground">
                                  Space allocation
                                </Label>
                                <span className="text-xs font-medium">
                                  {(((selectedUnit?.sizeSqFt || 0) -
                                    remainingSqFt) /
                                    (selectedUnit?.sizeSqFt || 1)) *
                                    100}
                                  %
                                </span>
                              </div>
                              <Progress
                                value={
                                  (((selectedUnit?.sizeSqFt || 0) -
                                    remainingSqFt) /
                                    (selectedUnit?.sizeSqFt || 1)) *
                                  100
                                }
                                className="h-2"
                              />
                            </div>

                            <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <LayoutGrid className="h-4 w-4 text-primary" />
                                <h3 className="font-medium">New Units</h3>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => navigateTab("prev")}
                                  disabled={activeTabIndex === 0}
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => navigateTab("next")}
                                  disabled={
                                    activeTabIndex === fields.length - 1
                                  }
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <Tabs
                              value={activeTabIndex.toString()}
                              onValueChange={(value) =>
                                setActiveTabIndex(Number.parseInt(value))
                              }
                              className="w-full"
                            >
                              <TabsList className="mb-4 grid w-full grid-cols-5 gap-1 bg-transparent p-0">
                                {fields.map((_, index) => (
                                  <TabsTrigger
                                    key={index}
                                    value={index.toString()}
                                    className={`${
                                      index === activeTabIndex
                                        ? "border-primary bg-primary/10"
                                        : "border-input bg-background"
                                    }`}
                                  >
                                    Unit {index + 1}
                                  </TabsTrigger>
                                ))}
                              </TabsList>

                              {fields.map((field, index) => (
                                <TabsContent
                                  key={field.id}
                                  value={index.toString()}
                                  className="mt-0 rounded-lg border bg-slate-50/50 p-4 dark:bg-slate-900/20"
                                >
                                  <Stack spacing="md">
                                    <Group className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                      <TextFormField
                                        control={newUnitForm.control}
                                        name={`units.${index}.unitNumber`}
                                        label="Unit Number"
                                        placeholder={`e.g., ${selectedUnit?.unitNumber}-${String.fromCharCode(
                                          65 + index,
                                        )}`}
                                      />
                                      <div>
                                        <Label className="mb-2 block text-sm font-medium">
                                          Size (sq ft)
                                        </Label>
                                        <Group className="items-center">
                                          <div className="flex-1">
                                            <NumberFormField
                                              control={newUnitForm.control}
                                              name={`units.${index}.sizeSqFt`}
                                              min={1}
                                            />
                                          </div>

                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9 rounded-md"
                                            onClick={() =>
                                              adjustSize(index, -10)
                                            }
                                          >
                                            <Minus className="h-4 w-4" />
                                          </Button>

                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9 rounded-md"
                                            onClick={() =>
                                              adjustSize(index, 10)
                                            }
                                          >
                                            <Plus className="h-4 w-4" />
                                          </Button>
                                        </Group>
                                      </div>
                                    </Group>

                                    <Group className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                      <SelectFormField
                                        control={newUnitForm.control}
                                        name={`units.${index}.type`}
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
                                        control={newUnitForm.control}
                                        name={`units.${index}.status`}
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
                                  </Stack>
                                </TabsContent>
                              ))}
                            </Tabs>
                          </CardContent>
                        </Card>
                      </form>
                    </Form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>

        <SheetFooter className="border-t px-6 py-4">
          {step === "configure" ? (
            <div className="flex w-full justify-between">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={form.handleSubmit(onConfigure)}>Continue</Button>
            </div>
          ) : (
            <div className="flex w-full justify-between">
              <Button
                variant="outline"
                onClick={() => setStep("configure")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleSplitSubmit}
                disabled={remainingSqFt < 0}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Split Unit
              </Button>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
