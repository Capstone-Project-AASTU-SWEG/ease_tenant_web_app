"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Bell,
  Building,
  CreditCard,
  Globe,
  HelpCircle,
  LogOut,
  Palette,
  Save,
  SettingsIcon,
  Shield,
  User,
  Users,
  Plus,
} from "lucide-react";
import PageWrapper from "@/components/custom/page-wrapper";
import { Title } from "@/components/custom/title";

// Form schemas
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  company: z.string().min(2, { message: "Company name is required." }),
  bio: z
    .string()
    .max(500, { message: "Bio must not exceed 500 characters." })
    .optional(),
});

const securityFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Dummy Components to resolve errors
function NotificationSettings() {
  return <div>Notification Settings</div>;
}

function AppearanceSettings() {
  return <div>Appearance Settings</div>;
}

function IntegrationSettings() {
  return <div>Integration Settings</div>;
}

// Main Settings Page Component
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <PageWrapper>
      {/* Page Header */}
      <header className="mb-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Title size="h2">Settings</Title>
            <p className="text-muted-foreground">
              Manage your account and property settings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help
            </Button>
          </div>
        </div>
      </header>

      {/* Settings Layout */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Settings Navigation */}
        <Card className="lg:w-64">
          <CardHeader className="px-4 py-4">
            <CardTitle className="text-base">Settings</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <SettingsNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="flex-1">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsContent value="account" className="mt-0">
              <AccountSettings />
            </TabsContent>
            <TabsContent value="security" className="mt-0">
              <SecuritySettings />
            </TabsContent>
            <TabsContent value="buildings" className="mt-0">
              <BuildingSettings />
            </TabsContent>
            <TabsContent value="billing" className="mt-0">
              <BillingSettings />
            </TabsContent>
            <TabsContent value="users" className="mt-0">
              Not done yet
            </TabsContent>
            <TabsContent value="notifications" className="mt-0">
              <NotificationSettings />
            </TabsContent>
            <TabsContent value="appearance" className="mt-0">
              <AppearanceSettings />
            </TabsContent>
            <TabsContent value="integrations" className="mt-0">
              <IntegrationSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageWrapper>
  );
}

// Settings Navigation Component
function SettingsNavigation({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const navigationItems = [
    { id: "account", label: "Account", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "buildings", label: "Buildings", icon: Building },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "users", label: "Users & Permissions", icon: Users },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "integrations", label: "Integrations", icon: Globe },
  ];

  return (
    <ScrollArea className="h-[calc(100vh-13rem)]">
      <div className="flex flex-col py-2">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={`justify-start rounded-none px-4 py-2 ${activeTab === item.id ? "bg-muted" : ""}`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
        <Separator className="my-2" />
        <Button
          variant="ghost"
          className="justify-start rounded-none px-4 py-2 text-destructive hover:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </ScrollArea>
  );
}

