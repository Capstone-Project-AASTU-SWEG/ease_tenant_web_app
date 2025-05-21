"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  FileText,
  Plus,
  Trash2,
  Save,
  GripVertical,
  PenLine,
  ChevronRight,
  XIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckboxFormField,
  TextFormField,
  TextareaFormField,
} from "@/components/custom/form-field";
import { Group } from "@/components/custom/group";
import CustomSheetHeader from "@/components/custom/sheet-header";
import { useCreateLeaseTemplateMutation } from "@/app/quries/useLeases";
import { errorToast, successToast } from "@/components/custom/toasts";
import { LeaseTemplate, leaseTemplateSchema } from "../_schema";

interface CreateLeaseTemplateDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTemplate: (template: Partial<LeaseTemplate>) => void;
  existingTemplate?: Partial<LeaseTemplate>;
}

export function CreateLeaseTemplateDrawer({
  isOpen,
  onOpenChange,
  // onCreateTemplate,
  existingTemplate,
}: CreateLeaseTemplateDrawerProps) {
  const [activeTab, setActiveTab] = useState<
    "details" | "sections" | "preview"
  >("details");

  const createLeaseTemplateMutation = useCreateLeaseTemplateMutation();

  // Form for the template
  const form = useForm<LeaseTemplate>({
    resolver: zodResolver(leaseTemplateSchema),
    defaultValues: existingTemplate || {
      name: "",
      description: "",
      isDefault: false,
      sections: [
        {
          title: "Parties",
          content:
            "This lease agreement is made between [LANDLORD] and [TENANT].",
        },
        {
          title: "Premises",
          content:
            "The landlord agrees to rent to the tenant the commercial space located at [ADDRESS], Unit [UNIT_NUMBER].",
        },
        {
          title: "Term",
          content:
            "The lease term begins on [START_DATE] and ends on [END_DATE], unless terminated earlier as provided in this agreement.",
        },
        {
          title: "Rent",
          content:
            "Tenant agrees to pay monthly rent of $[MONTHLY_RENT] due on the first day of each month.",
        },
      ],
    },
  });

  // Add a new section
  const addSection = () => {
    const currentSections = form.getValues("sections") || [];
    form.setValue("sections", [
      ...currentSections,
      {
        title: "",
        content: "",
      },
    ]);
  };

  // Remove a section
  const removeSection = (index: number) => {
    const currentSections = form.getValues("sections") || [];
    form.setValue(
      "sections",
      currentSections.filter((_, i) => i !== index),
    );
  };

  // Handle form submission
  const onSubmit = (data: LeaseTemplate) => {
    createLeaseTemplateMutation.mutate({
      name: data.name,
      isDefault: data.isDefault,
      description: data.description,
      sections: data.sections,
    });
  };

  useEffect(() => {
    if (createLeaseTemplateMutation.isSuccess) {
      successToast("Lease template created successfully.");
      onOpenChange(false);
    }
  }, [createLeaseTemplateMutation.isSuccess, onOpenChange]);

  useEffect(() => {
    if (createLeaseTemplateMutation.isError) {
      errorToast(createLeaseTemplateMutation.error.message);
    }
  }, [
    createLeaseTemplateMutation.error?.message,
    createLeaseTemplateMutation.isError,
  ]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-[500px] overflow-hidden p-0 sm:max-w-[600px] md:max-w-[800px]">
        <div className="flex h-full flex-col px-6">
          <CustomSheetHeader
            icon={FileText}
            title={
              existingTemplate ? "Edit Lease Template" : "Create Lease Template"
            }
            description={
              existingTemplate
                ? "Modify your lease template with sections and clauses"
                : "Create a new lease template with customizable sections and clauses"
            }
            rightSection={
              <Button
                type="button"
                variant="secondary"
                size={"sm"}
                onClick={() => onOpenChange(false)}
              >
                <XIcon />
              </Button>
            }
          />

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex h-full flex-col"
            >
              <div className="flex-1 overflow-hidden">
                <Tabs
                  defaultValue="details"
                  value={activeTab}
                  onValueChange={(activeTab) =>
                    setActiveTab(
                      activeTab as "sections" | "details" | "preview",
                    )
                  }
                  className="flex h-full flex-col"
                >
                  <TabsList className="h-14 w-full justify-start gap-3 bg-transparent p-0">
                    <TabsTrigger value="details" className="">
                      Template Details
                    </TabsTrigger>
                    <TabsTrigger value="sections" className="">
                      Sections & Clauses
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="">
                      Preview
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex-1 overflow-hidden">
                    <TabsContent value="details" className="mt-0 h-full p-0">
                      <ScrollArea className="h-full max-h-[35rem]">
                        <Card className="border shadow-sm">
                          <CardHeader>
                            <CardTitle>Template Information</CardTitle>
                            <CardDescription>
                              Provide basic details about your lease template
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <TextFormField
                              control={form.control}
                              name="name"
                              label="Template Name"
                              placeholder="e.g., Standard Office Lease"
                            />

                            <TextareaFormField
                              control={form.control}
                              name="description"
                              label="Description"
                              placeholder="Describe the purpose and use case for this template"
                              rows={3}
                            />

                            <CheckboxFormField
                              control={form.control}
                              name="isDefault"
                              classNames={{
                                formItem: "border bg-muted/30 p-4",
                                formControl: "items-start",
                              }}
                              title="Set as default template"
                              description="This template will be automatically selected
                                  when creating new leases"
                            />
                          </CardContent>
                        </Card>
                        <section className="mt-6 border-t py-2">
                          <div className="flex w-full justify-end">
                            <Button
                              type="button"
                              className="gap-2"
                              onClick={async () => {
                                if (activeTab === "details") {
                                  const isValid = await form.trigger([
                                    "name",
                                    "description",
                                  ]);

                                  if (isValid) {
                                    setActiveTab("sections");
                                  }
                                }
                              }}
                            >
                              Next
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </section>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent
                      value="sections"
                      className="h-[calc(100vh-300px)]"
                    >
                      <ScrollArea className="h-full w-full pr-3">
                        <Card className="h-full">
                          <Group justify="between">
                            <CardHeader>
                              <CardTitle>Sections & Clauses</CardTitle>
                              <CardDescription>
                                Define the structure and content of your lease
                                template
                              </CardDescription>
                            </CardHeader>
                          </Group>

                          <CardContent className="flex flex-col gap-4 pb-6">
                            {form.watch("sections")?.map((section, index) => (
                              <Card
                                key={index}
                                className="overflow-hidden border shadow-sm transition-all hover:shadow-md"
                              >
                                <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                                      <GripVertical className="h-4 w-4" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant="outline"
                                        className="rounded-md font-normal"
                                      >
                                        Section {index + 1}
                                      </Badge>
                                      <h3 className="text-sm font-medium">
                                        {section.title || "Untitled Section"}
                                      </h3>
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeSection(index)}
                                    className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>

                                <CardContent className="space-y-4 p-5">
                                  <TextFormField
                                    control={form.control}
                                    name={`sections.${index}.title`}
                                    label="Section Title"
                                    placeholder="e.g., Rent and Payment Terms"
                                  />

                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <label className="text-sm font-medium">
                                        Content
                                      </label>
                                      <div className="flex items-center text-xs text-muted-foreground">
                                        <PenLine className="mr-1 h-3 w-3" />
                                        Use [PLACEHOLDERS] for dynamic content
                                      </div>
                                    </div>
                                    <TextareaFormField
                                      control={form.control}
                                      name={`sections.${index}.content`}
                                      label=""
                                      placeholder="Enter the content for this section. Use [PLACEHOLDERS] for dynamic content."
                                      rows={4}
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            ))}

                            {form.watch("sections")?.length === 0 && (
                              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                  <FileText className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-lg font-medium">
                                  No sections yet
                                </h3>
                                <p className="mb-4 text-sm text-muted-foreground">
                                  Add sections to define the structure of your
                                  lease template
                                </p>
                                <Button
                                  type="button"
                                  onClick={addSection}
                                  className="gap-1.5"
                                >
                                  <Plus className="h-4 w-4" />
                                  Add First Section
                                </Button>
                              </div>
                            )}

                            <Button
                              type="button"
                              onClick={addSection}
                              className="w-full border-dashed bg-secondary"
                              variant="outline"
                            >
                              <Group spacing="sm">
                                <Plus className="h-4 w-4" />
                                Add Section
                              </Group>
                            </Button>
                          </CardContent>
                        </Card>
                        <ScrollBar orientation="vertical" />
                      </ScrollArea>

                      <section className="mt-4 border-t pt-4">
                        <div className="flex w-full justify-end">
                          <Button
                            type="button"
                            className="gap-2"
                            onClick={async () => {
                              if (activeTab === "sections") {
                                const isValid = await form.trigger("sections");
                                if (isValid) {
                                  setActiveTab("preview");
                                }
                              }
                            }}
                          >
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </section>
                    </TabsContent>

                    <TabsContent value="preview" className="mt-0 h-full p-0">
                      <ScrollArea className="h-[65vh]">
                        <ScrollBar orientation="vertical" hidden />
                        <Card className="">
                          <CardHeader>
                            <CardTitle>Template Preview</CardTitle>
                            <CardDescription>
                              Review how your lease template will appear
                            </CardDescription>
                          </CardHeader>

                          <CardContent>
                            <section className="mb-2">
                              {form.watch("isDefault") && (
                                <Badge className="border-0 bg-primary/10 text-primary hover:bg-primary/20">
                                  Default Template
                                </Badge>
                              )}
                            </section>
                            <div className="min-h-[600px] rounded-lg border border-neutral-100 bg-neutral-50 p-6">
                              <div className="mx-auto flex flex-col gap-6">
                                <div className="space-y-2 text-center">
                                  <h2 className="text-2xl font-bold">
                                    {form.watch("name") || "Lease Agreement"}
                                  </h2>
                                  <p className="text-muted-foreground">
                                    {form.watch("description") ||
                                      "No description provided"}
                                  </p>
                                </div>

                                {form
                                  .watch("sections")
                                  ?.map((section, index) => (
                                    <div key={index} className="space-y-3">
                                      <h3 className="text-lg font-semibold">
                                        {section.title ||
                                          `Section ${index + 1}`}
                                      </h3>
                                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                        {section.content}
                                      </div>
                                    </div>
                                  ))}

                                {form.watch("sections")?.length === 0 && (
                                  <div className="py-12 text-center text-muted-foreground">
                                    No sections added yet. Add sections to
                                    preview your template.
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </ScrollArea>
                      <section className="mt-6 border-t py-2">
                        <div className="flex w-full justify-end">
                          <Button
                            type="submit"
                            className="gap-2"
                            disabled={createLeaseTemplateMutation.isPending}
                          >
                            <Save className="h-4 w-4" />
                            {existingTemplate
                              ? "Update Template"
                              : "Create Template"}
                          </Button>
                        </div>
                      </section>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
