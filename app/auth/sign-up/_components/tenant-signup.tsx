"use client";

import { useState } from "react";
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
  SelectFormField,
  PasswordFormField,
  TextareaFormField,
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
import { signUp } from "../../_hooks/useAuth";
import { useRouter } from "next/navigation";
import { useSignUpMutation } from "../../_queries/useAuthQuery";
import { Group } from "@/components/custom/group";
import Stack from "@/components/custom/stack";
import { USER_TYPE } from "@/types";

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

const BusinessSection = ({ form, onNavigation }: FormSectionProps) => (
  <motion.div
    key="business"
    initial="hidden"
    animate="visible"
    exit="exit"
    variants={sectionVariants}
    className="flex h-[calc(100vh-20rem)] flex-col gap-4"
  >
    <div className="grid gap-4">
      <TextFormField
        control={form.control}
        name="businessName"
        label="Legal Business Name"
        placeholder="Acme Corporation"
      />

      <SelectFormField
        control={form.control}
        name="businessType"
        label="Primary Business Type"
        placeholder="Select business type"
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
          name="taxId"
          label="Tax ID (EIN)"
          placeholder="12-3456789"
        />
        <TextFormField
          control={form.control}
          name="businessWebsite"
          label="Business Website"
          placeholder="https://yourbusiness.com"
        />
      </div>
    </div>

    <div className="flex justify-between mt-auto">
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
    className="flex h-[calc(100vh-20rem)] flex-col gap-4"
  >
    <div className="grid gap-4">
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
        name="title"
        label="Job Title"
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

      <div className="pt-4">
        <h4 className="mb-4 text-sm font-medium text-muted-foreground">
          Secondary (Optional)
        </h4>
        <Group className="grid sm:grid-cols-2">
          <EmailFormField
            control={form.control}
            name="secondaryEmail"
            label="Email"
            placeholder="jane.smith@acmecorp.com"
          />
          <TextFormField
            control={form.control}
            name="secondaryPhone"
            label="Phone"
            placeholder="(123) 456-7890"
          />
        </Group>
      </div>
    </div>

    <div className="flex justify-end pt-4">
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

        <FormField
          control={form.control}
          name="marketingOptIn"
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
                  I want to receive marketing communications
                </FormLabel>
                <FormDescription>
                  Get updates about new features and special offers.
                </FormDescription>
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
    className={`flex items-center space-x-2 rounded-full px-6 py-2 ${
      direction === "back"
        ? "bg-muted text-muted-foreground"
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

// ========== MAIN COMPONENT ==========
export default function TenantSignup() {
  const [activeSection, setActiveSection] =
    useState<TENANT_SIGNUP_SECTION_TYPE>(TENANT_SIGNUP_SECTION_TYPE.CONTACT);

  const signUpMutation = useSignUpMutation();

  const router = useRouter();

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: {
      businessName: "b name",
      businessType: BUSINESS_TYPE_OPTIONS[0].value,
      businessDescription: "b description",
      businessWebsite: "",
      taxId: "123456789",
      firstName: "Nesredin",
      lastName: "Ge",
      title: "Developer",
      email: "nesru@gmail.com",
      phone: "0912345678",
      secondaryEmail: "",
      secondaryPhone: "",
      password: "12345678",
      confirmPassword: "12345678",
      termsAccepted: true,
      marketingOptIn: false,
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
        fieldsToValidate = ["firstName", "lastName", "title", "email", "phone"];
        break;

      case TENANT_SIGNUP_SECTION_TYPE.BUSINESS:
        fieldsToValidate = ["businessName", "businessType", "taxId"];
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
        return ["firstName", "lastName", "title", "email", "phone"];
      case TENANT_SIGNUP_SECTION_TYPE.BUSINESS:
        return ["businessName", "businessType"];
      case TENANT_SIGNUP_SECTION_TYPE.ACCOUNT:
        return ["password", "confirmPassword", "termsAccepted"];
      default:
        return [];
    }
  };

  async function onSubmit(values: TenantFormValues) {
    try {
      // Handle auth here
      await signUpMutation.mutateAsync({
        userID: Math.random().toString(),
        phoneNumber: values.phone,
        userType: USER_TYPE.TENANT,
      });
      signUp(values, USER_TYPE.TENANT);
      successToast("", {
        title: "Account created!",
        description: "You've successfully created your tenant account.",
      });
      form.reset();

      router.push("/dashboard");
    } catch (error) {
      let message = "";
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = "There was a problem creating your account.";
      }
      errorToast("", {
        title: "Sign Up Error",
        description: message,
      });
    }
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
