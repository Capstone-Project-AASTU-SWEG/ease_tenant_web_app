"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TenantsTable({ buildingId }: { buildingId: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tenants</h2>
        <Button>Add Tenant</Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search tenants..." className="w-full pl-8" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tenants</SelectItem>
            <SelectItem value="current">Current</SelectItem>
            <SelectItem value="past">Past</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Lease Start</TableHead>
              <TableHead>Lease End</TableHead>
              <TableHead>Rent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={tenant.avatar} alt={tenant.name} />
                      <AvatarFallback>{tenant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{tenant.name}</div>
                      <div className="text-xs text-muted-foreground">{tenant.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{tenant.room}</TableCell>
                <TableCell>{tenant.leaseStart}</TableCell>
                <TableCell>{tenant.leaseEnd}</TableCell>
                <TableCell>${tenant.rent.toLocaleString()}/mo</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      tenant.status === "Current"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                    }`}
                  >
                    {tenant.status}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Contact Tenant</DropdownMenuItem>
                      <DropdownMenuItem>Renew Lease</DropdownMenuItem>
                      <DropdownMenuItem>Payment History</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
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
]

