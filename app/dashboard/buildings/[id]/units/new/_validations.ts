import { z } from "zod";
import { UNIT_STATUS, UNIT_TYPE } from "@/types";

export const unitSchema = z.object({
  buildingId: z.string().min(1, "Building is required"),
  floorNumber: z.coerce.number().min(1, "Floor number must be at least 1"),
  unitNumber: z.string().min(1, "Unit number is required"),
  sizeSqFt: z.coerce.number().min(1, "Size must be greater than 0"),
  type: z.nativeEnum(UNIT_TYPE, {
    errorMap: () => ({ message: "Please select a unit type" }),
  }),
  status: z.nativeEnum(UNIT_STATUS, {
    errorMap: () => ({ message: "Please select a unit status" }),
  }),
  monthlyRent: z.coerce.number().min(0, "Monthly rent cannot be negative"),
  amenities: z.array(z.string()),
  images: z.array(z.instanceof(File)),
  videos: z.array(z.instanceof(File)),
  allowedUses: z.array(z.string()).optional(),
  lastRenovationDate: z.date().optional(),
  notes: z.string().optional(),
});

export type UnitSchema = z.infer<typeof unitSchema>;
