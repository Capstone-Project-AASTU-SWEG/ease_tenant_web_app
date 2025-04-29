import * as z from "zod";

export const tenantFormSchema = z
  .object({
    // Business Information
    businessName: z
      .string()
      .min(2, "Business name must be at least 2 characters"),
    businessType: z.string().min(1, "Please select your business type"),
    businessDescription: z.string().optional(),
    businessWebsite: z
      .string()
      .url("Please enter a valid URL")
      .or(z.literal("")),
    taxId: z.string().min(9, "Tax ID must be at least 9 characters").optional(),

    //  Information
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    title: z.string().min(2, "Please enter your job title"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    secondaryEmail: z
      .string()
      .email("Please enter a valid email")
      .or(z.literal("")),
    secondaryPhone: z.string().optional(),

    // Account Information
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
    marketingOptIn: z.boolean().default(false),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type TenantFormValues = z.infer<typeof tenantFormSchema>;
