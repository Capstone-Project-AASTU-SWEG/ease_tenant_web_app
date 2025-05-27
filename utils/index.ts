import ENV from "@/config/env";
import { Address, PRIORITY_LEVEL } from "@/types";

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
  obj?: unknown & { firstName?: string; lastName?: string },
) {
  return `${obj?.firstName} ${obj?.lastName}`;
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

export const timeElapsed = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(
    (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  if (diffDays > 0) {
    return `${diffDays}d ago`;
  } else if (diffHours > 0) {
    return `${diffHours}h ago`;
  } else {
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffMinutes}m ago`;
  }
};

export const getPriorityColor = (priority: PRIORITY_LEVEL): string => {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "high":
      return "bg-orange-100 text-orange-800 hover:bg-orange-200";
    case "medium":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "low":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    default:
      return "bg-slate-100 text-slate-800 hover:bg-slate-200";
  }
};

export function genUUID(prefix?: string) {
  return `${prefix}${Date.now()}`;
}

export function getFullFileURL(path: string) {
  return path
    ? `${ENV.NEXT_PUBLIC_BACKEND_BASE_URL_WITHOUT_PREFIX}/${path}`
    : "";
}
