"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FileText,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  Send,
  FileSignature,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  Building,
  Users,
  Calendar,
  DollarSign,
  ArrowUpDown,
  XIcon,
  IdCard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

import PageWrapper from "@/components/custom/page-wrapper";
import { CreateLeaseTemplateDrawer } from "./_components/create-lease-template-drawer";
import { CreateLeaseDrawer } from "./_components/create-lease-drawer";
import PageHeader from "@/components/custom/page-header";
import Stat from "@/components/custom/stat";
import { LEASE_STATUS, RentalApplication } from "@/types";
import {
  useCreateLeaseMutation,
  useDeleteLeaseTemplateMutation,
  useGetAllLeaseQuery,
  useGetLeaseTemplatesQuery,
  useLeaseTemplatePutMutation,
} from "@/app/quries/useLeases";
import LogJSON from "@/components/custom/log-json";
import { formatDate, formatDateTime } from "../applications/_utils";
import { useGetApplicationByIdQuery } from "@/app/quries/useApplications";
import { warningToast } from "@/components/custom/toasts";
import LeasePDFGenerator from "@/components/custom/lease-pdf-generator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateLease, LeaseTemplate } from "./_schema";

import { generateLeaseDataValues } from "@/utils/lease-data-mapper";
import { getFullNameFromObj, getLastDateAfterMonth } from "@/utils";
import { useAuth } from "@/app/quries/useAuth";
import { getStatusBadge } from "@/utils/components";

