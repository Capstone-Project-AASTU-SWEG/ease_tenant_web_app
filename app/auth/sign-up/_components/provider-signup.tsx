"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { errorToast, successToast } from "@/components/custom/toasts";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles, Building } from "lucide-react";
import Image from "next/image";
import ASSETS from "../../_assets";
import BackButton from "./back-btn";
import SubmitButton from "./submit-btn";

// ========== ANIMATIONS ==========
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const providerFormSchema = z
  .object({
    businessName: z
      .string()
      .min(2, { message: "Business name must be at least 2 characters." }),
    contactName: z
      .string()
      .min(2, { message: "Contact name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    phone: z
      .string()
      .min(10, { message: "Please enter a valid phone number." }),
    businessAddress: z
      .string()
      .min(5, { message: "Please enter a valid address." }),
    serviceType: z
      .string()
      .min(1, { message: "Please select a service type." }),
    serviceDescription: z.string().min(10, {
      message: "Please provide a brief description of your services.",
    }),
    website: z.string().optional(),
    taxId: z.string().min(5, { message: "Please enter a valid tax ID." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ProviderSignup() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof providerFormSchema>>({
    resolver: zodResolver(providerFormSchema),
    defaultValues: {
      businessName: "",
      contactName: "",
      email: "",
      phone: "",
      businessAddress: "",
      serviceType: "",
      serviceDescription: "",
      website: "",
      taxId: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  async function onSubmit(values: z.infer<typeof providerFormSchema>) {
    setIsSubmitting(true);

    try {
      // This would be replaced with your actual API call
      console.log("Provider signup data:", values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      successToast("", {
        title: "Account created!",
        description:
          "You've successfully created your service provider account.",
      });

      // Reset form
      form.reset();
    } catch (error: unknown) {
      errorToast("", {
        title: "Error",
        description:
          (error as Error).message ||
          "There was a problem creating your account.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <BackButton />

      {/* Left Column - Background Image */}
      <div className="relative hidden h-screen md:block md:w-1/2">
        <div className="absolute inset-0">
          <Image
            src={ASSETS.IMAGES.BUILDING_IMAGE}
            alt="Service Provider Portal Background"
            fill
            priority
            sizes="50vw"
            style={{ objectFit: "cover" }}
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-primary/80 to-primary/40 mix-blend-multiply" />
        </div>
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-12 text-white">
          <h1 className="mb-6 text-4xl font-bold">Service Provider Portal</h1>
          <p className="mb-8 max-w-md text-center text-lg">
            Join our platform to connect with property managers and tenants who
            need your professional services.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="mr-3 rounded-full bg-white/20 p-2">
                <Building className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium">Business Growth</h3>
                <p className="text-sm text-white/80">Expand your client base</p>
              </div>
            </div>
            <div className="flex items-center rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="mr-3 rounded-full bg-white/20 p-2">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium">Streamlined Operations</h3>
                <p className="text-sm text-white/80">
                  Manage service requests efficiently
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form with proper scrolling */}
      <div className="flex h-screen flex-1 flex-col bg-background md:w-1/2">
        <div className="h-full overflow-y-auto px-6 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">
              Service Provider Registration
            </h2>
            <p className="mt-2 text-muted-foreground">
              Create an account to offer services to property managers and
              tenants.
            </p>
          </div>

          <Form {...form}>
            <form
              id="provider-signup-form"
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
                    <div className="space-y-10">
                      {/* Business Information Section */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold">
                          Business Information
                        </h3>
                        <div className="grid gap-6">
                          <FormField
                            control={form.control}
                            name="businessName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Business Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Acme Services LLC"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="contactName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contact Person Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="businessAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Business Address</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="123 Main St, City, State, ZIP"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="taxId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tax ID / Business License</FormLabel>
                                <FormControl>
                                  <Input placeholder="XX-XXXXXXX" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Contact Information Section */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold">
                          Contact Information
                        </h3>
                        <div className="grid gap-6">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      placeholder="contact@acmeservices.com"
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
                                    <Input
                                      type="tel"
                                      placeholder="(123) 456-7890"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Website (Optional)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="https://www.acmeservices.com"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Service Details Section */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold">
                          Service Details
                        </h3>
                        <div className="grid gap-6">
                          <FormField
                            control={form.control}
                            name="serviceType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Service Type</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select your service type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="cleaning">
                                      Cleaning Services
                                    </SelectItem>
                                    <SelectItem value="plumbing">
                                      Plumbing Services
                                    </SelectItem>
                                    <SelectItem value="electrical">
                                      Electrical Services
                                    </SelectItem>
                                    <SelectItem value="hvac">
                                      HVAC Services
                                    </SelectItem>
                                    <SelectItem value="landscaping">
                                      Landscaping Services
                                    </SelectItem>
                                    <SelectItem value="security">
                                      Security Services
                                    </SelectItem>
                                    <SelectItem value="pest">
                                      Pest Control
                                    </SelectItem>
                                    <SelectItem value="renovation">
                                      Renovation Services
                                    </SelectItem>
                                    <SelectItem value="other">
                                      Other Services
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="serviceDescription"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Service Description</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Briefly describe the services you offer..."
                                    className="min-h-[100px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Account Section */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold">
                          Account Information
                        </h3>
                        <div className="grid gap-6">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="password"
                                      placeholder="••••••••"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Password must be at least 8 characters long.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirm Password</FormLabel>
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
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <SubmitButton isSubmitting={isSubmitting} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
