"use client";

import { useState, useMemo, useEffect } from "react";
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
  Home,
  Building,
  Wrench,
  Briefcase,
  MoreHorizontal,
  Calendar,
  ArrowLeft,
  User,
  Mail,
  Info,
  UserPlus,
  UserCog,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { Label } from "@/components/ui/label";
import PageWrapper from "@/components/custom/page-wrapper";
import SearchInput from "@/components/custom/search-input";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  Application,
  APPLICATION_STATUS,
  APPLICATION_TYPE,
  PRIORITY_LEVEL,
  RentalApplication,
  Tenant,
  WithTimestampsStr,
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

import { RentalApplicationDetail } from "./_components/rental-application-detail";
import PageHeader from "@/components/custom/page-header";
import {
  useDeleteApplicationMutation,
  useGetApplicationsOfBuildingQuery,
  useUpdateApplicationStatusMutation,
} from "@/app/quries/useApplications";
import LogJSON from "@/components/custom/log-json";
import Stat from "@/components/custom/stat";
import {
  CustomTabs,
  CustomTabsList,
  TabItem,
} from "@/components/custom/custom-tabs";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { successToast } from "@/components/custom/toasts";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/quries/useAuth";
// import { getBuildingByID } from "../buildings/ks/useBuildings";

const tabs: TabItem[] = [
  {
    value: "all",
    label: "All",
    icon: Home,
  },
  {
    value: "rental",
    label: "Rental",
    icon: Building,
  },
  {
    value: "maintenance",
    label: "Maintenance",
    icon: Wrench,
  },
  {
    value: "provider",
    label: "Provider",
    icon: Users,
  },
  {
    value: "service",
    label: "Service",
    icon: Briefcase,
  },
  {
    value: "other",
    label: "Other",
    icon: MoreHorizontal,
  },
];

const ApplicationsPage = () => {
  // State for applications data

  const { isTenant, isManager, data } = useAuth();
  const router = useRouter();

  const [applications, setApplications] = useState<
    (Application & WithTimestampsStr)[]
  >([]);

  const getApplicationsOfBuildingQuery = useGetApplicationsOfBuildingQuery(
    data?.building?.id,
  );

  useEffect(() => {
    if (isManager) {
      setApplications(getApplicationsOfBuildingQuery.data || []);
    }
  }, [getApplicationsOfBuildingQuery.data, isManager]);

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
  const [selectedApplication, setSelectedApplication] = useState<
    (Application & WithTimestampsStr) | null
  >(null);
  const [showDetailView, setShowDetailView] = useState(false);

  if (isTenant) {
    router.replace("/dashboard/tenant");
  }

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
            const building = applications.find(
              (app) => app.id === rentalApp.unit.buildingId,
            )?.building;

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
  const handleSelectApplication = (
    application: Application & WithTimestampsStr,
  ) => {
    setSelectedApplication(application);
    setShowDetailView(true);
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
          {/* Total Applications */}
          <Stat
            icon={FileText}
            iconColor="text-blue-600"
            iconBg="bg-blue-100"
            title="Total Applications"
            value={stats.total.toString()}
            moreInfo={`${stats.total ? (stats.approved / stats.total) * 100 : 0} Pending Review`}
          />

          {/* Approved */}
          <Stat
            icon={CheckCircle}
            iconColor="text-green-600"
            iconBg="bg-green-100"
            title="Approved"
            value={stats.approved.toString()}
            moreInfo={`${stats.total ? (stats.urgent / stats.total) * 100 : 0}% Approval Rate`}
          />

          {/* Urgent */}
          <Stat
            icon={AlertCircle}
            iconColor="text-red-600"
            iconBg="bg-red-100"
            title="Urgent"
            value={stats.urgent.toString()}
            moreInfo={`${stats.pending + stats.inReview}% Of Total`}
          />

          {/* Unassigned */}
          <Stat
            icon={Users}
            iconColor="text-amber-600"
            iconBg="bg-amber-100"
            title="Unassigned"
            value={stats.unassigned.toString()}
            moreInfo={`${stats.total ? (stats.unassigned / stats.total) * 100 : 0}% Needs Assignment`}
          />
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

          <CustomTabs variant={"pills"}>
            <CustomTabsList
              items={tabs}
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as APPLICATION_TYPE)}
              fullWidth={false}
            />
          </CustomTabs>
        </div>

        {/* Applications List */}
        <div>
          {getApplicationsOfBuildingQuery.isPending ? (
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
              <div className="rounded-full bg-primary/5 p-4">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium">
                No applications found
              </h3>
              <p className="mt-2 max-w-md text-slate-500"></p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-primary/5 p-4">
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
          key={selectedApplication.id}
          application={selectedApplication}
          setShowDetailView={setShowDetailView}
          showDetailView={showDetailView}
        />
      )}
    </PageWrapper>
  );
};

