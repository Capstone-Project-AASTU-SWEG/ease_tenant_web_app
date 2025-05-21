import { RentalApplication } from "@/types";
import { format, addMonths } from "date-fns";
import { formatCurrency, getFormatedAddress, getFullNameFromObj } from ".";
import { formatDate } from "@/app/dashboard/applications/_utils";

/**
 * Calculates the end date based on start date and duration in months
 * @param startDate Start date
 * @param durationMonths Duration in months
 * @param formatStr Format string for the result
 * @returns Formatted end date
 */
export const calculateEndDate = (
  startDate?: string | Date,
  durationMonths = 12,
  formatStr = "MMMM d, yyyy",
): string => {
  if (!startDate) return "N/A";

  try {
    const date =
      typeof startDate === "string" ? new Date(startDate) : startDate;
    const endDate = addMonths(date, durationMonths);
    return format(endDate, formatStr);
  } catch (error) {
    console.error("Error calculating end date:", error);
    return "N/A";
  }
};

/**
 * Formats a list of amenities into a readable string
 * @param amenities Array of amenity strings
 * @returns Formatted amenities string
 */
export const formatAmenities = (amenities?: string[]): string => {
  if (!amenities || amenities.length === 0) return "None";
  return amenities.join(", ");
};

export const generateLeaseDataValues = (
  application?: RentalApplication,
): Record<string, string> => {
  if (!application) {
    return { ERROR: "No application data provided" };
  }

  console.log({ application });

  const startDate = application?.leaseDetails?.requestedStartDate;
  const durationMonths = application?.leaseDetails?.requestedDuration || 12;
  const monthlyRent = application?.unit?.monthlyRent || 0;

  // Calculate derived values
  const endDate = calculateEndDate(startDate, durationMonths);
  const annualRent = monthlyRent * 12;
  const totalLeaseValue = monthlyRent * durationMonths;

  return {
    // Tenant Information
    TENANT_NAME: getFullNameFromObj(application?.submittedBy?.userId || {}),
    TENANT_EMAIL: application?.submittedBy?.userId?.email || "N/A",
    TENANT_PHONE: application?.submittedBy?.userId?.phone || "N/A",
    TENANT_ID: application?.submittedBy?.userId?.id || "N/A",

    // Building Information
    BUILDING_NAME: application?.building?.name || "N/A",
    BUILDING_ADDRESS: getFormatedAddress(application?.building?.address),
    BUILDING_FLOORS: application?.building?.totalFloors?.toString() || "N/A",
    BUILDING_UNITS: application?.building?.totalUnits?.toString() || "N/A",

    // Unit Information
    UNIT_NUMBER: application?.unit?.unitNumber || "N/A",
    UNIT_FLOOR: application?.unit?.floorNumber?.toString() || "N/A",
    UNIT_SIZE: application?.unit?.sizeSqFt
      ? `${application.unit.sizeSqFt} sq ft`
      : "N/A",
    UNIT_TYPE: application?.unit?.type || "N/A",
    UNIT_AMENITIES: formatAmenities(application?.unit?.amenities),

    // Financial Information
    MONTHLY_RENT: formatCurrency(monthlyRent),
    ANNUAL_RENT: formatCurrency(annualRent),
    TOTAL_LEASE_VALUE: formatCurrency(totalLeaseValue),
    PAYMENT_FREQUENCY:
      application?.building.leaseTerms?.paymentFrequency || "Monthly",
    LATE_FEE: formatCurrency(monthlyRent * 0.05), // Assuming 5% late fee

    // Dates and Duration
    START_DATE: formatDate(startDate.toString()),
    END_DATE: endDate,
    LEASE_DURATION: `${durationMonths} months`,
    LEASE_DURATION_YEARS: `${(durationMonths / 12).toFixed(1)} years`,
    SUBMISSION_DATE: formatDate(application?.createdAt?.toString() || ""),

    // Policies and Terms
    PET_POLICY:
      application?.building.leaseTerms?.petPolicy || "No pets allowed",

    // Application Information
    APPLICATION_ID: application?.id || "N/A",
    APPLICATION_STATUS: application?.status || "N/A",

    // Landlord Information (assuming these would be filled from elsewhere)
    LANDLORD_NAME: "Property Management Company",
    LANDLORD_ADDRESS: "123 Management St, Business City, ST 12345",
    LANDLORD_PHONE: "(555) 123-4567",
    LANDLORD_EMAIL: "management@example.com",

    // Additional calculated fields
    MOVE_IN_DATE: formatDate(startDate.toString()),
    NOTICE_PERIOD: "30 days",
    RENEWAL_TERMS: "Subject to landlord approval and market rates",

    // Utilities and Services (placeholders - would need to be provided elsewhere)
    UTILITIES_INCLUDED: "Water, Trash",
    UTILITIES_TENANT: "Electricity, Internet, Cable",
    MAINTENANCE_CONTACT: "Maintenance Department: (555) 987-6543",
    EMERGENCY_CONTACT: "Emergency Services: (555) 789-0123",

    // Legal Information
    JURISDICTION: "State of [State]",
    GOVERNING_LAW: "This agreement is governed by the laws of [State]",

    // Current Date (for signature/generation)
    CURRENT_DATE: formatDate(new Date().toString()),
  };
};
