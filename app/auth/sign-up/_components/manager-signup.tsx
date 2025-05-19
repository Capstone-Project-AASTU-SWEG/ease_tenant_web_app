"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Group } from "@/components/custom/group";
import {
  DateFormField,
  EmailFormField,
  NumberFormField,
  PasswordFormField,
  TextFormField,
} from "@/components/custom/form-field";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles, Building2 } from "lucide-react";
import { useManagerSignUp } from "../../_queries/useAuth";
import { errorToast, successToast } from "@/components/custom/toasts";
import { DataListInput } from "@/components/custom/data-list-input";
import { useGetAllBuildingsQuery } from "@/app/quries/useBuildings";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BackButton from "./back-btn";
import SubmitButton from "./submit-btn";
import ASSETS from "../../_assets";
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

const managerFormSchema = z
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
    assignedBuilding: z.string().optional(),
    employmentDate: z.date().optional(),
    salary: z.coerce.number().min(0).optional(),
    password: z
      .string()
      .min(4, { message: "Password must be at least 4 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ManagerSignup() {
  const router = useRouter();

  const form = useForm<z.infer<typeof managerFormSchema>>({
    resolver: zodResolver(managerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      assignedBuilding: "",
      salary: 0,
      employmentDate: new Date(),
    },
  });

  const managerSignUpMutation = useManagerSignUp();
  const buildings = useGetAllBuildingsQuery();

  async function onSubmit(values: z.infer<typeof managerFormSchema>) {
    const optional: Record<string, string | number> = {};

    if (values.salary && values.salary > 1) {
      optional["salary"] = values.salary;
    }
    managerSignUpMutation.mutate({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      phone: values.phone,
      assignedBuilding: values.assignedBuilding,
      employmentDate: values.employmentDate,
      ...optional,
    });
  }

  useEffect(() => {
    if (managerSignUpMutation.isSuccess) {
      successToast("", {
        title: "Account created!",
        description: "You've successfully created your manager account.",
      });
      form.reset();

      // Assuming you want to redirect after successful signup
      router.push("/dashboard/manager");
    }
  }, [form, router, managerSignUpMutation.isSuccess]);

  useEffect(() => {
    if (managerSignUpMutation.isError) {
      errorToast("", {
        title: "Sign Up Error",
        description:
          managerSignUpMutation.error?.message ||
          "An error occurred while creating the account. Please try again.",
      });
    }
  }, [managerSignUpMutation.isError, managerSignUpMutation.error]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <BackButton />

      {/* Left Column - Background Image */}
      <div className="relative hidden h-screen md:block md:w-1/2">
        <div className="absolute inset-0">
          <Image
            src={ASSETS.IMAGES.BUILDING_IMAGE}
            alt="Property Manager Portal Background"
            fill
            priority
            sizes="50vw"
            style={{ objectFit: "cover" }}
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-primary/80 to-primary/40 mix-blend-multiply" />
        </div>
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-12 text-white">
          <h1 className="mb-6 text-4xl font-bold">Property Manager Portal</h1>
          <p className="mb-8 max-w-md text-center text-lg">
            Join our building management system to efficiently manage
            properties, tenants, and maintenance requests.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="mr-3 rounded-full bg-white/20 p-2">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium">Property Management</h3>
                <p className="text-sm text-white/80">
                  Manage properties efficiently
                </p>
              </div>
            </div>
            <div className="flex items-center rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="mr-3 rounded-full bg-white/20 p-2">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium">Streamlined Operations</h3>
                <p className="text-sm text-white/80">
                  Simplify your daily tasks
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
              Property Manager Registration
            </h2>
            <p className="mt-2 text-muted-foreground">
              Create an account to manage properties, tenants, and maintenance
              requests.
            </p>
          </div>

          <ScrollArea>
            <Form {...form}>
              <form
                id="manager-signup-form"
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
                        {/* Building Selection Section */}
                        <div className="space-y-6">
                          <h3 className="text-xl font-semibold">
                            Building Assignment
                          </h3>
                          <div className="grid gap-6">
                            <DataListInput
                              maxItems={1}
                              items={
                                buildings.data?.map((building) => ({
                                  label: building.name,
                                  value: building.id,
                                })) || []
                              }
                              label="Select Building"
                              onChange={(data) => {
                                form.setValue(
                                  "assignedBuilding",
                                  data.at(0)?.value,
                                );
                              }}
                            />
                          </div>
                        </div>

                        {/* Personal Information Section */}
                        <div className="space-y-6">
                          <h3 className="text-xl font-semibold">
                            Personal Information
                          </h3>
                          <div className="grid gap-6">
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
                          </div>
                        </div>

                        {/* Employment Details Section */}
                        <div className="space-y-6">
                          <h3 className="text-xl font-semibold">
                            Employment Details
                          </h3>
                          <div className="grid gap-6">
                            <Group className="grid sm:grid-cols-2">
                              <DateFormField
                                control={form.control}
                                name="employmentDate"
                                label="Employment Date"
                              />
                              <NumberFormField
                                control={form.control}
                                name="salary"
                                label="Salary"
                                placeholder="50,000"
                              />
                            </Group>
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
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <SubmitButton
                            isSubmitting={managerSignUpMutation.isPending}
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
