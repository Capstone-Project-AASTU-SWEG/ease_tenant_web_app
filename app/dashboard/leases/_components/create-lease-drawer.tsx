"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FileText,
  Check,
  Building,
  Calendar,
  DollarSign,
  ClipboardList,
  Send,
  Save,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter } from "@/components/ui/sheet";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  NumberFormField,
  SelectFormField,
  DateFormField,
  TextareaFormField,
} from "@/components/custom/form-field";
import CustomSheetHeader from "@/components/custom/sheet-header";
import { Group } from "@/components/custom/group";
import { RentalApplication, Tenant, WithTimestampsStr } from "@/types";
import LogJSON from "@/components/custom/log-json";
import { useGetAllUnitsOfBuildingQuery } from "@/app/quries/useUnits";
import { useGetBuilding, useGetBuildingTenants } from "@/hooks/use-building";
// import LogJSON from "@/components/custom/log-json";

// Template type
type LeaseTemplate = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
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

interface CreateLeaseDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  templates: LeaseTemplate[];
  onCreateLease: (lease: Partial<CreateLeaseFormValues>) => void;
  application:
    | (RentalApplication & {
        id: string;
      } & {
        submittedBy: Tenant;
      } & WithTimestampsStr)
    | undefined;
}

export function CreateLeaseDrawer({
  isOpen,
  onOpenChange,
  templates,
  onCreateLease,
  application,
}: CreateLeaseDrawerProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [selectedTemplate, setSelectedTemplate] =
    useState<LeaseTemplate | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { getBuildingQuery } = useGetBuilding();
  const { getBuildingTenantsQuery } = useGetBuildingTenants();

  // Sample data for units and tenants
  const units = getBuildingQuery.data?.units || [];

  const unitsDataItems = units?.map((unit) => ({
    value: unit.id,
    label: unit.unitNumber,
  }));

  const tenants = [{ value: "tenant1", label: "Acme Corporation" }];

  // Form for the lease
  const form = useForm<CreateLeaseFormValues>({
    resolver: zodResolver(createLeaseSchema),
    defaultValues: {
      templateId: templates.find((t) => t.isDefault)?.id || "",
      unitId: application?.unit.id || "",
      tenantId: application?.submittedBy.id || "",
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      monthlyRent: application?.unit.monthlyRent || 0,
      securityDeposit: 0,
      notes: "",
      sendImmediately: true,
    },
  });

  // Update selected template when template ID changes
  const watchTemplateId = form.watch("templateId");
  useEffect(() => {
    const template = templates.find((t) => t.id === watchTemplateId) || null;
    setSelectedTemplate(template);
  }, [watchTemplateId, templates]);

  // Handle form submission
  const onSubmit = (data: CreateLeaseFormValues) => {
    if (activeTab === "details") {
      setActiveTab("review");
    } else if (activeTab === "review") {
      onCreateLease(data);
      setIsSuccess(true);
    }
  };

  // Reset drawer state
  const resetDrawer = () => {
    form.reset();
    setActiveTab("details");
    setIsSuccess(false);
  };

  // Handle drawer close
  const handleOpenChange = (open: boolean) => {
    if (!open) resetDrawer();
    onOpenChange(open);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full max-w-[600px] overflow-hidden p-0 sm:max-w-[700px] md:max-w-[900px]">
        <LogJSON
          data={{
            // formData: form.getValues(),
            // application,
            abc: getBuildingTenantsQuery.data,
          }}
        />
        <div className="flex h-full flex-col">
          {isSuccess ? (
            <div className="flex flex-1 flex-col items-center justify-center p-8">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg">
                <Check className="h-10 w-10 text-white" />
              </div>
              <h3 className="mb-3 text-2xl font-semibold tracking-tight">
                Lease Created Successfully
              </h3>
              <p className="mb-8 max-w-md text-center text-muted-foreground">
                {form.getValues("sendImmediately")
                  ? "The lease has been created and sent to the tenant for signature. You'll be notified when they respond."
                  : "The lease has been created and saved as a draft. You can send it to the tenant at any time."}
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => handleOpenChange(false)}
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />
                  View Lease
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col px-4">
              <CustomSheetHeader
                icon={FileText}
                title="Create New Lease"
                description="Create a new lease agreement for a tenant"
              />

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-1 flex-col overflow-hidden"
                >
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="flex flex-1 flex-col overflow-hidden"
                  >
                    <TabsList className="h-14 w-full justify-start gap-8 bg-transparent p-0">
                      <TabsTrigger value="details" className="">
                        Lease Details
                      </TabsTrigger>
                      <TabsTrigger value="review" className="">
                        Review & Create
                      </TabsTrigger>
                    </TabsList>

                    <div className="flex-1 overflow-hidden">
                      <TabsContent
                        value="details"
                        className="mt-0 h-full p-0 data-[state=active]:flex data-[state=active]:flex-col"
                      >
                        <ScrollArea className="flex-1">
                          <div className="max-w-3xl space-y-6">
                            <Card className="overflow-hidden border shadow-sm">
                              <CardHeader>
                                <CardTitle>
                                  <Group spacing={"sm"}>
                                    <ClipboardList className="h-5 w-5 text-primary" />
                                    <h4 className="font-medium">
                                      Template Selection
                                    </h4>
                                  </Group>
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                {/* <LogJSON data={{ templates }} /> */}

                                <SelectFormField
                                  control={form.control}
                                  name="templateId"
                                  label="Lease Template"
                                  options={templates.map((template) => ({
                                    label: template.name,
                                    value: template.id,
                                  }))}
                                />

                                {selectedTemplate && (
                                  <div className="mt-3 rounded-md bg-muted/30 p-3 text-sm">
                                    <p className="text-muted-foreground">
                                      {selectedTemplate.description}
                                    </p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden border shadow-sm">
                              <div className="border-b bg-muted/30 px-5 py-3">
                                <div className="flex items-center gap-2">
                                  <Building className="h-5 w-5 text-primary" />
                                  <h4 className="font-medium">
                                    Property & Tenant
                                  </h4>
                                </div>
                              </div>
                              <CardContent className="p-5">
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                  <SelectFormField
                                    control={form.control}
                                    name="unitId"
                                    label="Unit"
                                    options={unitsDataItems}
                                  />
                                  <SelectFormField
                                    control={form.control}
                                    name="tenantId"
                                    label="Tenant"
                                    options={tenants}
                                  />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden border shadow-sm">
                              <div className="border-b bg-muted/30 px-5 py-3">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-5 w-5 text-primary" />
                                  <h4 className="font-medium">Lease Term</h4>
                                </div>
                              </div>
                              <CardContent className="p-5">
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden border shadow-sm">
                              <div className="border-b bg-muted/30 px-5 py-3">
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-5 w-5 text-primary" />
                                  <h4 className="font-medium">
                                    Financial Terms
                                  </h4>
                                </div>
                              </div>
                              <CardContent className="p-5">
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden border shadow-sm">
                              <div className="border-b bg-muted/30 px-5 py-3">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-5 w-5 text-primary" />
                                  <h4 className="font-medium">
                                    Additional Information
                                  </h4>
                                </div>
                              </div>
                              <CardContent className="p-5">
                                <TextareaFormField
                                  control={form.control}
                                  name="notes"
                                  label="Notes"
                                  placeholder="Add any additional notes about this lease"
                                  rows={3}
                                />
                              </CardContent>
                            </Card>
                          </div>
                        </ScrollArea>
                      </TabsContent>

                      <TabsContent
                        value="review"
                        className="mt-0 h-full p-0 data-[state=active]:flex data-[state=active]:flex-col"
                      >
                        <ScrollArea className="flex-1">
                          <div className="max-w-3xl space-y-6">
                            <Card className="overflow-hidden border shadow-sm">
                              <CardHeader>
                                <CardTitle>
                                  <Group spacing={"sm"}>
                                    <ClipboardList className="h-5 w-5 text-primary" />
                                    <h4 className="font-medium">
                                      Lease Summary
                                    </h4>
                                  </Group>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="p-0">
                                <div className="divide-y">
                                  <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3">
                                    <div className="space-y-2">
                                      <h4 className="text-sm font-medium text-muted-foreground">
                                        Template
                                      </h4>
                                      <div className="flex items-center gap-2">
                                        <ClipboardList className="h-4 w-4 text-primary" />
                                        <p className="font-medium">
                                          {selectedTemplate?.name ||
                                            "Unknown Template"}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <h4 className="text-sm font-medium text-muted-foreground">
                                        Unit
                                      </h4>
                                      <div className="flex items-center gap-2">
                                        <Building className="h-4 w-4 text-primary" />
                                        <p className="font-medium">
                                          {units.find(
                                            (u) =>
                                              u.value ===
                                              form.getValues("unitId"),
                                          )?.label || "Unknown Unit"}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <h4 className="text-sm font-medium text-muted-foreground">
                                        Tenant
                                      </h4>
                                      <div className="flex items-center gap-2">
                                        <Badge
                                          variant="outline"
                                          className="font-normal"
                                        >
                                          {tenants.find(
                                            (t) =>
                                              t.value ===
                                              form.getValues("tenantId"),
                                          )?.label || "Unknown Tenant"}
                                        </Badge>
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <h4 className="text-sm font-medium text-muted-foreground">
                                        Lease Term
                                      </h4>
                                      <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-primary" />
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm">
                                            {form
                                              .getValues("startDate")
                                              .toLocaleDateString()}
                                          </span>
                                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                          <span className="text-sm">
                                            {form
                                              .getValues("endDate")
                                              .toLocaleDateString()}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <h4 className="text-sm font-medium text-muted-foreground">
                                        Monthly Rent
                                      </h4>
                                      <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-primary" />
                                        <p className="font-medium">
                                          $
                                          {form
                                            .getValues("monthlyRent")
                                            .toLocaleString()}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <h4 className="text-sm font-medium text-muted-foreground">
                                        Security Deposit
                                      </h4>
                                      <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-primary" />
                                        <p className="font-medium">
                                          $
                                          {form
                                            .getValues("securityDeposit")
                                            .toLocaleString()}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {form.getValues("notes") && (
                                    <div className="p-6">
                                      <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                          Notes
                                        </h4>
                                        <div className="rounded-md bg-muted/30 p-3">
                                          <p className="whitespace-pre-wrap text-sm">
                                            {form.getValues("notes")}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="overflow-hidden border shadow-sm">
                              <CardContent className="p-5">
                                <div className="flex items-start space-x-3">
                                  <Checkbox
                                    id="sendImmediately"
                                    checked={form.getValues("sendImmediately")}
                                    onCheckedChange={(checked) =>
                                      form.setValue(
                                        "sendImmediately",
                                        checked as boolean,
                                      )
                                    }
                                    className="mt-1 h-5 w-5"
                                  />
                                  <div className="space-y-1">
                                    <label
                                      htmlFor="sendImmediately"
                                      className="text-sm font-medium"
                                    >
                                      Send to tenant immediately for electronic
                                      signature
                                    </label>
                                    <p className="text-xs text-muted-foreground">
                                      The tenant will receive an email with a
                                      link to review and sign the lease
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    </div>
                  </Tabs>

                  <SheetFooter className="border-t px-6 py-4">
                    <div className="flex w-full justify-between">
                      {activeTab === "details" ? (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" className="gap-2">
                            Continue to Review
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setActiveTab("details")}
                          >
                            Back to Details
                          </Button>
                          <Button type="submit" className="gap-2">
                            {form.getValues("sendImmediately") ? (
                              <>
                                <Send className="h-4 w-4" />
                                Create & Send Lease
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4" />
                                Create Lease
                              </>
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </SheetFooter>
                </form>
              </Form>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
