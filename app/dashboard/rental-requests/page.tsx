import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Clock, Plus, XCircle } from "lucide-react"
import Link from "next/link"

export default function RentalRequestsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rental Requests</h2>
          <p className="text-muted-foreground">Manage your rental requests and track their status</p>
        </div>
        <Button asChild>
          <Link href="/rental-requests/new">
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Requests</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Rental Requests</CardTitle>
              <CardDescription>You have 2 pending rental requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Desired Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Office Suite #304, Tech Tower</TableCell>
                    <TableCell>April 5, 2025</TableCell>
                    <TableCell>May 1, 2025</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                        <Clock className="mr-1 h-3 w-3" />
                        Under Review
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Retail Space #102, Eastside Plaza</TableCell>
                    <TableCell>April 2, 2025</TableCell>
                    <TableCell>June 15, 2025</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                        <Clock className="mr-1 h-3 w-3" />
                        Negotiation
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Rental Requests</CardTitle>
              <CardDescription>History of your previous rental requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Office #201, Tech Tower</TableCell>
                    <TableCell>March 10, 2025</TableCell>
                    <TableCell>March 15, 2025</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Approved
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Warehouse Bay #5, Industrial Park</TableCell>
                    <TableCell>February 5, 2025</TableCell>
                    <TableCell>February 10, 2025</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-500/10 text-red-500">
                        <XCircle className="mr-1 h-3 w-3" />
                        Rejected
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Suite #405, Eastside Plaza</TableCell>
                    <TableCell>January 15, 2025</TableCell>
                    <TableCell>January 20, 2025</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Approved
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
