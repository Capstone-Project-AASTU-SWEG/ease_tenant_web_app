"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  ArrowLeft,
  Download,
  Send,
  Clock,
  FileSignature,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Title } from "@/components/custom/title";
import { Text } from "@/components/custom/text";
import PageWrapper from "@/components/custom/page-wrapper";
import { Group } from "@/components/custom/group";
import { BackgroundDots } from "@/components/custom/design-elements";

// Lease status enum
enum LEASE_STATUS {
  DRAFT = "draft",
  SENT = "sent",
  SIGNED = "signed",
  ACTIVE = "active",
  EXPIRED = "expired",
  TERMINATED = "terminated",
}

export default function LeaseDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "details" | "document" | "history"
  >("details");

  // Sample lease data (in a real app, fetch this from API)
  const lease = {
    id: params.id,
    templateId: "template1",
    templateName: "Standard Office Lease",
    unitId: "unit1",
    unitNumber: "101",
    buildingName: "Main Office Tower",
    tenantId: "tenant1",
    tenantName: "Acme Corporation",
    tenantEmail: "contact@acmecorp.com",
    status: LEASE_STATUS.SENT,
    startDate: new Date("2023-01-01"),
    endDate: new Date("2023-12-31"),
    monthlyRent: 2500,
    securityDeposit: 5000,
    createdAt: new Date("2022-12-15"),
    updatedAt: new Date("2022-12-15"),
    sentAt: new Date("2022-12-16"),
    signedAt: null,
    notes: "Tenant requested additional parking spaces.",
    history: [
      {
        date: new Date("2022-12-15"),
        action: "Created",
        user: "John Manager",
      },
      {
        date: new Date("2022-12-16"),
        action: "Sent to tenant",
        user: "John Manager",
      },
      {
        date: new Date("2022-12-18"),
        action: "Viewed by tenant",
        user: "System",
      },
    ],
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

  // Handle sending a reminder
  const handleSendReminder = () => {
    console.log("Sending reminder for lease:", lease.id);
    // Implement API call to send reminder
  };

  return (
    <PageWrapper>
      <BackgroundDots />
      <header className="mb-6">
        <Group className="mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/leases")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Title size="h2">Lease Details</Title>
        </Group>
        <Text variant="dimmed">View and manage lease agreement details</Text>
      </header>

      <main className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">
              Lease for Unit {lease.unitNumber} - {lease.tenantName}
            </CardTitle>
            <Group>
              {getStatusBadge(lease.status)}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(`/dashboard/leases/${lease.id}/edit`)
                    }
                  >
                    <FileSignature className="mr-2 h-4 w-4" />
                    Edit Lease
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </DropdownMenuItem>
                  {lease.status === LEASE_STATUS.SENT && (
                    <DropdownMenuItem onClick={handleSendReminder}>
                      <Clock className="mr-2 h-4 w-4" />
                      Send Reminder
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Terminate Lease
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Group>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Building & Unit
                </h4>
                <p>
                  {lease.buildingName}, Unit {lease.unitNumber}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Tenant
                </h4>
                <p>{lease.tenantName}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Template
                </h4>
                <p>{lease.templateName}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Lease Term
                </h4>
                <p>
                  {lease.startDate.toLocaleDateString()} to{" "}
                  {lease.endDate.toLocaleDateString()}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Monthly Rent
                </h4>
                <p>${lease.monthlyRent.toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Security Deposit
                </h4>
                <p>${lease.securityDeposit.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {lease.status === LEASE_STATUS.SENT && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-amber-500" />
                <Text>
                  Waiting for tenant signature. Sent on{" "}
                  {lease.sentAt?.toLocaleDateString()}
                </Text>
              </div>
              <Button
                onClick={handleSendReminder}
                variant="outline"
                className="border-amber-300 bg-white"
              >
                Send Reminder
              </Button>
            </CardContent>
          </Card>
        )}

        <Tabs
          defaultValue="details"
          value={activeTab}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onValueChange={(value) => setActiveTab(value as any)}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="details" className="px-6">
              Details
            </TabsTrigger>
            <TabsTrigger value="document" className="px-6">
              Document
            </TabsTrigger>
            <TabsTrigger value="history" className="px-6">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tenant Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Name
                    </h4>
                    <p>{lease.tenantName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Email
                    </h4>
                    <p>{lease.tenantEmail}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lease Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">
                  {lease.notes || "No notes available."}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="document" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Lease Document</CardTitle>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border bg-muted/30 p-8">
                  <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold">
                      COMMERCIAL LEASE AGREEMENT
                    </h2>
                    <p className="text-muted-foreground">
                      Standard Office Lease
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-2 text-lg font-semibold">1. PARTIES</h3>
                      <p>
                        This lease agreement is made between PROPERTY MANAGEMENT
                        COMPANY {`("Landlord")`} and {lease.tenantName}{" "}
                        {`("Tenant")`}.
                      </p>
                    </div>

                    <div>
                      <h3 className="mb-2 text-lg font-semibold">
                        2. PREMISES
                      </h3>
                      <p>
                        The landlord agrees to rent to the tenant the commercial
                        space located at {lease.buildingName}, Unit{" "}
                        {lease.unitNumber}.
                      </p>
                    </div>

                    <div>
                      <h3 className="mb-2 text-lg font-semibold">3. TERM</h3>
                      <p>
                        The lease term begins on{" "}
                        {lease.startDate.toLocaleDateString()} and ends on{" "}
                        {lease.endDate.toLocaleDateString()}, unless terminated
                        earlier as provided in this agreement.
                      </p>
                    </div>

                    <div>
                      <h3 className="mb-2 text-lg font-semibold">4. RENT</h3>
                      <p>
                        Tenant agrees to pay monthly rent of $
                        {lease.monthlyRent.toLocaleString()} due on the first
                        day of each month.
                      </p>
                    </div>

                    {/* More lease sections would go here */}
                    <div className="text-center text-muted-foreground">
                      [Additional lease terms and conditions...]
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-8">
                      <div>
                        <p className="mb-4 font-medium">LANDLORD:</p>
                        <div className="h-px w-full bg-border"></div>
                        <p className="mt-1 text-sm">Signature</p>
                      </div>
                      <div>
                        <p className="mb-4 font-medium">TENANT:</p>
                        <div className="h-px w-full bg-border"></div>
                        <p className="mt-1 text-sm">Signature</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Lease History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lease.history.map((event, index) => (
                    <div key={index} className="flex items-start">
                      <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        {index === 0 ? (
                          <FileText className="h-4 w-4" />
                        ) : event.action.includes("Sent") ? (
                          <Send className="h-4 w-4" />
                        ) : event.action.includes("Viewed") ? (
                          <FileSignature className="h-4 w-4" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{event.action}</p>
                        <div className="flex text-sm text-muted-foreground">
                          <p>
                            {event.date.toLocaleDateString()} at{" "}
                            {event.date.toLocaleTimeString()}
                          </p>
                          <Separator
                            orientation="vertical"
                            className="mx-2 h-4"
                          />
                          <p>{event.user}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </PageWrapper>
  );
}
