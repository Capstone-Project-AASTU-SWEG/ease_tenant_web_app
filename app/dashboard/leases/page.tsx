"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  Send,
  FileSignature,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

import { Title } from "@/components/custom/title";
import { Text } from "@/components/custom/text";
import PageWrapper from "@/components/custom/page-wrapper";
import { Group } from "@/components/custom/group";
import { CreateLeaseTemplateDialog } from "./_components/create-lease-template-dialog";
import { CreateLeaseDialog } from "./_components/create-lease-dialog";

// Lease status enum
enum LEASE_STATUS {
  DRAFT = "draft",
  SENT = "sent",
  SIGNED = "signed",
  ACTIVE = "active",
  EXPIRED = "expired",
  TERMINATED = "terminated",
}

// Template type
type LeaseTemplate = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  isDefault: boolean;
};

// Lease type
type Lease = {
  id: string;
  templateId: string;
  templateName: string;
  unitId: string;
  unitNumber: string;
  tenantId: string;
  tenantName: string;
  status: LEASE_STATUS;
  startDate: Date;
  endDate: Date;
  monthlyRent: number;
  securityDeposit: number;
  createdAt: Date;
  updatedAt: Date;
  sentAt?: Date;
  signedAt?: Date;
};

export default function LeasesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"leases" | "templates">("leases");
  const [createTemplateDialogOpen, setCreateTemplateDialogOpen] =
    useState(false);
  const [createLeaseDialogOpen, setCreateLeaseDialogOpen] = useState(false);

  // Sample data for templates
  const templates: LeaseTemplate[] = [
    {
      id: "template1",
      name: "Standard Office Lease",
      description: "Standard 12-month lease for office spaces",
      createdAt: new Date("2023-01-15"),
      updatedAt: new Date("2023-06-20"),
      isDefault: true,
    },
    {
      id: "template2",
      name: "Retail Space Lease",
      description: "Lease template for retail spaces with special provisions",
      createdAt: new Date("2023-02-10"),
      updatedAt: new Date("2023-02-10"),
      isDefault: false,
    },
    {
      id: "template3",
      name: "Short-Term Flexible Lease",
      description: "3-6 month flexible lease with renewal options",
      createdAt: new Date("2023-03-05"),
      updatedAt: new Date("2023-07-12"),
      isDefault: false,
    },
    {
      id: "template4",
      name: "Premium Office Suite Lease",
      description: "Lease for premium office suites with additional services",
      createdAt: new Date("2023-04-18"),
      updatedAt: new Date("2023-04-18"),
      isDefault: false,
    },
  ];

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
    {
      id: "lease2",
      templateId: "template2",
      templateName: "Retail Space Lease",
      unitId: "unit2",
      unitNumber: "102",
      tenantId: "tenant2",
      tenantName: "Global Retail Inc.",
      status: LEASE_STATUS.SENT,
      startDate: new Date("2023-02-01"),
      endDate: new Date("2024-01-31"),
      monthlyRent: 3200,
      securityDeposit: 6400,
      createdAt: new Date("2023-01-15"),
      updatedAt: new Date("2023-01-15"),
      sentAt: new Date("2023-01-16"),
    },
    {
      id: "lease3",
      templateId: "template3",
      templateName: "Short-Term Flexible Lease",
      unitId: "unit3",
      unitNumber: "201",
      tenantId: "tenant3",
      tenantName: "Tech Startup LLC",
      status: LEASE_STATUS.DRAFT,
      startDate: new Date("2023-03-01"),
      endDate: new Date("2023-08-31"),
      monthlyRent: 1800,
      securityDeposit: 3600,
      createdAt: new Date("2023-02-20"),
      updatedAt: new Date("2023-02-22"),
    },
    {
      id: "lease4",
      templateId: "template1",
      templateName: "Standard Office Lease",
      unitId: "unit4",
      unitNumber: "202",
      tenantId: "tenant4",
      tenantName: "Legal Services Co.",
      status: LEASE_STATUS.SIGNED,
      startDate: new Date("2023-04-01"),
      endDate: new Date("2024-03-31"),
      monthlyRent: 2800,
      securityDeposit: 5600,
      createdAt: new Date("2023-03-10"),
      updatedAt: new Date("2023-03-10"),
      sentAt: new Date("2023-03-11"),
      signedAt: new Date("2023-03-15"),
    },
    {
      id: "lease5",
      templateId: "template4",
      templateName: "Premium Office Suite Lease",
      unitId: "unit5",
      unitNumber: "301",
      tenantId: "tenant5",
      tenantName: "Executive Consulting Group",
      status: LEASE_STATUS.EXPIRED,
      startDate: new Date("2022-05-01"),
      endDate: new Date("2023-04-30"),
      monthlyRent: 4500,
      securityDeposit: 9000,
      createdAt: new Date("2022-04-15"),
      updatedAt: new Date("2022-04-15"),
      sentAt: new Date("2022-04-16"),
      signedAt: new Date("2022-04-20"),
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
        return <Badge variant="outline">Draft</Badge>;
      case LEASE_STATUS.SENT:
        return <Badge variant="secondary">Sent</Badge>;
      case LEASE_STATUS.SIGNED:
        return <Badge variant="default">Signed</Badge>;
      case LEASE_STATUS.ACTIVE:
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            Active
          </Badge>
        );
      case LEASE_STATUS.EXPIRED:
        return <Badge variant="destructive">Expired</Badge>;
      case LEASE_STATUS.TERMINATED:
        return <Badge variant="destructive">Terminated</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <PageWrapper>
      {/* <BackgroundDots /> */}
      <header className="mb-6">
        <Title size="h2">Lease Management</Title>
        <Text variant="dimmed">
          Create, manage, and track lease agreements for your properties
        </Text>
      </header>

      <main className="space-y-6">
        <Group className="justify-between">
          <Group>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leases or templates..."
                className="w-[300px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </Group>

          <Group>
            {activeTab === "templates" ? (
              <Button onClick={() => setCreateTemplateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Template
              </Button>
            ) : (
              <Button onClick={() => setCreateLeaseDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Lease
              </Button>
            )}
          </Group>
        </Group>
        <Tabs
          defaultValue="leases"
          value={activeTab}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onValueChange={(value) => setActiveTab(value as any)}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="leases" className="px-6">
              Leases
            </TabsTrigger>
            <TabsTrigger value="templates" className="px-6">
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leases" className="mt-0">
            <div className="rounded-md border">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Template</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Monthly Rent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeases.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No leases found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLeases.map((lease) => (
                        <TableRow key={lease.id}>
                          <TableCell className="font-medium">
                            {lease.tenantName}
                          </TableCell>
                          <TableCell>{lease.unitNumber}</TableCell>
                          <TableCell>{lease.templateName}</TableCell>
                          <TableCell>
                            {lease.startDate.toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {lease.endDate.toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            ${lease.monthlyRent.toLocaleString()}
                          </TableCell>
                          <TableCell>{getStatusBadge(lease.status)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(`/dashboard/leases/${lease.id}`)
                                  }
                                >
                                  <FileText className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                {lease.status === LEASE_STATUS.DRAFT && (
                                  <DropdownMenuItem
                                    onClick={() => handleSendLease(lease.id)}
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
                                  className="text-destructive"
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
            </div>
          </TabsContent>

          <TabsContent value="templates" className="mt-0">
            <div className="rounded-md border">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template Name</TableHead>
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
                          No templates found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTemplates.map((template) => (
                        <TableRow key={template.id}>
                          <TableCell className="font-medium">
                            {template.name}
                          </TableCell>
                          <TableCell>{template.description}</TableCell>
                          <TableCell>
                            {template.createdAt.toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {template.updatedAt.toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {template.isDefault && (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/leases/templates/${template.id}`,
                                    )
                                  }
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
                                >
                                  <FileSignature className="mr-2 h-4 w-4" />
                                  Edit Template
                                </DropdownMenuItem>
                                {!template.isDefault && (
                                  <DropdownMenuItem>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Set as Default
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => setCreateLeaseDialogOpen(true)}
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
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <CreateLeaseTemplateDialog
        isOpen={createTemplateDialogOpen}
        onOpenChange={setCreateTemplateDialogOpen}
        onCreateTemplate={handleCreateTemplate}
      />

      <CreateLeaseDialog
        isOpen={createLeaseDialogOpen}
        onOpenChange={setCreateLeaseDialogOpen}
        templates={templates}
        onCreateLease={handleCreateLease}
      />
    </PageWrapper>
  );
}
