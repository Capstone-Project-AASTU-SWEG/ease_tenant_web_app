"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  FileText,
  Building,
  ClipboardList,
  Send,
  Save,
  ArrowRight,
  XIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  SelectFormField,
  TextareaFormField,
  TextFormField,
  CheckboxFormField,
} from "@/components/custom/form-field";
import CustomSheetHeader from "@/components/custom/sheet-header";
import { Group } from "@/components/custom/group";
import { RentalApplication } from "@/types";
// import LogJSON from "@/components/custom/log-json";
import Stack from "@/components/custom/stack";
// import { DataListInput } from "@/components/custom/data-list-input";
import { useGetAllTenants } from "@/app/quries/useUsers";
import { getFullName, getFullNameFromObj } from "@/utils";
import { CreateLease, createLeaseSchema, LeaseTemplate } from "../_schema";
import LeasePreviewMinimal from "@/components/custom/lease-preview";
import { generateLeaseDataValues } from "@/utils/lease-data-mapper";
import { Label } from "@/components/ui/label";
import LogJSON from "@/components/custom/log-json";
import { useAuth } from "@/app/quries/useAuth";
import { useRouter } from "next/navigation";

interface CreateLeaseDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  templates: (LeaseTemplate & { id: string })[];
  onCreateLease: (lease: Partial<CreateLease>) => void;
  application: RentalApplication
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
  const getAllTenantsQuery = useGetAllTenants();

  const router = useRouter();

  const { data, isManager } = useAuth();

  const tenants = getAllTenantsQuery.data || [];

  if (data && !isManager) {
    router.replace("/dashboard/tenant");
  }

  // Form for the lease
  const form = useForm<CreateLease>({
    resolver: zodResolver(createLeaseSchema),
    defaultValues: {
      templateId: templates.find((t) => t.isDefault)?.id || "",
      buildingName: application?.building.name || data?.building?.name || "",
      unitNumber: application?.unit.unitNumber || "",
      tenantId: application?.submittedBy.id || "",
      monthlyRent: application?.unit.monthlyRent || 0,
      notes: "",
      sendImmediately: true,
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (templates.length ) {
      reset({
        templateId: templates.find((t) => t.isDefault)?.id || "",
        tenantId: application?.submittedBy.id,
        buildingName: application?.building.name || data?.building?.name,
        unitNumber: application?.unit.unitNumber,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        monthlyRent: application?.unit.monthlyRent,
        securityDeposit: 0,
        notes: "",
        sendImmediately: true,
      });
    }
  }, [templates, application, reset, data?.building?.name]);

  // Update selected template when template ID changes
  const watchTemplateId = form.watch("templateId");
  useEffect(() => {
    const template = templates.find((t) => t.id === watchTemplateId) || null;
    setSelectedTemplate(template);
  }, [watchTemplateId, templates]);

  // Handle form submission
  const onSubmit = (data: CreateLease) => {
    if (activeTab === "details") {
      setActiveTab("review");
    } else if (activeTab === "review") {
      onCreateLease(data);
    }
  };

  // Reset drawer state
  const resetDrawer = () => {
    form.reset();
    setActiveTab("details");
  };

  // Handle drawer close
  const handleOpenChange = (open: boolean) => {
    if (!open) resetDrawer();
    onOpenChange(open);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full max-w-[500px] overflow-hidden p-0 sm:max-w-[600px] md:max-w-[800px]">
        <LogJSON
          data={{
            // formData: form.getValues(),
            // application,
            building: data?.building,
            defaultValues: form.getValues()
            // tenants,

            // abc: getBuildingTenantsQuery.data,
          }}
        />
        <div className="flex h-full flex-col">
          <div className="flex h-full flex-col px-6">
            <CustomSheetHeader
              icon={FileText}
              title="Create New Lease"
              description="Create a new lease agreement for a tenant"
              rightSection={
                <Button
                  variant="outline"
                  size={"icon"}
                  onClick={() => handleOpenChange(false)}
                  className="scale-75 rounded-full"
                >
                  <XIcon />
                </Button>
              }
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
                  <TabsList className="h-14 w-full justify-start gap-2 bg-transparent p-0">
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
                      <ScrollArea className="flex-1 pr-3">
                        <div className="space-y-6">
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
                              <Stack spacing={"lg"}>
                                <TextFormField
                                  control={form.control}
                                  name="buildingName"
                                  label="Building Name"
                                />
                                <Group className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                  <TextFormField
                                    control={form.control}
                                    name="unitNumber"
                                    label="Unit"
                                  />

                                  <SelectFormField
                                    control={form.control}
                                    name="tenantId"
                                    label="Tenant"
                                    options={tenants.map((t) => ({
                                      label: getFullNameFromObj(t),
                                      value: t.id,
                                    }))}
                                  />

                                  {/* <DataListInput
                                    maxItems={1}
                                    label="Tenant"
                                    onChange={(values) => {
                                      form.setValue(
                                        "tenantId",
                                        values[0].value,
                                      );
                                    }}
                                    items={
                                      tenants?.map((t) => ({
                                        label: getFullName(
                                          t.firstName,
                                          t.lastName,
                                        ),
                                        value: t.id,
                                      })) || []
                                    }
                                    selectedItems={[
                                      {
                                        value: form.watch("tenantId"),
                                        label: `${application?.submittedBy.userId?.firstName} ${application?.submittedBy.userId?.lastName}`,
                                      },
                                    ]}
                                  /> */}
                                </Group>
                              </Stack>
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

                        <section className="mt-6 border-t py-4">
                          <div className="flex w-full justify-end">
                            <Button type="submit" className="gap-2">
                              Continue to Review
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </section>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent
                      value="review"
                      className="mt-0 h-full p-0 data-[state=active]:flex data-[state=active]:flex-col"
                    >
                      <ScrollArea className="flex-1 pr-3">
                        <div className="space-y-6">
                          <Card className="overflow-hidden border shadow-sm">
                            <CardHeader>
                              <CardTitle>
                                <Group spacing={"sm"}>
                                  <ClipboardList className="h-5 w-5 text-primary" />
                                  <h4 className="font-medium">Lease Summary</h4>
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
                                      Building
                                    </h4>
                                    <div className="flex items-center gap-2">
                                      <Building className="h-4 w-4 text-primary" />
                                      <p className="font-medium">
                                        {application?.building.name}
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
                                        {form.getValues("unitNumber")}
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
                                        {(() => {
                                          const t = tenants.find(
                                            (t) =>
                                              t.id ===
                                              form.getValues("tenantId"),
                                          );

                                          return (
                                            getFullName(
                                              t?.firstName,
                                              t?.lastName,
                                            ) || "Unknown Tenant"
                                          );
                                        })()}
                                      </Badge>
                                    </div>
                                  </div>
                                  {/* 
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
                                    </div> */}

                                  <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                      Monthly Rent
                                    </h4>
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium">
                                        ETB {form.getValues("monthlyRent")}
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

                          <Stack className="">
                            <Label className="text-lg">Lease Doc Preview</Label>
                            <LeasePreviewMinimal
                              dataValues={generateLeaseDataValues(application)}
                              leaseTitle={selectedTemplate?.name || ""}
                              leaseDescription={
                                selectedTemplate?.description || ""
                              }
                              sections={selectedTemplate?.sections || []}
                              maxHeight={500}
                            />
                          </Stack>

                          <section className="rounded-lg border p-4">
                            <CheckboxFormField
                              title="Send to tenant immediately for electronic
                                      signature"
                              description="The tenant will receive an email with a
                                      link to review and sign the lease"
                              control={form.control}
                              name="sendImmediately"
                            />
                          </section>
                        </div>

                        <section className="mt-6 border-t py-4">
                          <div className="flex w-full justify-between">
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
                          </div>
                        </section>
                      </ScrollArea>
                    </TabsContent>
                  </div>
                </Tabs>
              </form>
            </Form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
