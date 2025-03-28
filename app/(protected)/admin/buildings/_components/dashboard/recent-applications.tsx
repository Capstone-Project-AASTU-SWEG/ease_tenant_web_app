import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from "lucide-react"

export function RecentApplications() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
        <CardDescription>You have 24 pending applications to review.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.map((application) => (
            <div key={application.id} className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={application.avatar} alt={application.name} />
                <AvatarFallback>{application.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{application.name}</p>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="outline" className="h-8 w-8">
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Approve</span>
                    </Button>
                    <Button size="icon" variant="outline" className="h-8 w-8">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Reject</span>
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {application.unit} • Applied on {application.date}
                </p>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full">
            View All Applications
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const applications = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=32&width=32",
    unit: "Building A, Unit 304",
    date: "Apr 23, 2023",
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=32&width=32",
    unit: "Building C, Unit 201",
    date: "Apr 22, 2023",
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    avatar: "/placeholder.svg?height=32&width=32",
    unit: "Building B, Unit 512",
    date: "Apr 21, 2023",
  },
  {
    id: "4",
    name: "David Kim",
    avatar: "/placeholder.svg?height=32&width=32",
    unit: "Building A, Unit 107",
    date: "Apr 20, 2023",
  },
]

