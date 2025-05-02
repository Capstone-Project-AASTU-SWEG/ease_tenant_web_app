import * as z from "zod";
import { BUILDING_STATUS, PAYMENT_FREQUENCY } from "@/types";

export const buildingSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Building name must be at least 2 characters" }),
  description: z.string().optional(),
  address: z.object({
    street: z.string().min(1, { message: "Street is required" }),
    city: z.string().min(1, { message: "City is required" }),
    state: z.string().optional(),
    country: z.string().min(1, { message: "Country is required" }),
    postalCode: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),
  managerId: z.string().optional(),
  totalFloors: z.coerce
    .number()
    .min(1, { message: "Building must have at least 1 floor" }),
  totalUnits: z.coerce
    .number()
    .min(1, { message: "Building must have at least 1 unit" }),
  amenities: z.array(z.string()).default([]),
  elevators: z.coerce.number().min(0).default(0),
  parkingSpaces: z.coerce.number().min(0).default(0),
  emergencyExits: z.coerce.number().min(0).default(0),
  images: z.array(z.instanceof(File)),
  videos: z.array(z.instanceof(File)),
  regulationDocuments: z.array(
    z.object({
      name: z.string(),
      file: z.instanceof(File),
    }),
  ),
  yearBuilt: z.coerce.number().optional(),
  status: z.nativeEnum(BUILDING_STATUS).default(BUILDING_STATUS.ACTIVE),
  operatingHours: z.string().optional(),
  accessibilityFeatures: z.array(z.string()).default([]),
  fireSafetyCertified: z.boolean().default(false),

  leaseTerms: z.object({
    minLeasePeriodMonths: z.coerce.number().min(1),
    maxLeasePeriodMonths: z.coerce.number().optional(),
    paymentFrequency: z.nativeEnum(PAYMENT_FREQUENCY),
    latePaymentPenalty: z.coerce.number().min(0).optional(),
    securityDeposit: z.coerce.number().min(0).optional().default(0),
    leaseRenewalPolicy: z.string().optional(),
    petPolicy: z.string().optional(),
  }),
});

export type BuildingSchema = z.infer<typeof buildingSchema>;
