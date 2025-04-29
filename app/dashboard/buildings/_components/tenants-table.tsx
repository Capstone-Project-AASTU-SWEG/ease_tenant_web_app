"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreHorizontal,
  Search,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  FileText,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getBuildings } from "../_hooks/useBuildings";

export function TenantsTable({ buildingID }: { buildingID: string }) {
  const buildings = getBuildings();
  const building = buildings.find((build) => build.id === buildingID);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false);
  const [isViewTenantOpen, setIsViewTenantOpen] = useState(false);
  const [isContactTenantOpen, setIsContactTenantOpen] = useState(false);
  const [isRenewLeaseOpen, setIsRenewLeaseOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<
    (typeof tenants)[0] | null
  >(null);

  const filteredTenants = tenants.filter((tenant) => {
    // Filter by search query
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.room.includes(searchQuery);

    // Filter by status
    const matchesStatus =
      statusFilter === "all" ||
      tenant.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleViewTenant = (tenant: (typeof tenants)[0]) => {
    setSelectedTenant(tenant);
    setIsViewTenantOpen(true);
  };

  const handleContactTenant = (tenant: (typeof tenants)[0]) => {
    setSelectedTenant(tenant);
    setIsContactTenantOpen(true);
  };

  const handleRenewLease = (tenant: (typeof tenants)[0]) => {
    setSelectedTenant(tenant);
    setIsRenewLeaseOpen(true);
  };

  console.log({ building });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="relative w-full flex-1">
          <Search className="absolute left-3 top-1/2 z-[9] h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tenants..."
            className="w-full rounded-full border-neutral-200/50 bg-background/60 pl-10 pr-4 shadow-sm backdrop-blur-sm transition-all focus-visible:ring-2 focus-visible:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] rounded-full border-neutral-200/50 bg-background/60 backdrop-blur-sm">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tenants</SelectItem>
            <SelectItem value="current">Current</SelectItem>
            <SelectItem value="past">Past</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200/50 bg-background/70 backdrop-blur-md transition-all duration-300 hover:shadow-md">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Room</TableHead>
              <TableHead className="hidden md:table-cell">
                Lease Start
              </TableHead>
              <TableHead className="hidden md:table-cell">Lease End</TableHead>
              <TableHead className="hidden sm:table-cell">Rent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredTenants.map((tenant, index) => (
                <motion.tr
                  key={tenant.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-background/60 transition-colors hover:bg-background/80"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                        <AvatarImage src={tenant.avatar} alt={tenant.name} />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {tenant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{tenant.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {tenant.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{tenant.room}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {tenant.leaseStart}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {tenant.leaseEnd}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    ${tenant.rent.toLocaleString()}/mo
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        tenant.status === "Current"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                      }`}
                    >
                      {tenant.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:bg-primary/10"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-background/80 backdrop-blur-sm"
                      >
                        <DropdownMenuItem
                          onClick={() => handleViewTenant(tenant)}
                        >
                          <FileText className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleContactTenant(tenant)}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" /> Contact
                          Tenant
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRenewLease(tenant)}
                        >
                          <Calendar className="mr-2 h-4 w-4" /> Renew Lease
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CreditCard className="mr-2 h-4 w-4" /> Payment
                          History
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
            {filteredTenants.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <UserPlus className="mb-2 h-10 w-10 opacity-20" />
                    <p>No tenants found</p>
                    <p className="text-sm">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Tenant Dialog */}
      <Dialog open={isAddTenantOpen} onOpenChange={setIsAddTenantOpen}>
        <DialogContent className="border-none bg-background/80 backdrop-blur-xl sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Tenant</DialogTitle>
            <DialogDescription>
              Enter the details for the new tenant
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tenant-name">Full Name</Label>
                <Input
                  id="tenant-name"
                  placeholder="e.g., John Smith"
                  className="bg-background/60"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tenant-email">Email</Label>
                <Input
                  id="tenant-email"
                  type="email"
                  placeholder="e.g., john@example.com"
                  className="bg-background/60"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tenant-phone">Phone Number</Label>
                <Input
                  id="tenant-phone"
                  placeholder="e.g., (555) 123-4567"
                  className="bg-background/60"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tenant-room">Room Number</Label>
                <Select>
                  <SelectTrigger id="tenant-room" className="bg-background/60">
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="103">103 (Vacant)</SelectItem>
                    <SelectItem value="202">202 (Vacant)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="lease-start">Lease Start Date</Label>
                <Input
                  id="lease-start"
                  type="date"
                  className="bg-background/60"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lease-end">Lease End Date</Label>
                <Input
                  id="lease-end"
                  type="date"
                  className="bg-background/60"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tenant-rent">Monthly Rent ($)</Label>
                <Input
                  id="tenant-rent"
                  type="number"
                  placeholder="e.g., 1500"
                  className="bg-background/60"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tenant-deposit">Security Deposit ($)</Label>
                <Input
                  id="tenant-deposit"
                  type="number"
                  placeholder="e.g., 1500"
                  className="bg-background/60"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tenant-notes">Additional Notes</Label>
              <Textarea
                id="tenant-notes"
                placeholder="Any additional information..."
                className="bg-background/60"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTenantOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Tenant</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Tenant Dialog */}
      {selectedTenant && (
        <Dialog open={isViewTenantOpen} onOpenChange={setIsViewTenantOpen}>
          <DialogContent className="border-none bg-background/80 backdrop-blur-xl sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Tenant Details</DialogTitle>
              <DialogDescription>
                Information about {selectedTenant.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-background shadow-md">
                  <AvatarImage
                    src={selectedTenant.avatar}
                    alt={selectedTenant.name}
                  />
                  <AvatarFallback className="bg-primary/20 text-xl text-primary">
                    {selectedTenant.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedTenant.name}
                  </h3>
                  <Badge className="mt-1">{selectedTenant.status}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedTenant.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>(555) 123-4567</span>
                </div>
              </div>

              <div className="rounded-lg bg-muted/20 p-4">
                <h4 className="mb-2 font-medium">Lease Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Room</p>
                    <p className="font-medium">{selectedTenant.room}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Monthly Rent
                    </p>
                    <p className="font-medium">
                      ${selectedTenant.rent.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lease Start</p>
                    <p className="font-medium">{selectedTenant.leaseStart}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lease End</p>
                    <p className="font-medium">{selectedTenant.leaseEnd}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-medium">Payment History</h4>
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg bg-background/60 p-3"
                    >
                      <div>
                        <p className="font-medium">April 2023 Rent</p>
                        <p className="text-sm text-muted-foreground">
                          Paid on Apr 2, 2023
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800"
                      >
                        Paid
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-medium">Documents</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg bg-background/60 p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>Lease Agreement.pdf</span>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-background/60 p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>Background Check.pdf</span>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsViewTenantOpen(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setIsViewTenantOpen(false);
                  handleContactTenant(selectedTenant);
                }}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Tenant
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Contact Tenant Dialog */}
      {selectedTenant && (
        <Dialog
          open={isContactTenantOpen}
          onOpenChange={setIsContactTenantOpen}
        >
          <DialogContent className="border-none bg-background/80 backdrop-blur-xl sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Contact Tenant</DialogTitle>
              <DialogDescription>
                Send a message to {selectedTenant.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={selectedTenant.avatar}
                    alt={selectedTenant.name}
                  />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {selectedTenant.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedTenant.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedTenant.email}
                  </p>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contact-method">Contact Method</Label>
                <Select defaultValue="email">
                  <SelectTrigger
                    id="contact-method"
                    className="bg-background/60"
                  >
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="app">In-App Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message-subject">Subject</Label>
                <Input
                  id="message-subject"
                  placeholder="e.g., Upcoming Maintenance"
                  className="bg-background/60"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message-body">Message</Label>
                <Textarea
                  id="message-body"
                  placeholder="Type your message here..."
                  className="min-h-[150px] bg-background/60"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="send-copy"
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="send-copy">Send a copy to myself</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsContactTenantOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Send Message</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Renew Lease Dialog */}
      {selectedTenant && (
        <Dialog open={isRenewLeaseOpen} onOpenChange={setIsRenewLeaseOpen}>
          <DialogContent className="border-none bg-background/80 backdrop-blur-xl sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Renew Lease</DialogTitle>
              <DialogDescription>
                Extend the lease for {selectedTenant.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="rounded-lg bg-muted/20 p-4">
                <h4 className="mb-2 font-medium">Current Lease</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p className="font-medium">{selectedTenant.leaseStart}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">End Date</p>
                    <p className="font-medium">{selectedTenant.leaseEnd}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Current Rent</p>
                    <p className="font-medium">
                      ${selectedTenant.rent.toLocaleString()}/month
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Room</p>
                    <p className="font-medium">{selectedTenant.room}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="renewal-term">Renewal Term</Label>
                <Select defaultValue="12">
                  <SelectTrigger id="renewal-term" className="bg-background/60">
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="12">12 Months</SelectItem>
                    <SelectItem value="18">18 Months</SelectItem>
                    <SelectItem value="24">24 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="new-start-date">New Start Date</Label>
                  <Input
                    id="new-start-date"
                    type="date"
                    className="bg-background/60"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-end-date">New End Date</Label>
                  <Input
                    id="new-end-date"
                    type="date"
                    className="bg-background/60"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="new-rent">New Monthly Rent ($)</Label>
                <Input
                  id="new-rent"
                  type="number"
                  defaultValue={selectedTenant.rent}
                  className="bg-background/60"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="renewal-notes">Notes</Label>
                <Textarea
                  id="renewal-notes"
                  placeholder="Any special terms or conditions..."
                  className="bg-background/60"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsRenewLeaseOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Renew Lease</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
}

const tenants = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    room: "101",
    leaseStart: "Jan 1, 2023",
    leaseEnd: "Dec 31, 2023",
    rent: 1200,
    status: "Current",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    room: "102",
    leaseStart: "Mar 15, 2023",
    leaseEnd: "Mar 14, 2024",
    rent: 1500,
    status: "Current",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael.c@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    room: "201",
    leaseStart: "Feb 1, 2023",
    leaseEnd: "Jan 31, 2024",
    rent: 1250,
    status: "Current",
  },
  {
    id: "4",
    name: "Emma Rodriguez",
    email: "emma.r@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    room: "203",
    leaseStart: "Apr 1, 2023",
    leaseEnd: "Mar 31, 2024",
    rent: 1850,
    status: "Current",
  },
  {
    id: "5",
    name: "David Kim",
    email: "david.k@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    room: "301",
    leaseStart: "May 15, 2023",
    leaseEnd: "May 14, 2024",
    rent: 1300,
    status: "Current",
  },
  {
    id: "6",
    name: "Lisa Wong",
    email: "lisa.w@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    room: "302",
    leaseStart: "Jun 1, 2023",
    leaseEnd: "May 31, 2024",
    rent: 1600,
    status: "Current",
  },
];