export default function LeasesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"leases" | "templates">("leases");
  const [createTemplateDialogOpen, setCreateTemplateDialogOpen] =
    useState(false);
  const [isLeasePreviewOpen, setIsLeasePreviewOpen] = useState(false);
  // const [leaseInfo, setLeaseInfo] = useState<CreateLease | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<
    (LeaseTemplate & { id: string }) | null
  >(null);
  const [createLeaseDialogOpen, setCreateLeaseDialogOpen] = useState(false);

  const getLeaseTemplatesQuery = useGetLeaseTemplatesQuery();

  const deleteLeaseTemplateMutation = useDeleteLeaseTemplateMutation();
  const leaseTemplatePutMutation = useLeaseTemplatePutMutation();

  const searchParam = useSearchParams();
  const appId = searchParam.get("appId") as string;

  const getApplicationByIdQuery = useGetApplicationByIdQuery(appId);
  const application = getApplicationByIdQuery.data;

  const auth = useAuth();

  // Sample data for templates
  const templates = getLeaseTemplatesQuery.data || [];
  const [pdfBlob, setPDFBlob] = useState<Blob | null>(null);
  const [isPDFBlobSet, setIsPDFBlobSet] = useState(false);
  const createLeaseMutation = useCreateLeaseMutation();
  const getAllLeaseQuery = useGetAllLeaseQuery();
  const leases = getAllLeaseQuery.data || [];

  const appFound = !!leases.find((l) => {
    return l.application?.id === appId;
  });

  // Filter leases based on search query
  const filteredLeases = leases.filter(
    (lease) =>
      lease.tenant?.firstName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      lease.unit?.unitNumber?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Filter templates based on search query
  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Handle creating a new lease template
  const handleCreateTemplate = (templateData: Partial<LeaseTemplate>) => {
    console.log("Creating new template:", templateData);
    // Implement API call to create template
  };

  // Handle creating a new lease
  const handleCreateLease = (leaseData: Partial<CreateLease>) => {
    const leaseTemplate = templates.find(
      (temp) => temp.id === leaseData.templateId,
    );

    if (!leaseTemplate) {
      warningToast("Lease template not found.");
      return;
    }

    const managerSignature = auth.data?.manager?.signature;

    if (!managerSignature) {
      warningToast("Please, set signature before creating leases.");
      return;
    }

    setSelectedTemplate(leaseTemplate);
    setCreateLeaseDialogOpen(false);
    setIsLeasePreviewOpen(true);
  };

  // Handle sending a lease to tenant
  const handleSendLease = (leaseId: string) => {
    console.log("Sending lease:", leaseId);
    // Implement API call to send lease
  };

  // Get summary stats
  const getLeaseStats = () => {
    const active = leases.filter(
      (lease) => lease.status === LEASE_STATUS.ACTIVE,
    ).length;
    const pending = leases.filter(
      (lease) =>
        lease.status === LEASE_STATUS.SENT ||
        lease.status === LEASE_STATUS.DRAFT,
    ).length;
    const expired = leases.filter(
      (lease) => lease.status === LEASE_STATUS.EXPIRED,
    ).length;

    const totalRent = leases
      .filter((lease) => lease.status === LEASE_STATUS.ACTIVE)
      .reduce((sum, lease) => sum + lease.unit?.monthlyRent || 0, 0);

    return { active, pending, expired, totalRent };
  };

  const stats = getLeaseStats();

  useEffect(() => {
    if (appId && getApplicationByIdQuery.isSuccess) {
      // open drawer for creating lease info
      if (appFound) {
        setCreateLeaseDialogOpen(false);
      } else {
        setCreateLeaseDialogOpen(true);
      }
    }
  }, [appFound, appId, getApplicationByIdQuery.isSuccess]);

  useEffect(() => {
    if (isPDFBlobSet && pdfBlob) {
      // TODO: CALL THE API ENDPOINT
      if (!application) {
        warningToast("Application info not found.");
        return;
      }
      if (!selectedTemplate) {
        warningToast("Template info not found.");
        return;
      }

      console.log({ pdfBlob });

      createLeaseMutation.mutate({
        applicationId: application?.id,
        contractFile: pdfBlob,
        status: LEASE_STATUS.ACTIVE,
        tenantId: application?.submittedBy.id,
        unitId: (application as RentalApplication)?.unit.id,
        templateId: selectedTemplate.id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPDFBlobSet]);

  return (
    <PageWrapper className="py-0">
      <LogJSON data={{ leases: getAllLeaseQuery.data }} />
      <PageHeader
        title="Lease Management"
        description="Create, manage, and track lease agreements for your properties."
        rightSection={
          activeTab === "templates" ? (
            <Button
              size="sm"
              className="h-9"
              onClick={() => setCreateTemplateDialogOpen(true)}
            >
              <Plus className="mr-1 h-4 w-4" />
              New Template
            </Button>
          ) : (
            <Button
              size="sm"
              className="h-9"
              onClick={() => setCreateLeaseDialogOpen(true)}
            >
              <Plus className="mr-1 h-4 w-4" />
              New Lease
            </Button>
          )
        }
      />

      {/* Preview Dialog */}
      <Dialog open={isLeasePreviewOpen} onOpenChange={setIsLeasePreviewOpen}>
        <DialogHeader>
          <DialogTitle />
        </DialogHeader>
        <DialogContent className="w-full max-w-xl p-0">
          {isLeasePreviewOpen && (
            <LeasePDFGenerator
              managerSignature={auth.data?.manager?.signature}
              showPreview={true}
              generateOnMount={true}
              leaseTitle={selectedTemplate?.name || "Lease Agreement"}
              leaseDescription={selectedTemplate?.description}
              sections={selectedTemplate?.sections || []}
              dataValues={generateLeaseDataValues(
                application as RentalApplication,
              )}
              onPdfGenerated={(blob) => {
                setPDFBlob(blob);
                setIsPDFBlobSet(true);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Stat
          title="Active Leases"
          value={stats.active || 0}
          icon={CheckCircle2}
          moreInfo="Currently active lease agreements"
        />

        <Stat
          title="Pending Leases"
          value={String(stats.pending)}
          icon={Clock}
          iconColor="text-blue-500"
          moreInfo="Awaiting signature or in draft"
        />

        <Stat
          title="Expired Leases"
          value={String(stats.expired)}
          icon={AlertCircle}
          iconColor="text-amber-500"
          moreInfo="Leases that need renewal"
        />

        <Stat
          title="Monthly Revenue"
          value={`ETB${stats.totalRent.toFixed(2)}`}
          icon={DollarSign}
          iconColor="text-primary"
          moreInfo="From active lease agreements"
        />
      </div>

      <div className="mb-8 mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <Tabs
            defaultValue="leases"
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "leases" | "templates")
            }
            className="w-full"
          >
            <div className="flex items-center justify-between">
              <TabsList className="bg-muted/50 p-1">
                <TabsTrigger
                  value="leases"
                  className="rounded-md data-[state=active]:bg-primary"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Leases
                </TabsTrigger>
                <TabsTrigger
                  value="templates"
                  className="rounded-md data-[state=active]:bg-primary"
                >
                  <FileSignature className="mr-2 h-4 w-4" />
                  Templates
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-[200px] pl-9 md:w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 gap-1">
                      <Filter className="h-3.5 w-3.5" />
                      <span>Filter</span>
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem>All Statuses</DropdownMenuItem>
                    <DropdownMenuItem>Active Only</DropdownMenuItem>
                    <DropdownMenuItem>Pending Only</DropdownMenuItem>
                    <DropdownMenuItem>Expired Only</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <TabsContent value="leases" className="mt-6 space-y-4">
              <Card className="border shadow-sm">
                <ScrollArea className="">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[200px]">
                          <div className="flex items-center gap-1">
                            <IdCard className="h-4 w-4 text-muted-foreground" />
                            <span>Lease ID</span>
                          </div>
                        </TableHead>
                        <TableHead className="w-[200px]">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>Tenant</span>
                            <ArrowUpDown className="ml-1 h-3 w-3 text-muted-foreground" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span>Unit</span>
                          </div>
                        </TableHead>
                        <TableHead>Template</TableHead>
                        <TableHead>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Term</span>
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span>Monthly Rent</span>
                          </div>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeases.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
                              <FileText className="h-10 w-10 text-muted-foreground/50" />
                              <p>No leases found</p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCreateLeaseDialogOpen(true)}
                                className="mt-2"
                              >
                                <Plus className="mr-1 h-4 w-4" />
                                Create New Lease
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredLeases.map((lease) => (
                          <TableRow
                            key={lease.id}
                            className="cursor-pointer transition-colors hover:bg-muted/30"
                            onClick={() =>
                              router.push(`/dashboard/leases/${lease.id}`)
                            }
                          >
                            <TableCell
                              className="font-medium"
                              onClick={() => {
                                navigator.clipboard.writeText(lease.id);
                              }}
                            >
                              {lease.id?.slice(0, 4)}..
                            </TableCell>
                            <TableCell className="font-medium">
                              {getFullNameFromObj(lease.tenant?.userId || {})}
                            </TableCell>
                            <TableCell>{lease.unit?.unitNumber}</TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {lease.leaseTemplate?.name || "Not Defined"}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm">
                                <span>
                                  {formatDateTime(
                                    lease?.application?.leaseDetails.requestedStartDate?.toString(),
                                  )}
                                </span>
                                <span className="text-muted-foreground">→</span>
                                <span>
                                  {formatDateTime(
                                    getLastDateAfterMonth(
                                      lease?.application?.leaseDetails.requestedStartDate.toString(),
                                      lease?.application.leaseDetails
                                        .requestedDuration,
                                    ).toString(),
                                  )}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              ${lease.unit?.monthlyRent.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(lease.status)}
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-[180px]"
                                >
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/leases/${lease.id}`,
                                      )
                                    }
                                    className="cursor-pointer"
                                  >
                                    <FileText className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  {lease.status === LEASE_STATUS.DRAFT && (
                                    <DropdownMenuItem
                                      onClick={() => handleSendLease(lease.id)}
                                      className="cursor-pointer"
                                    >
                                      <Send className="mr-2 h-4 w-4" />
                                      Send to Tenant
                                    </DropdownMenuItem>
                                  )}
                                  {lease.status === LEASE_STATUS.SENT && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        router.push(
                                          `/dashboard/leases/${lease.id}/remind`,
                                        )
                                      }
                                      className="cursor-pointer"
                                    >
                                      <Clock className="mr-2 h-4 w-4" />
                                      Send Reminder
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/leases/${lease.id}/edit`,
                                      )
                                    }
                                    className="cursor-pointer"
                                  >
                                    <FileSignature className="mr-2 h-4 w-4" />
                                    Edit Lease
                                  </DropdownMenuItem>
                                  {lease.status === LEASE_STATUS.ACTIVE && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        router.push(
                                          `/dashboard/leases/${lease.id}/renew`,
                                        )
                                      }
                                      className="cursor-pointer"
                                    >
                                      <CheckCircle2 className="mr-2 h-4 w-4" />
                                      Renew Lease
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/leases/${lease.id}/terminate`,
                                      )
                                    }
                                    className="cursor-pointer text-destructive"
                                  >
                                    <AlertCircle className="mr-2 h-4 w-4" />
                                    Terminate Lease
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="mt-6 space-y-4">
              <Card className="border shadow-sm">
                <ScrollArea className="">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[250px]">
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span>Template Name</span>
                            <ArrowUpDown className="ml-1 h-3 w-3 text-muted-foreground" />
                          </div>
                        </TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Default</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTemplates.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
                              <FileText className="h-10 w-10 text-muted-foreground/50" />
                              <p>No templates found</p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setCreateTemplateDialogOpen(true)
                                }
                                className="mt-2"
                              >
                                <Plus className="mr-1 h-4 w-4" />
                                Create New Template
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTemplates.map((template) => (
                          <TableRow
                            key={template.id}
                            className="cursor-pointer transition-colors hover:bg-muted/30"
                            onClick={() =>
                              router.push(
                                `/dashboard/leases/templates/${template.id}`,
                              )
                            }
                          >
                            <TableCell className="font-medium">
                              {template.name}
                            </TableCell>
                            <TableCell className="max-w-[300px] truncate">
                              {template.description}
                            </TableCell>
                            <TableCell>
                              {formatDate(template.createdAt)}
                            </TableCell>
                            <TableCell>
                              {formatDate(template.updatedAt)}
                            </TableCell>
                            <TableCell>
                              {template.isDefault && (
                                <Badge
                                  variant="outline"
                                  className="border-0 bg-green-100 text-green-700"
                                >
                                  <div className="flex items-center gap-1.5">
                                    <CheckCircle2 className="h-3 w-3" />
                                    <span>Default</span>
                                  </div>
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-[180px]"
                                >
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/leases/templates/${template.id}`,
                                      )
                                    }
                                    className="cursor-pointer"
                                  >
                                    <FileText className="mr-2 h-4 w-4" />
                                    View Template
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/leases/templates/${template.id}/edit`,
                                      )
                                    }
                                    className="cursor-pointer"
                                  >
                                    <FileSignature className="mr-2 h-4 w-4" />
                                    Edit Template
                                  </DropdownMenuItem>
                                  {!template.isDefault && (
                                    <DropdownMenuItem
                                      className="cursor-pointer"
                                      onClick={() => {
                                        leaseTemplatePutMutation.mutate({
                                          ...template,
                                          isDefault: true,
                                        });
                                      }}
                                    >
                                      <CheckCircle2 className="mr-2 h-4 w-4" />
                                      Set as Default
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => {
                                      deleteLeaseTemplateMutation.mutate(
                                        template.id,
                                      );
                                    }}
                                    className="cursor-pointer text-red-500"
                                  >
                                    <XIcon className="mr-2 h-4 w-4" />
                                    Delete Template
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialogs */}
      <CreateLeaseTemplateDrawer
        isOpen={createTemplateDialogOpen}
        onOpenChange={setCreateTemplateDialogOpen}
        onCreateTemplate={handleCreateTemplate}
      />

      <CreateLeaseDrawer
        isOpen={createLeaseDialogOpen}
        onOpenChange={setCreateLeaseDialogOpen}
        templates={templates}
        onCreateLease={handleCreateLease}
        application={getApplicationByIdQuery.data as RentalApplication}
      />
    </PageWrapper>
  );
}
