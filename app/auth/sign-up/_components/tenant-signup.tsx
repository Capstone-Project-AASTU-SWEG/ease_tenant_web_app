"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { errorToast, successToast } from "@/components/custom/toasts";
import { motion } from "framer-motion";
import {
  TextFormField,
  EmailFormField,
  PasswordFormField,
  TextareaFormField,
  SelectFormField,
} from "@/components/custom/form-field";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { tenantFormSchema, type TenantFormValues } from "../../_validations";
import { BUSINESS_TYPE_OPTIONS } from "../../_constants";
import { useRouter } from "next/navigation";
import { Group } from "@/components/custom/group";
import Stack from "@/components/custom/stack";
import { useTenantSignUp } from "../../_queries/useAuth";
import Image from "next/image";
import SubmitButton from "./submit-btn";
import ASSETS from "../../_assets";
import BackButton from "./back-btn";
import { ScrollArea } from "@/components/ui/scroll-area";

// ========== ANIMATIONS ==========
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// ========== MAIN COMPONENT ==========
export default function TenantSignup() {
  const router = useRouter();

  const signUpMutation = useTenantSignUp();

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: {
      businessName: "",
      businessType: BUSINESS_TYPE_OPTIONS[0].value,
      businessDescription: "",
      businessWebsite: "",
      businessRegistrationNumber: "",
      taxId: "",
      firstName: "",
      lastName: "",
      occupation: "Developer",
      email: "",
      phone: "",
      workPhoneNumber: "",
      emergencyContact: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  async function onSubmit(values: TenantFormValues) {
    signUpMutation.mutate({
      businessName: values.businessName,
      businessRegistrationNumber: values.businessRegistrationNumber,
      businessType: values.businessType,
      businessWebsite: values.businessWebsite,
      businessDescription: values.businessDescription,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      occupation: values.occupation,
      password: values.password,
      emergencyContact: values.emergencyContact,
      workPhoneNumber: values.workPhoneNumber,
      taxId: values.taxId,
      status: "Pending",
    });
  }

  // On successful signup, show success toast and redirect
  useEffect(() => {
    if (signUpMutation.isSuccess) {
      successToast("", {
        title: "Account created!",
        description: "You've successfully created your tenant account.",
      });
      form.reset();

      const token = signUpMutation.data.token;
      localStorage.setItem("token", token);
      router.push("/dashboard/tenant");
    }
  }, [form, router, signUpMutation.data?.token, signUpMutation.isSuccess]);

  // On error, show error toast
  useEffect(() => {
    if (signUpMutation.isError) {
      errorToast("", {
        title: "Sign Up Error",
        description: signUpMutation.error.message,
      });
    }
  }, [signUpMutation.isError, signUpMutation.error]);

  return (
    <div className="flex flex-row overflow-hidden">
      <BackButton />

      {/* Left Column - Background Image using Next.js Image component */}
      <div className="relative hidden h-screen md:block md:w-1/2">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={ASSETS.IMAGES.BUILDING_IMAGE || "/placeholder.svg"}
            alt="Commercial Tenant Portal Background"
            fill
            priority
            sizes="50vw"
            style={{ objectFit: "cover" }}
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-primary/80 to-primary/40 mix-blend-multiply" />
        </div>
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-12 text-white">
          <h1 className="mb-6 text-4xl font-bold">Commercial Tenant Portal</h1>
          <p className="mb-8 max-w-md text-center text-lg">
            Join our building management system to streamline your commercial
            space operations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="mr-3 rounded-full bg-white/20 p-2">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium">Simplified Management</h3>
                <p className="text-sm text-white/80">
                  Manage your space efficiently
                </p>
              </div>
            </div>
            <div className="flex items-center rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="mr-3 rounded-full bg-white/20 p-2">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium">Streamlined Communication</h3>
                <p className="text-sm text-white/80">
                  Direct line to building management
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form with proper scrolling */}
      <div className="flex h-[100dvh] flex-1 flex-col overflow-hidden bg-background md:w-1/2">
        <div className="h-full overflow-y-auto p-6">
          <Stack spacing={"sm"} className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">
              Commercial Tenant Registration
            </h2>
            <p className="mt-2 text-muted-foreground">
              Create an account to access the building management system for
              your commercial space.
            </p>
          </Stack>

          <ScrollArea className="">
            <Form {...form}>
              <form
                id="tenant-signup-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-8"
              >
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={contentVariants}
                >
                  <Card className="border-none shadow-none">
                    <CardContent className="p-0">
                      <div className="flex flex-col gap-10">
                        {/* Contact Section */}
                        <section className="flex flex-col gap-6">
                          <h3 className="text-xl font-semibold">
                            Contact Information
                          </h3>
                          <Stack className="gap-6">
                            <Group className="grid sm:grid-cols-2">
                              <TextFormField
                                control={form.control}
                                name="firstName"
                                label="First Name"
                                placeholder="John"
                              />
                              <TextFormField
                                control={form.control}
                                name="lastName"
                                label="Last Name"
                                placeholder="Doe"
                              />
                            </Group>
                            <TextFormField
                              control={form.control}
                              name="occupation"
                              label="Occupation"
                              placeholder="Property Manager"
                            />

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

                            <Group className="grid sm:grid-cols-2">
                              <TextFormField
                                control={form.control}
                                name="workPhoneNumber"
                                label="Work Phone Number"
                                placeholder="(123) 456-7890"
                              />
                              <TextFormField
                                control={form.control}
                                name="emergencyContact"
                                label="Emergency Contact"
                                placeholder="(123) 456-7890"
                              />
                            </Group>
                          </Stack>
                        </section>

                        {/* Business Section */}
                        <Stack className="gap-6">
                          <h3 className="text-xl font-semibold">
                            Business Information
                          </h3>
                          <div className="grid gap-6">
                            <TextFormField
                              control={form.control}
                              name="businessName"
                              label="Business Name"
                              placeholder="Acme Corporation"
                            />

                            <SelectFormField
                              control={form.control}
                              name="businessType"
                              label="Business Type"
                              options={BUSINESS_TYPE_OPTIONS}
                            />

                            <TextareaFormField
                              control={form.control}
                              name="businessDescription"
                              label="Business Description"
                              placeholder="Brief description of your business activities"
                            />

                            <div className="grid gap-4 sm:grid-cols-2">
                              <TextFormField
                                control={form.control}
                                name="businessRegistrationNumber"
                                label="Business Registration Number"
                                placeholder="12-3456789"
                              />
                              <TextFormField
                                control={form.control}
                                name="taxId"
                                label="Tax ID (EIN)"
                                placeholder="12-3456789"
                              />
                            </div>
                            <TextFormField
                              control={form.control}
                              name="businessWebsite"
                              label="Business Website"
                              placeholder="https://yourbusiness.com"
                            />
                          </div>
                        </Stack>

                        {/* Account Section */}
                        <div className="flex flex-col gap-6">
                          <h3 className="text-xl font-semibold">
                            Account Information
                          </h3>
                          <Stack>
                            <Group className="grid sm:grid-cols-2">
                              <PasswordFormField
                                control={form.control}
                                name="password"
                                label="Password"
                                placeholder="••••••••"
                              />
                              <PasswordFormField
                                control={form.control}
                                name="confirmPassword"
                                label="Confirm Password"
                                placeholder="••••••••"
                              />
                            </Group>

                            <Stack>
                              <FormField
                                control={form.control}
                                name="termsAccepted"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg bg-white/20 p-4">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel>
                                        I accept the{" "}
                                        <a
                                          href="/terms"
                                          className="text-primary underline underline-offset-4"
                                        >
                                          terms and conditions
                                        </a>
                                      </FormLabel>
                                      <FormDescription>
                                        By creating an account, you agree to our
                                        terms of service and privacy policy.
                                      </FormDescription>
                                      <FormMessage />
                                    </div>
                                  </FormItem>
                                )}
                              />
                            </Stack>
                          </Stack>
                        </div>

                        <div className="flex justify-end">
                          <SubmitButton
                            isSubmitting={signUpMutation.isPending}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </form>
            </Form>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
