"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"



export function FloorPlan({ buildingId }: { buildingId: string }) {
  const [selectedFloor, setSelectedFloor] = useState("1")

  // This would be fetched based on the building ID in a real app
  const totalFloors = 4
  const floorOptions = Array.from({ length: totalFloors }, (_, i) => ({
    value: String(i + 1),
    label: `Floor ${i + 1}`,
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Floor Plan</h2>
        <div className="flex items-center gap-2">
          <Select value={selectedFloor} onValueChange={setSelectedFloor}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select floor" />
            </SelectTrigger>
            <SelectContent>
              {floorOptions.map((floor) => (
                <SelectItem key={floor.value} value={floor.value}>
                  {floor.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">Edit Floor Plan</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <TooltipProvider>
            <div className="relative aspect-[16/9] w-full border bg-muted/20">
              <div className="grid h-full grid-cols-4 gap-1 p-4">
                {Array.from({ length: 12 }, (_, i) => {
                  const isOccupied = i % 3 !== 0
                  const roomNumber = `${selectedFloor}${String(i + 1).padStart(2, "0")}`
                  return (
                    <Tooltip key={i}>
                      <TooltipTrigger asChild>
                        <div
                          className={`flex cursor-pointer items-center justify-center rounded border p-2 text-sm transition-colors hover:bg-muted ${
                            isOccupied ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"
                          }`}
                        >
                          {roomNumber}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs">
                          <p className="font-medium">Room {roomNumber}</p>
                          <p>{isOccupied ? "Occupied" : "Vacant"}</p>
                          {isOccupied && <p>Tenant: John Doe</p>}
                          <p>Size: 650 sq ft</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
              <div className="absolute bottom-2 right-2 rounded-sm bg-background/80 px-2 py-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-sm bg-green-100 dark:bg-green-900/20"></div>
                    <span>Occupied</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-sm bg-red-100 dark:bg-red-900/20"></div>
                    <span>Vacant</span>
                  </div>
                </div>
              </div>
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  )
}

