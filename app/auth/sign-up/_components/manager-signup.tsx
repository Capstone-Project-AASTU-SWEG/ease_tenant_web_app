"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SignupLayout from "./signup-layout";
import { Form } from "@/components/ui/form";
import { Group } from "@/components/custom/group";
import {
  DateFormField,
  EmailFormField,
  NumberFormField,
  PasswordFormField,
  TextFormField,
} from "@/components/custom/form-field";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useManagerSignUp } from "../../_queries/useAuth";
import { useEffect } from "react";
import { errorToast, successToast } from "@/components/custom/toasts";
import Stack from "@/components/custom/stack";
import { Label } from "@/components/ui/label";
import { DataListInput } from "@/components/custom/data-list-input";

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" },
  tap: { scale: 0.98 },
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
    assignedBuildingId: z.string().optional(),
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
  const form = useForm<z.infer<typeof managerFormSchema>>({
    resolver: zodResolver(managerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const managerSignUpMutation = useManagerSignUp();

  async function onSubmit(values: z.infer<typeof managerFormSchema>) {
    managerSignUpMutation.mutate({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      phone: values.phone,
      assignedBuildingId: values.assignedBuildingId,
      employmentDate: values.employmentDate,
      salary: values.salary,
    });
  }

  useEffect(() => {
    if (managerSignUpMutation.isSuccess) {
      successToast("Manager account created successfully!");
    }
  }, [managerSignUpMutation.isSuccess]);

  useEffect(() => {
    if (managerSignUpMutation.isError) {
      errorToast(
        managerSignUpMutation.error?.message ||
          "An error occurred while creating the account. Please try again.",
      );
    }
  }, [
    form,
    managerSignUpMutation.error?.message,
    managerSignUpMutation.isError,
  ]);

  return (
    <SignupLayout
      title="Property Manager Registration"
      description="Create an account to manage properties, tenants, and maintenance requests."
      userType="manager"
    >
      <Form {...form}>
        <form id="manager-signup-form" onSubmit={form.handleSubmit(onSubmit)}>
          <section className="h-[calc(100vh-20rem)] space-y-6">
            {/* Building info */}
            <Stack spacing={"xs"}>
              <Label className="text-sm font-normal">Select Building</Label>
              <DataListInput
                maxItems={1}
                items={[
                  {
                    label: "Building Name 01",
                    value: "01",
                  },
                  {
                    label: "Building Name 02",
                    value: "02",
                  },
                ]}
              />
            </Stack>
            <Group align={"start"} className="grid sm:grid-cols-2">
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

            <Group align={"start"} className="grid sm:grid-cols-2">
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

            <Group align={"start"} className="grid sm:grid-cols-2">
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

            <Group align={"start"} className="grid sm:grid-cols-2">
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
          </section>
          <section className="mt-10 flex items-center justify-end">
            <SubmitButton isSubmitting={false} />
          </section>
        </form>
      </Form>
    </SignupLayout>
  );
}

const SubmitButton = ({ isSubmitting }: { isSubmitting: boolean }) => (
  <motion.button
    type="submit"
    className="flex items-center space-x-2 rounded-full bg-gradient-to-r from-primary to-primary/80 px-6 py-2 text-primary-foreground shadow-md"
    disabled={isSubmitting}
    variants={buttonVariants}
    whileHover="hover"
    whileTap="tap"
  >
    <span>{isSubmitting ? "Creating Account..." : "Create Account"}</span>
    <Sparkles className="h-4 w-4" />
  </motion.button>
);
