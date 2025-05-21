import { Address } from "@/types";

// Helper functions for occupancy indicators
export const getOccupancyColor = (occupancy: number) => {
  if (occupancy >= 90) return "bg-green-500";
  if (occupancy >= 70) return "bg-blue-500";
  if (occupancy >= 50) return "bg-amber-500";
  return "bg-red-500";
};

export const getOccupancyTextColor = (occupancy: number) => {
  if (occupancy >= 90) return "text-green-600";
  if (occupancy >= 70) return "text-blue-600";
  if (occupancy >= 50) return "text-amber-600";
  return "text-red-600";
};

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getLastDateAfterMonth(startDate: string, lafterMonth: number) {
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + lafterMonth);

  return endDate;
}

export function getFullName(fName?: string, lName?: string) {
  return `${fName} ${lName}`;
}
export function getFullNameFromObj(
  obj: unknown & { firstName?: string; lastName?: string },
) {
  return `${obj.firstName} ${obj.lastName}`;
}

export function getFormatedAddress(address?: Address) {
  return `${address?.street}, ${address?.city}, ${address?.state}`;
}

export const storeBuildingId = (buildingId: string) => {
  localStorage.setItem("buildingId", buildingId);
};
export const getBuildingIdFromStore = () => {
  return localStorage.getItem("buildingId") as string;
};
export const storeUnitId = (unitId: string) => {
  localStorage.setItem("unitId", unitId);
};
export const getUnitIdFromStore = () => {
  return localStorage.getItem("unitId") as string;
};
export const storeApplicationId = (applicationId: string) => {
  localStorage.setItem("applicationId", applicationId);
};
export const getApplicationIdFromStore = () => {
  return localStorage.getItem("applicationId") as string;
};
export const getTenantIdFromStore = () => {
  return localStorage.getItem("tenantId") as string;
};

export const getFloors = (floorCount: number) => {
  return Array.from({ length: floorCount }, (_, i) => {
    return i + 1;
  });
};
