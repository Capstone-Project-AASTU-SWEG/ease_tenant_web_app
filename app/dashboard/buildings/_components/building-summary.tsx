"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Building, LayoutGrid, List, ArrowUpRight, Filter } from "lucide-react";
import Stack from "@/components/custom/stack";
import { Group } from "@/components/custom/group";
import SearchInput from "@/components/custom/search-input";
import { useGetAllBuildingsQuery } from "@/app/quries/useBuildings";

export function BuildingSummary() {
  const getAllBuildingsQuery = useGetAllBuildingsQuery();
  const buildings = getAllBuildingsQuery.data;

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  if (!buildings) {
    return;
  }

  // Calculate occupancy rate for each building
  const buildingsWithOccupancy = buildings.map((building) => {
    const occupancyRate = Math.round(
      ((building.totalUnits - (building.availableUnits || 0)) /
        building.totalUnits) *
        100,
    );
    return {
      ...building,
      occupancyRate,
      // For compatibility with existing code
      occupancy: occupancyRate,
      units: building.totalUnits,
      floors: building.totalFloors,
      vacant: building.availableUnits,
      address: `${building.address.street}, ${building.address.city}`,
    };
  });

  // Filter buildings based on search query
  const filteredBuildings = buildingsWithOccupancy.filter(
    (building) =>
      building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      building.address.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Stack className="relative p-6">
      {/* Search and filters */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <SearchInput onSearchQuery={setSearchQuery} searchQuery={searchQuery} />
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Tabs defaultValue="all" className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all" className="rounded-full">
                All
              </TabsTrigger>
              <TabsTrigger value="high" className="rounded-full">
                High Occ.
              </TabsTrigger>
              <TabsTrigger value="low" className="rounded-full">
                Low Occ.
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Building cards */}
      {viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBuildings.map((building) => (
            <Card
              key={building.id}
              className="group overflow-hidden rounded-md border-slate-200/50 bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:shadow-md dark:border-slate-700/50 dark:bg-slate-800/90"
            >
              <div className="absolute left-0 top-0 h-1 w-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full bg-primary"
                  style={{
                    width: `${building.occupancyRate}%`,
                  }}
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg transition-colors group-hover:text-primary">
                      {building.name}
                    </CardTitle>
                    {building.occupancy > 90 && (
                      <Badge
                        variant="outline"
                        className="rounded-full border-primary/20 bg-primary/10 text-primary"
                      >
                        High Demand
                      </Badge>
                    )}
                  </div>
                  <Group>
                    <Link
                      title="Manage Building"
                      href={`/dashboard/buildings/${building.id}`}
                      className="flex items-center justify-center"
                    >
                      <ArrowUpRight className="ml-2 h-4 w-4 transition-opacity" />
                    </Link>
                  </Group>
                </div>
                <CardDescription className="flex items-center">
                  {building.address}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Occupancy</span>
                    <span className="font-medium">{building.occupancy}%</span>
                  </div>
                  <Progress value={building.occupancy} className="h-2" />
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <div className="flex flex-col items-center justify-center rounded-md bg-slate-100/80 p-2 dark:bg-slate-700/30">
                      <span className="block text-base font-medium">
                        {building.units}
                      </span>
                      <span className="text-muted-foreground">Units</span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-md bg-slate-100/80 p-2 dark:bg-slate-700/30">
                      <span className="block text-base font-medium">
                        {building.floors}
                      </span>
                      <span className="text-muted-foreground">Floors</span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-md bg-slate-100/80 p-2 dark:bg-slate-700/30">
                      <span className="block text-base font-medium">
                        {building.vacant}
                      </span>
                      <span className="text-muted-foreground">Vacant</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBuildings.map((building) => (
            <Card
              key={building.id}
              className="group overflow-hidden rounded-lg border-slate-200/50 bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:shadow-md dark:border-slate-700/50 dark:bg-slate-800/90"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-primary/70" />
              <CardContent className="p-4 pl-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold transition-colors group-hover:text-primary">
                        {building.name}
                      </h3>
                      {building.occupancy > 90 && (
                        <Badge
                          variant="outline"
                          className="border-primary/20 bg-primary/10 text-primary"
                        >
                          High Demand
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {building.address}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Units</p>
                        <p className="font-medium">{building.units}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Floors</p>
                        <p className="font-medium">{building.floors}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Vacant</p>
                        <p className="font-medium">{building.vacant}</p>
                      </div>
                    </div>

                    <div className="flex min-w-[120px] items-center gap-2">
                      <div className="w-full">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            Occupancy
                          </span>
                          <span className="font-medium">
                            {building.occupancy}%
                          </span>
                        </div>
                        <Progress value={building.occupancy} className="h-2" />
                      </div>
                    </div>

                    <Button size="sm" variant="ghost" asChild>
                      <Link
                        href={`/dashboard/buildings/${building.id}`}
                        className="flex items-center justify-center"
                      >
                        Manage
                        <ArrowUpRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredBuildings.length === 0 && (
        <div className="py-12 text-center">
          <Building className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
          <h3 className="mt-4 text-lg font-medium">No buildings found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </Stack>
  );
}
