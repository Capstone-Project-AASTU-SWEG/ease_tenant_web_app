"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CheckCircle2,
  Clock,
  Plus,
  Wrench,
  Filter,
  AlertTriangle,
  Calendar,
  Building,
  ArrowUpRight,
  ChevronRight,
  ClipboardList,
  CheckCheck,
  AlertCircle,
  X,
  CalendarClock,
} from "lucide-react";
import Link from "next/link";
import PageWrapper from "@/components/custom/page-wrapper";
import Stat from "@/components/custom/stat";
import SearchInput from "@/components/custom/search-input";

// Types
type Priority = "high" | "medium" | "low";
type Status =
  | "pending"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

interface MaintenanceRequest {
  id: string;
  title: string;
  property: string;
  location: string;
  description: string;
  submittedDate: string;
  completedDate?: string;
  priority: Priority;
  status: Status;
  assignedTo?: string;
  scheduledDate?: string;
  images?: string[];
  notes?: string[];
}

// Sample data
const maintenanceRequests: MaintenanceRequest[] = [
  {
    id: "REQ-001",
    title: "Broken Window",
    property: "Tech Tower",
    location: "Office #201",
    description:
      "The window in the conference room is cracked and needs to be replaced as soon as possible.",
    submittedDate: "April 8, 2025",
    priority: "high",
    status: "scheduled",
    assignedTo: "Maintenance Team A",
    scheduledDate: "April 12, 2025",
    images: ["/placeholder.svg?height=100&width=100"],
    notes: [
      "Technician will arrive between 9-11 AM",
      "Replacement glass has been ordered",
    ],
  },
  {
    id: "REQ-002",
    title: "Plumbing Issues",
    property: "Eastside Plaza",
    location: "Suite #405",
    description:
      "Water leaking from the bathroom sink. The area under the sink is wet and there appears to be a loose connection.",
    submittedDate: "April 5, 2025",
    priority: "medium",
    status: "in_progress",
    assignedTo: "John's Plumbing",
    scheduledDate: "April 9, 2025",
    images: [
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
    ],
    notes: [
      "Plumber arrived at 10:30 AM",
      "Additional parts needed, will return tomorrow",
    ],
  },
  {
    id: "REQ-003",
    title: "Lighting Replacement",
    property: "West Point",
    location: "Store #102",
    description:
      "Several overhead lights are flickering and need to be replaced in the main retail area.",
    submittedDate: "April 2, 2025",
    priority: "low",
    status: "pending",
    notes: ["Waiting for approval from property management"],
  },
  {
    id: "REQ-004",
    title: "AC Repair",
    property: "Tech Tower",
    location: "Office #201",
    description:
      "Air conditioning unit is not cooling properly. Office temperature is consistently above 78°F.",
    submittedDate: "March 15, 2025",
    completedDate: "April 2, 2025",
    priority: "high",
    status: "completed",
    assignedTo: "Cool Air Services",
    notes: [
      "Refrigerant was low",
      "System cleaned and recharged",
      "Recommended annual maintenance",
    ],
  },
  {
    id: "REQ-005",
    title: "Door Lock Replacement",
    property: "Eastside Plaza",
    location: "Suite #405",
    description:
      "Main entrance door lock is sticking and difficult to open with the key.",
    submittedDate: "March 10, 2025",
    completedDate: "March 12, 2025",
    priority: "medium",
    status: "completed",
    assignedTo: "Security Solutions Inc.",
    notes: ["Lock mechanism replaced", "New keys provided to tenant"],
  },
  {
    id: "REQ-006",
    title: "Pest Control",
    property: "West Point",
    location: "Store #102",
    description:
      "Signs of rodent activity in the storage area. Need pest control services.",
    submittedDate: "February 25, 2025",
    completedDate: "February 27, 2025",
    priority: "medium",
    status: "completed",
    assignedTo: "City Pest Control",
    notes: [
      "Traps set",
      "Entry points sealed",
      "Follow-up inspection scheduled for March",
    ],
  },
];

