"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileText, ArrowRight, Check } from "lucide-react";

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
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

import {
  NumberFormField,
  SelectFormField,
  DateFormField,
  TextareaFormField,
} from "@/components/custom/form-field";
import { Group } from "@/components/custom/group";

// Template type
type LeaseTemplate = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  isDefault: boolean;
};

// Schema for lease creation
const createLeaseSchema = z.object({
  templateId: z.string().min(1, "Template is required"),
  unitId: z.string().min(1, "Unit is required"),
  tenantId: z.string().min(1, "Tenant is required"),
  startDate: z.coerce.date(),
  endDate: z.date(),
  monthlyRent: z.coerce.number().min(1, "Monthly rent is required"),
  securityDeposit: z.coerce.number().min(0),
  notes: z.string().optional(),
  sendImmediately: z.boolean().default(false),
});

type CreateLeaseFormValues = z.infer<typeof createLeaseSchema>;

interface CreateLeaseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  templates: LeaseTemplate[];
  onCreateLease: (lease: Partial<CreateLeaseFormValues>) => void;
}

export function CreateLeaseDialog({
  isOpen,
  onOpenChange,
  templates,
  onCreateLease,
}: CreateLeaseDialogProps) {
  const [step, setStep] = useState<"details" | "review" | "success">("details");
  const [selectedTemplate, setSelectedTemplate] =
    useState<LeaseTemplate | null>(null);

  // Sample data for units and tenants
  const units = [
    { value: "unit1", label: "101 - Office (1000 sq ft)" },
    { value: "unit2", label: "102 - Retail (800 sq ft)" },
    { value: "unit3", label: "201 - Office (1200 sq ft)" },
    { value: "unit4", label: "202 - Office (900 sq ft)" },
    { value: "unit5", label: "301 - Executive Suite (1500 sq ft)" },
  ];

  const tenants = [
    { value: "tenant1", label: "Acme Corporation" },
    { value: "tenant2", label: "Global Retail Inc." },
    { value: "tenant3", label: "Tech Startup LLC" },
    { value: "tenant4", label: "Legal Services Co." },
    { value: "tenant5", label: "Executive Consulting Group" },
  ];

  // Form for the lease
  const form = useForm<CreateLeaseFormValues>({
    resolver: zodResolver(createLeaseSchema),
    defaultValues: {
      templateId: templates.find((t) => t.isDefault)?.id || "",
      unitId: "",
      tenantId: "",
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      monthlyRent: 0,
      securityDeposit: 0,
      notes: "",
      sendImmediately: true,
    },
  });

  // Update selected template when template ID changes
  const watchTemplateId = form.watch("templateId");
  useState(() => {
    const template = templates.find((t) => t.id === watchTemplateId) || null;
    setSelectedTemplate(template);
  });

  // Handle form submission
  const onSubmit = (data: CreateLeaseFormValues) => {
    if (step === "details") {
      setStep("review");
    } else if (step === "review") {
      onCreateLease(data);
      setStep("success");
    }
  };

  // Reset dialog state
  const resetDialog = () => {
    form.reset();
    setStep("details");
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
            <FileText className="h-5 w-5 text-primary" />
            Create New Lease
          </DialogTitle>
          <DialogDescription>
            Create a new lease agreement for a tenant
          </DialogDescription>
        </DialogHeader>

        {step === "success" ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-4 rounded-full bg-green-100 p-3">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">
              Lease Created Successfully
            </h3>
            <p className="mb-6 text-center text-muted-foreground">
              {form.getValues("sendImmediately")
                ? "The lease has been created and sent to the tenant for signature."
                : "The lease has been created and saved as a draft."}
            </p>
            <Button onClick={() => handleOpenChange(false)}>Close</Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="mb-6 flex justify-center">
                <div className="flex items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${step === "details" ? "bg-primary text-primary-foreground" : "bg-muted-foreground text-muted"}`}
                  >
                    1
                  </div>
                  <div className="mx-2 h-1 w-16 bg-muted-foreground"></div>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${step === "review" ? "bg-primary text-primary-foreground" : "bg-muted-foreground text-muted"}`}
                  >
                    2
                  </div>
                </div>
              </div>

              {step === "details" && (
                <div className="space-y-4">
                  <SelectFormField
                    control={form.control}
                    name="templateId"
                    label="Lease Template"
                    options={templates.map((template) => ({
                      label: template.name,
                      value: template.id,
                    }))}
                  />

                  <Group className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <SelectFormField
                      control={form.control}
                      name="unitId"
                      label="Unit"
                      options={units}
                    />
                    <SelectFormField
                      control={form.control}
                      name="tenantId"
                      label="Tenant"
                      options={tenants}
                    />
                  </Group>

                  <Group className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <DateFormField
                      control={form.control}
                      name="startDate"
                      label="Start Date"
                    />
                    <DateFormField
                      control={form.control}
                      name="endDate"
                      label="End Date"
                    />
                  </Group>

                  <Group className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <NumberFormField
                      control={form.control}
                      name="monthlyRent"
                      label="Monthly Rent ($)"
                    />
                    <NumberFormField
                      control={form.control}
                      name="securityDeposit"
                      label="Security Deposit ($)"
                    />
                  </Group>

                  <TextareaFormField
                    control={form.control}
                    name="notes"
                    label="Notes"
                    placeholder="Add any additional notes about this lease"
                    rows={3}
                  />
                </div>
              )}

              {step === "review" && (
                <div className="space-y-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Template
                          </h4>
                          <p>{selectedTemplate?.name || "Unknown Template"}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Unit
                          </h4>
                          <p>
                            {units.find(
                              (u) => u.value === form.getValues("unitId"),
                            )?.label || "Unknown Unit"}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Tenant
                          </h4>
                          <p>
                            {tenants.find(
                              (t) => t.value === form.getValues("tenantId"),
                            )?.label || "Unknown Tenant"}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Lease Term
                          </h4>
                          <p>
                            {form.getValues("startDate").toLocaleDateString()}{" "}
                            to {form.getValues("endDate").toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Monthly Rent
                          </h4>
                          <p>
                            ${form.getValues("monthlyRent").toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Security Deposit
                          </h4>
                          <p>
                            $
                            {form.getValues("securityDeposit").toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {form.getValues("notes") && (
                        <>
                          <Separator className="my-4" />
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground">
                              Notes
                            </h4>
                            <p className="whitespace-pre-wrap text-sm">
                              {form.getValues("notes")}
                            </p>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sendImmediately"
                      checked={form.getValues("sendImmediately")}
                      onChange={(e) =>
                        form.setValue("sendImmediately", e.target.checked)
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="sendImmediately" className="text-sm">
                      Send to tenant immediately for electronic signature
                    </label>
                  </div>
                </div>
              )}

              <DialogFooter className="mt-6">
                {step === "details" ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep("details")}
                    >
                      Back
                    </Button>
                    <Button type="submit">
                      {form.getValues("sendImmediately")
                        ? "Create & Send Lease"
                        : "Create Lease"}
                    </Button>
                  </>
                )}
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
