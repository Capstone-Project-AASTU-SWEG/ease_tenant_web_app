"use client";

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building,
  Calendar,
  CheckSquare,
  Clock,
  DollarSign,
  Home,
  MapPin,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Application } from "@/types";

interface ApplicationSummaryProps {
  application: Application; // Replace with your actual application type
  className?: string;
}

export function ApplicationSummary({
  application,
  className,
}: ApplicationSummaryProps) {
  if (!application) return null;

  const { status, priority, leaseDetails, unit, building } = application;

  // Format dates
  const formattedCreatedDate = format(
    new Date(application.createdAt || 0),
    "MMM d, yyyy",
  );
  const formattedStartDate = format(
    new Date(leaseDetails.requestedStartDate),
    "MMM d, yyyy",
  );

  // Calculate end date based on duration
  const endDate = new Date(leaseDetails.requestedStartDate);
  endDate.setMonth(endDate.getMonth() + leaseDetails.requestedDuration);
  const formattedEndDate = format(endDate, "MMM d, yyyy");

  return (
    <Card className={cn("overflow-hidden shadow-md", className)}>
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white pb-3 dark:from-slate-900 dark:to-slate-800">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckSquare className="h-5 w-5 text-primary" />
            Application Summary
          </CardTitle>
          <ApplicationStatusBadge status={status} />
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="grid gap-6">
          {/* Application Details */}
          <div className="grid gap-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Application Details
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Submitted on {formattedCreatedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <span>
                  Priority: <PriorityBadge priority={priority} />
                </span>
              </div>
            </div>
          </div>

          {/* Unit Information */}
          <div className="grid gap-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Unit Information
            </h3>
            <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900/50">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">{unit.unitNumber}</h4>
                </div>
                <Badge variant="outline" className="bg-primary/5 text-primary">
                  {unit.type}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Size</p>
                  <p className="font-medium">{unit.sizeSqFt} sq ft</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Monthly Rent</p>
                  <p className="font-medium">
                    ${unit.monthlyRent.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Floor</p>
                  <p className="font-medium">{unit.floorNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium">{unit.status}</p>
                </div>
              </div>

              {unit.amenities && unit.amenities.length > 0 && (
                <div className="mt-3">
                  <p className="mb-2 text-xs text-muted-foreground">
                    Amenities
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {unit.amenities
                      .slice(0, 5)
                      .map((amenity: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    {unit.amenities.length > 5 && (
                      <Badge variant="secondary" className="text-xs">
                        +{unit.amenities.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Building & Lease Information */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                Building
              </h3>
              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">{building.name}</h4>
                </div>
                <div className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>
                    {building.address.street}, {building.address.city},{" "}
                    {building.address.country}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                Lease Details
              </h3>
              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">
                    {leaseDetails.requestedDuration}{" "}
                    {leaseDetails.requestedDuration === 1 ? "month" : "months"}
                  </h4>
                </div>
                <div className="mt-2 grid gap-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span>{formattedStartDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End Date:</span>
                    <span>{formattedEndDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="rounded-lg bg-primary/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Payment Summary</h3>
              </div>
              <span className="text-lg font-semibold text-primary">
                ${unit.monthlyRent.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Monthly rent + applicable fees
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ApplicationStatusBadge({ status }: { status: string }) {
  return (
    <Badge
      className={cn(
        status === "approved" &&
          "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400",
        status === "pending" &&
          "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400",
        status === "rejected" &&
          "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400",
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        priority === "high" &&
          "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
        priority === "medium" &&
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
        priority === "low" &&
          "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      )}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}
