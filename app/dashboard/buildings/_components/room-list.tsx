"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, Search } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { getBuildings } from "../_hooks/useBuildings";

export function RoomsList({ buildingID }: { buildingID: string }) {
  const buildings = getBuildings();
  const building = buildings.find((build) => build.id === buildingID);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isMergeRoomsOpen, setIsMergeRoomsOpen] = useState(false);
  const [isSplitRoomOpen, setIsSplitRoomOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search rooms..."
            className="w-full rounded-full pl-8"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px] rounded-full">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rooms</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
            <SelectItem value="vacant">Vacant</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px] rounded-full">
            <SelectValue placeholder="Filter by floor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Floors</SelectItem>
            {Array(building?.totalFloors || 0)
              .fill(1)
              .map((_, i) => (
                <SelectItem value={i + 1 + ""} key={i + 1}>
                  Floor {i + 1}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room #</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size (sq ft)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.number}</TableCell>
                  <TableCell>{room.floor}</TableCell>
                  <TableCell>{room.type}</TableCell>
                  <TableCell>{room.size}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        room.status === "Occupied"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                      }`}
                    >
                      {room.status}
                    </span>
                  </TableCell>
                  <TableCell>{room.tenant || "—"}</TableCell>
                  <TableCell>${room.rent.toLocaleString()}</TableCell>
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
                        <DropdownMenuItem>Edit Room</DropdownMenuItem>
                        <DropdownMenuItem>Change Status</DropdownMenuItem>
                        <DropdownMenuItem>Maintenance Request</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Room Dialog */}
      <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
            <DialogDescription>
              Enter the details for the new room in your building.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="room-number">Room Number</Label>
                <Input id="room-number" placeholder="e.g., 101" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="floor">Floor</Label>
                <Select defaultValue="1">
                  <SelectTrigger id="floor">
                    <SelectValue placeholder="Select floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Floor 1</SelectItem>
                    <SelectItem value="2">Floor 2</SelectItem>
                    <SelectItem value="3">Floor 3</SelectItem>
                    <SelectItem value="4">Floor 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Room Type</Label>
                <Select defaultValue="studio">
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="1br">1 Bedroom</SelectItem>
                    <SelectItem value="2br">2 Bedroom</SelectItem>
                    <SelectItem value="3br">3 Bedroom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="size">Size (sq ft)</Label>
                <Input id="size" type="number" placeholder="e.g., 650" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rent">Monthly Rent ($)</Label>
              <Input id="rent" type="number" placeholder="e.g., 1500" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="available" />
              <Label htmlFor="available">Available for rent</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRoomOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Room</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Merge Rooms Dialog */}
      <Dialog open={isMergeRoomsOpen} onOpenChange={setIsMergeRoomsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Merge Rooms</DialogTitle>
            <DialogDescription>
              Select two or more adjacent rooms to merge into a single unit.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Select Rooms to Merge</Label>
              <div className="max-h-[200px] overflow-y-auto rounded border p-2">
                {rooms
                  .filter((room) => room.status === "Vacant")
                  .map((room) => (
                    <div
                      key={room.id}
                      className="flex items-center space-x-2 py-1"
                    >
                      <Checkbox id={`room-${room.id}`} />
                      <Label htmlFor={`room-${room.id}`} className="text-sm">
                        Room {room.number} ({room.size} sq ft)
                      </Label>
                    </div>
                  ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-room-number">New Room Number</Label>
              <Input id="new-room-number" placeholder="e.g., 101-102" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-type">New Room Type</Label>
              <Select defaultValue="2br">
                <SelectTrigger id="new-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="1br">1 Bedroom</SelectItem>
                  <SelectItem value="2br">2 Bedroom</SelectItem>
                  <SelectItem value="3br">3 Bedroom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-rent">New Monthly Rent ($)</Label>
              <Input id="new-rent" type="number" placeholder="e.g., 2500" />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsMergeRoomsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Merge Rooms</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Split Room Dialog */}
      <Dialog open={isSplitRoomOpen} onOpenChange={setIsSplitRoomOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Split Room</DialogTitle>
            <DialogDescription>
              Divide a single room into multiple smaller units.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="room-to-split">Select Room to Split</Label>
              <Select>
                <SelectTrigger id="room-to-split">
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms
                    .filter((room) => room.status === "Vacant")
                    .map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        Room {room.number} ({room.size} sq ft)
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="num-units">Number of New Units</Label>
              <Select defaultValue="2">
                <SelectTrigger id="num-units">
                  <SelectValue placeholder="Select number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Units</SelectItem>
                  <SelectItem value="3">3 Units</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>New Room Numbers</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="e.g., 101A" />
                <Input placeholder="e.g., 101B" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>New Room Types</Label>
              <div className="grid grid-cols-2 gap-2">
                <Select defaultValue="studio">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="1br">1 Bedroom</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="studio">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="1br">1 Bedroom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSplitRoomOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Split Room</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const rooms = [
  {
    id: "1",
    number: "101",
    floor: "1",
    type: "Studio",
    size: 450,
    status: "Occupied",
    tenant: "John Smith",
    rent: 1200,
  },
  {
    id: "2",
    number: "102",
    floor: "1",
    type: "1 Bedroom",
    size: 650,
    status: "Occupied",
    tenant: "Sarah Johnson",
    rent: 1500,
  },
  {
    id: "3",
    number: "103",
    floor: "1",
    type: "2 Bedroom",
    size: 850,
    status: "Vacant",
    tenant: "",
    rent: 1800,
  },
  {
    id: "4",
    number: "201",
    floor: "2",
    type: "Studio",
    size: 450,
    status: "Occupied",
    tenant: "Michael Chen",
    rent: 1250,
  },
  {
    id: "5",
    number: "202",
    floor: "2",
    type: "1 Bedroom",
    size: 650,
    status: "Vacant",
    tenant: "",
    rent: 1550,
  },
  {
    id: "6",
    number: "203",
    floor: "2",
    type: "2 Bedroom",
    size: 850,
    status: "Occupied",
    tenant: "Emma Rodriguez",
    rent: 1850,
  },
  {
    id: "7",
    number: "301",
    floor: "3",
    type: "Studio",
    size: 450,
    status: "Occupied",
    tenant: "David Kim",
    rent: 1300,
  },
  {
    id: "8",
    number: "302",
    floor: "3",
    type: "1 Bedroom",
    size: 650,
    status: "Occupied",
    tenant: "Lisa Wong",
    rent: 1600,
  },
];
