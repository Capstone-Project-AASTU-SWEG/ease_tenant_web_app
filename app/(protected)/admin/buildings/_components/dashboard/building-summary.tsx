import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Building, Plus } from "lucide-react";
import Link from "next/link";

export function BuildingSummary() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Buildings</h2>
        <Button asChild>
          <Link href="/admin/buildings/new">
            <Plus className="mr-2 h-4 w-4" /> Add Building
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {buildings.map((building) => (
          <Card key={building.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{building.name}</CardTitle>
                <Building className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>{building.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Occupancy</span>
                  <span className="font-medium">{building.occupancy}%</span>
                </div>
                <Progress value={building.occupancy} className="h-2" />
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div>
                    <span className="block font-medium">{building.units}</span>{" "}
                    Units
                  </div>
                  <div>
                    <span className="block font-medium">{building.floors}</span>{" "}
                    Floors
                  </div>
                  <div>
                    <span className="block font-medium">{building.vacant}</span>{" "}
                    Vacant
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link href={`/admin/buildings/${building.id}`}>Manage</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
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
  {
    id: "4",
    name: "Highland Court",
    address: "101 Highland Dr, Anytown, CA",
    units: 24,
    floors: 2,
    vacant: 5,
    occupancy: 79,
  },
  {
    id: "5",
    name: "Metro Lofts",
    address: "202 Downtown Blvd, Anytown, CA",
    units: 60,
    floors: 5,
    vacant: 12,
    occupancy: 80,
  },
  {
    id: "6",
    name: "Oakwood Commons",
    address: "303 Oak St, Anytown, CA",
    units: 42,
    floors: 3,
    vacant: 3,
    occupancy: 93,
  },
];
