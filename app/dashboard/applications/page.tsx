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
  ArrowUpDown,
  ChevronRight,
  Users,
  FileText,
  Trash2,
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
  APPLICATION_STATUS,
  APPLICATION_TYPE,
  PRIORITY_LEVEL,
  RentalApplication,
  Tenant,
} from "@/types";
import {
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
import { RentalApplicationDetail } from "./_components/rental-application-detail";
import PageHeader from "@/components/custom/page-header";
import { useGetApplicationsOfBuildingQuery } from "@/app/quries/useApplications";
import LogJSON from "@/components/custom/log-json";

const ApplicationsPage = () => {
  // State for applications data
  const { data: applications = [], isLoading } =
    useGetApplicationsOfBuildingQuery("6817cf0d67320596899e2d34");

  // State for filters and search
  const [activeTab, setActiveTab] = useState<APPLICATION_TYPE | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<APPLICATION_STATUS | "all">(
    "all",
  );
  const [priorityFilter, setPriorityFilter] = useState<PRIORITY_LEVEL | "all">(
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
    if (!Array.isArray(applications)) {
      return [];
    }

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
          const matchesCommonFields =
            app.id?.toLowerCase().includes(query) ||
            `${app.submittedBy?.firstName}${app.submittedBy?.lastName}`
              .toLowerCase()
              .includes(query) ||
            app.submittedBy?.email?.toLowerCase().includes(query) ||
            (app.notes && app.notes.toLowerCase().includes(query));

          if (matchesCommonFields) return true;

          // Type-specific searching
          if (app.type === "rental") {
            const rentalApp = app as RentalApplication;
            const building = getBuildingByID(rentalApp.unit.buildingId);
            return (
              building?.name?.toLowerCase().includes(query) ||
              rentalApp.unit.unitNumber?.toLowerCase().includes(query) ||
              rentalApp.unit.type?.toLowerCase().includes(query)
            );
          }
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
      pending: applications?.filter((app) => app.status === "pending").length,
      approved: applications?.filter((app) => app.status === "approved").length,
      rejected: applications?.filter((app) => app.status === "rejected").length,
      inReview: applications?.filter((app) => app.status === "in_review")
        .length,
      urgent: applications?.filter((app) => app.priority === "urgent").length,
      unassigned: applications?.filter((app) => !app.assignedTo).length,
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
    newStatus: APPLICATION_STATUS,
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
    <PageWrapper className="py-0">
      <PageHeader
        title="Applications Management"
        description="Review and manage all incoming applications"
      />

      {/* Main Content */}
      <main className="mt-4">
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
            onValueChange={(value) => setActiveTab(value as APPLICATION_TYPE)}
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

      <LogJSON data={{ selectedApplication }} />

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
};

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
      <LogJSON data={{application}} position="bottom-left" />
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
                    TODO: Bussiness Name
                    {(application as RentalApplication).submittedBy.email}
                  </p>
                  <p className="text-sm text-slate-600">
                    Unit {(application as RentalApplication).unit.unitNumber} at{" "}
                    {
                      getBuildingByID(
                        (application as RentalApplication).unit.buildingId,
                      )?.name
                    }
                  </p>
                  <p className="text-sm text-slate-500">
                    {(application as RentalApplication).unit.type} •{" "}
                    {
                      (application as RentalApplication).leaseDetails
                        .numberOfEmployees
                    }{" "}
                    employees
                  </p>
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
  onStatusChange: (appID: string, status: APPLICATION_STATUS) => void;
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

  const submittedBy = application.submittedBy as Tenant;

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
                  {application.type === "rental" &&
                    `${submittedBy.businessName} - Unit ${(application as RentalApplication).unit.unitNumber}`}
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
                        {formatDateTime(application.createdAt || "")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Last Updated
                      </span>
                      <span className="text-sm">
                        {formatDateTime(application.updatedAt || "")}
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

export default ApplicationsPage;
