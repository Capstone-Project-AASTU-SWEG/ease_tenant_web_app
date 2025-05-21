import { z } from "zod";

export const leaseTemplateSchema = z.object({
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

export type LeaseTemplate = z.infer<typeof leaseTemplateSchema>;

// Schema for lease creation
export const createLeaseSchema = z.object({
  templateId: z.string().min(1, "Template is required"),
  buildingName: z.string().min(1, "Building Name is required"),
  unitNumber: z.string().min(1, "Unit number is required."),
  tenantId: z.string().min(1, "Tenant is required"),
  startDate: z.coerce.date(),
  endDate: z.date(),
  monthlyRent: z.coerce.number().min(1, "Monthly rent is required"),
  securityDeposit: z.coerce.number().min(0),
  notes: z.string().optional(),
  sendImmediately: z.boolean().default(false),
});

export type CreateLease = z.infer<typeof createLeaseSchema>;
