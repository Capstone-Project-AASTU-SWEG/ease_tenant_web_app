"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Edit3,
  Send,
  Clock,
  AlertCircle,
  CreditCard,
  Download,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PageWrapper from "@/components/custom/page-wrapper";
import PageHeader from "@/components/custom/page-header";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import {
  type SignatureLine,
  SignaturePad,
} from "@/components/custom/signature-pad";
import { useSearchParams } from "next/navigation";
import { PageError } from "@/components/custom/page-error";
import {
  useCreateContractMutation,
  useGetLeaseQuery,
} from "@/app/quries/useLeases";
import { PageLoader } from "@/components/custom/page-loader";
import LeasePDFGenerator from "@/components/custom/lease-pdf-generator";
import { generateLeaseDataValues } from "@/utils/lease-data-mapper";
import type {
  Lease,
  LeaseTemplate,
  RentalApplication,
  Tenant,
  Unit,
} from "@/types";
import { Steps, Step } from "@/components/custom/steps";

import { format } from "date-fns";
import { useGetBuildingQuery } from "../quries/useBuildings";
import { ErrorDisplay } from "@/components/custom/error-display";
import ChapaPayment from "@/components/custom/chapa/chapa-payment";
import { genUUID, getFullFileURL } from "@/utils";
import { warningToast } from "@/components/custom/toasts";

// Define the schema for lease response
const rejectLeaseSchema = z.object({
  reason: z.string().min(1, "Please select a reason"),
  comments: z.string().optional(),
});

// Define the schema for payment
const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(16, "Card number must be at least 16 digits")
    .max(19, "Card number must not exceed 19 digits"),
  cardHolder: z.string().min(3, "Cardholder name is required"),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiry date (MM/YY)"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});

type RejectLeaseFormData = z.infer<typeof rejectLeaseSchema>;
type PaymentFormData = z.infer<typeof paymentSchema>;

type LeaseStatus = "pending" | "signed" | "rejected" | "expired" | "paid";

