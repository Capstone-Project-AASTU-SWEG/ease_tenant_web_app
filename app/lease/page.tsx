"use client";

import { useState } from "react";
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
  Lock,
  Download,
  ChevronRight,
  Shield,
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { SignatureLine, SignaturePad } from "@/components/custom/signature-pad";
import { useSearchParams } from "next/navigation";
import { PageError } from "@/components/custom/page-error";
import { useGetLeaseQuery } from "@/app/quries/useLeases";
import { PageLoader } from "@/components/custom/page-loader";
import LeasePDFGenerator from "@/components/custom/lease-pdf-generator_v2";
import { generateLeaseDataValues } from "@/utils/lease-data-mapper";
import { Lease, LeaseTemplate, RentalApplication, Tenant, Unit } from "@/types";
import { Steps, Step } from "@/components/custom/steps";

import { format } from "date-fns";
import { chapaCheckout } from "@/lib/chapa";

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

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

  const searchParams = useSearchParams();
  const leaseId = searchParams.get("leaseId") as string;

  const getLeaseQuery = useGetLeaseQuery(leaseId);

  const lease = getLeaseQuery.data as Lease & {
    tenant: Tenant;
    unit: Unit;
    application: RentalApplication;
    leaseTemplate: LeaseTemplate;
  };

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

  if (!leaseId) {
    return <PageError message={"Lease Id not found"} variant={"403"} />;
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

    const result = await chapaCheckout({
      amount: lease.unit.monthlyRent + "",
      description: "ertyui",
      email: "nesru@gmail.com",
      first_name: "djakdjka dja",
      last_name: "jfklajdkf akdjfa",
      return_url: "http://localhost:3000",
      title: "djfakldjfkaj",
    });

    console.log({ result });
  };

  const handlePaymentSubmit = async (data: PaymentFormData) => {
    setIsProcessing(true);

    try {
      // Simulate API call to Chapa payment gateway
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Payment processed:", data);
      setShowPaymentDialog(false);
      setLeaseStatus("paid");
      setCurrentStep(2);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setIsProcessing(false);
    }
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

  return (
    <PageWrapper className="py-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageHeader
          title="Lease Agreement"
          description="Review, sign, and complete payment for your commercial property lease"
          withBackButton
        />
      </motion.div>

      {/* Progress Steps */}
      <div className="mb-8 mt-6">
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
        <LeasePDFGenerator
          dataValues={generateLeaseDataValues(lease.application)}
          leaseTitle={lease.leaseTemplate.name}
          leaseDescription={lease.leaseTemplate.description}
          sections={lease.leaseTemplate.sections}
          generateOnMount={false}
          showPreview={true}
          onPdfGenerated={handlePdfGenerated}
          signatureData={signatureData.svg}
        />

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

          <div className="mt-2 rounded-lg bg-primary/5 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Security Deposit + First Month
              </span>
              <span className="text-lg font-semibold text-primary">
                ${(lease?.unit?.monthlyRent * 2).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="my-2 flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              <Lock className="h-3 w-3" />
              Secured by Chapa Payment
            </div>
          </div>

          <Form {...paymentForm}>
            <form
              onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)}
              className="space-y-4"
            >
              <FormField
                control={paymentForm.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        {...field}
                        onChange={(e) => {
                          // Format card number with spaces
                          const value = e.target.value.replace(/\s/g, "");
                          const formattedValue = value.replace(
                            /(\d{4})(?=\d)/g,
                            "$1 ",
                          );
                          field.onChange(formattedValue);
                        }}
                        maxLength={19}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={paymentForm.control}
                name="cardHolder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cardholder Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={paymentForm.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="MM/YY"
                          {...field}
                          onChange={(e) => {
                            // Format expiry date
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length <= 2) {
                              field.onChange(value);
                            } else {
                              field.onChange(
                                `${value.slice(0, 2)}/${value.slice(2, 4)}`,
                              );
                            }
                          }}
                          maxLength={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={paymentForm.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="123"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            field.onChange(value);
                          }}
                          maxLength={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="rounded-lg bg-slate-50 p-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Your payment information is encrypted and secure</span>
                </div>
              </div>

              <Separator />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPaymentDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="gap-2 bg-gradient-to-r from-primary to-primary/80 transition-all hover:from-primary/90 hover:to-primary"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      Pay ${(lease?.unit?.monthlyRent * 2).toLocaleString()}
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
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
