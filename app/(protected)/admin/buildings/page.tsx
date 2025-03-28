import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Title } from "@/components/custom/title";
import ASSETS from "@/app/(auth)/_assets";

export default function BuildingsPage() {
  return (
    <main className="p-4 md:p-6">
      <div className="flex items-center justify-between">
        <Title size={"h2"}>Buildings</Title>
        <Button asChild>
          <Link href="/admin/buildings/new">
            <Plus className="mr-2 h-4 w-4" /> Add Building
          </Link>
        </Button>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search buildings..."
            className="w-full pl-8"
          />
        </div>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="high">High Occupancy</TabsTrigger>
            <TabsTrigger value="low">Low Occupancy</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {buildings.map((building) => (
          <Card key={building.id} className="overflow-hidden">
            <div className="relative aspect-video w-full bg-muted">
              <Image
                src={ASSETS.IMAGES.BUILDING_IMAGE}
                alt={building.name}
                className="h-full w-full object-cover"
                fill
              />
            </div>
            <CardHeader>
              <CardTitle>{building.name}</CardTitle>
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
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <Link href={`/admin/buildings/${building.id}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button size="sm" className="flex-1" asChild>
                    <Link href={`/admin/buildings/${building.id}/manage`}>
                      Manage
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
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