const Page = () => {
  const [leaseStatus, setLeaseStatus] = useState<LeaseStatus>("pending");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [signatureData, setSignatureData] = useState<{
    svg: string;
    points: SignatureLine[];
    isEmpty: boolean;
  }>({
    svg: "",
    points: [],
    isEmpty: true,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const [txRef, setTxRef] = useState(() => genUUID("tx-"));

  // Form for rejection reasons
  const rejectForm = useForm<RejectLeaseFormData>({
    resolver: zodResolver(rejectLeaseSchema),
    defaultValues: {
      reason: "",
      comments: "",
    },
  });

  // Form for payment
  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const handleCreatingNewTX = useCallback(() => {
    setTxRef(genUUID("tx-"));
  }, []);
  const searchParams = useSearchParams();
  const leaseId = searchParams.get("leaseId") as string;

  const getLeaseQuery = useGetLeaseQuery(leaseId);

  const createContractMutation = useCreateContractMutation();

  const lease = getLeaseQuery.data as Lease & {
    tenant: Tenant;
    unit: Unit;
    application: RentalApplication;
    leaseTemplate: LeaseTemplate;
  };

  const getBuildingQuery = useGetBuildingQuery(lease?.unit.buildingId);
  const manager = getBuildingQuery.data?.manager;

  const isSigned = !!lease?.finalContractFile;

  const tenant = lease?.tenant;

  if (getLeaseQuery.isPending) {
    return (
      <PageLoader isLoading={true} variant={"card"} loaderVariant={"dots"} />
    );
  }

  if (getLeaseQuery.isError) {
    return (
      <PageError
        title={"Lease not found"}
        description={getLeaseQuery.error.message}
        variant={"404"}
        fullPage
      />
    );
  }
  if (!lease) {
    return null;
  }

  if (!leaseId) {
    return <PageError message={"Lease info not provided."} variant={"403"} />;
  }

  const handleReject = (data: RejectLeaseFormData) => {
    console.log("Lease rejected:", data);
    setLeaseStatus("rejected");
    setShowRejectDialog(false);
  };

  // Handle signature change
  const handleSignatureChange = (data: {
    svg: string;
    points: SignatureLine[];
    isEmpty: boolean;
  }) => {
    setSignatureData(data);
    if (!data.isEmpty) {
    }
  };

  const handleSignAndAccept = async () => {
    if (signatureData.isEmpty) {
      alert("Please sign the document before proceeding");
      return;
    }
    setCurrentStep(1);
    setShowPaymentDialog(true);
  };

  const handlePaymentSubmit = async () => {
    // TODO: API REQUEST TO SEND SUCCESSFULL CONTRACT
    if (!pdfBlob) {
      warningToast("Contract pdf not provided.");
      return;
    }

    createContractMutation.mutate({
      leaseId,
      signedContractFile: pdfBlob,
      tenantSignature: signatureData.svg,
      txRef,
    });
  };

  const handlePdfGenerated = (blob: Blob) => {
    setPdfBlob(blob);
  };

  const downloadSignedPdf = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${lease?.leaseTemplate?.name || "Lease"}_signed.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  if (!lease) {
    return null;
  }

  if (isSigned) {
    const downloadFinalPdf = () => {
      if (lease.finalContractFile) {
        const link = document.createElement("a");
        link.href = getFullFileURL(lease.finalContractFile);
        link.download = `${lease?.leaseTemplate?.name || "Lease"}_Final_Signed.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

    return (
      <PageWrapper className="py-0">
        <PageHeader
          title="Lease Agreement - Completed"
          description="Your lease has been successfully signed and finalized"
          withBackButton
        />

        <div className="">
          {/* Success Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 overflow-hidden rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <CheckCircle className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  Lease Successfully Completed!
                </h1>
                <p className="mt-1 text-green-100">
                  Your lease agreement has been signed by all parties and is now
                  active.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            {/* Main Content */}
            <div className="space-y-6">
              {/* Lease Details Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="overflow-hidden border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <FileText className="h-6 w-6 text-primary" />
                      Lease Agreement Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Property
                          </label>
                          <p className="text-lg font-semibold">
                            {lease.unit.unitNumber}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Lease Term
                          </label>
                          <p className="text-lg font-semibold">
                            {lease.application.leaseDetails.requestedDuration}{" "}
                            months
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Monthly Rent
                          </label>
                          <p className="text-lg font-semibold text-primary">
                            ${lease.unit.monthlyRent.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Start Date
                          </label>
                          <p className="text-lg font-semibold">
                            {format(
                              new Date(
                                lease.application.leaseDetails.requestedStartDate,
                              ),
                              "MMM d, yyyy",
                            )}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            End Date
                          </label>
                          <p className="text-lg font-semibold">
                            {format(
                              new Date(
                                new Date(
                                  lease.application.leaseDetails.requestedStartDate,
                                ).setMonth(
                                  new Date(
                                    lease.application.leaseDetails.requestedStartDate,
                                  ).getMonth() +
                                    lease.application.leaseDetails
                                      .requestedDuration,
                                ),
                              ),
                              "MMM d, yyyy",
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Signatures Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="overflow-hidden border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Edit3 className="h-6 w-6 text-primary" />
                      Digital Signatures
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Tenant Signature */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-muted-foreground">
                          Tenant Signature
                        </label>
                        <div className="rounded-lg border-2 border-green-200 bg-green-50/50 p-4 dark:border-green-800 dark:bg-green-900/20">
                          {lease.tenant.signature && (
                            <div
                              className="flex h-16 items-center justify-center"
                              dangerouslySetInnerHTML={{
                                __html: lease.tenant.signature,
                              }}
                            />
                          )}
                          <div className="mt-2 flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                            <CheckCircle className="h-4 w-4" />
                            <span>
                              Signed by {tenant.firstName} {tenant.lastName}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Manager Signature */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-muted-foreground">
                          Manager/Landlord Signature
                        </label>
                        <div className="rounded-lg border-2 border-green-200 bg-green-50/50 p-4 dark:border-green-800 dark:bg-green-900/20">
                          {manager?.signature && (
                            <div
                              className="flex h-16 items-center justify-center"
                              dangerouslySetInnerHTML={{
                                __html: manager.signature,
                              }}
                            />
                          )}
                          <div className="mt-2 flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                            <CheckCircle className="h-4 w-4" />
                            <span>Signed by Property Manager</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          Agreement finalized on{" "}
                          {format(
                            new Date(lease.updatedAt || lease.createdAt),
                            "PPP 'at' p",
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar Actions */}
            <div className="space-y-6">
              {/* Download Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="overflow-hidden border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Download className="h-5 w-5 text-primary" />
                      Download Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Button
                        onClick={downloadFinalPdf}
                        className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80 transition-all hover:from-primary/90 hover:to-primary"
                        size="lg"
                      >
                        <Download className="h-5 w-5" />
                        Download Final Signed Lease
                      </Button>

                      <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
                        <p className="text-xs text-muted-foreground">
                          This document contains all signatures and is legally
                          binding. Keep this copy for your records.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Status Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="overflow-hidden border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                    <CardTitle className="flex items-center gap-2 text-lg text-green-700 dark:text-green-400">
                      <CheckCircle className="h-5 w-5" />
                      Lease Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-green-700 dark:text-green-400">
                            Active Lease
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-500">
                            All parties have signed
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Lease ID:
                          </span>
                          <span className="font-mono">
                            {leaseId.substring(0, 8)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            Completed
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Next Steps Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="overflow-hidden border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <AlertCircle className="h-5 w-5 text-primary" />
                      Next Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                        <p>Keep a copy of your signed lease agreement</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                        <p>
                          Property access will be available on your start date
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                        <p>Contact property management for any questions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="py-0">
      <PageHeader
        title="Lease Agreement"
        description="Review, sign, and complete payment for your commercial property lease"
        withBackButton
      />

      {/* <LogJSON
        data={{
          manager,
          abc: lease?.application?.building?.managerId,
          li: lease.unit.buildingId,
        }}
      /> */}

      {/* Progress Steps */}
      <div className="mb-8 mt-4">
        <Steps currentStep={currentStep} className="mx-auto max-w-3xl">
          <Step
            title="Review & Sign"
            description="Review lease terms and add your signature"
          />
          <Step
            title="Payment"
            description="Complete security deposit payment"
          />
          <Step
            title="Confirmation"
            description="Receive your signed lease copy"
          />
        </Steps>
      </div>

      {/* Status Badge */}
      <div className="mb-6 flex items-center justify-between">
        <StatusBadge status={leaseStatus} />
        <div className="text-sm text-muted-foreground">
          Lease ID: <span className="font-mono">{leaseId.substring(0, 8)}</span>
        </div>
      </div>

      <main className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-[3fr_2fr]">
        {/* Lease Agreement Column */}
        {manager ? (
          <LeasePDFGenerator
            dataValues={generateLeaseDataValues(lease.application)}
            leaseTitle={lease.leaseTemplate.name}
            leaseDescription={lease.leaseTemplate.description}
            sections={lease.leaseTemplate.sections}
            generateOnMount={true}
            showPreview={true}
            onPdfGenerated={handlePdfGenerated}
            tenantSignature={signatureData.svg}
            managerSignature={manager?.signature}
          />
        ) : (
          <ErrorDisplay message="Manager info not found" />
        )}

        {/* Actions Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col gap-6"
        >
          {/* Lease Summary Card */}
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 shadow-md dark:from-slate-900 dark:to-slate-800">
            <CardHeader className="border-b bg-slate-50/50 pb-3 dark:bg-slate-800/50">
              <CardTitle className="flex items-center text-lg">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Lease Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Property:</p>
                    <p className="font-medium">{lease.unit.unitNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Term:</p>
                    <p className="font-medium">
                      {lease.application.leaseDetails.requestedDuration} months
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Monthly Rent:</p>
                    <p className="font-medium">
                      ${lease.unit.monthlyRent.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Security Deposit:</p>
                    <p className="font-medium">
                      ${(lease.unit.monthlyRent * 2).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Start Date:</p>
                    <p className="font-medium">
                      {format(
                        new Date(
                          lease.application.leaseDetails.requestedStartDate,
                        ),
                        "MMM d, yyyy",
                      )}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">End Date:</p>
                    <p className="font-medium">
                      {format(
                        new Date(
                          new Date(
                            lease.application.leaseDetails.requestedStartDate,
                          ).setMonth(
                            new Date(
                              lease.application.leaseDetails.requestedStartDate,
                            ).getMonth() +
                              lease.application.leaseDetails.requestedDuration,
                          ),
                        ),
                        "MMM d, yyyy",
                      )}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-primary/5 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Due Now:</span>
                    <span className="text-lg font-semibold text-primary">
                      ${(lease.unit.monthlyRent * 2).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Security deposit + first {`month's`} rent
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Signature Card */}
          <Card className="overflow-hidden border-0 shadow-md">
            <CardHeader className="border-b bg-slate-50/50 pb-3 dark:bg-slate-800/50">
              <CardTitle className="flex items-center text-lg">
                <Edit3 className="mr-2 h-5 w-5 text-primary" />
                Tenant Signature
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              {leaseStatus === "paid" || leaseStatus === "signed" ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="rounded-md border bg-white p-4 dark:bg-slate-950">
                    {signatureData.svg && (
                      <div
                        className="h-24 w-full"
                        dangerouslySetInnerHTML={{ __html: signatureData.svg }}
                      />
                    )}
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-500">
                    Signed on {format(new Date(), "MMM d, yyyy")}
                  </p>
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card className="overflow-hidden border-0 shadow-md">
            <CardHeader className="border-b bg-slate-50/50 pb-3 dark:bg-slate-800/50">
              <CardTitle className="flex items-center text-lg">
                <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="flex flex-col gap-3">
                {leaseStatus === "pending" && (
                  <>
                    <Button
                      className="gap-2 bg-gradient-to-r from-primary to-primary/80 transition-all hover:from-primary/90 hover:to-primary"
                      onClick={handleSignAndAccept}
                      disabled={signatureData.isEmpty}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Sign & Accept Lease
                    </Button>

                    <Dialog
                      open={showRejectDialog}
                      onOpenChange={setShowRejectDialog}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <XCircle className="h-4 w-4" />
                          Request Lease Modification
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="w-[60%] sm:max-w-lg">
                        <DialogHeader>
                          <DialogTitle>
                            Lease Modification Agreement
                          </DialogTitle>
                        </DialogHeader>

                        <Form {...rejectForm}>
                          <form
                            onSubmit={rejectForm.handleSubmit(handleReject)}
                            className="space-y-4"
                          >
                            <FormField
                              control={rejectForm.control}
                              name="reason"
                              render={({ field }) => (
                                <FormItem className="space-y-3">
                                  <FormLabel>Reason for rejection</FormLabel>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="space-y-1"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                          value="terms"
                                          id="terms"
                                        />
                                        <Label htmlFor="terms">
                                          Lease terms unsatisfactory
                                        </Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                          value="rent"
                                          id="rent"
                                        />
                                        <Label htmlFor="rent">
                                          Rent too high
                                        </Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                          value="space"
                                          id="space"
                                        />
                                        <Label htmlFor="space">
                                          Space no longer needed
                                        </Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                          value="other"
                                          id="other"
                                        />
                                        <Label htmlFor="other">Other</Label>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={rejectForm.control}
                              name="comments"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Additional Comments</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Please provide any additional details about your decision..."
                                      className="resize-none"
                                      {...field}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <DialogFooter>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowRejectDialog(false)}
                              >
                                Cancel
                              </Button>
                              <Button type="submit" variant="destructive">
                                Submit Rejection
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="ghost"
                      className="gap-2 text-muted-foreground"
                    >
                      <Send className="h-4 w-4" />
                      Request Modifications
                    </Button>
                  </>
                )}

                {leaseStatus === "paid" && (
                  <>
                    <div className="rounded-md bg-green-50 p-4 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-green-100 p-1 dark:bg-green-800">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium">
                            Lease Successfully Signed & Paid
                          </p>
                          <p className="mt-1 text-sm">
                            Payment of $
                            {(lease.unit.monthlyRent * 2).toLocaleString()}{" "}
                            processed successfully.
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10"
                      onClick={downloadSignedPdf}
                    >
                      <Download className="h-4 w-4" />
                      Download Signed Copy
                    </Button>
                  </>
                )}

                {leaseStatus === "rejected" && (
                  <>
                    <div className="rounded-md bg-red-50 p-3 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                      <p className="flex items-center gap-2 text-sm font-medium">
                        <XCircle className="h-4 w-4" />
                        Lease rejected
                      </p>
                      <p className="mt-1 text-xs">
                        The landlord has been notified of your decision.
                      </p>
                    </div>
                    <Button variant="outline" className="gap-2">
                      <Edit3 className="h-4 w-4" />
                      Request New Terms
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <CreditCard className="h-5 w-5 text-primary" />
              Complete Payment
            </DialogTitle>
          </DialogHeader>

          <section>
            {showPaymentDialog && (
              <ChapaPayment
                txRef={txRef}
                setNewTxRef={handleCreatingNewTX}
                onSuccessfulPayment={handlePaymentSubmit}
                amount={100}
                currency="ETB"
                onClose={() => {}}
                user={{
                  id: tenant.id,
                  email: tenant.email,
                  firstName: tenant.firstName,
                  lastName: tenant.lastName,
                  phone: tenant.phone,
                }}
              />
            )}
          </section>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">Payment Successful!</h2>
            <p className="mb-6 text-muted-foreground">
              Your lease has been signed and payment of $
              {(lease?.unit?.monthlyRent * 2).toLocaleString()} has been
              processed successfully.
            </p>

            <div className="mb-6 w-full rounded-lg bg-slate-50 p-4 text-left">
              <h3 className="mb-2 font-medium">Transaction Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-mono">
                  TXN{Math.random().toString(36).substring(2, 10).toUpperCase()}
                </span>
                <span className="text-muted-foreground">Date:</span>
                <span>{format(new Date(), "MMM d, yyyy, h:mm a")}</span>
                <span className="text-muted-foreground">Amount:</span>
                <span>${(lease?.unit?.monthlyRent * 2).toLocaleString()}</span>
                <span className="text-muted-foreground">Payment Method:</span>
                <span>
                  Credit Card (****
                  {paymentForm.getValues().cardNumber.slice(-4)})
                </span>
              </div>
            </div>

            <div className="flex w-full gap-3">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => {
                  setShowSuccessDialog(false);
                }}
              >
                Close
              </Button>
              <Button className="flex-1 gap-2" onClick={downloadSignedPdf}>
                <Download className="h-4 w-4" />
                Download Lease
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
};

const StatusBadge = ({ status }: { status: LeaseStatus }) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        status === "pending" &&
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500",
        status === "signed" &&
          "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500",
        status === "paid" &&
          "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500",
        status === "rejected" &&
          "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500",
        status === "expired" &&
          "bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-400",
      )}
    >
      {status === "pending" && <Clock className="h-3 w-3" />}
      {status === "signed" && <CheckCircle2 className="h-3 w-3" />}
      {status === "paid" && <CheckCircle2 className="h-3 w-3" />}
      {status === "rejected" && <XCircle className="h-3 w-3" />}
      {status === "expired" && <AlertCircle className="h-3 w-3" />}

      <span>
        {status === "pending" && "Pending Signature"}
        {status === "signed" && "Signed"}
        {status === "paid" && "Paid & Signed"}
        {status === "rejected" && "Rejected"}
        {status === "expired" && "Expired"}
      </span>
    </div>
  );
};

export default Page;
