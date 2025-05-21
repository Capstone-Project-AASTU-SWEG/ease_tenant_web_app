import { APPLICATION_STATUS, APPLICATION_TYPE, PRIORITY_LEVEL } from "@/types";
import {
  Building2,
  CheckCircle,
  Clock,
  FileText,
  PenTool,
  XCircle,
} from "lucide-react";

/**
 * Format date to a readable string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

/**
 * Format date with time
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
};

/**
 * Calculate time elapsed since a given date
 */
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

/**
 * Get color for application status
 */
export const getStatusColor = (status: APPLICATION_STATUS): string => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "in_review":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    default:
      return "bg-slate-100 text-slate-800 hover:bg-slate-200";
  }
};

/**
 * Get icon for application status
 */
export const getStatusIcon = (status: APPLICATION_STATUS) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-4 w-4" />;
    case "rejected":
      return <XCircle className="h-4 w-4" />;
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "in_review":
      return <FileText className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

/**
 * Get color for priority level
 */
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

/**
 * Get icon for application type
 */
export const getApplicationTypeIcon = (type: APPLICATION_TYPE) => {
  switch (type) {
    case "rental":
      return <Building2 className="h-5 w-5" />;
    case "maintenance":
      return <PenTool className="h-5 w-5" />;
    // case "provider":
    //   return <UserCog className="h-5 w-5" />;
    // case "service":
    //   return <Briefcase className="h-5 w-5" />;
    // case "other":
    //   return <FileText className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

/**
 * Get label for application type
 */
export const getApplicationTypeLabel = (type: APPLICATION_TYPE): string => {
  switch (type) {
    case "rental":
      return "Rental Application";
    case "maintenance":
      return "Maintenance Request";
    // case "provider":
    //   return "Provider Registration";
    // case "service":
    //   return "Service Offering";
    // case "other":
    //   return "Other Request";
    default:
      return "Application";
  }
};

/**
 * Format status label
 */
export const formatStatusLabel = (status: APPLICATION_STATUS): string => {
  switch (status) {
    case "in_review":
      return "In Review";
    // case "on_hold":
    //   return "On Hold";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};