export default function MaintenancePage() {
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [propertyFilter, setPropertyFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] =
    useState<MaintenanceRequest | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);

  const activeRequests = maintenanceRequests.filter(
    (req) => req.status !== "completed" && req.status !== "cancelled",
  );
  const completedRequests = maintenanceRequests.filter(
    (req) => req.status === "completed" || req.status === "cancelled",
  );

  const filteredActiveRequests = activeRequests.filter((req) => {
    const matchesSearch =
      searchQuery === "" ||
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority =
      priorityFilter === "all" || req.priority === priorityFilter;
    const matchesProperty =
      propertyFilter === "all" || req.property === propertyFilter;

    return matchesSearch && matchesPriority && matchesProperty;
  });

  const filteredCompletedRequests = completedRequests.filter((req) => {
    const matchesSearch =
      searchQuery === "" ||
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority =
      priorityFilter === "all" || req.priority === priorityFilter;
    const matchesProperty =
      propertyFilter === "all" || req.property === propertyFilter;

    return matchesSearch && matchesPriority && matchesProperty;
  });

  const properties = [
    ...new Set(maintenanceRequests.map((req) => req.property)),
  ];

  const handleViewRequest = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setShowDetailPanel(true);
  };

  const closeDetailPanel = () => {
    setShowDetailPanel(false);
  };

  // Calculate statistics
  const totalActive = activeRequests.length;
  const highPriority = activeRequests.filter(
    (req) => req.priority === "high",
  ).length;
  const inProgress = activeRequests.filter(
    (req) => req.status === "in_progress",
  ).length;
  const scheduled = activeRequests.filter(
    (req) => req.status === "scheduled",
  ).length;

  return (
    <PageWrapper className="relative min-h-screen">
      <div className="space-y-8 pb-16">
        <PageHeader />
        <StatisticsSection
          totalActive={totalActive}
          highPriority={highPriority}
          inProgress={inProgress}
          scheduled={scheduled}
        />

        <Tabs
          defaultValue="active"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="bg-background/50 backdrop-blur-sm">
              <TabsTrigger
                value="active"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                <ClipboardList className="mr-2 h-4 w-4" />
                Active Requests
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                <CheckCheck className="mr-2 h-4 w-4" />
                Completed
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-wrap gap-2">
              <SearchInput
                searchQuery={searchQuery}
                onSearchQuery={(sq) => {
                  setSearchQuery(sq);
                }}
              />

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[130px] border-neutral-200/50 bg-background/60 backdrop-blur-sm">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                <SelectTrigger className="w-[150px] border-neutral-200/50 bg-background/60 backdrop-blur-sm">
                  <Building className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  {properties.map((property) => (
                    <SelectItem key={property} value={property}>
                      {property}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="active" className="m-0">
                <RequestsTable
                  requests={filteredActiveRequests}
                  isActive={true}
                  onViewRequest={handleViewRequest}
                />
              </TabsContent>

              <TabsContent value="completed" className="m-0">
                <RequestsTable
                  requests={filteredCompletedRequests}
                  isActive={false}
                  onViewRequest={handleViewRequest}
                />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>

      <AnimatePresence>
        {showDetailPanel && selectedRequest && (
          <RequestDetailPanel
            request={selectedRequest}
            onClose={closeDetailPanel}
          />
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}

function PageHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Maintenance Requests
        </h2>
        <p className="text-muted-foreground">
          Submit and track maintenance requests for your properties
        </p>
      </div>
      <Button
        asChild
        className="bg-primary shadow-md transition-all hover:bg-primary/90"
      >
        <Link href="/dashboard/maintenance/new">
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Link>
      </Button>
    </motion.div>
  );
}

function StatisticsSection({
  totalActive,
  highPriority,
  inProgress,
  scheduled,
}: {
  totalActive: number;
  highPriority: number;
  inProgress: number;
  scheduled: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
    >
      <Stat
        title="Active Requests"
        value={totalActive}
        moreInfo="Total pending requests"
        icon={ClipboardList}
        // color="primary"
      />
      <Stat
        title="High Priority"
        value={highPriority}
        moreInfo="Urgent attention needed"
        icon={AlertCircle}
        // color="destructive"
      />
      <Stat
        title="In Progress"
        value={inProgress}
        moreInfo="Currently being worked on"
        icon={Wrench}
        // color="blue"
      />
      <Stat
        title="Scheduled"
        value={scheduled}
        moreInfo="Upcoming maintenance"
        icon={CalendarClock}
        // color="amber"
      />
    </motion.div>
  );
}

function RequestsTable({
  requests,
  isActive,
  onViewRequest,
}: {
  requests: MaintenanceRequest[];
  isActive: boolean;
  onViewRequest: (request: MaintenanceRequest) => void;
}) {
  return (
    <Card className="overflow-hidden border border-neutral-200/50 bg-background/70 shadow-sm backdrop-blur-md">
      <CardHeader>
        <CardTitle>
          {isActive
            ? "Active Maintenance Requests"
            : "Completed Maintenance Requests"}
        </CardTitle>
        <CardDescription>
          {isActive
            ? `You have ${requests.length} pending maintenance ${requests.length === 1 ? "request" : "requests"}`
            : "History of your resolved maintenance requests"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length > 0 ? (
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Request</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>{isActive ? "Submitted" : "Completed"}</TableHead>
                  <TableHead>{isActive ? "Priority" : "Submitted"}</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request, index) => (
                  <motion.tr
                    key={request.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-background/60 transition-colors hover:bg-background/80"
                  >
                    <TableCell className="font-medium">
                      {request.title}
                    </TableCell>
                    <TableCell>
                      {request.location}, {request.property}
                    </TableCell>
                    <TableCell>
                      {isActive ? request.submittedDate : request.completedDate}
                    </TableCell>
                    <TableCell>
                      {isActive ? (
                        <PriorityBadge priority={request.priority} />
                      ) : (
                        request.submittedDate
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={request.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewRequest(request)}
                        className="hover:bg-primary/10 hover:text-primary"
                      >
                        View
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 rounded-full bg-muted/50 p-3">
              <ClipboardList className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No requests found</h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              {isActive
                ? "You don't have any active maintenance requests matching your filters."
                : "You don't have any completed maintenance requests matching your filters."}
            </p>
            <Button variant="outline" className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create New Request
            </Button>
          </div>
        )}
      </CardContent>
      {requests.length > 0 && (
        <CardFooter className="flex justify-between border-t bg-muted/20 py-2">
          <p className="text-sm text-muted-foreground">
            Showing {requests.length}{" "}
            {requests.length === 1 ? "request" : "requests"}
          </p>
          <Button variant="ghost" size="sm" className="text-xs">
            Export Data
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  switch (priority) {
    case "high":
      return (
        <Badge
          variant="destructive"
          className="bg-destructive/10 text-destructive"
        >
          <AlertTriangle className="mr-1 h-3 w-3" />
          High
        </Badge>
      );
    case "medium":
      return (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
          Medium
        </Badge>
      );
    case "low":
      return (
        <Badge variant="outline" className="bg-muted/50 text-muted-foreground">
          Low
        </Badge>
      );
  }
}

function StatusBadge({ status }: { status: Status }) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-muted/50 text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    case "scheduled":
      return (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
          <Calendar className="mr-1 h-3 w-3" />
          Scheduled
        </Badge>
      );
    case "in_progress":
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
          <Wrench className="mr-1 h-3 w-3" />
          In Progress
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-500">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Completed
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="outline" className="bg-destructive/10 text-destructive">
          <X className="mr-1 h-3 w-3" />
          Cancelled
        </Badge>
      );
  }
}

function RequestDetailPanel({
  request,
  onClose,
}: {
  request: MaintenanceRequest;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 z-50 h-screen w-full max-w-md overflow-auto border-l border-neutral-200/50 bg-background/80 shadow-lg backdrop-blur-lg"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/90 p-4 backdrop-blur-sm">
        <h3 className="text-lg font-semibold">Request Details</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6 p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{request.title}</h2>
            <StatusBadge status={request.status} />
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Building className="mr-2 h-4 w-4" />
            {request.location}, {request.property}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Request ID</p>
            <p className="font-medium">{request.id}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Priority</p>
            <PriorityBadge priority={request.priority} />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Submitted</p>
            <p className="font-medium">{request.submittedDate}</p>
          </div>
          {request.completedDate && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="font-medium">{request.completedDate}</p>
            </div>
          )}
          {request.scheduledDate && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Scheduled</p>
              <p className="font-medium">{request.scheduledDate}</p>
            </div>
          )}
          {request.assignedTo && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Assigned To</p>
              <div className="flex items-center">
                <Avatar className="mr-2 h-6 w-6">
                  <AvatarFallback className="bg-primary/20 text-xs text-primary">
                    {request.assignedTo
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <p className="font-medium">{request.assignedTo}</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Description</h4>
          <p className="text-sm">{request.description}</p>
        </div>

        {request.images && request.images.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold">Images</h4>
            <div className="grid grid-cols-3 gap-2">
              {request.images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-md border bg-muted/20"
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Request image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {request.notes && request.notes.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold">Notes</h4>
            <ul className="space-y-2">
              {request.notes.map((note, index) => (
                <li key={index} className="rounded-md bg-muted/20 p-3 text-sm">
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-2 pt-4">
          <h4 className="font-semibold">Timeline</h4>
          <div className="space-y-4">
            <TimelineItem
              title="Request Submitted"
              date={request.submittedDate}
              icon={<ClipboardList className="h-4 w-4" />}
              status="completed"
            />

            {request.status === "scheduled" ||
            request.status === "in_progress" ||
            request.status === "completed" ? (
              <TimelineItem
                title="Maintenance Scheduled"
                date={request.scheduledDate || "N/A"}
                icon={<Calendar className="h-4 w-4" />}
                status="completed"
              />
            ) : (
              <TimelineItem
                title="Maintenance Scheduled"
                date="Pending"
                icon={<Calendar className="h-4 w-4" />}
                status="pending"
              />
            )}

            {request.status === "in_progress" ||
            request.status === "completed" ? (
              <TimelineItem
                title="Work In Progress"
                date={
                  request.status === "in_progress" ? "Current" : "Completed"
                }
                icon={<Wrench className="h-4 w-4" />}
                status={
                  request.status === "in_progress" ? "current" : "completed"
                }
              />
            ) : (
              <TimelineItem
                title="Work In Progress"
                date="Pending"
                icon={<Wrench className="h-4 w-4" />}
                status="pending"
              />
            )}

            {request.status === "completed" ? (
              <TimelineItem
                title="Request Completed"
                date={request.completedDate || "N/A"}
                icon={<CheckCircle2 className="h-4 w-4" />}
                status="completed"
              />
            ) : (
              <TimelineItem
                title="Request Completed"
                date="Pending"
                icon={<CheckCircle2 className="h-4 w-4" />}
                status="pending"
              />
            )}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 flex justify-between border-t bg-background/90 p-4 backdrop-blur-sm">
        {request.status !== "completed" && request.status !== "cancelled" && (
          <>
            <Button
              variant="outline"
              className="border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel Request
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Wrench className="mr-2 h-4 w-4" />
              {request.status === "pending"
                ? "Schedule"
                : request.status === "scheduled"
                  ? "Start Work"
                  : "Complete"}
            </Button>
          </>
        )}
        {(request.status === "completed" || request.status === "cancelled") && (
          <>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              New Similar Request
            </Button>
            <Button>
              <ArrowUpRight className="mr-2 h-4 w-4" />
              View Property
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
}

function TimelineItem({
  title,
  date,
  icon,
  status,
}: {
  title: string;
  date: string;
  icon: React.ReactNode;
  status: "pending" | "current" | "completed";
}) {
  const statusColors = {
    pending: "bg-muted/50 text-muted-foreground border-muted",
    current: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    completed: "bg-green-500/10 text-green-500 border-green-500/30",
  };

  return (
    <div className="flex items-start">
      <div className={`mr-3 rounded-full p-2 ${statusColors[status]}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{date}</p>
      </div>
    </div>
  );
}
