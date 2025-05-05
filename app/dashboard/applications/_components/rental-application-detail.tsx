import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RentalApplication, Tenant } from "@/types";
import {
  Briefcase,
  Building2,
  Calendar,
  FileText,
  Download,
} from "lucide-react";

import { formatDateTime } from "../_utils";
import { Button } from "@/components/ui/button";
import { useGetBuildingQuery } from "@/app/quries/useBuildings";
import { Loader } from "@/components/custom/loader";
import { Center } from "@/components/custom/center";
import LogJSON from "@/components/custom/log-json";

/**
 * Rental Application Detail Component
 */
export function RentalApplicationDetail({
  application,
}: {
  application: RentalApplication;
}) {
  const getBuildingQuery = useGetBuildingQuery("6817cf0d67320596899e2d34");
  const building = getBuildingQuery.data;
  const submittedBy = application.submittedBy as Tenant;

  if (getBuildingQuery.isLoading) {
    return (
      <Center className="h-[4rem]">
        <Loader variant="dots" />;
      </Center>
    );
  }

  return (
    <>
      {/* Business Details */}
      <LogJSON data={{ building, submittedBy }} />
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-base">
            <Briefcase className="mr-2 h-4 w-4 text-blue-500" />
            Business Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Business Name
              </p>
              <p>{submittedBy.businessName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Business Type
              </p>
              <p>{submittedBy.businessType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Employees</p>
              <p>{application.leaseDetails.numberOfEmployees}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unit Details */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-base">
            <Building2 className="mr-2 h-4 w-4 text-blue-500" />
            Unit Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Building</p>
              <p>{building?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Unit Number</p>
              <p>{application.unit.unitNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Floor</p>
              <p>{application.unit.floorNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Monthly Rent</p>
              <p>${application.unit.monthlyRent.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lease Details */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-base">
            <Calendar className="mr-2 h-4 w-4 text-blue-500" />
            Lease Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Requested Start Date
              </p>
              <p>
                {formatDateTime(
                  application.leaseDetails.requestedStartDate.toLocaleString(),
                )}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Requested Duration
              </p>
              <p>{application.leaseDetails.requestedDuration} months</p>
            </div>
          </div>

          {application.leaseDetails.specialRequirements && (
            <div>
              <p className="text-sm font-medium text-slate-500">
                Special Requirements
              </p>
              <p className="text-sm">
                {application.leaseDetails.specialRequirements}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents */}
      {application.documents && application.documents.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base">
              <FileText className="mr-2 h-4 w-4 text-blue-500" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {application.documents.map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-center justify-between rounded-md bg-slate-50 p-2"
                >
                  <div className="flex items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-200 text-xs font-medium">
                      {doc.type.toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{doc.name}</p>
                      {/* <p className="text-xs text-slate-500">
                        Uploaded {formatDate(doc.uploadedAt)}
                      </p> */}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
