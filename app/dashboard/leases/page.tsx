"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Lease, LEASE_STATUS, LeaseTemplate } from "@/types";
import { useGetLeaseTemplatesQuery } from "@/app/quries/useLeases";
import LogJSON from "@/components/custom/log-json";
import { formatDate } from "../applications/_utils";

export default function LeasesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"leases" | "templates">("leases");
  const [createTemplateDialogOpen, setCreateTemplateDialogOpen] =
    useState(false);
  const [createLeaseDialogOpen, setCreateLeaseDialogOpen] = useState(false);

  const getLeaseTemplatesQuery = useGetLeaseTemplatesQuery();

  // Sample data for templates
  const templates = getLeaseTemplatesQuery.data || [];

  // Sample data for leases
  const leases: Lease[] = [
    {
      id: "lease1",
      templateId: "template1",
      templateName: "Standard Office Lease",
      unitId: "unit1",
      unitNumber: "101",
      tenantId: "tenant1",
      tenantName: "Acme Corporation",
      status: LEASE_STATUS.ACTIVE,
      startDate: new Date("2023-01-01"),
      endDate: new Date("2023-12-31"),
      monthlyRent: 2500,
      securityDeposit: 5000,
      createdAt: new Date("2022-12-15"),
      updatedAt: new Date("2022-12-15"),
      sentAt: new Date("2022-12-16"),
      signedAt: new Date("2022-12-20"),
    },
  ];

  // Filter leases based on search query
  const filteredLeases = leases.filter(
    (lease) =>
      lease.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lease.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lease.templateName.toLowerCase().includes(searchQuery.toLowerCase()),
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
  const handleCreateLease = (leaseData: Partial<Lease>) => {
    console.log("Creating new lease:", leaseData);
    // Implement API call to create lease
  };

  // Handle sending a lease to tenant
  const handleSendLease = (leaseId: string) => {
    console.log("Sending lease:", leaseId);
    // Implement API call to send lease
  };

  // Get status badge for lease
  const getStatusBadge = (status: LEASE_STATUS) => {
    switch (status) {
      case LEASE_STATUS.DRAFT:
        return (
          <Badge
            variant="outline"
            className="bg-muted/50 text-muted-foreground"
          >
            <div className="flex items-center gap-1.5">
              <FileText className="h-3 w-3" />
              <span>Draft</span>
            </div>
          </Badge>
        );
      case LEASE_STATUS.SENT:
        return (
          <Badge
            variant="secondary"
            className="border-0 bg-blue-100 text-blue-700 hover:bg-blue-200"
          >
            <div className="flex items-center gap-1.5">
              <Send className="h-3 w-3" />
              <span>Sent</span>
            </div>
          </Badge>
        );
      case LEASE_STATUS.SIGNED:
        return (
          <Badge
            variant="default"
            className="border-0 bg-purple-100 text-purple-700 hover:bg-purple-200"
          >
            <div className="flex items-center gap-1.5">
              <FileSignature className="h-3 w-3" />
              <span>Signed</span>
            </div>
          </Badge>
        );
      case LEASE_STATUS.ACTIVE:
        return (
          <Badge
            variant="default"
            className="border-0 bg-green-100 text-green-700 hover:bg-green-200"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3" />
              <span>Active</span>
            </div>
          </Badge>
        );
      case LEASE_STATUS.EXPIRED:
        return (
          <Badge
            variant="destructive"
            className="border-0 bg-amber-100 text-amber-700 hover:bg-amber-200"
          >
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              <span>Expired</span>
            </div>
          </Badge>
        );
      case LEASE_STATUS.TERMINATED:
        return (
          <Badge
            variant="destructive"
            className="border-0 bg-red-100 text-red-700 hover:bg-red-200"
          >
            <div className="flex items-center gap-1.5">
              <AlertCircle className="h-3 w-3" />
              <span>Terminated</span>
            </div>
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
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
      .reduce((sum, lease) => sum + lease.monthlyRent, 0);

    return { active, pending, expired, totalRent };
  };

  const stats = getLeaseStats();

  return (
    <PageWrapper className="py-0">
      <LogJSON data={{ templates }} />
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Stat
          title="Active Leases"
          value={String(10)}
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
          value={`$${stats.totalRent.toLocaleString()}`}
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
                <ScrollArea className="h-[calc(100vh-360px)]">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow className="hover:bg-transparent">
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
                            <TableCell className="font-medium">
                              {lease.tenantName}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-normal">
                                {lease.unitNumber}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {lease.templateName}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm">
                                <span>
                                  {lease.startDate.toLocaleDateString()}
                                </span>
                                <span className="text-muted-foreground">→</span>
                                <span>
                                  {lease.endDate.toLocaleDateString()}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              ${lease.monthlyRent.toLocaleString()}
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
                <ScrollArea className="h-[calc(100vh-360px)]">
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
                                    <DropdownMenuItem className="cursor-pointer">
                                      <CheckCircle2 className="mr-2 h-4 w-4" />
                                      Set as Default
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      setCreateLeaseDialogOpen(true)
                                    }
                                    className="cursor-pointer"
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Lease
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
      />
    </PageWrapper>
  );
}
