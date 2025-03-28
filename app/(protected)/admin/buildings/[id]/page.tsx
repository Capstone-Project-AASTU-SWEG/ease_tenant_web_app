import Link from "next/link";
import { ChevronLeft, Edit, Home, Layers, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FloorPlan } from "../_components/building/floor-plan";
import { RoomsList } from "../_components/building/room-list";
import { TenantsTable } from "../_components/building/tenants-table";

export default function BuildingDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  // In a real app, you would fetch the building data based on the ID
  const building = buildings.find((b) => b.id === params.id) || buildings[0];

  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/buildings">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{building.name}</h1>
        <Button variant="outline" size="icon" className="ml-auto">
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </div>
      <p className="mt-1 text-muted-foreground">{building.address}</p>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Building Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="flex items-center justify-between text-sm">
                <span>Occupancy</span>
                <span className="font-medium">{building.occupancy}%</span>
              </div>
              <Progress value={building.occupancy} className="h-2" />
              <div className="mt-4 grid gap-4">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <span className="font-medium">{building.units}</span> Total
                    Units
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <span className="font-medium">{building.floors}</span>{" "}
                    Floors
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <span className="font-medium">
                      {building.units - building.vacant}
                    </span>{" "}
                    Occupied Units
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Button className="h-auto flex-col items-center justify-center gap-2 py-4">
                <Plus className="h-5 w-5" />
                <span>Add Room</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col items-center justify-center gap-2 py-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
                <span>Split Room</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col items-center justify-center gap-2 py-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M3 9h18" />
                </svg>
                <span>Merge Rooms</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col items-center justify-center gap-2 py-4"
              >
                <Users className="h-5 w-5" />
                <span>View Tenants</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col items-center justify-center gap-2 py-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 9V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1" />
                  <path d="M2 13h10" />
                  <path d="m9 16 3-3-3-3" />
                </svg>
                <span>Export Data</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col items-center justify-center gap-2 py-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 8v4l3 3" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                <span>Maintenance</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="floors" className="mt-6">
        <TabsList>
          <TabsTrigger value="floors">Floor Plans</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
        </TabsList>
        <TabsContent value="floors" className="mt-4">
          <FloorPlan buildingId={params.id} />
        </TabsContent>
        <TabsContent value="rooms" className="mt-4">
          <RoomsList buildingId={params.id} />
        </TabsContent>
        <TabsContent value="tenants" className="mt-4">
          <TenantsTable buildingId={params.id} />
        </TabsContent>
      </Tabs>
    </main>
  );
}

const buildings = [
  {
    id: "1",
    name: "Sunset Apartments",
    address: "123 Main St, Anytown, CA",
    units: 48,
    floors: 4,
    vacant: 6,
    occupancy: 87,
  },
  {
    id: "2",
    name: "Riverside Towers",
    address: "456 River Rd, Anytown, CA",
    units: 72,
    floors: 6,
    vacant: 8,
    occupancy: 89,
  },
  {
    id: "3",
    name: "Parkview Residences",
    address: "789 Park Ave, Anytown, CA",
    units: 36,
    floors: 3,
    vacant: 2,
    occupancy: 94,
  },
];
