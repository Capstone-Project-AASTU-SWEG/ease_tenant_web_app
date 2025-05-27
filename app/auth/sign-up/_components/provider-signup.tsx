"use client";

import { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";

import { errorToast, successToast } from "@/components/custom/toasts";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles, Building } from "lucide-react";
import Image from "next/image";
import ASSETS from "../../_assets";
import BackButton from "./back-btn";
import SubmitButton from "./submit-btn";
import {
  EmailFormField,
  NumberFormField,
  SelectFormField,
  TextareaFormField,
  TextFormField,
} from "@/components/custom/form-field";
import Stack from "@/components/custom/stack";
import { Group } from "@/components/custom/group";
import { FileUploader } from "@/components/custom/file-upload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ChapaPayment from "@/components/custom/chapa/chapa-payment";
import { genUUID } from "@/utils";
import { useCreateServiceProvidersMutation } from "@/app/quries/useServiceProviders";
import { useGetAllBuildingsQuery } from "@/app/quries/useBuildings";

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
    buildingId: z.string().min(2, { message: "Building info is required." }),
    businessName: z
      .string()
      .min(2, { message: "Business name must be at least 2 characters." }),
    firstName: z
      .string()
      .min(2, { message: "Contact first name must be at least 2 characters." }),
    lastName: z
      .string()
      .min(2, { message: "Contact last must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    phone: z
      .string()
      .min(10, { message: "Please enter a valid phone number." }),
    businessAddress: z.string(),
    serviceType: z
      .string()
      .min(1, { message: "Please select a service type." }),
    servicePrice: z.coerce.number(),

    serviceDescription: z.string().min(10, {
      message: "Please provide a brief description of your services.",
    }),
    website: z.string().optional(),
    taxId: z.string().min(5, { message: "Please enter a valid tax ID." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ProviderSignup() {
  const [images, setImages] = useState<File[]>([]);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<z.infer<
    typeof providerFormSchema
  > | null>(null);

  const getAllBuildingsQuery = useGetAllBuildingsQuery();
  const buildings = getAllBuildingsQuery.data;

  const [tx, setTx] = useState(() => {
    return genUUID("tx-");
  });

  const createServiceProvidersMutation = useCreateServiceProvidersMutation();

  const form = useForm<z.infer<typeof providerFormSchema>>({
    resolver: zodResolver(providerFormSchema),
    defaultValues: {
      buildingId: "",
      businessName: "",
      firstName: "",
      lastName: "",
      servicePrice: 10,
      email: "",
      phone: "",
      businessAddress: "",
      serviceType: "",
      serviceDescription: "",
      website: "",
      taxId: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit() {
    setIsPaymentOpen(true);
  }

  const handleSuccessfulPayment = async () => {
    const values = form.getValues();

    // Store the submitted data for preview
    setSubmittedData(values);

    const formData = new FormData();
    formData.append("buildingId", values.buildingId);
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("password", values.password);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("businessName", values.businessName);
    formData.append("businessAddress", values.businessAddress);
    formData.append("taxId", values.taxId);
    formData.append("website", values?.website || "");
    formData.append("serviceType", values.serviceType);
    formData.append("servicePrice", values.servicePrice.toString());
    formData.append("serviceDescription", values.serviceDescription);

    if (images.length > 0) {
      images.forEach((img) => {
        formData.append("images", img);
      });
    }

    createServiceProvidersMutation.mutate(formData);
    form.reset();

    // Close payment dialog and show preview
    setIsPaymentOpen(false);
    setIsPreviewOpen(true);
  };

  useEffect(() => {
    if (createServiceProvidersMutation.isSuccess) {
      successToast("", {
        title: "Account created!",
        description:
          "You've successfully created your service provider account.",
      });
    }
  }, [createServiceProvidersMutation.isSuccess]);

  useEffect(() => {
    if (createServiceProvidersMutation.isError) {
      errorToast("", {
        title: "Error",
        description:
          createServiceProvidersMutation.error.message ||
          "There was a problem creating your account.",
      });
    }
  }, [
    createServiceProvidersMutation.error?.message,
    createServiceProvidersMutation.isError,
  ]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <BackButton />

      {/* Left Column - Background Image */}
      <div className="relative hidden h-screen md:block md:w-1/2">
        <div className="absolute inset-0">
          <Image
            src={ASSETS.IMAGES.BUILDING_IMAGE || "/placeholder.svg"}
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

      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogHeader>
          <DialogTitle />
        </DialogHeader>

        <DialogContent>
          <ChapaPayment
            amount={10}
            currency="ETB"
            onClose={() => {}}
            txRef={tx}
            onSuccessfulPayment={() => {
              handleSuccessfulPayment();
            }}
            setNewTxRef={() => {
              setTx(genUUID("tx-"));
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-primary" />
              Registration Successful!
            </DialogTitle>
          </DialogHeader>

          {submittedData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="font-medium text-green-800">
                  🎉 Welcome to our service provider network! {`Here's`} a
                  summary of your registration:
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Business Information */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="space-y-4"
                >
                  <h3 className="border-b pb-2 text-lg font-semibold text-primary">
                    Business Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Contact Person
                      </label>
                      <p className="font-medium">
                        {submittedData.firstName} {submittedData.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Business Name
                      </label>
                      <p className="font-medium">
                        {submittedData.businessName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Business Address
                      </label>
                      <p className="font-medium">
                        {submittedData.businessAddress}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Tax ID
                      </label>
                      <p className="font-medium">{submittedData.taxId}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="space-y-4"
                >
                  <h3 className="border-b pb-2 text-lg font-semibold text-primary">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Email
                      </label>
                      <p className="font-medium">{submittedData.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Phone
                      </label>
                      <p className="font-medium">{submittedData.phone}</p>
                    </div>
                    {submittedData.website && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Website
                        </label>
                        <p className="font-medium text-blue-600">
                          {submittedData.website}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Service Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="space-y-4"
              >
                <h3 className="border-b pb-2 text-lg font-semibold text-primary">
                  Service Details
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Service Type
                    </label>
                    <p className="font-medium capitalize">
                      {submittedData.serviceType}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Service Price
                    </label>
                    <p className="font-medium">
                      {submittedData.servicePrice} ETB
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Images Uploaded
                    </label>
                    <p className="font-medium">{images.length} image(s)</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Service Description
                  </label>
                  <p className="mt-1 rounded-md bg-gray-50 p-3 font-medium">
                    {submittedData.serviceDescription}
                  </p>
                </div>
              </motion.div>

              {/* Images */}
              <Stack spacing={"md"}>
                <label className="text-sm font-medium text-muted-foreground">
                  Service Images
                </label>
                <section className="relative h-[20rem] px-4">
                  {images.map((img, ind) => {
                    const objURL = URL.createObjectURL(img);
                    return (
                      <Image
                        className="rounded-lg object-cover"
                        alt="product image"
                        src={objURL}
                        key={ind}
                        fill
                      />
                    );
                  })}
                </section>
              </Stack>

              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="rounded-lg border border-blue-200 bg-blue-50 p-4"
              >
                <h4 className="mb-2 font-semibold text-blue-900">
                  {`What's`} Next?
                </h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Your account is being reviewed by our team</li>
                  <li>
                    • {`You'll`} receive a confirmation email within 24 hours
                  </li>
                  <li>
                    • Once approved, you can start receiving service requests
                  </li>
                  <li>• Check your dashboard for new opportunities</li>
                </ul>
              </motion.div>

              <div className="flex justify-end gap-3 pt-4">
                <Button onClick={() => setIsPreviewOpen(false)}>Close</Button>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>

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
              className="flex flex-col gap-6"
            >
              <motion.div
                initial="hidden"
                animate="visible"
                variants={contentVariants}
              >
                <Card className="border-none shadow-none">
                  <CardContent className="p-0">
                    <div className="space-y-10">
                      {/* Select building info */}
                      <SelectFormField
                        control={form.control}
                        name="buildingId"
                        label="Select building"
                        options={
                          buildings?.map((b) => ({
                            label: b.name,
                            value: b.id,
                          })) || []
                        }
                      />
                      {/* Contact Information Section */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold">
                          Contact Information
                        </h3>
                        <Stack>
                          <Group align={"start"} spacing={"lg"}>
                            <TextFormField
                              control={form.control}
                              name="firstName"
                              label="First Name"
                            />
                            <TextFormField
                              control={form.control}
                              name="lastName"
                              label="Last Name"
                            />
                          </Group>
                          <Group className="grid gap-4 sm:grid-cols-2">
                            <EmailFormField
                              control={form.control}
                              name="email"
                              label="Email"
                            />

                            <TextFormField
                              control={form.control}
                              name="phone"
                              label="Phone Number"
                            />
                          </Group>

                          <TextFormField
                            control={form.control}
                            name="website"
                            label="Website (Optional)"
                          />
                        </Stack>
                      </div>
                      {/* Business Information Section */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold">
                          Business Information
                        </h3>
                        <Stack>
                          <TextFormField
                            control={form.control}
                            name="businessName"
                            label="Business Name"
                          />

                          <TextFormField
                            control={form.control}
                            name="businessAddress"
                            label="Business Address"
                          />

                          <TextFormField
                            control={form.control}
                            name="taxId"
                            label="Tax ID"
                          />
                        </Stack>
                      </div>

                      {/* Service Details Section */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold">
                          Service Details
                        </h3>
                        <Stack>
                          <SelectFormField
                            label="Service Type"
                            control={form.control}
                            name="serviceType"
                            options={[
                              {
                                label: "Cleaning Services",
                                value: "cleaning",
                              },
                              {
                                label: "Plumbing Services",
                                value: "plumbing",
                              },
                              {
                                label: "HVAC Services",
                                value: "hvac",
                              },
                              {
                                label: "Landscaping Services",
                                value: "landscaping",
                              },
                              {
                                label: "Security Services",
                                value: "security",
                              },
                              {
                                label: "Pest Control",
                                value: "pest",
                              },
                              {
                                label: "Renovation Services",
                                value: "renovation",
                              },
                              {
                                label: "Other Services",
                                value: "other",
                              },
                            ]}
                          />

                          <NumberFormField
                            control={form.control}
                            name="servicePrice"
                            label="Service Price"
                          />

                          <TextareaFormField
                            control={form.control}
                            name="serviceDescription"
                            label="Service Description"
                          />

                          <section>
                            <FileUploader
                              onFilesChange={(files) => {
                                setImages(files);
                              }}
                              label="Upload Service/Product Images"
                              acceptedFormats={[
                                "image/png",
                                "image/jpg",
                                "image/jpeg",
                              ]}
                            />
                          </section>
                        </Stack>
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
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <SubmitButton
                          text="Submit Service Info"
                          isSubmitting={false}
                        />
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
