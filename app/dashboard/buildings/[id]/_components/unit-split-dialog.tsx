"use client";

import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Scissors, Plus, Minus, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

// Schema for the main form
const unitSplitSchema = z.object({
  unitId: z.string().min(1, "Please select a unit to split"),
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

interface UnitSplitDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  buildingId: string;
  units: { id: string; unitNumber: string; sizeSqFt: number }[];
  onSplitUnit: (unitId: string, newUnits: NewUnitFormValues[]) => void;
}

export function UnitSplitDialog({
  isOpen,
  onOpenChange,
  units,
  onSplitUnit,
}: UnitSplitDialogProps) {
  const [step, setStep] = useState<"configure" | "details">("configure");
  const [selectedUnit, setSelectedUnit] = useState<{
    id: string;
    unitNumber: string;
    sizeSqFt: number;
  } | null>(null);
  const [remainingSqFt, setRemainingSqFt] = useState(0);

  // Main form for selecting unit and number of splits
  const form = useForm<UnitSplitFormValues>({
    resolver: zodResolver(unitSplitSchema),
    defaultValues: {
      unitId: units[0].id,
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
    const unit = units.find((u) => u.id === data.unitId);
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
    setStep("details");
  };

  // Handle size adjustment for a unit
  const adjustSize = (index: number, adjustment: number) => {
    const currentSize = +newUnitForm.getValues(`units.${index}.sizeSqFt`);
    const newSize = Math.max(1, currentSize + adjustment);
    console.log({ newSize, currentSize });
    newUnitForm.setValue(`units.${index}.sizeSqFt`, newSize);
  };

  // Handle final submission
  const handleSplitSubmit = () => {
    if (!selectedUnit) return;

    // Validate the form before submission
    newUnitForm.handleSubmit((data) => {
      onSplitUnit(selectedUnit.id, data.units);
      resetDialog();
      onOpenChange(false);
    })();
  };

  // Reset dialog state
  const resetDialog = () => {
    form.reset();
    newUnitForm.reset({ units: [] });
    setStep("configure");
    setSelectedUnit(null);
    setRemainingSqFt(0);
  };

  // Handle dialog close
  const handleOpenChange = (open: boolean) => {
    if (!open) resetDialog();
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Scissors className="h-5 w-5 text-primary" />
            Split Unit
          </DialogTitle>
          <DialogDescription>
            Divide an existing unit into multiple smaller units
          </DialogDescription>
        </DialogHeader>

        {step === "configure" ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onConfigure)}
              className="space-y-4"
            >
              <SelectFormField
                control={form.control}
                name="unitId"
                label="Select Unit to Split"
                options={units.map((unit) => ({
                  label: `${unit.unitNumber} (${unit.sizeSqFt} sq ft)`,
                  value: unit.id,
                }))}
              />

              <NumberFormField
                control={form.control}
                name="numberOfUnits"
                label="Number of New Units"
                placeholder="2"
                min={2}
                // max={10}
              />

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Continue</Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <Form {...newUnitForm}>
            <form onSubmit={handleSplitSubmit} className="space-y-4">
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm font-medium">
                  Splitting Unit {selectedUnit?.unitNumber} (
                  {selectedUnit?.sizeSqFt} sq ft) into {fields.length} units
                </p>
                <p className="text-xs text-muted-foreground">
                  Remaining unallocated space:{" "}
                  <span className={remainingSqFt < 0 ? "text-destructive" : ""}>
                    {remainingSqFt} sq ft
                  </span>
                </p>
              </div>

              {remainingSqFt < 0 && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {`You've`} allocated more space than available. Please
                    adjust the sizes of your new units.
                  </AlertDescription>
                </Alert>
              )}

              <Tabs defaultValue="0" className="w-full">
                <TabsList className="grid w-full grid-cols-4 sm:grid-cols-5 md:grid-cols-6">
                  {fields.map((_, index) => (
                    <TabsTrigger key={index} value={index.toString()}>
                      Unit {index + 1}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {fields.map((field, index) => (
                  <TabsContent
                    key={field.id}
                    value={index.toString()}
                    className="space-y-4"
                  >
                    <Stack spacing="md">
                      <Group className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <TextFormField
                          control={newUnitForm.control}
                          name={`units.${index}.unitNumber`}
                          label="Unit Number"
                          placeholder={`e.g., ${selectedUnit?.unitNumber}-${String.fromCharCode(65 + index)}`}
                        />
                        <div>
                          <Label className="mb-2 block font-normal">
                            Size (sq ft)
                          </Label>
                          <Group className="">
                            <NumberFormField
                              control={newUnitForm.control}
                              name={`units.${index}.sizeSqFt`}
                              min={1}
                            />

                            <Button
                              type="button"
                              variant="outline"
                              className="flex h-9 w-9 items-center justify-center rounded-full"
                              onClick={() => adjustSize(index, -1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              className="flex h-9 w-9 items-center justify-center rounded-full"
                              onClick={() => adjustSize(index, 1)}
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
                          options={Object.values(UNIT_TYPE).map((type) => ({
                            label:
                              type.charAt(0).toUpperCase() +
                              type.slice(1).replace("_", " "),
                            value: type,
                          }))}
                        />
                        <SelectFormField
                          control={newUnitForm.control}
                          name={`units.${index}.status`}
                          label="Unit Status"
                          options={Object.values(UNIT_STATUS).map((status) => ({
                            label:
                              status.charAt(0).toUpperCase() +
                              status.slice(1).replace("_", " "),
                            value: status,
                          }))}
                        />
                      </Group>
                    </Stack>
                  </TabsContent>
                ))}
              </Tabs>

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("configure")}
                >
                  Back
                </Button>
                <Button type="submit" disabled={remainingSqFt < 0}>
                  <Save className="mr-2 h-4 w-4" />
                  Split Unit
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
