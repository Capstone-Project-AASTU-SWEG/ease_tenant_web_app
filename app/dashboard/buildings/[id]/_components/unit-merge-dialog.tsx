"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Combine, Save, X } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface UnitMergeDialogProps {
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

export function UnitMergeDialog({
  isOpen,
  onOpenChange,
  units,
  onMergeUnits,
}: UnitMergeDialogProps) {
  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);
  const [selectedUnits, setSelectedUnits] = useState<typeof units>([]);
  const [totalSize, setTotalSize] = useState(0);

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
    resetDialog();
    onOpenChange(false);
  };

  // Reset dialog state
  const resetDialog = () => {
    form.reset();
    setSelectedUnitIds([]);
    setSelectedUnits([]);
    setTotalSize(0);
  };

  // Handle dialog close
  const handleOpenChange = (open: boolean) => {
    if (!open) resetDialog();
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Combine className="h-5 w-5 text-primary" />
            Merge Units
          </DialogTitle>
          <DialogDescription>
            Combine multiple units into a single larger unit
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Unit selection panel */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">
              Select Units to Merge (minimum 2)
            </h3>
            <ScrollArea className="h-[400px] rounded-md border p-2">
              {Object.entries(unitsByFloor).map(([floor, floorUnits]) => (
                <div key={floor} className="mb-4">
                  <h4 className="mb-2 text-sm font-semibold">Floor {floor}</h4>
                  <div className="space-y-2">
                    {floorUnits.map((unit) => (
                      <div
                        key={unit.id}
                        className="flex items-center space-x-2 rounded-md border p-2"
                      >
                        <Checkbox
                          id={`unit-${unit.id}`}
                          checked={selectedUnitIds.includes(unit.id)}
                          onCheckedChange={() => toggleUnitSelection(unit.id)}
                        />
                        <label
                          htmlFor={`unit-${unit.id}`}
                          className="flex flex-1 cursor-pointer items-center justify-between text-sm"
                        >
                          <span>Unit {unit.unitNumber}</span>
                          <span className="text-muted-foreground">
                            {unit.sizeSqFt} sq ft
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </ScrollArea>

            {selectedUnits.length > 0 && (
              <div className="rounded-md bg-muted p-3">
                <h4 className="mb-2 text-sm font-medium">
                  Selected Units ({selectedUnits.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedUnits.map((unit) => (
                    <div
                      key={unit.id}
                      className="flex items-center rounded-full bg-secondary px-3 py-1 text-xs"
                    >
                      {unit.unitNumber}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-4 w-4"
                        onClick={() => toggleUnitSelection(unit.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs">Total Size: {totalSize} sq ft</p>
              </div>
            )}
          </div>

          {/* Merged unit details form */}
          <div>
            <h3 className="mb-4 text-sm font-medium">
              New Merged Unit Details
            </h3>
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
                    options={Object.values(UNIT_TYPE).map((type) => ({
                      label:
                        type.charAt(0).toUpperCase() +
                        type.slice(1).replace("_", " "),
                      value: type,
                    }))}
                  />

                  <SelectFormField
                    control={form.control}
                    name="status"
                    label="Unit Status"
                    options={Object.values(UNIT_STATUS).map((status) => ({
                      label:
                        status.charAt(0).toUpperCase() +
                        status.slice(1).replace("_", " "),
                      value: status,
                    }))}
                  />
                </Group>

                <TextareaFormField
                  control={form.control}
                  name="notes"
                  label="Notes"
                  placeholder="Add any notes about this merge operation"
                  rows={3}
                />

                <DialogFooter className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={selectedUnitIds.length < 2}>
                    <Save className="mr-2 h-4 w-4" />
                    Merge Units
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
