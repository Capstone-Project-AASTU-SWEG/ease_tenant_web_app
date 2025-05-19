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
import { Checkbox } from "@/components/ui/checkbox";
import { errorToast, successToast } from "@/components/custom/toasts";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles, Wrench } from "lucide-react";
import Image from "next/image";
import BackButton from "./back-btn";
import SubmitButton from "./submit-btn";
import ASSETS from "../../_assets";
import { ScrollArea } from "@/components/ui/scroll-area";
import Stack from "@/components/custom/stack";
import { Group } from "@/components/custom/group";
import {
  EmailFormField,
  PasswordFormField,
  SelectFormField,
  TextFormField,
} from "@/components/custom/form-field";

// ========== ANIMATIONS ==========
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const maintainerFormSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "First name must be at least 2 characters." }),
    lastName: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    phone: z
      .string()
      .min(10, { message: "Please enter a valid phone number." }),
    specialization: z
      .string()
      .min(1, { message: "Please select a specialization." }),
    experience: z
      .string()
      .min(1, { message: "Please select your experience level." }),
    certifications: z.string().optional(),
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

export default function MaintainerSignup() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof maintainerFormSchema>>({
    resolver: zodResolver(maintainerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialization: "",
      experience: "",
      certifications: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  async function onSubmit(values: z.infer<typeof maintainerFormSchema>) {
    setIsSubmitting(true);

    try {
      // This would be replaced with your actual API call
      console.log("Maintainer signup data:", values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      successToast("", {
        title: "Account created!",
        description:
          "You've successfully created your maintenance staff account.",
      });

      // Reset form
      form.reset();
    } catch (error: unknown) {
      errorToast("", {
        title: "Sign Up Error",
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
            alt="Maintenance Staff Portal Background"
            fill
            priority
            sizes="50vw"
            style={{ objectFit: "cover" }}
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-primary/80 to-primary/40 mix-blend-multiply" />
        </div>
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-12 text-white">
          <h1 className="mb-6 text-4xl font-bold">Maintenance Staff Portal</h1>
          <p className="mb-8 max-w-md text-center text-lg">
            Join our building management system to efficiently handle
            maintenance requests and keep properties in top condition.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="mr-3 rounded-full bg-white/20 p-2">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium">Streamlined Requests</h3>
                <p className="text-sm text-white/80">
                  Manage maintenance tasks efficiently
                </p>
              </div>
            </div>
            <div className="flex items-center rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="mr-3 rounded-full bg-white/20 p-2">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium">Professional Tools</h3>
                <p className="text-sm text-white/80">
                  Access everything you need in one place
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form with proper scrolling */}
      <div className="flex h-screen flex-1 flex-col bg-background md:w-1/2">
        <div className="h-full overflow-y-auto p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">
              Maintenance Staff Registration
            </h2>
            <p className="mt-2 text-muted-foreground">
              Create an account to receive and respond to maintenance requests.
            </p>
          </div>

          <ScrollArea>
            <Form {...form}>
              <form
                id="maintainer-signup-form"
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
                        {/* Personal Information Section */}
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
                        </section>

                        {/* Professional Details Section */}
                        <div className="space-y-6">
                          <h3 className="text-xl font-semibold">
                            Professional Details
                          </h3>
                          <div className="grid gap-6">
                            <SelectFormField
                              control={form.control}
                              name="specialization"
                              label="Specialization"
                              options={[
                                {
                                  value: "general",
                                  label: "General Maintenance",
                                },
                                {
                                  value: "plumbing",
                                  label: "Plumbing",
                                },
                                {
                                  value: "electrical",
                                  label: "Electrical",
                                },
                              ]}
                            />
                            <SelectFormField
                              control={form.control}
                              name="experience"
                              label="Experience Level"
                              placeholder="Select your experience level"
                              options={[
                                {
                                  value: "entry",
                                  label: "Entry Level (0-2 years)",
                                },
                                {
                                  value: "intermediate",
                                  label: "Intermediate (3-5 years)",
                                },
                                {
                                  value: "experienced",
                                  label: "Experienced (6-10 years)",
                                },
                                {
                                  value: "expert",
                                  label: "Expert (10+ years)",
                                },
                              ]}
                            />

                            {/* <FormField
                              control={form.control}
                              name="certifications"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Certifications (Optional)
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="List any relevant certifications"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            /> */}
                          </div>
                        </div>

                        {/* Account Section */}
                        <div className="space-y-6">
                          <h3 className="text-xl font-semibold">
                            Account Information
                          </h3>
                          <div className="grid gap-6">
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
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
