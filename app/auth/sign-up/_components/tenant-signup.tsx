"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
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
import SignupLayout from "./signup-layout";
import { motion, AnimatePresence } from "framer-motion";
import {
  TextFormField,
  EmailFormField,
  PasswordFormField,
  TextareaFormField,
  SelectFormField,
} from "@/components/custom/form-field";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import TabNavigation from "@/components/custom/section-navigation";
import { tenantFormSchema, TenantFormValues } from "../../_validations";
import {
  BUSINESS_TYPE_OPTIONS,
  TENANT_SIGNUP_SECTION_TYPE,
  TENANT_SIGNUP_SECTIONS,
} from "../../_constants";
import { useRouter } from "next/navigation";
import { Group } from "@/components/custom/group";
import Stack from "@/components/custom/stack";
import { useTenantSignUp } from "../../_queries/useAuth";

// ========== ANIMATIONS ==========
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: { opacity: 0, x: 20, transition: { duration: 0.3, ease: "easeIn" } },
};

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" },
  tap: { scale: 0.98 },
};

// ========== FORM SECTIONS ==========
interface FormSectionProps {
  form: UseFormReturn<TenantFormValues>;
  onNavigation: (direction: "next" | "prev") => Promise<void>;
  isSubmitting?: boolean;
}

// ========== MAIN COMPONENT ==========
export default function TenantSignup() {
  const [activeSection, setActiveSection] =
    useState<TENANT_SIGNUP_SECTION_TYPE>(TENANT_SIGNUP_SECTION_TYPE.CONTACT);

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

  const sectionOrder: TENANT_SIGNUP_SECTION_TYPE[] = [
    TENANT_SIGNUP_SECTION_TYPE.CONTACT,
    TENANT_SIGNUP_SECTION_TYPE.BUSINESS,
    TENANT_SIGNUP_SECTION_TYPE.ACCOUNT,
  ];

  const getCurrentSectionIndex = () => {
    return sectionOrder.indexOf(activeSection);
  };

  const validateCurrentSection = async (): Promise<boolean> => {
    const currentSection = activeSection;
    let fieldsToValidate: (keyof TenantFormValues)[] = [];

    switch (currentSection) {
      case TENANT_SIGNUP_SECTION_TYPE.CONTACT:
        fieldsToValidate = [
          "firstName",
          "lastName",
          "occupation",
          "email",
          "phone",
        ];
        break;

      case TENANT_SIGNUP_SECTION_TYPE.BUSINESS:
        fieldsToValidate = [
          "businessName",
          "businessType",
          "taxId",
          "businessRegistrationNumber",
        ];
        break;

      case TENANT_SIGNUP_SECTION_TYPE.ACCOUNT:
        fieldsToValidate = ["password", "confirmPassword", "termsAccepted"];
        break;
    }

    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const handleNavigation = async (direction: "next" | "prev") => {
    if (direction === "next") {
      const isValid = await validateCurrentSection();
      if (!isValid) return;
    }

    const currentIndex = getCurrentSectionIndex();
    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < sectionOrder.length) {
      setActiveSection(sectionOrder[newIndex]);
    }
  };

  const handleTabChange = async (tabId: TENANT_SIGNUP_SECTION_TYPE) => {
    const targetIndex = sectionOrder.indexOf(tabId);
    const currentIndex = getCurrentSectionIndex();

    // Only allow going to previous tabs without validation
    if (targetIndex < currentIndex) {
      setActiveSection(tabId);
      return;
    }

    // For going forward, validate all intermediate SECTIONS
    for (let i = currentIndex; i < targetIndex; i++) {
      const isValid = await form.trigger(getSectionFields(sectionOrder[i]));
      if (!isValid) {
        // If any intermediate section is invalid, jump to that section
        setActiveSection(sectionOrder[i]);
        return;
      }
    }

    setActiveSection(tabId);
  };

  const getSectionFields = (
    section: TENANT_SIGNUP_SECTION_TYPE,
  ): (keyof TenantFormValues)[] => {
    switch (section) {
      case TENANT_SIGNUP_SECTION_TYPE.CONTACT:
        return ["firstName", "lastName", "occupation", "email", "phone"];
      case TENANT_SIGNUP_SECTION_TYPE.BUSINESS:
        return ["businessName", "businessType"];
      case TENANT_SIGNUP_SECTION_TYPE.ACCOUNT:
        return ["password", "confirmPassword", "termsAccepted"];
      default:
        return [];
    }
  };

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
    });
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case TENANT_SIGNUP_SECTION_TYPE.CONTACT:
        return <ContactSection form={form} onNavigation={handleNavigation} />;
      case TENANT_SIGNUP_SECTION_TYPE.BUSINESS:
        return <BusinessSection form={form} onNavigation={handleNavigation} />;
      case TENANT_SIGNUP_SECTION_TYPE.ACCOUNT:
        return (
          <AccountSection
            form={form}
            onNavigation={handleNavigation}
            isSubmitting={signUpMutation.isPending}
          />
        );
      default:
        return null;
    }
  };

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
    <SignupLayout
      title="Commercial Tenant Registration"
      description="Create an account to access the building management system for your commercial space."
      userType="tenant"
    >
      <Form {...form}>
        <form
          id="tenant-signup-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <AnimatePresence>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={contentVariants}
            >
              <TabNavigation
                activeTab={activeSection}
                onChange={(tabID) =>
                  handleTabChange(tabID as TENANT_SIGNUP_SECTION_TYPE)
                }
                tabs={TENANT_SIGNUP_SECTIONS}
              />

              <Card className="overflow-hidden border-none shadow-none">
                <CardContent className="">
                  <AnimatePresence mode="wait">
                    {renderActiveSection()}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </form>
      </Form>
    </SignupLayout>
  );
}