type RenderApplicationCardProps = {
  application: Application & WithTimestampsStr;
  onSelectApplication: (application: Application & WithTimestampsStr) => void;
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
        className="mb-4 cursor-pointer overflow-hidden bg-primary transition-all duration-200 hover:shadow-md"
        onClick={() => onSelectApplication(application)}
      >
        <CardContent className="p-4 text-white">
          <div className="flex flex-col space-y-4">
            {/* Header with ID, Type and Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-primary/5 p-1.5">
                  {getApplicationTypeIcon(application.type)}
                </div>
                <div>
                  {/* <p className="text-sm font-medium text-slate-500">
                    {application.id}
                  </p> */}
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
                    {/* TODO: Bussiness Name */}
                    {
                      (application as RentalApplication).submittedBy[
                        "businessName"
                      ]
                    }
                  </p>
                  <p className="text-sm text-white/70">
                    Unit {(application as RentalApplication).unit?.unitNumber}{" "}
                    at {application.building.name}
                  </p>
                  <p className="text-sm text-white/60">
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
                  <AvatarFallback className="text-xs text-primary">
                    {(
                      application.submittedBy?.firstName +
                      application.submittedBy?.lastName
                    )
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-white/70">
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
                <span className="text-white/50">
                  {timeElapsed(application.createdAt)}
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
  application: Application & WithTimestampsStr;
  showDetailView: boolean;
  setShowDetailView: (show: boolean) => void;
};

// Render application detail view
const RenderApplicationDetail = ({
  application: app,
  showDetailView,
  setShowDetailView,
}: RenderApplicationDetailProps) => {
  const [activeTab, setActiveTab] = useState("details");
  const updateApplicationStatusMutation = useUpdateApplicationStatusMutation();

  const deleteApplicationMutation = useDeleteApplicationMutation();

  const router = useRouter();

  const [application, setApplication] = useState(app);

  const submittedBy = application.submittedBy as Tenant;
  const handleStatusChange = (appID: string, status: APPLICATION_STATUS) => {
    updateApplicationStatusMutation.mutate({
      appId: appID,
      status,
    });

    setApplication((prev) => ({ ...prev, status: status }));
  };

  const handleDeleteApplication = (appID: string) => {
    deleteApplicationMutation.mutate({ appId: appID });
  };

  useEffect(() => {
    if (deleteApplicationMutation.isSuccess) {
      setShowDetailView(false);
      successToast("Application deleted successfully.");
    }
  }, [deleteApplicationMutation.isSuccess, setShowDetailView]);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <AnimatePresence>
      {showDetailView && (
        <Sheet open={showDetailView} onOpenChange={setShowDetailView}>
          <SheetContent
            side="right"
            className="max-h-screen w-full max-w-4xl overflow-hidden p-0 sm:max-w-2xl md:max-w-3xl lg:max-w-4xl"
          >
            <SheetTitle />
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeIn}
              className="flex h-full flex-col"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 border-b bg-white px-6 py-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDetailView(false)}
                    className="h-8 w-8 rounded-full"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                  </Button>

                  <div className="flex items-center gap-2">
                    <Badge
                      className={`${getStatusColor(application.status)} px-2 py-1`}
                    >
                      <span className="flex items-center gap-1">
                        {getStatusIcon(application.status)}
                        <span>{formatStatusLabel(application.status)}</span>
                      </span>
                    </Badge>
                    <Badge
                      className={`${getPriorityColor(application.priority)} px-2 py-1`}
                    >
                      {application.priority.charAt(0).toUpperCase() +
                        application.priority.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/5">
                    {getApplicationTypeIcon(application.type)}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-slate-900">
                      {application.type === "rental" &&
                        `${submittedBy.businessName} - Unit ${(application as RentalApplication).unit.unitNumber}`}
                    </h2>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        {getApplicationTypeLabel(application.type)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDateTime(application.createdAt || "")}
                      </span>
                      <span>•</span>
                      <span>ID: {application.id}</span>
                    </div>
                  </div>
                </div>

                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="mt-6"
                >
                  <CustomTabs variant={"pills"} className="mb-2">
                    <CustomTabsList
                      items={[
                        { label: "Details", value: "details", icon: Info },
                        {
                          label: "Submission",
                          value: "submission",
                          icon: UserPlus,
                        },
                        { label: "Actions", value: "actions", icon: UserCog },
                      ]}
                      defaultValue={"details"}
                      value={activeTab}
                      onValueChange={(value) => {
                        setActiveTab(
                          value as "details" | "submission" | "actions",
                        );
                      }}
                    />
                  </CustomTabs>
                  {/* Content */}
                  <ScrollArea className="h-[35rem] flex-1 pr-4">
                    <div className="py-4">
                      <TabsContent value="details" className="m-0">
                        {/* Application specific content */}
                        {application.type === "rental" && (
                          <div className="space-y-6">
                            <RentalApplicationDetail
                              application={application as RentalApplication}
                            />
                          </div>
                        )}

                        {/* Notes section */}
                        <Card className="mt-6 border-none shadow-sm">
                          <CardHeader className="border-b bg-slate-50 pb-3 pt-3">
                            <CardTitle className="text-base font-medium">
                              Notes
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4">
                            {application.notes ? (
                              <p className="text-sm text-slate-600">
                                {application.notes}
                              </p>
                            ) : (
                              <div className="flex h-20 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                                <p className="text-sm text-slate-500">
                                  No notes available
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="submission" className="m-0 space-y-6">
                        {/* Applicant Information */}
                        <Card className="border-none shadow-sm">
                          <CardHeader className="border-b bg-slate-50 pb-3 pt-3">
                            <CardTitle className="flex items-center text-base font-medium">
                              <User className="mr-2 h-4 w-4 text-primary" />
                              Applicant Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-16 w-16 border">
                                <AvatarImage
                                  src={`https://avatar.vercel.sh/${submittedBy.email}`}
                                  alt={submittedBy.firstName}
                                />
                                <AvatarFallback className="text-lg">
                                  {(
                                    submittedBy.firstName +
                                    " " +
                                    submittedBy.lastName
                                  )
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="text-lg font-medium">
                                  {submittedBy.firstName} {submittedBy.lastName}
                                </h3>
                                <div className="mt-1 flex flex-col gap-1 text-sm text-slate-500">
                                  <span className="flex items-center gap-2">
                                    <Mail className="h-3.5 w-3.5" />
                                    {submittedBy.email}
                                  </span>
                                  {submittedBy.businessName && (
                                    <span className="flex items-center gap-2">
                                      <Building className="h-3.5 w-3.5" />
                                      {submittedBy.businessName}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Submission Timeline */}
                        <Card className="border-none shadow-sm">
                          <CardHeader className="border-b bg-slate-50 pb-3 pt-3">
                            <CardTitle className="flex items-center text-base font-medium">
                              <Calendar className="mr-2 h-4 w-4 text-primary" />
                              Submission Timeline
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4">
                            <div className="space-y-4">
                              <div className="flex items-start gap-3">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                  <FileText className="h-3 w-3" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="font-medium">
                                      Application Submitted
                                    </p>
                                    <Badge
                                      variant="outline"
                                      className="font-normal"
                                    >
                                      {formatDateTime(
                                        application.createdAt || "",
                                      )}
                                    </Badge>
                                  </div>
                                  <p className="mt-1 text-sm text-slate-500">
                                    {submittedBy.firstName}{" "}
                                    {submittedBy.lastName} submitted this
                                    application
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-3">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/5 text-slate-600">
                                  <Clock className="h-3 w-3" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="font-medium">Last Updated</p>
                                    <Badge
                                      variant="outline"
                                      className="font-normal"
                                    >
                                      {formatDateTime(
                                        application.updatedAt || "",
                                      )}
                                    </Badge>
                                  </div>
                                  <p className="mt-1 text-sm text-slate-500">
                                    Application status was updated to{" "}
                                    {formatStatusLabel(application.status)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="actions" className="m-0 space-y-6">
                        {/* Status Management */}
                        <Card className="border-none shadow-sm">
                          <CardHeader className="border-b bg-slate-50 pb-3 pt-3">
                            <CardTitle className="flex items-center text-base font-medium">
                              <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                              Status Management
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4 p-4">
                            <div className="space-y-2">
                              <Label>Change Status</Label>
                              <div className="grid grid-cols-2 gap-3">
                                <Button
                                  variant="outline"
                                  className="justify-start gap-2 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
                                  onClick={() =>
                                    handleStatusChange(
                                      application.id,
                                      "pending",
                                    )
                                  }
                                  disabled={
                                    updateApplicationStatusMutation.isPending
                                  }
                                >
                                  <Clock className="h-4 w-4" />
                                  <span>Pending</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  className="justify-start gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                                  onClick={() =>
                                    handleStatusChange(
                                      application.id,
                                      "in_review",
                                    )
                                  }
                                  disabled={
                                    updateApplicationStatusMutation.isPending
                                  }
                                >
                                  <FileText className="h-4 w-4" />
                                  <span>In Review</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  className="justify-start gap-2 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                                  onClick={() =>
                                    handleStatusChange(
                                      application.id,
                                      "approved",
                                    )
                                  }
                                  disabled={
                                    updateApplicationStatusMutation.isPending
                                  }
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  <span>Approved</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  className="justify-start gap-2 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                                  onClick={() =>
                                    handleStatusChange(
                                      application.id,
                                      "rejected",
                                    )
                                  }
                                  disabled={
                                    updateApplicationStatusMutation.isPending
                                  }
                                >
                                  <XCircle className="h-4 w-4" />
                                  <span>Rejected</span>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="border-none shadow-sm">
                          <CardHeader className="border-b bg-primary/5 pb-3 pt-3">
                            <CardTitle className="flex items-center text-base font-medium">
                              <MessageSquare className="mr-2 h-4 w-4 text-primary" />
                              Quick Actions
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                              <Button className="justify-start gap-2">
                                <MessageSquare className="h-4 w-4" />
                                <span>Contact Applicant</span>
                              </Button>

                              <Button
                                variant="outline"
                                className="justify-start gap-2"
                              >
                                <Calendar className="h-4 w-4" />
                                <span>Schedule Meeting</span>
                              </Button>
                              <Button
                                variant="outline"
                                className="justify-start gap-2"
                                onClick={() => {
                                  // TODO: MAKE END POINT
                                  router.push(
                                    `/dashboard/leases?appId=${application.id}`,
                                  );
                                }}
                              >
                                <FileText className="h-4 w-4" />
                                <span>Send Lease</span>
                              </Button>
                              <Button
                                variant="outline"
                                className="justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={() => {
                                  if (
                                    confirm(
                                      "Are you sure you want to delete this application? This action cannot be undone.",
                                    )
                                  ) {
                                    handleDeleteApplication(application.id);
                                  }
                                }}
                                disabled={deleteApplicationMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete Application</span>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </div>
                    <ScrollBar />
                  </ScrollArea>
                </Tabs>
              </div>
            </motion.div>
          </SheetContent>
        </Sheet>
      )}
    </AnimatePresence>
  );
};

export default ApplicationsPage;
