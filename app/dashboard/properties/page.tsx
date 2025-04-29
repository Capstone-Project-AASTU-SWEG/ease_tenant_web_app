import { CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Filter, Search } from "lucide-react"
import Link from "next/link"

export default function PropertiesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Available Properties</h2>
          <p className="text-muted-foreground">
            Browse and filter available properties across all buildings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search properties..."
              className="w-full rounded-md pl-8 md:w-[300px]"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Building" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Buildings</SelectLabel>
              <SelectItem value="all">All Buildings</SelectItem>
              <SelectItem value="tech-tower">Tech Tower</SelectItem>
              <SelectItem value="eastside-plaza">Eastside Plaza</SelectItem>
              <SelectItem value="west-point">West Point</SelectItem>
              <SelectItem value="north-commons">North Commons</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Property Types</SelectLabel>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="warehouse">Warehouse</SelectItem>
              <SelectItem value="coworking">Co-working</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Size Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Size Ranges</SelectLabel>
              <SelectItem value="all">All Sizes</SelectItem>
              <SelectItem value="small\">Small (< 500 sq ft)</SelectItem>
              <SelectItem value="medium">Medium (500-1000 sq ft)</SelectItem>
              <SelectItem value="large">Large (1000-2000 sq ft)</SelectItem>
              <SelectItem value="x-large">X-Large (> 2000 sq ft)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="grid" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>
          <div className="text-sm text-muted-foreground">
            Showing 12 properties
          </div>
        </div>
        <TabsContent value="grid" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCard key={i} index={i} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="table" className="space-y-4">
          <PropertyTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PropertyCard({ index }: { index: number }) {
  const properties = [
    {
      id: 1,
      title: "Office Suite #304",
      building: "Tech Tower",
      type: "Office",
      size: 850,
      price: 1850,
      available: "Immediate",
      features: ["Conference Room", "Kitchen", "Natural Light", "24/7 Access"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      title: "Retail Space #102",
      building: "Eastside Plaza",
      type: "Retail",
      size: 1200,
      price: 2400,
      available: "May 1, 2025",
      features: ["High Foot Traffic", "Large Windows", "Storage Room", "Loading Dock"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      title: "Co-working Desk #12",
      building: "North Commons",
      type: "Co-working",
      size: 100,
      price: 350,
      available: "Immediate",
      features: ["Shared Kitchen", "Meeting Rooms", "High-Speed Internet", "Printing"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      title: "Office Suite #510",
      building: "West Point",
      type: "Office",
      size: 950,
      price: 2100,
      available: "June 15, 2025",
      features: ["Corner Office", "Private Bathroom", "Parking Included", "View"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 5,
      title: "Warehouse Bay #3",
      building: "Industrial Park",
      type: "Warehouse",
      size: 3500,
      price: 4200,
      available: "Immediate",
      features: ["Dock High Doors", "Climate Control", "Security System", "Office Area"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 6,
      title: "Meeting Space #205",
      building: "Tech Tower",
      type: "Office",
      size: 400,
      price: 900,
      available: "May 1, 2025",
      features: ["AV Equipment", "Flexible Layout", "Catering Available", "Natural Light"],
      image: "/placeholder.svg?height=200&width=300",
    },
  ];

  const property = properties[index % properties.length];

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={property.image || "/placeholder.svg"}
          alt={property.title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between">
          <CardTitle className="text-lg">{property.title}</CardTitle>
          <Badge variant={property.available === "Immediate" ? "default" : "outline"}>
            {property.available === "Immediate" ? "Available Now" : "Coming Soon"}
          </Badge>
        </div>
        <CardDescription className="flex items-center space-x-1">
          <Building2 className="h-3.5 w-3.5" />
          <span>{property.building}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Type: </span>
            <span>{property.type}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Size: </span>
            <span>{property.size} sq ft</span>
          </div>
          <div>
            <span className="text-muted-foreground">Price: </span>
            <span>${property.price}/mo</span>
          </div>
          <div>
            <span className="text-muted-foreground">Available: </span>
            <span>{property.available}</span>
          </div>
        </div>
        <div className="mt-4">
          <span className="text-sm text-muted-foreground">Features:</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {property.features.map((feature) => (
              <Badge key={feature} variant="secondary" className="text-xs font-normal">
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <Button variant="outline" size="sm">
          View Details
        </Button>
        <Button size="sm" asChild>
          <Link href="/rental-requests/new">Request Rental</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function PropertyTable() {
  const properties = [
    {
      id: 1,
      title: "Office Suite #304",
      building: "Tech Tower",
      type: "Office",
      size: 850,
      price: 1850,
      available: "Immediate",
    },
    {
      id: 2,
      title: "Retail Space #102",
      building: "Eastside Plaza",
      type: "Retail",
      size: 1200,
      price: 2400,
      available: "May 1, 2025",
    },
    {
      id: 3,
      title: "Co-working Desk #12",
      building: "North Commons",
      type: "Co-working",
      size: 100,
      price: 350,
      available: "Immediate",
    },
    {
      id: 4,
      title: "Office Suite #510",
      building: "West Point",
      type: "Office",
      size: 950,
      price: 2100,
      available: "June 15, 2025",
    },
    {
      id: 5,
      title: "Warehouse Bay #3",
      building: "Industrial Park",
      type: "Warehouse",
      size: 3500,
      price: 4200,
      available: "Immediate",
    },
    {
      id: 6,
      title: "Meeting Space #205",
      building: "Tech Tower",
      type: "Office",
      size: 400,
      price: 900,
      available: "May 1, 2025",
    },
  ];

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="px-4 py-3 font-medium">Property</th>
              <th className="px-4 py-3 font-medium">Building</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Size</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Available</th>
              <th className="px-4 py-3 font-medium sr-only">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-b">
                <td className="px-4 py-3">{property.title}</td>
                <td className="px-4 py-3">{property.building}</td>
                <td className="px-4 py-3">{property.type}</td>
                <td className="px-4 py-3">{property.size} sq ft</td>
                <td className="px-4 py-3">${property.price}/mo</td>
                <td className="px-4 py-3">
                  <Badge variant={property.available === "Immediate" ? "default" : "outline"}>
                    {property.available}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button size="sm" asChild>
                    <Link href="/rental-requests/new">Request</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
