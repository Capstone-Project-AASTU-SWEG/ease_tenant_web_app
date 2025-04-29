"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  ChevronDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building2,
  PenToolIcon as Tool,
  UserCog,
  Briefcase,
  Calendar,
  ArrowUpDown,
  ChevronRight,
  Users,
  FileText,
  Trash2,
  Download,
  MessageSquare,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import PageWrapper from "@/components/custom/page-wrapper";
import SearchInput from "@/components/custom/search-input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Application,
  ApplicationStatus,
  ApplicationType,
  MaintenanceApplication,
  OtherApplication,
  PriorityLevel,
  ProviderApplication,
  RentalApplication,
  ServiceApplication,
} from "@/types";
import {
  formatDate,
  formatDateTime,
  formatStatusLabel,
  getApplicationTypeIcon,
  getApplicationTypeLabel,
  getPriorityColor,
  getStatusColor,
  getStatusIcon,
  timeElapsed,
} from "./_utils";
import {
  getApplications,
  removeApplication,
  updateApplicationStatus,
} from "../buildings/_hooks/useApplications";
import { getBuildingByID } from "../buildings/_hooks/useBuildings";
import { Group } from "@/components/custom/group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ApplicationsPage() {
  // State for applications data
  const applications = getApplications();

  const isLoading = false;

  // State for filters and search
  const [activeTab, setActiveTab] = useState<ApplicationType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all",
  );
  const [priorityFilter, setPriorityFilter] = useState<PriorityLevel | "all">(
    "all",
  );
  const [sortBy, setSortBy] = useState<"date" | "priority" | "status">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // State for selected application and detail view
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);

  // Filter and sort applications based on current filters
  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        // Filter by type
        if (activeTab !== "all" && app.type !== activeTab) return false;

        // Filter by status
        if (statusFilter !== "all" && app.status !== statusFilter) return false;

        // Filter by priority
        if (priorityFilter !== "all" && app.priority !== priorityFilter)
          return false;

        // Search query filtering
        if (searchQuery) {
          const query = searchQuery.toLowerCase();

          // Search in common fields
          if (
            app.id.toLowerCase().includes(query) ||
            (app.submittedBy.firstName + app.submittedBy.lastName)
              .toLowerCase()
              .includes(query) ||
            app.submittedBy.email.toLowerCase().includes(query) ||
            (app.notes && app.notes.toLowerCase().includes(query))
          ) {
            return true;
          }

          // Type-specific searching

          switch (app.type) {
            case "rental":
              const rentalApp = app as RentalApplication;
              const building = getBuildingByID(
                rentalApp.unitDetails.buildingId,
              ); // Mock building data
              return (
                building?.name.toLowerCase().includes(query) ||
                rentalApp.unitDetails.unitNumber
                  .toLowerCase()
                  .includes(query) ||
                rentalApp.businessDetails.name.toLowerCase().includes(query) ||
                rentalApp.businessDetails.type.toLowerCase().includes(query)
              );
            case "maintenance":
              const maintApp = app as MaintenanceApplication;
              return (
                maintApp.issueDetails.title.toLowerCase().includes(query) ||
                maintApp.issueDetails.description
                  .toLowerCase()
                  .includes(query) ||
                maintApp.issueDetails.category.toLowerCase().includes(query) ||
                maintApp.unitDetails.buildingName.toLowerCase().includes(query)
              );
            case "provider":
              const providerApp = app as ProviderApplication;
              return (
                providerApp.providerDetails.companyName
                  .toLowerCase()
                  .includes(query) ||
                providerApp.providerDetails.serviceType
                  .toLowerCase()
                  .includes(query) ||
                providerApp.providerDetails.contactPerson
                  .toLowerCase()
                  .includes(query)
              );
            case "service":
              const serviceApp = app as ServiceApplication;
              return (
                serviceApp.serviceDetails.title.toLowerCase().includes(query) ||
                serviceApp.serviceDetails.description
                  .toLowerCase()
                  .includes(query) ||
                serviceApp.serviceDetails.category
                  .toLowerCase()
                  .includes(query) ||
                serviceApp.providerDetails.name.toLowerCase().includes(query)
              );
            case "other":
              const otherApp = app as OtherApplication;
              return (
                otherApp.title.toLowerCase().includes(query) ||
                otherApp.description.toLowerCase().includes(query) ||
                (otherApp.category &&
                  otherApp.category.toLowerCase().includes(query))
              );
          }

          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sort by selected criteria
        switch (sortBy) {
          case "date":
            return sortDirection === "desc"
              ? new Date(b.submittedAt).getTime() -
                  new Date(a.submittedAt).getTime()
              : new Date(a.submittedAt).getTime() -
                  new Date(b.submittedAt).getTime();
          case "priority": {
            const priorityOrder = { urgent: 3, high: 2, medium: 1, low: 0 };
            return sortDirection === "desc"
              ? priorityOrder[b.priority] - priorityOrder[a.priority]
              : priorityOrder[a.priority] - priorityOrder[b.priority];
          }
          case "status": {
            const statusOrder = {
              pending: 0,
              in_review: 1,
              on_hold: 2,
              approved: 3,
              rejected: 4,
            };
            return sortDirection === "desc"
              ? statusOrder[b.status] - statusOrder[a.status]
              : statusOrder[a.status] - statusOrder[b.status];
          }
          default:
            return 0;
        }
      });
  }, [
    applications,
    activeTab,
    searchQuery,
    statusFilter,
    priorityFilter,
    sortBy,
    sortDirection,
  ]);

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((app) => app.status === "pending").length,
      approved: applications.filter((app) => app.status === "approved").length,
      rejected: applications.filter((app) => app.status === "rejected").length,
      inReview: applications.filter((app) => app.status === "in_review").length,
      onHold: applications.filter((app) => app.status === "on_hold").length,
      urgent: applications.filter((app) => app.priority === "urgent").length,
      unassigned: applications.filter((app) => !app.assignedTo).length,
    };
  }, [applications]);

  // Handle application selection
  const handleSelectApplication = (application: Application) => {
    setSelectedApplication(application);
    setShowDetailView(true);
  };

  // Handle application status change
  const handleStatusChange = (
    applicationId: string,
    newStatus: ApplicationStatus,
  ) => {
    updateApplicationStatus(applicationId, newStatus);
  };

  // Handle application deletion
  const handleDeleteApplication = (applicationId: string) => {
    removeApplication(applicationId);
  };

  // Toggle sort direction
  const toggleSort = (sortField: "date" | "priority" | "status") => {
    if (sortBy === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(sortField);
      setSortDirection("desc");
    }
  };

  return (
    <PageWrapper className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white">
        <div className="py-4">
          <div>
            <h1 className="text-2xl font-bold">Applications Management</h1>
            <p className="text-slate-500">
              Review and manage all incoming applications
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Applications
                  </p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="rounded-full bg-blue-100 p-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Pending Review</span>
                  <span className="font-medium">
                    {stats.pending + stats.inReview}
                  </span>
                </div>
                <Progress
                  value={((stats.pending + stats.inReview) / stats.total) * 100}
                  className="mt-2 h-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Approved</p>
                  <p className="text-3xl font-bold">{stats.approved}</p>
                </div>
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Approval Rate</span>
                  <span className="font-medium">
                    {stats.total
                      ? Math.round((stats.approved / stats.total) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <Progress
                  value={stats.total ? (stats.approved / stats.total) * 100 : 0}
                  className="mt-2 h-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Urgent</p>
                  <p className="text-3xl font-bold">{stats.urgent}</p>
                </div>
                <div className="rounded-full bg-red-100 p-3">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Of Total</span>
                  <span className="font-medium">
                    {stats.total
                      ? Math.round((stats.urgent / stats.total) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <Progress
                  value={stats.total ? (stats.urgent / stats.total) * 100 : 0}
                  className="mt-2 h-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Unassigned
                  </p>
                  <p className="text-3xl font-bold">{stats.unassigned}</p>
                </div>
                <div className="rounded-full bg-amber-100 p-3">
                  <Users className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Needs Assignment</span>
                  <span className="font-medium">
                    {stats.total
                      ? Math.round((stats.unassigned / stats.total) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    stats.total ? (stats.unassigned / stats.total) * 100 : 0
                  }
                  className="mt-2 h-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <SearchInput
              searchQuery={searchQuery}
              onSearchQuery={setSearchQuery}
            />
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                    All Statuses
                    {statusFilter === "all" && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                    Pending
                    {statusFilter === "pending" && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("in_review")}
                  >
                    In Review
                    {statusFilter === "in_review" && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("on_hold")}>
                    On Hold
                    {statusFilter === "on_hold" && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("approved")}>
                    Approved
                    {statusFilter === "approved" && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>
                    Rejected
                    {statusFilter === "rejected" && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>

                  <DropdownMenuLabel className="mt-2">
                    Filter by Priority
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setPriorityFilter("all")}>
                    All Priorities
                    {priorityFilter === "all" && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter("urgent")}>
                    Urgent
                    {priorityFilter === "urgent" && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter("high")}>
                    High
                    {priorityFilter === "high" && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter("medium")}>
                    Medium
                    {priorityFilter === "medium" && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter("low")}>
                    Low
                    {priorityFilter === "low" && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    Sort
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => toggleSort("date")}
                    className="flex items-center justify-between"
                  >
                    <span>Date</span>
                    {sortBy === "date" &&
                      (sortDirection === "desc" ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4 rotate-180" />
                      ))}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => toggleSort("priority")}
                    className="flex items-center justify-between"
                  >
                    <span>Priority</span>
                    {sortBy === "priority" &&
                      (sortDirection === "desc" ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4 rotate-180" />
                      ))}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => toggleSort("status")}
                    className="flex items-center justify-between"
                  >
                    <span>Status</span>
                    {sortBy === "status" &&
                      (sortDirection === "desc" ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4 rotate-180" />
                      ))}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as ApplicationType)}
          >
            <TabsList>
              <TabsTrigger className="px-6" value="all">
                All
              </TabsTrigger>
              <TabsTrigger className="px-6" value="rental">
                Rental
              </TabsTrigger>
              <TabsTrigger className="px-6" value="maintenance">
                Maintenance
              </TabsTrigger>
              <TabsTrigger className="px-6" value="provider">
                Provider
              </TabsTrigger>
              <TabsTrigger className="px-6" value="service">
                Service
              </TabsTrigger>
              <TabsTrigger className="px-6" value="other">
                Other
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Applications List */}
        <div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
              <p className="mt-4 text-slate-500">Loading applications...</p>
            </div>
          ) : filteredApplications.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {filteredApplications.map((application) => (
                  <RenderApplicationCard
                    application={application}
                    onSelectApplication={handleSelectApplication}
                    key={application.id}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-slate-100 p-4">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium">
                No applications found
              </h3>
              <p className="mt-2 max-w-md text-slate-500"></p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-slate-100 p-4">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium">
                No applications found
              </h3>
              <p className="mt-2 max-w-md text-slate-500">
                {searchQuery
                  ? `No applications match your search for "${searchQuery}". Try adjusting your filters or search terms.`
                  : "There are no applications matching your current filters. Try changing your filter settings."}
              </p>
              <Button
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                  setActiveTab("all");
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Application Detail Dialog */}
      {selectedApplication && (
        <RenderApplicationDetail
          application={selectedApplication}
          setShowDetailView={setShowDetailView}
          showDetailView={showDetailView}
          onStatusChange={handleStatusChange}
          onDeleteApplication={handleDeleteApplication}
        />
      )}
    </PageWrapper>
  );
}