const BusinessSection = ({ form, onNavigation }: FormSectionProps) => (
  <motion.div
    key="business"
    initial="hidden"
    animate="visible"
    exit="exit"
    variants={sectionVariants}
    className="flex flex-col"
  >
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

    <div className="mt-8 flex justify-between">
      <NavigationButton direction="back" onClick={() => onNavigation("prev")} />
      <NavigationButton direction="next" onClick={() => onNavigation("next")} />
    </div>
  </motion.div>
);

const ContactSection = ({ form, onNavigation }: FormSectionProps) => (
  <motion.div
    key=""
    initial="hidden"
    animate="visible"
    exit="exit"
    variants={sectionVariants}
    className="flex flex-col"
  >
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
    </div>

    <div className="mt-6 flex justify-end">
      <NavigationButton direction="next" onClick={() => onNavigation("next")} />
    </div>
  </motion.div>
);

const AccountSection = ({
  form,
  onNavigation,
  isSubmitting = false,
}: FormSectionProps) => (
  <motion.div
    key="account"
    initial="hidden"
    animate="visible"
    exit="exit"
    variants={sectionVariants}
    className="flex h-[calc(100vh-20rem)] flex-col gap-4"
  >
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
                  By creating an account, you agree to our terms of service and
                  privacy policy.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </Stack>
    </Stack>

    <div className="mt-auto flex justify-between">
      <NavigationButton direction="back" onClick={() => onNavigation("prev")} />
      <SubmitButton isSubmitting={isSubmitting} />
    </div>
  </motion.div>
);

// ========== REUSABLE COMPONENTS ==========
const NavigationButton = ({
  direction,
  onClick,
}: {
  direction: "back" | "next";
  onClick: () => void;
}) => (
  <motion.button
    type="button"
    className={`flex items-center space-x-2 px-6 py-2 ${
      direction === "back"
        ? "text-muted-foreground"
        : "bg-primary text-primary-foreground shadow-md"
    }`}
    onClick={onClick}
    variants={buttonVariants}
    whileHover="hover"
    whileTap="tap"
  >
    {direction === "back" ? (
      <>
        <ChevronLeft className="h-4 w-4" />
        <span>Back</span>
      </>
    ) : (
      <>
        <span>Next</span>
        <ChevronRight className="h-4 w-4" />
      </>
    )}
  </motion.button>
);

const SubmitButton = ({ isSubmitting }: { isSubmitting: boolean }) => (
  <motion.button
    type="submit"
    className="flex items-center space-x-2 rounded-md bg-gradient-to-r from-primary to-primary/80 px-6 py-2 text-primary-foreground shadow-md"
    disabled={isSubmitting}
    variants={buttonVariants}
    whileHover="hover"
    whileTap="tap"
  >
    <span>{isSubmitting ? "Creating Account..." : "Create Account"}</span>
    <Sparkles className="h-4 w-4" />
  </motion.button>
);