// Account Settings Component
function AccountSettings() {
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "Alex Johnson",
      email: "alex@skylineproperties.com",
      phone: "(555) 123-4567",
      company: "Skyline Properties Management",
      bio: "Commercial property manager with over 10 years of experience managing Class A office buildings and retail spaces.",
    },
  });

  function onSubmit(values: z.infer<typeof profileFormSchema>) {
    // In a real app, this would save to the backend
    console.log(values);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Manage your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-8 sm:flex-row">
            <div className="flex flex-col items-center gap-4 sm:w-1/3">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src="/placeholder.svg?height=96&width=96"
                  alt="Profile"
                />
                <AvatarFallback>AJ</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center gap-2">
                <Button variant="outline" size="sm">
                  Change Avatar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  Remove
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="your.email@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input placeholder="Company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about yourself"
                            className="h-24 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Brief description for your profile. Maximum 500
                          characters.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize your account preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="timezone">Timezone</Label>
                <p className="text-sm text-muted-foreground">
                  Set your local timezone
                </p>
              </div>
              <Select defaultValue="America/New_York">
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">
                    Eastern Time (ET)
                  </SelectItem>
                  <SelectItem value="America/Chicago">
                    Central Time (CT)
                  </SelectItem>
                  <SelectItem value="America/Denver">
                    Mountain Time (MT)
                  </SelectItem>
                  <SelectItem value="America/Los_Angeles">
                    Pacific Time (PT)
                  </SelectItem>
                  <SelectItem value="America/Anchorage">
                    Alaska Time (AKT)
                  </SelectItem>
                  <SelectItem value="Pacific/Honolulu">
                    Hawaii Time (HT)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Language</Label>
                <p className="text-sm text-muted-foreground">
                  Set your preferred language
                </p>
              </div>
              <Select defaultValue="en-US">
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="en-GB">English (UK)</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="date-format">Date Format</Label>
                <p className="text-sm text-muted-foreground">
                  Choose how dates are displayed
                </p>
              </div>
              <Select defaultValue="MM/DD/YYYY">
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <Button variant="outline">Reset to Defaults</Button>
          <Button>Save Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Security Settings Component
function SecuritySettings() {
  const form = useForm<z.infer<typeof securityFormSchema>>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof securityFormSchema>) {
    // In a real app, this would update the password
    console.log(values);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Update Password</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Receive a code via SMS to verify your identity
                </p>
              </div>
              <Switch checked={true} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Authenticator App</Label>
                <p className="text-sm text-muted-foreground">
                  Use an authenticator app to generate verification codes
                </p>
              </div>
              <Button variant="outline">Set Up</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Recovery Codes</Label>
                <p className="text-sm text-muted-foreground">
                  Generate backup codes to access your account
                </p>
              </div>
              <Button variant="outline">Generate Codes</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Login Sessions</CardTitle>
          <CardDescription>
            Manage your active sessions across devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                device: "MacBook Pro",
                location: "New York, USA",
                ip: "192.168.1.1",
                lastActive: "Active now",
                current: true,
              },
              {
                device: "iPhone 13",
                location: "New York, USA",
                ip: "192.168.1.2",
                lastActive: "2 hours ago",
                current: false,
              },
              {
                device: "Windows PC",
                location: "Chicago, USA",
                ip: "192.168.1.3",
                lastActive: "Yesterday at 3:30 PM",
                current: false,
              },
            ].map((session, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    {session.device.includes("Mac") ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <rect width="16" height="10" x="4" y="2" rx="2" />
                        <path d="M12 12v8" />
                        <path d="M8 18h8" />
                      </svg>
                    ) : session.device.includes("iPhone") ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <rect
                          width="12"
                          height="20"
                          x="6"
                          y="2"
                          rx="2"
                          ry="2"
                        />
                        <path d="M12 18h.01" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <rect width="20" height="14" x="2" y="3" rx="2" />
                        <line x1="8" x2="16" y1="21" y2="21" />
                        <line x1="12" x2="12" y1="17" y2="21" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{session.device}</p>
                      {session.current && (
                        <Badge variant="outline">Current</Badge>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      <p>
                        {session.location} • {session.ip}
                      </p>
                      <p>{session.lastActive}</p>
                    </div>
                  </div>
                </div>
                {!session.current && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <Button variant="outline">Refresh</Button>
          <Button variant="destructive">Revoke All Other Sessions</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Building Settings Component
function BuildingSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Property Portfolio</CardTitle>
            <CardDescription>Manage your commercial properties</CardDescription>
          </div>
          <Button>
            <Building className="mr-2 h-4 w-4" />
            Add Building
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: "Skyline Tower",
                address: "123 Business Ave, New York, NY 10001",
                type: "Office",
                units: 24,
                sqft: "120,000",
              },
              {
                name: "Commerce Plaza",
                address: "456 Market St, Chicago, IL 60601",
                type: "Mixed Use",
                units: 18,
                sqft: "85,000",
              },
              {
                name: "Tech Park Campus",
                address: "789 Innovation Dr, San Francisco, CA 94103",
                type: "Office",
                units: 12,
                sqft: "65,000",
              },
            ].map((building, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="font-semibold">{building.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {building.address}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline">{building.type}</Badge>
                      <Badge variant="outline">{building.units} Units</Badge>
                      <Badge variant="outline">{building.sqft} sq ft</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <SettingsIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Building Configuration</CardTitle>
          <CardDescription>
            Configure global settings for all properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="unit-numbering">Unit Numbering System</Label>
                <Select defaultValue="floor-unit">
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select numbering system" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="floor-unit">
                      Floor-Unit (e.g., 301, 302)
                    </SelectItem>
                    <SelectItem value="letter">
                      Letter (e.g., Suite A, B)
                    </SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="area-unit">Area Unit</Label>
                <Select defaultValue="sqft">
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select area unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sqft">Square Feet (sq ft)</SelectItem>
                    <SelectItem value="sqm">Square Meters (sq m)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="business-hours">Default Business Hours</Label>
                <div className="mt-1.5 flex items-center gap-2">
                  <Select defaultValue="8">
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Start" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 6).map(
                        (hour) => (
                          <SelectItem key={hour} value={hour.toString()}>
                            {hour}:00 AM
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <span>to</span>
                  <Select defaultValue="18">
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="End" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 12).map(
                        (hour) => (
                          <SelectItem key={hour} value={hour.toString()}>
                            {hour === 12 ? 12 : hour - 12}:00{" "}
                            {hour < 12 ? "AM" : "PM"}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                    <SelectItem value="cad">CAD (C$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Default Amenities</h3>
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {[
                  "Parking",
                  "24/7 Access",
                  "Security",
                  "Conference Rooms",
                  "Elevator",
                  "HVAC",
                  "Loading Dock",
                  "Fitness Center",
                  "Cafeteria",
                ].map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${amenity}`}
                      defaultChecked={[
                        "Parking",
                        "Security",
                        "Elevator",
                        "HVAC",
                      ].includes(amenity)}
                    />
                    <Label htmlFor={`amenity-${amenity}`} className="text-sm">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t px-6 py-4">
          <Button>Save Configuration</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Billing Settings Component
function BillingSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Manage your payment methods and billing preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                type: "credit-card",
                name: "Visa ending in 4242",
                expiry: "09/2026",
                default: true,
              },
              {
                type: "credit-card",
                name: "Mastercard ending in 5555",
                expiry: "12/2025",
                default: false,
              },
              {
                type: "bank",
                name: "Chase Bank Account",
                number: "****6789",
                default: false,
              },
            ].map((method, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    {method.type === "credit-card" ? (
                      <CreditCard className="h-4 w-4 text-primary" />
                    ) : (
                      <Building className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{method.name}</p>
                      {method.default && (
                        <Badge variant="outline">Default</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {method.type === "credit-card"
                        ? `Expires ${method.expiry}`
                        : `Account ${method.number}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                  {!method.default && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>
            Manage your billing address and tax information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  defaultValue="Skyline Properties Management"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="tax-id">Tax ID / EIN</Label>
                <Input
                  id="tax-id"
                  defaultValue="12-3456789"
                  className="mt-1.5"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="billing-address">Billing Address</Label>
              <Textarea
                id="billing-address"
                className="mt-1.5"
                defaultValue="123 Business Ave, Suite 500&#10;New York, NY 10001"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="billing-city">City</Label>
                <Input
                  id="billing-city"
                  defaultValue="New York"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="billing-state">State</Label>
                <Input
                  id="billing-state"
                  defaultValue="NY"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="billing-zip">ZIP Code</Label>
                <Input
                  id="billing-zip"
                  defaultValue="10001"
                  className="mt-1.5"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="billing-country">Country</Label>
              <Select defaultValue="us">
                <SelectTrigger id="billing-country" className="mt-1.5">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t px-6 py-4">
          <Button>Save Billing Information</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing Preferences</CardTitle>
          <CardDescription>
            Configure how you receive and pay invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-pay Invoices</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically pay invoices when they are due
                </p>
              </div>
              <Switch checked={true} />
            </div>
            <Separator />
            <div>
              <Label>Invoice Delivery</Label>
              <RadioGroup defaultValue="email" className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="invoice-email" />
                  <Label htmlFor="invoice-email">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email-paper" id="invoice-both" />
                  <Label htmlFor="invoice-both">Email and Paper</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paper" id="invoice-paper" />
                  <Label htmlFor="invoice-paper">Paper Only</Label>
                </div>
              </RadioGroup>
            </div>
            <Separator />
            <div>
              <Label htmlFor="billing-email">Billing Email</Label>
              <Input
                id="billing-email"
                defaultValue="billing@skylineproperties.com"
                className="mt-1.5"
              />
              <p className="mt-1 text-sm text-muted-foreground">
                Where invoices and payment receipts will be sent
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t px-6 py-4">
          <Button>Save Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
