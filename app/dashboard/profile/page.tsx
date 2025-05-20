"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/app/quries/useAuth";
import PageHeader from "@/components/custom/page-header";
import PageWrapper from "@/components/custom/page-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  PenTool,
  Shield,
  Bell,
  Save,
  //   Upload,
  CheckCircle,
  Clock,
} from "lucide-react";
import { SignatureLine, SignaturePad } from "@/components/custom/signature-pad";
import {
  errorToast,
  successToast,
  warningToast,
} from "@/components/custom/toasts";
import { getFullName } from "@/utils";
import {
  useManagerProfileUpdateMutation,
  useTenantProfileUpdateMutation,
} from "@/app/quries/useUsers";
import { EmailFormField, TextFormField } from "@/components/custom/form-field";
import { Group } from "@/components/custom/group";
import Stack from "@/components/custom/stack";

// Form schema for profile information
const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  occupation: z.string().optional(),
  department: z.string().optional(),
  notificationsEmail: z.boolean().default(true),
  notificationsSMS: z.boolean().default(false),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfilePage = () => {
  const { data: user, isManager, isOwner, isTenant } = useAuth();
  const managerProfileUpdateMutation = useManagerProfileUpdateMutation();
  const tenantProfileUpdateMutation = useTenantProfileUpdateMutation();
  const [activeTab, setActiveTab] = useState("personal");
  //   const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [signatureData, setSignatureData] = useState<{
    svg: string;
    points: SignatureLine[];
    isEmpty: boolean;
  }>({
    svg: "",
    points: [],
    isEmpty: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isSignatureSaved, setIsSignatureSaved] = useState(false);

  // Initialize form with user data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.user.firstName || "",
      lastName: user?.user.lastName || "",
      email: user?.user.email || "",
      phone: user?.user.phone || "",

      occupation: user?.tenant?.occupation || "",
      notificationsEmail: true,
      notificationsSMS: false,
    },
  });

  useEffect(() => {
    if (user?.user) {
      form.reset({
        firstName: user?.user.firstName || "",
        lastName: user?.user.lastName || "",
        email: user?.user.email || "",
        phone: user?.user.phone || "",

        occupation: user?.tenant?.occupation || "",
        notificationsEmail: true,
        notificationsSMS: false,
      });
    }
  }, [form, user?.tenant?.occupation, user?.user]);

  // Handle profile form submission
  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);

    if (isManager) {
      const managerData = user?.manager;
      if (!managerData) {
        return;
      }

      const payload = { ...managerData, ...data };

      managerProfileUpdateMutation.mutate({
        manager: payload,
      });
    } else if (isTenant) {
      const tenantData = user?.tenant;
      if (!tenantData) {
        warningToast("Tenant info not found.");
        return;
      }
      const payload = { ...tenantData, ...data };
      tenantProfileUpdateMutation.mutate({
        tenant: payload,
      });
    }
  };

  useEffect(() => {
    if (managerProfileUpdateMutation.isSuccess) {
      successToast("", {
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });

      setIsSaving(false);
    }
  }, [managerProfileUpdateMutation.isSuccess]);

  useEffect(() => {
    if (managerProfileUpdateMutation.isError) {
      errorToast("", {
        title: "Profile Update",
        description: managerProfileUpdateMutation.error.message,
      });

      setIsSaving(false);
    }
  }, [
    managerProfileUpdateMutation.error?.message,
    managerProfileUpdateMutation.isError,
    managerProfileUpdateMutation.isSuccess,
  ]);
  useEffect(() => {
    if (tenantProfileUpdateMutation.isSuccess) {
      successToast("", {
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });

      setIsSaving(false);
    }
  }, [tenantProfileUpdateMutation.isSuccess]);

  useEffect(() => {
    if (tenantProfileUpdateMutation.isError) {
      errorToast("", {
        title: "Profile Update",
        description: tenantProfileUpdateMutation.error.message,
      });

      setIsSaving(false);
    }
  }, [
    tenantProfileUpdateMutation.error?.message,
    tenantProfileUpdateMutation.isError,
    tenantProfileUpdateMutation.isSuccess,
  ]);

  // Handle signature save
  const handleSaveSignature = async () => {
    if (signatureData.isEmpty) {
      warningToast("", {
        title: "Signature required",
        description: "Please draw your signature before saving.",
      });
      return;
    }

    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Signature saved:", signatureData);
    warningToast("", {
      title: "Signature saved",
      description: "Your signature has been saved successfully.",
    });

    setIsSaving(false);
    setIsSignatureSaved(true);
  };

  // Handle signature change
  const handleSignatureChange = (data: {
    svg: string;
    points: SignatureLine[];
    isEmpty: boolean;
  }) => {
    setSignatureData(data);
    if (!data.isEmpty) {
      setIsSignatureSaved(false);
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Get role badge
  const getRoleBadge = () => {
    if (isOwner) return <Badge className="bg-purple-500">Owner</Badge>;
    if (isManager) return <Badge className="bg-blue-500">Manager</Badge>;
    if (isTenant) return <Badge className="bg-green-500">Tenant</Badge>;
    return <Badge>User</Badge>;
  };

  return (
    <PageWrapper className="py-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageHeader
          title="My Profile"
          description="Manage your personal information and preferences"
          withBackButton
        />
      </motion.div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_3fr]">
        {/* Profile sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage />
                    <AvatarFallback className="text-lg">
                      {getInitials(
                        user?.user.firstName + " " + user?.user.lastName ||
                          "User",
                      )}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <h2 className="text-xl font-semibold">
                  {getFullName(user?.user.firstName, user?.user.lastName) ||
                    "User Name"}
                </h2>
                <div className="absolute right-4 top-4 mt-1 flex items-center gap-2">
                  {getRoleBadge()}
                  {isSignatureSaved && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 text-green-500"
                    >
                      <CheckCircle className="h-3 w-3" />
                      Signed
                    </Badge>
                  )}
                </div>
                {user?.tenant?.occupation && (
                  <p className="mt-2 text-center text-sm text-muted-foreground">
                    {user?.tenant?.occupation}
                  </p>
                )}
                <Separator className="my-6" />

                <div className="w-full space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {user?.user.email || "email@example.com"}
                    </span>
                  </div>
                  {user?.user?.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.user.phone}</span>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                <div className="w-full">
                  <h3 className="mb-2 text-sm font-medium">Last login</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Today at 10:30 AM</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Tabs
            defaultValue={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Personal</span>
              </TabsTrigger>
              {isOwner ||
                (isManager && (
                  <TabsTrigger
                    value="signature"
                    className="flex items-center gap-2"
                  >
                    <PenTool className="h-4 w-4" />
                    <span className="hidden sm:inline">Signature</span>
                  </TabsTrigger>
                ))}
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center gap-2"
              >
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <Stack spacing={"lg"}>
                        <Group className="grid sm:grid-cols-2">
                          <TextFormField
                            control={form.control}
                            name="firstName"
                            label="First Name"
                          />
                          <TextFormField
                            control={form.control}
                            name="lastName"
                            label="First Name"
                          />
                        </Group>

                        <Group className="grid sm:grid-cols-2">
                          <EmailFormField
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder="john.doe@acmecorp.com"
                          />
                          <TextFormField
                            control={form.control}
                            name="phone"
                            label="Phone Number"
                            placeholder="(123) 456-7890"
                          />
                        </Group>
                      </Stack>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="occupation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Title</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your job title"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={isSaving}
                          className="gap-2"
                        >
                          {isSaving ? "Saving..." : "Save Changes"}
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Signature Tab */}
            <TabsContent value="signature">
              <Card>
                <CardHeader>
                  <CardTitle>Digital Signature</CardTitle>
                  <CardDescription>
                    Create and manage your digital signature for documents and
                    approvals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="rounded-lg border bg-slate-50 p-6 dark:bg-slate-900/50">
                      <h3 className="mb-2 text-base font-medium">
                        Your Signature
                      </h3>
                      <p className="mb-4 text-sm text-muted-foreground">
                        Draw your signature below. This will be used for
                        document signing and approvals.
                      </p>

                      <SignaturePad
                        height={200}
                        penColor="#1e40af"
                        penWidth={2.5}
                        backgroundColor="#ffffff"
                        borderColor="#e2e8f0"
                        borderWidth={1}
                        borderRadius={8}
                        card={false}
                        showToolbar={true}
                        showDoneButton={false}
                        placeholder="Sign here"
                        onChange={handleSignatureChange}
                      />
                    </div>

                    {!signatureData.isEmpty && (
                      <div className="rounded-lg border bg-slate-50 p-6 dark:bg-slate-900/50">
                        <h3 className="mb-2 text-base font-medium">Preview</h3>
                        <div
                          className="flex min-h-[100px] items-center justify-center rounded border bg-white p-4"
                          dangerouslySetInnerHTML={{
                            __html: signatureData.svg,
                          }}
                        />
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button
                        onClick={handleSaveSignature}
                        disabled={isSaving || signatureData.isEmpty}
                        className="gap-2 bg-gradient-to-r from-primary to-primary/80 transition-all hover:from-primary/90 hover:to-primary"
                      >
                        {isSaving ? "Saving..." : "Save Signature"}
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security and authentication
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="rounded-lg border bg-slate-50 p-6 dark:bg-slate-900/50">
                      <h3 className="mb-4 text-base font-medium">Password</h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="current-password">
                            Current Password
                          </Label>
                          <Input
                            id="current-password"
                            type="password"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="new-password">New Password</Label>
                          <Input
                            id="new-password"
                            type="password"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Label htmlFor="confirm-password">
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          className="mt-1"
                        />
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline">Update Password</Button>
                      </div>
                    </div>

                    <div className="rounded-lg border bg-slate-50 p-6 dark:bg-slate-900/50">
                      <h3 className="mb-4 text-base font-medium">
                        Two-Factor Authentication
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            Enable Two-Factor Authentication
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications and updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form className="space-y-6">
                      <div className="space-y-4">
                        <div className="rounded-lg border bg-slate-50 p-6 dark:bg-slate-900/50">
                          <h3 className="mb-4 text-base font-medium">
                            Communication Channels
                          </h3>
                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="notificationsEmail"
                              render={({ field }) => (
                                <div className="flex items-center justify-between">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                      Email Notifications
                                    </FormLabel>
                                    <FormDescription>
                                      Receive notifications via email
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </div>
                              )}
                            />
                            <Separator />
                            <FormField
                              control={form.control}
                              name="notificationsSMS"
                              render={({ field }) => (
                                <div className="flex items-center justify-between">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                      SMS Notifications
                                    </FormLabel>
                                    <FormDescription>
                                      Receive notifications via text message
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </div>
                              )}
                            />
                          </div>
                        </div>

                        <div className="rounded-lg border bg-slate-50 p-6 dark:bg-slate-900/50">
                          <h3 className="mb-4 text-base font-medium">
                            Notification Types
                          </h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-base">
                                  Property Updates
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  Notifications about property changes and
                                  maintenance
                                </p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label className="text-base">
                                  System Announcements
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  Important system updates and announcements
                                </p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit" className="gap-2">
                          Save Preferences
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default ProfilePage;
