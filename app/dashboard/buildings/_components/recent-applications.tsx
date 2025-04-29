"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  ChevronRight,
  Clock,
  Calendar,
  BuildingIcon,
  SlidersHorizontal,
  Phone,
  Mail,
  FileText,
  MessageSquare,
  ExternalLink,
  Eye,
  MoreHorizontal,
  AlertCircle,
  PieChart,
  Search,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/custom/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Group } from "@/components/custom/group";
import Stack from "@/components/custom/stack";

export function RecentApplications() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Filter applications based on status and search query
  const filteredApplications = applications.filter((application) => {
    // Filter by status
    if (selectedStatus !== "all" && application.status !== selectedStatus) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        application.name.toLowerCase().includes(query) ||
        application.unit.toLowerCase().includes(query) ||
        application.email?.toLowerCase().includes(query) ||
        application.type?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Get application by ID for detail view
  const getApplicationById = (id: string) => {
    return applications.find((app) => app.id === id);
  };

  // Display time since application
  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    return `${diffInDays} days ago`;
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="rounded-full border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
          >
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "review":
        return (
          <Badge
            variant="outline"
            className="rounded-full border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
          >
            <Eye className="mr-1 h-3 w-3" />
            In Review
          </Badge>
        );
      case "incomplete":
        return (
          <Badge
            variant="outline"
            className="rounded-full border-orange-200 bg-orange-100 text-orange-700 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
          >
            <AlertCircle className="mr-1 h-3 w-3" />
            Incomplete
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Stack className="p-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <Group className="">
          <Tabs
            defaultValue="all"
            value={selectedStatus}
            onValueChange={setSelectedStatus}
          >
            <TabsList className="rounded-full">
              <TabsTrigger value="all" className="rounded-full">
                All
              </TabsTrigger>
              <TabsTrigger value="pending" className="rounded-full">
                Pending
              </TabsTrigger>
              <TabsTrigger value="review" className="rounded-full">
                In Review
              </TabsTrigger>
              <TabsTrigger value="incomplete" className="rounded-full">
                Incomplete
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {/* <Badge className="ml-2 rounded-full bg-primary/10 text-primary">
            {filteredApplications.length} Applications
          </Badge> */}
        </Group>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="relative w-full max-w-xs sm:w-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              className="rounded-full pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-none bg-white/90 shadow-none">
        <CardHeader className="mb-3 p-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription className="mt-1">
                You have{" "}
                {applications.filter((app) => app.status === "pending").length}{" "}
                pending applications to review.
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="rounded-full border-primary/20 bg-primary/10 px-3 text-primary"
            >
              <Clock className="mr-1 h-3 w-3" />5 new today
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredApplications.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredApplications.map((application) => (
                <div
                  key={application.id}
                  className="relative flex cursor-pointer items-center gap-4 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  onMouseEnter={() => setHoveredItem(application.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {application.unread && (
                    <div className="absolute left-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary" />
                  )}

                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm dark:border-slate-800">
                    <AvatarImage
                      src={application.avatar}
                      alt={application.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {application.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium">
                          {application.name}
                        </p>
                        {renderStatusBadge(application.status)}
                        {application.priority && (
                          <Badge
                            variant="outline"
                            className={`rounded-full ${
                              application.priority === "high"
                                ? "border-rose-200 bg-rose-100 text-rose-700 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-400"
                                : "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                            }`}
                          >
                            {application.priority === "high"
                              ? "High Priority"
                              : "Medium Priority"}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="mt-1 flex flex-col gap-y-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-x-3">
                      <div className="flex items-center">
                        <BuildingIcon className="mr-1 h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{application.unit}</span>
                      </div>

                      <div className="flex items-center sm:before:mx-2 sm:before:text-muted-foreground/50 sm:before:content-['•']">
                        <Calendar className="mr-1 h-3 w-3 flex-shrink-0 sm:hidden" />
                        <span>{getTimeSince(application.date)}</span>
                      </div>

                      {application.type && (
                        <div className="flex items-center sm:before:mx-2 sm:before:text-muted-foreground/50 sm:before:content-['•']">
                          <FileText className="mr-1 h-3 w-3 flex-shrink-0 sm:hidden" />
                          <span>{application.type}</span>
                        </div>
                      )}
                    </div>

                    {application.score && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            Applicant Score
                          </span>
                          <span className="font-medium">
                            {application.score}/100
                          </span>
                        </div>
                        <Progress
                          value={application.score}
                          className="mt-1 h-1"
                          indicatorClassName={`${
                            application.score > 80
                              ? "bg-emerald-500"
                              : application.score > 60
                                ? "bg-amber-500"
                                : "bg-rose-500"
                          }`}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setSelectedItem(application.id)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[550px]">
                        {selectedItem && (
                          <ApplicationDetails
                            application={getApplicationById(selectedItem)}
                          />
                        )}
                      </DialogContent>
                    </Dialog>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/20"
                          >
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Approve</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Approve application</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20"
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Reject</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Reject application</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          <span>Add Comment</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          <span>Email Applicant</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          <span>View Full Application</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground/20" />
              <h3 className="mt-4 text-lg font-medium">
                No applications found
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your filters
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex w-full justify-end border-t border-slate-100 p-4 pt-2 dark:border-slate-800">
          {/* <Button variant="outline" className="group rounded-full">
            <span>View All Applications</span>
            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button> */}
        </CardFooter>
      </Card>
    </Stack>
  );
}

// Application Details Dialog Component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ApplicationDetails({ application }: { application: any }) {
  if (!application) return null;

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <span>Application Details</span>
          {application.priority && (
            <Badge
              variant="outline"
              className={`rounded-full ${
                application.priority === "high"
                  ? "border-rose-200 bg-rose-100 text-rose-700"
                  : "border-amber-200 bg-amber-100 text-amber-700"
              }`}
            >
              {application.priority === "high"
                ? "High Priority"
                : "Medium Priority"}
            </Badge>
          )}
        </DialogTitle>
        <DialogDescription>
          Application submitted on{" "}
          {new Date(application.date).toLocaleDateString()}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
            <AvatarImage src={application.avatar} alt={application.name} />
            <AvatarFallback className="bg-primary/10 text-lg text-primary">
              {application.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">{application.name}</h3>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              {application.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{application.email}</span>
                </div>
              )}
              {application.phone && (
                <div className="ml-3 flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{application.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Property</Label>
            <div className="flex items-center gap-1.5">
              <BuildingIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{application.unit}</span>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              Application Type
            </Label>
            <div className="flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {application.type || "Standard Lease"}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Status</Label>
            <div>
              {application.status === "pending" && (
                <Badge
                  variant="outline"
                  className="border-amber-200 bg-amber-100 text-amber-700"
                >
                  <Clock className="mr-1 h-3 w-3" />
                  Pending
                </Badge>
              )}
              {application.status === "review" && (
                <Badge
                  variant="outline"
                  className="border-blue-200 bg-blue-100 text-blue-700"
                >
                  <Eye className="mr-1 h-3 w-3" />
                  In Review
                </Badge>
              )}
              {application.status === "incomplete" && (
                <Badge
                  variant="outline"
                  className="border-orange-200 bg-orange-100 text-orange-700"
                >
                  <AlertCircle className="mr-1 h-3 w-3" />
                  Incomplete
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Submitted</Label>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {new Date(application.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {application.score && (
          <div className="mt-2 rounded-md bg-slate-50 p-4 dark:bg-slate-800">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="flex items-center text-sm font-medium">
                <PieChart className="mr-2 h-4 w-4 text-primary" />
                Applicant Score
              </h4>
              <div
                className={`rounded-full px-2 py-0.5 text-sm font-medium ${
                  application.score > 80
                    ? "bg-emerald-100 text-emerald-700"
                    : application.score > 60
                      ? "bg-amber-100 text-amber-700"
                      : "bg-rose-100 text-rose-700"
                }`}
              >
                {application.score}/100
              </div>
            </div>
            <Progress
              value={application.score}
              className="h-2"
              indicatorClassName={`${
                application.score > 80
                  ? "bg-emerald-500"
                  : application.score > 60
                    ? "bg-amber-500"
                    : "bg-rose-500"
              }`}
            />
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="mb-1 text-xs text-muted-foreground">Credit</div>
                <div className="font-medium">
                  {application.creditScore || "Good"}
                </div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-xs text-muted-foreground">Income</div>
                <div className="font-medium">
                  {application.incomeRatio || "3.5x"}
                </div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-xs text-muted-foreground">
                  Background
                </div>
                <div className="font-medium">
                  {application.background || "Clear"}
                </div>
              </div>
            </div>
          </div>
        )}

        {application.notes && (
          <div className="mt-2">
            <Label className="mb-1 text-xs text-muted-foreground">Notes</Label>
            <div className="rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-800">
              {application.notes}
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-between">
          <Button variant="outline" className="mr-2 w-1/2">
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact
          </Button>
          <Button className="w-1/2">
            <Check className="mr-2 h-4 w-4" />
            Approve
          </Button>
        </div>
      </div>
    </>
  );
}

// Sample data with enhanced fields
const applications = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    unit: "Building A, Unit 304",
    date: "2023-04-23",
    status: "pending",
    priority: "high",
    unread: true,
    score: 86,
    email: "sarah.johnson@example.com",
    phone: "(555) 123-4567",
    type: "New Lease",
    creditScore: "Excellent",
    incomeRatio: "4.2x",
    background: "Clear",
    notes:
      "Applicant has excellent references from previous landlords and stable employment history.",
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    unit: "Building C, Unit 201",
    date: "2023-04-22",
    status: "review",
    priority: "medium",
    unread: true,
    score: 72,
    email: "michael.chen@example.com",
    phone: "(555) 987-6543",
    type: "Renewal",
    creditScore: "Good",
    incomeRatio: "3.5x",
    background: "Clear",
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    unit: "Building B, Unit 512",
    date: "2023-04-21",
    status: "incomplete",
    unread: false,
    score: 55,
    email: "emma.r@example.com",
    phone: "(555) 456-7890",
    type: "New Lease",
    creditScore: "Fair",
    incomeRatio: "2.8x",
    background: "Check Required",
    notes: "Missing employment verification documents. Follow up required.",
  },
  {
    id: "4",
    name: "David Kim",
    avatar: "/placeholder.svg?height=40&width=40",
    unit: "Building A, Unit 107",
    date: "2023-04-20",
    status: "pending",
    unread: false,
    score: 92,
    email: "david.kim@example.com",
    phone: "(555) 234-5678",
    type: "Short-Term",
    creditScore: "Excellent",
    incomeRatio: "5.0x",
    background: "Clear",
  },
  {
    id: "5",
    name: "Lisa Thompson",
    avatar: "/placeholder.svg?height=40&width=40",
    unit: "Building D, Unit 405",
    date: "2023-04-19",
    status: "review",
    priority: "high",
    unread: true,
    score: 68,
    email: "lisa.t@example.com",
    phone: "(555) 876-5432",
    type: "New Lease",
  },
];
