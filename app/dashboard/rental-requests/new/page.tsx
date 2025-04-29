"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const formSchema = z.object({
  building: z.string({
    required_error: "Please select a building.",
  }),
  property: z.string({
    required_error: "Please select a property.",
  }),
  startDate: z.date({
    required_error: "Please select a start date.",
  }),
  duration: z.string({
    required_error: "Please select a lease duration.",
  }),
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  businessType: z.string().min(2, {
    message: "Business type must be at least 2 characters.",
  }),
  employeeCount: z.string().min(1, {
    message: "Please enter number of employees.",
  }),
  specialRequirements: z.string().optional(),
})

export default function NewRentalRequestPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      specialRequirements: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // In a real app, submit the form data to your API here
      console.log(values)
      router.push("/rental-requests?success=true")
    }
  }

  const properties = {
    "tech-tower": [
      { id: "tt-301", name: "Office Suite #301" },
      { id: "tt-304", name: "Office Suite #304" },
      { id: "tt-205", name: "Meeting Space #205" },
    ],
    "eastside-plaza": [
      { id: "ep-102", name: "Retail Space #102" },
      { id: "ep-204", name: "Office #204" },
    ],
    "west-point": [
      { id: "wp-510", name: "Office Suite #510" },
      { id: "wp-102", name: "Store #102" },
    ],
    "north-commons": [
      { id: "nc-12", name: "Co-working Desk #12" },
      { id: "nc-15", name: "Co-working Desk #15" },
    ],
  }

  const [availableProperties, setAvailableProperties] = useState<{ id: string; name: string }[]>([])

  function handleBuildingChange(value: string) {
    form.setValue("building", value)
    form.setValue("property", "")

    // Update available properties based on building selection
    if (value in properties) {
      setAvailableProperties(properties[value as keyof typeof properties])
    } else {
      setAvailableProperties([])
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">New Rental Request</h2>
        <p className="text-muted-foreground">Submit a request to rent a property</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Rental Request Form</CardTitle>
            <div className="text-sm text-muted-foreground">Step {step} of 3</div>
          </div>
          <CardDescription>
            {step === 1 && "Select the property you want to rent"}
            {step === 2 && "Provide your business information"}
            {step === 3 && "Review and submit your request"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="building"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Building</FormLabel>
                        <Select onValueChange={(value) => handleBuildingChange(value)} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a building" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="tech-tower">Tech Tower</SelectItem>
                            <SelectItem value="eastside-plaza">Eastside Plaza</SelectItem>
                            <SelectItem value="west-point">West Point</SelectItem>
                            <SelectItem value="north-commons">North Commons</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Select the building where you'd like to rent a property</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="property"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!form.watch("building")}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a property" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableProperties.map((property) => (
                              <SelectItem key={property.id} value={property.id}>
                                {property.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Select the specific property you're interested in</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Desired Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date() || date > new Date(2026, 0, 1)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>When would you like to start the lease?</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lease Duration</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select lease duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="6">6 months</SelectItem>
                            <SelectItem value="12">1 year</SelectItem>
                            <SelectItem value="24">2 years</SelectItem>
                            <SelectItem value="36">3 years</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>How long do you plan to lease this property?</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Type</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Technology, Retail, Services" {...field} />
                        </FormControl>
                        <FormDescription>What type of business do you operate?</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employeeCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Employees</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>How many employees will be using this space?</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specialRequirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requirements</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any special requirements or modifications needed?"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Please list any modifications, special access, or other requirements
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-2 text-lg font-medium">Property Information</h3>
                    <div className="rounded-md border p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium">Building</div>
                          <div className="text-sm text-muted-foreground">
                            {form.watch("building") === "tech-tower" && "Tech Tower"}
                            {form.watch("building") === "eastside-plaza" && "Eastside Plaza"}
                            {form.watch("building") === "west-point" && "West Point"}
                            {form.watch("building") === "north-commons" && "North Commons"}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Property</div>
                          <div className="text-sm text-muted-foreground">
                            {availableProperties.find((p) => p.id === form.watch("property"))?.name || "-"}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Start Date</div>
                          <div className="text-sm text-muted-foreground">
                            {form.watch("startDate") ? format(form.watch("startDate"), "PPP") : "-"}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Lease Duration</div>
                          <div className="text-sm text-muted-foreground">
                            {form.watch("duration") === "6" && "6 months"}
                            {form.watch("duration") === "12" && "1 year"}
                            {form.watch("duration") === "24" && "2 years"}
                            {form.watch("duration") === "36" && "3 years"}
                            {form.watch("duration") === "flexible" && "Flexible"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-2 text-lg font-medium">Business Information</h3>
                    <div className="rounded-md border p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium">Company Name</div>
                          <div className="text-sm text-muted-foreground">{form.watch("companyName") || "-"}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Business Type</div>
                          <div className="text-sm text-muted-foreground">{form.watch("businessType") || "-"}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Employee Count</div>
                          <div className="text-sm text-muted-foreground">{form.watch("employeeCount") || "-"}</div>
                        </div>
                      </div>
                      {form.watch("specialRequirements") && (
                        <div className="mt-4">
                          <div className="text-sm font-medium">Special Requirements</div>
                          <div className="text-sm text-muted-foreground">{form.watch("specialRequirements")}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-md bg-muted p-4 text-sm">
                    By submitting this request, you agree to our{" "}
                    <a href="#" className="text-primary underline">
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary underline">
                      Privacy Policy
                    </a>
                    .
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4">
                {step > 1 ? (
                  <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                    Back
                  </Button>
                ) : (
                  <div />
                )}
                <Button type="submit">
                  {step < 3 ? (
                    <>
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
