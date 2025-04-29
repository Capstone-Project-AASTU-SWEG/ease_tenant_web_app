"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileText, Plus, Trash2 } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  TextFormField,
  TextareaFormField,
} from "@/components/custom/form-field";
import { Group } from "@/components/custom/group";

// Schema for lease template
const leaseTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  description: z.string().min(1, "Description is required"),
  isDefault: z.boolean().default(false),
  sections: z.array(
    z.object({
      title: z.string().min(1, "Section title is required"),
      content: z.string().min(1, "Section content is required"),
    }),
  ),
});

type LeaseTemplateFormValues = z.infer<typeof leaseTemplateSchema>;

interface CreateLeaseTemplateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTemplate: (template: Partial<LeaseTemplateFormValues>) => void;
  existingTemplate?: Partial<LeaseTemplateFormValues>;
}

export function CreateLeaseTemplateDialog({
  isOpen,
  onOpenChange,
  onCreateTemplate,
  existingTemplate,
}: CreateLeaseTemplateDialogProps) {
  const [activeTab, setActiveTab] = useState("details");

  // Form for the template
  const form = useForm<LeaseTemplateFormValues>({
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
  const onSubmit = (data: LeaseTemplateFormValues) => {
    onCreateTemplate(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-primary" />
            {existingTemplate ? "Edit Lease Template" : "Create Lease Template"}
          </DialogTitle>
          <DialogDescription>
            {existingTemplate
              ? "Modify your lease template with sections and clauses"
              : "Create a new lease template with customizable sections and clauses"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs
              defaultValue="details"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="details">Template Details</TabsTrigger>
                <TabsTrigger value="sections">Sections & Clauses</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
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

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isDefault"
                    checked={form.watch("isDefault")}
                    onCheckedChange={(checked) =>
                      form.setValue("isDefault", checked as boolean)
                    }
                  />
                  <label
                    htmlFor="isDefault"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Set as default template
                  </label>
                </div>
              </TabsContent>

              <TabsContent value="sections" className="space-y-4">
                <ScrollArea className="h-[400px] pr-4">
                  {form.watch("sections")?.map((section, index) => (
                    <div key={index} className="mb-6 rounded-md border p-4">
                      <Group className="mb-2 justify-between">
                        <h3 className="text-sm font-medium">
                          Section {index + 1}
                        </h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSection(index)}
                          className="h-8 w-8 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </Group>

                      <TextFormField
                        control={form.control}
                        name={`sections.${index}.title`}
                        label="Section Title"
                        placeholder="e.g., Rent and Payment Terms"
                      />

                      <TextareaFormField
                        control={form.control}
                        name={`sections.${index}.content`}
                        label="Content"
                        placeholder="Enter the content for this section. Use [PLACEHOLDERS] for dynamic content."
                        rows={4}
                      />
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSection}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Section
                  </Button>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="preview" className="space-y-4">
                <ScrollArea className="h-[400px] rounded-md border p-4">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-xl font-bold">
                        {form.watch("name") || "Lease Agreement"}
                      </h2>
                      <p className="text-muted-foreground">
                        {form.watch("description")}
                      </p>
                    </div>

                    {form.watch("sections")?.map((section, index) => (
                      <div key={index} className="space-y-2">
                        <h3 className="text-lg font-semibold">
                          {section.title || `Section ${index + 1}`}
                        </h3>
                        <div className="whitespace-pre-wrap text-sm">
                          {section.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {existingTemplate ? "Update Template" : "Create Template"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