type RenderApplicationCardProps = {
  application: Application;
  onSelectApplication: (application: Application) => void;
};

// Render application card based on type
const RenderApplicationCard = ({
  application,
  onSelectApplication,
}: RenderApplicationCardProps) => {
  return (
    <motion.div
      key={application.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card
        className="mb-4 cursor-pointer overflow-hidden border-l-4 transition-all duration-200 hover:shadow-md"
        style={{
          borderLeftColor:
            application.priority === "urgent"
              ? "rgb(239, 68, 68)"
              : application.priority === "high"
                ? "rgb(249, 115, 22)"
                : application.priority === "medium"
                  ? "rgb(59, 130, 246)"
                  : "rgb(34, 197, 94)",
        }}
        onClick={() => onSelectApplication(application)}
      >
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4">
            {/* Header with ID, Type and Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-slate-100 p-1.5">
                  {getApplicationTypeIcon(application.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {application.id}
                  </p>
                  <h3 className="font-medium">
                    {getApplicationTypeLabel(application.type)}
                  </h3>
                </div>
              </div>
              <Badge
                className={`${getStatusColor(application.status)} transition-colors duration-200`}
              >
                <span className="flex items-center gap-1">
                  {getStatusIcon(application.status)}
                  <span>{formatStatusLabel(application.status)}</span>
                </span>
              </Badge>
            </div>

            {/* Application specific content */}
            <div className="space-y-2">
              {application.type === "rental" && (
                <div className="space-y-1">
                  <p className="font-medium">
                    {(application as RentalApplication).businessDetails.name}
                  </p>
                  <p className="text-sm text-slate-600">
                    Unit{" "}
                    {(application as RentalApplication).unitDetails.unitNumber}{" "}
                    at{" "}
                    {
                      getBuildingByID(
                        (application as RentalApplication).unitDetails
                          .buildingId,
                      )?.name
                    }
                  </p>
                  <p className="text-sm text-slate-500">
                    {(application as RentalApplication).businessDetails.type} •{" "}
                    {
                      (application as RentalApplication).businessDetails
                        .employees
                    }{" "}
                    employees
                  </p>
                </div>
              )}

              {application.type === "maintenance" && (
                <div className="space-y-1">
                  <p className="font-medium">
                    {(application as MaintenanceApplication).issueDetails.title}
                  </p>
                  <p className="line-clamp-1 text-sm text-slate-600">
                    {
                      (application as MaintenanceApplication).issueDetails
                        .description
                    }
                  </p>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>
                      {
                        (application as MaintenanceApplication).issueDetails
                          .category
                      }
                    </span>
                    <span>•</span>
                    <span>
                      {
                        (application as MaintenanceApplication).issueDetails
                          .location
                      }
                    </span>
                  </div>
                </div>
              )}

              {application.type === "provider" && (
                <div className="space-y-1">
                  <p className="font-medium">
                    {
                      (application as ProviderApplication).providerDetails
                        .companyName
                    }
                  </p>
                  <p className="text-sm text-slate-600">
                    {
                      (application as ProviderApplication).providerDetails
                        .serviceType
                    }
                  </p>
                  <p className="text-sm text-slate-500">
                    {
                      (application as ProviderApplication).providerDetails
                        .yearsInBusiness
                    }{" "}
                    years in business •{" "}
                    {
                      (application as ProviderApplication).providerDetails
                        .employeeCount
                    }{" "}
                    employees
                  </p>
                </div>
              )}

              {application.type === "service" && (
                <div className="space-y-1">
                  <p className="font-medium">
                    {(application as ServiceApplication).serviceDetails.title}
                  </p>
                  <p className="line-clamp-1 text-sm text-slate-600">
                    {
                      (application as ServiceApplication).serviceDetails
                        .description
                    }
                  </p>
                  <p className="text-sm text-slate-500">
                    {
                      (application as ServiceApplication).serviceDetails
                        .category
                    }{" "}
                    •
                    {(application as ServiceApplication).serviceDetails.pricing
                      .type === "fixed"
                      ? ` Fixed: $${(application as ServiceApplication).serviceDetails.pricing.amount}`
                      : (application as ServiceApplication).serviceDetails
                            .pricing.type === "hourly"
                        ? ` Hourly: $${(application as ServiceApplication).serviceDetails.pricing.amount}/hr`
                        : " Quote-based"}
                  </p>
                </div>
              )}

              {application.type === "other" && (
                <div className="space-y-1">
                  <p className="font-medium">
                    {(application as OtherApplication).title}
                  </p>
                  <p className="line-clamp-1 text-sm text-slate-600">
                    {(application as OtherApplication).description}
                  </p>
                  {(application as OtherApplication).category && (
                    <p className="text-sm text-slate-500">
                      {(application as OtherApplication).category} •{" "}
                      {(application as OtherApplication).requestedAction ||
                        "No action specified"}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer with metadata */}
            <div className="flex items-center justify-between pt-2 text-sm">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={application.submittedBy?.firstName.slice(0, 2)}
                    alt={application.submittedBy?.firstName}
                  />
                  <AvatarFallback className="text-xs">
                    {(
                      application.submittedBy?.firstName +
                      application.submittedBy?.lastName
                    )
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-slate-600">
                  {application.submittedBy?.firstName}{" "}
                  {application.submittedBy?.lastName}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Badge
                  className={`${getPriorityColor(application.priority)} text-xs`}
                >
                  {application.priority.charAt(0).toUpperCase() +
                    application.priority.slice(1)}
                </Badge>
                <span className="text-slate-500">
                  {timeElapsed(application.submittedAt)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

type RenderApplicationDetailProps = {
  application: Application;
  showDetailView: boolean;
  setShowDetailView: (show: boolean) => void;
  onStatusChange: (appID: string, status: ApplicationStatus) => void;
  onDeleteApplication: (appID: string) => void;
};
// Render application detail view
const RenderApplicationDetail = ({
  application,
  showDetailView,
  setShowDetailView,
  onStatusChange,
  onDeleteApplication,
}: RenderApplicationDetailProps) => {
  if (!application) return null;

  return (
    <Sheet open={showDetailView} onOpenChange={setShowDetailView}>
      <SheetContent className="max-h-screen w-full max-w-4xl overflow-y-auto p-0 sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
        <SheetHeader className="px-6 pb-2 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="rounded-full bg-slate-100 p-2">
                {getApplicationTypeIcon(application.type)}
              </div>
              <div>
                <SheetTitle className="text-xl">
                  {application.type === "rental"
                    ? `${(application as RentalApplication).businessDetails.name} - Unit ${(application as RentalApplication).unitDetails.unitNumber}`
                    : application.type === "maintenance"
                      ? (application as MaintenanceApplication).issueDetails
                          .title
                      : application.type === "provider"
                        ? (application as ProviderApplication).providerDetails
                            .companyName
                        : application.type === "service"
                          ? (application as ServiceApplication).serviceDetails
                              .title
                          : (application as OtherApplication).title}
                </SheetTitle>
                <SheetDescription className="flex items-center gap-2">
                  <span>{getApplicationTypeLabel(application.type)}</span>
                  <span>•</span>
                  <span>ID: {application.id}</span>
                </SheetDescription>
              </div>
            </div>
            <Group spacing="md">
              <Badge className={`${getStatusColor(application.status)}`}>
                <span className="flex items-center gap-1">
                  {getStatusIcon(application.status)}
                  <span>{formatStatusLabel(application.status)}</span>
                </span>
              </Badge>
              <Badge className={`${getPriorityColor(application.priority)}`}>
                {application.priority.charAt(0).toUpperCase() +
                  application.priority.slice(1)}
              </Badge>

              {/* TODO: Add closeing button here */}
              <Button
                variant="ghost"
                className="flex size-8 items-center justify-center rounded-full hover:bg-slate-100"
                onClick={() => setShowDetailView(false)}
              >
                <XCircle className="h-5 w-5 text-slate-500" />
              </Button>
            </Group>
          </div>
        </SheetHeader>

        <ScrollArea className="">
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Left column - Application details */}
              <div className="space-y-6 md:col-span-2">
                {/* Application specific content */}
                {application.type === "rental" && (
                  <RentalApplicationDetail
                    application={application as RentalApplication}
                  />
                )}

                {application.type === "maintenance" && (
                  <MaintenanceApplicationDetail
                    application={application as MaintenanceApplication}
                  />
                )}

                {application.type === "provider" && (
                  <ProviderApplicationDetail
                    application={application as ProviderApplication}
                  />
                )}

                {application.type === "service" && (
                  <ServiceApplicationDetail
                    application={application as ServiceApplication}
                  />
                )}

                {application.type === "other" && (
                  <OtherApplicationDetail
                    application={application as OtherApplication}
                  />
                )}

                {/* Submission details */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Submission Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Submitted By
                      </span>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage
                            src={application.submittedBy.firstName}
                            alt={application.submittedBy.firstName}
                          />
                          <AvatarFallback className="text-xs">
                            {(
                              application.submittedBy.firstName +
                              " " +
                              application.submittedBy.lastName
                            )
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {application.submittedBy.firstName}{" "}
                          {application.submittedBy.lastName}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Submitted On
                      </span>
                      <span className="text-sm">
                        {formatDateTime(application.submittedAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Last Updated
                      </span>
                      <span className="text-sm">
                        {formatDateTime(application.lastUpdated)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Email</span>
                      <span className="text-sm">
                        {application.submittedBy.email}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes section */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {application.notes ? (
                      <p className="text-sm text-slate-600">
                        {application.notes}
                      </p>
                    ) : (
                      <p className="text-sm italic text-slate-500">
                        No notes available
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right column - Metadata and actions */}
              <div className="space-y-6">
                {/* Status and assignment */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Status & Assignment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Application Status</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            <span className="flex items-center gap-2">
                              {getStatusIcon(application.status)}
                              {formatStatusLabel(application.status)}
                            </span>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              onStatusChange(application.id, "pending")
                            }
                            className="flex items-center gap-2"
                          >
                            <Clock className="h-4 w-4" />
                            <span>Pending</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              onStatusChange(application.id, "in_review")
                            }
                            className="flex items-center gap-2"
                          >
                            <FileText className="h-4 w-4" />
                            <span>In Review</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              onStatusChange(application.id, "on_hold")
                            }
                            className="flex items-center gap-2"
                          >
                            <AlertCircle className="h-4 w-4" />
                            <span>On Hold</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              onStatusChange(application.id, "approved")
                            }
                            className="flex items-center gap-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Approved</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              onStatusChange(application.id, "rejected")
                            }
                            className="flex items-center gap-2 text-red-500"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Rejected</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Contact Applicant</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => {
                              if (
                                confirm(
                                  "Are you sure you want to delete this application? This action cannot be undone.",
                                )
                              ) {
                                onDeleteApplication(application.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete Application</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

// ======================================================
// Application Detail Components
// ======================================================

/**
 * Rental Application Detail Component
 */
function RentalApplicationDetail({
  application,
}: {
  application: RentalApplication;
}) {
  const building = getBuildingByID(application.unitDetails.buildingId);
  if (!building) return <p>Building not found.</p>;

  return (
    <>
      {/* Business Details */}
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
              <p>{application.businessDetails.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Business Type
              </p>
              <p>{application.businessDetails.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Employees</p>
              <p>{application.businessDetails.employees}</p>
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
              <p>{building.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Unit Number</p>
              <p>{application.unitDetails.unitNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Floor</p>
              <p>{application.unitDetails.floorNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Monthly Rent</p>
              <p>${application.unitDetails.monthlyRent.toLocaleString()}</p>
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
              <p>{formatDate(application.leaseDetails.requestedStartDate)}</p>
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
                  key={doc.id}
                  className="flex items-center justify-between rounded-md bg-slate-50 p-2"
                >
                  <div className="flex items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-200 text-xs font-medium">
                      {doc.type.toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-slate-500">
                        Uploaded {formatDate(doc.uploadedAt)}
                      </p>
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

/**
 * Maintenance Application Detail Component
 */
function MaintenanceApplicationDetail({
  application,
}: {
  application: MaintenanceApplication;
}) {
  return (
    <>
      {/* Issue Details */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-base">
            <Tool className="mr-2 h-4 w-4 text-blue-500" />
            Issue Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Title</p>
            <p className="font-medium">{application.issueDetails.title}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">Description</p>
            <p>{application.issueDetails.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Category</p>
              <p>{application.issueDetails.category}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Location</p>
              <p>{application.issueDetails.location}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Reported At</p>
              <p>{formatDateTime(application.issueDetails.reportedAt)}</p>
            </div>
            {application.scheduledFor && (
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Scheduled For
                </p>
                <p>{formatDateTime(application.scheduledFor)}</p>
              </div>
            )}
          </div>

          {application.estimatedCost !== undefined && (
            <div>
              <p className="text-sm font-medium text-slate-500">
                Estimated Cost
              </p>
              <p>${application.estimatedCost.toLocaleString()}</p>
            </div>
          )}
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
              <p>{application.unitDetails.buildingName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Unit Number</p>
              <p>{application.unitDetails.unitNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Floor</p>
              <p>{application.unitDetails.floorNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      {application.images && application.images.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {application.images.map((image, index) => (
                <div key={image.id} className="space-y-1">
                  <div className="relative aspect-video overflow-hidden rounded-md border border-slate-200">
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={image.caption || `Issue image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {image.caption && (
                    <p className="text-xs text-slate-500">{image.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

/**
 * Provider Application Detail Component
 */
function ProviderApplicationDetail({
  application,
}: {
  application: ProviderApplication;
}) {
  return (
    <>
      {/* Provider Details */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-base">
            <UserCog className="mr-2 h-4 w-4 text-blue-500" />
            Provider Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Company Name</p>
              <p>{application.providerDetails.companyName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Service Type</p>
              <p>{application.providerDetails.serviceType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Contact Person
              </p>
              <p>{application.providerDetails.contactPerson}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Phone</p>
              <p>{application.providerDetails.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Email</p>
              <p>{application.providerDetails.email}</p>
            </div>
            {application.providerDetails.website && (
              <div>
                <p className="text-sm font-medium text-slate-500">Website</p>
                <p className="truncate">
                  <a
                    href={application.providerDetails.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {application.providerDetails.website}
                  </a>
                </p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-slate-500">
                Years in Business
              </p>
              <p>{application.providerDetails.yearsInBusiness}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Employee Count
              </p>
              <p>{application.providerDetails.employeeCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Offered */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Services Offered</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {application.servicesOffered.map((service, index) => (
              <Badge key={index} variant="outline" className="bg-slate-50">
                {service}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Certifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {application.certifications.map((cert) => (
              <div key={cert.id} className="rounded-md bg-slate-50 p-3">
                <div className="flex justify-between">
                  <p className="font-medium">{cert.name}</p>
                  <Badge variant="outline">
                    {new Date(cert.expiryDate) > new Date()
                      ? "Valid"
                      : "Expired"}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">
                  Issued by: {cert.issuedBy}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    Expires: {formatDate(cert.expiryDate)}
                  </p>
                  {cert.verificationUrl && (
                    <Button variant="link" size="sm" className="h-auto p-0">
                      Verify
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insurance Details */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Insurance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Provider</p>
                <p>{application.insuranceDetails.provider}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Policy Number
                </p>
                <p>{application.insuranceDetails.policyNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Coverage Amount
                </p>
                <p>
                  $
                  {application.insuranceDetails.coverageAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Expiry Date
                </p>
                <p>{formatDate(application.insuranceDetails.expiryDate)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* References */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">References</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {application.references.map((ref, index) => (
              <div key={index} className="rounded-md bg-slate-50 p-3">
                <p className="font-medium">{ref.name}</p>
                <p className="text-sm text-slate-600">{ref.company}</p>
                <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500">{ref.phone}</p>
                  <p className="text-sm text-slate-500">{ref.email}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

/**
 * Service Application Detail Component
 */
function ServiceApplicationDetail({
  application,
}: {
  application: ServiceApplication;
}) {
  return (
    <>
      {/* Service Details */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-base">
            <Briefcase className="mr-2 h-4 w-4 text-blue-500" />
            Service Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Title</p>
            <p className="font-medium">{application.serviceDetails.title}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">Description</p>
            <p>{application.serviceDetails.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Category</p>
              <p>{application.serviceDetails.category}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pricing Type</p>
              <p className="capitalize">
                {application.serviceDetails.pricing.type}
              </p>
            </div>
            {application.serviceDetails.pricing.amount !== undefined && (
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {application.serviceDetails.pricing.type === "hourly"
                    ? "Hourly Rate"
                    : "Fixed Price"}
                </p>
                <p>
                  ${application.serviceDetails.pricing.amount.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">Availability</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {application.serviceDetails.availability.map((day, index) => (
                <Badge key={index} variant="outline" className="bg-slate-50">
                  {day}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Provider Details */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Provider Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Provider Name
              </p>
              <p>{application.providerDetails.name}</p>
            </div>
            {application.providerDetails.rating !== undefined && (
              <div>
                <p className="text-sm font-medium text-slate-500">Rating</p>
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(application.providerDetails.rating!)
                            ? "text-yellow-400"
                            : i < application.providerDetails.rating!
                              ? "text-yellow-400/50"
                              : "text-slate-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-1 text-sm text-slate-600">
                    {application.providerDetails.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            )}
            {application.providerDetails.completedJobs !== undefined && (
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Completed Jobs
                </p>
                <p>{application.providerDetails.completedJobs}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Target Buildings */}
      {application.targetBuildings &&
        application.targetBuildings.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Target Buildings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {application.targetBuildings.map((building) => (
                  <div
                    key={building.id}
                    className="flex items-center rounded-md bg-slate-50 p-2"
                  >
                    <Building2 className="mr-2 h-4 w-4 text-slate-400" />
                    <span>{building.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
    </>
  );
}

/**
 * Other Application Detail Component
 */
function OtherApplicationDetail({
  application,
}: {
  application: OtherApplication;
}) {
  return (
    <>
      {/* Request Details */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-base">
            <FileText className="mr-2 h-4 w-4 text-blue-500" />
            Request Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Title</p>
            <p className="font-medium">{application.title}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">Description</p>
            <p>{application.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {application.category && (
              <div>
                <p className="text-sm font-medium text-slate-500">Category</p>
                <p>{application.category}</p>
              </div>
            )}
            {application.requestedAction && (
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Requested Action
                </p>
                <p>{application.requestedAction}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Attachments */}
      {application.attachments && application.attachments.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {application.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between rounded-md bg-slate-50 p-2"
                >
                  <div className="flex items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-200 text-xs font-medium">
                      {attachment.type.toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{attachment.name}</p>
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
