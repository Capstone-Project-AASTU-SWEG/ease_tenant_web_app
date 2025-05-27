"use client";
import {
  Briefcase,
  Building2,
  Calendar,
  FileText,
  Download,
  Users,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RentalApplication, Tenant } from "@/types";
import { formatDateTime } from "../_utils";
import { useGetBuildingQuery } from "@/app/quries/useBuildings";
import { Loader } from "@/components/custom/loader";
import { Center } from "@/components/custom/center";


const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/**
 * Rental Application Detail Component
 */
export function RentalApplicationDetail({
  application,
}: {
  application: RentalApplication;
}) {
  const getBuildingQuery = useGetBuildingQuery(application.building.id);
  const building = getBuildingQuery.data;
  const submittedBy = application.submittedBy as Tenant;

  if (getBuildingQuery.isLoading) {
    return (
      <Center className="h-[4rem]">
        <Loader variant="dots" />
      </Center>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="space-y-6"
    >
      {/* Application Summary */}
      <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/5 text-primary">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {submittedBy.businessName}
              </h2>
              <p className="text-sm text-slate-500">
                {submittedBy.businessType}
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="bg-primary/5 px-3 py-1 text-blue-700"
          >
            ${application.unit.monthlyRent.toLocaleString()}/month
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span className="text-sm">
              Unit {application.unit.unitNumber}, Floor{" "}
              {application.unit.floorNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-400" />
            <span className="text-sm">
              {application.leaseDetails.numberOfEmployees} Employees
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="text-sm">
              {application.leaseDetails.requestedDuration} Month Lease
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}

      <section className="mt-6 space-y-6">
        {/* Unit Details */}
        <Card className="overflow-hidden border-none bg-white shadow-sm">
          <CardHeader className="border-b bg-slate-50 pb-3 pt-3">
            <CardTitle className="flex items-center text-base font-medium">
              <Building2 className="mr-2 h-4 w-4 text-primary" />
              Unit Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-sm font-medium text-slate-500">
                  Building
                </p>
                <p className="font-medium text-slate-900">{building?.name}</p>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-slate-500">
                  Unit Number
                </p>
                <p className="font-medium text-slate-900">
                  {application.unit.unitNumber}
                </p>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-slate-500">Floor</p>
                <p className="font-medium text-slate-900">
                  {application.unit.floorNumber}
                </p>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-slate-500">
                  Monthly Rent
                </p>
                <p className="font-medium text-slate-900">
                  ${application.unit.monthlyRent.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-none bg-white shadow-sm">
          <CardHeader className="border-b bg-slate-50 pb-3 pt-3">
            <CardTitle className="flex items-center text-base font-medium">
              <Briefcase className="mr-2 h-4 w-4 text-primary" />
              Business Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-sm font-medium text-slate-500">
                  Business Name
                </p>
                <p className="font-medium text-slate-900">
                  {submittedBy.businessName}
                </p>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-slate-500">
                  Business Type
                </p>
                <p className="font-medium text-slate-900">
                  {submittedBy.businessType}
                </p>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-slate-500">
                  Employees
                </p>
                <p className="font-medium text-slate-900">
                  {application.leaseDetails.numberOfEmployees}
                </p>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-slate-500">
                  Contact Email
                </p>
                <p className="font-medium text-slate-900">
                  {submittedBy.email || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lease Details */}
        <Card className="overflow-hidden border-none bg-white shadow-sm">
          <CardHeader className="border-b bg-slate-50 pb-3 pt-3">
            <CardTitle className="flex items-center text-base font-medium">
              <Calendar className="mr-2 h-4 w-4 text-primary" />
              Lease Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-sm font-medium text-slate-500">
                  Requested Start Date
                </p>
                <p className="font-medium text-slate-900">
                  {formatDateTime(
                    application.leaseDetails.requestedStartDate.toLocaleString(),
                  )}
                </p>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-slate-500">
                  Requested Duration
                </p>
                <p className="font-medium text-slate-900">
                  {application.leaseDetails.requestedDuration} months
                </p>
              </div>
            </div>

            {application.leaseDetails.specialRequirements && (
              <div className="mt-6">
                <p className="mb-1 text-sm font-medium text-slate-500">
                  Special Requirements
                </p>
                <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                  {application.leaseDetails.specialRequirements}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-none bg-white shadow-sm">
          <CardHeader className="border-b bg-slate-50 pb-3 pt-3">
            <CardTitle className="flex items-center text-base font-medium">
              <FileText className="mr-2 h-4 w-4 text-primary" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {application.documents && application.documents.length > 0 ? (
              <div className="space-y-3">
                {application.documents.map((doc) => (
                  <div
                    key={doc.name}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3 transition-colors hover:bg-slate-100"
                  >
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100 text-blue-700">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-slate-900">
                          {doc.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {doc.type.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-full p-0"
                    >
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                <FileText className="mb-2 h-8 w-8 text-slate-300" />
                <p className="text-sm text-slate-500">No documents available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </motion.div>
  );
}
