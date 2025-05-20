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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
import Image from "next/image";
import { SignatureLine, SignaturePad } from "@/components/custom/signature-pad";

// Define the schema for lease response
const rejectLeaseSchema = z.object({
  reason: z.string().min(1, "Please select a reason"),
  comments: z.string().optional(),
});

type RejectLeaseFormData = z.infer<typeof rejectLeaseSchema>;

// Sample lease agreement
const LEASE_AGREEMENT = `
COMMERCIAL PROPERTY LEASE AGREEMENT

BETWEEN:
[LANDLORD NAME] ("Landlord")

AND:
[TENANT NAME] ("Tenant")

FOR PROPERTY:
[ADDRESS]

TERM:
This lease shall commence on [START DATE] and terminate on [END DATE], unless extended or terminated earlier as provided herein.

1. RENT
   Tenant agrees to pay monthly rent of $[AMOUNT] due on the first day of each month.
   
2. SECURITY DEPOSIT
   Tenant shall deposit $[AMOUNT] as security for the faithful performance of this lease.
   
3. USE OF PREMISES
   The premises shall be used for [PERMITTED USE] purposes only.
   
4. UTILITIES
   Tenant shall be responsible for payment of all utilities, including electricity, water, gas, telephone, internet, and waste disposal.
   
5. MAINTENANCE
   a. Landlord shall maintain the structural elements of the building, including the roof and exterior walls.
   b. Tenant shall maintain the interior of the premises and all fixtures therein.
   
6. ALTERATIONS
   Tenant shall not make alterations without prior written consent of Landlord.
   
7. INSURANCE
   Tenant shall maintain liability insurance of not less than $1,000,000 per occurrence.
   
8. DEFAULT
   If Tenant fails to pay rent when due or breaches any other term, Landlord may terminate this lease.
   
9. ASSIGNMENT AND SUBLETTING
   Tenant shall not assign or sublet without prior written consent of Landlord.
   
10. ACCESS
    Landlord may enter premises at reasonable times to inspect, make repairs, or show premises to prospective tenants.
    
11. SIGNAGE
    Tenant shall not install exterior signage without prior approval from Landlord.
    
12. PARKING
    Tenant is entitled to [NUMBER] parking spaces in the building's parking area.
    
13. GOVERNING LAW
    This lease shall be governed by the laws of [STATE/COUNTRY].
    
14. ENTIRE AGREEMENT
    This lease contains the entire agreement between the parties.

IN WITNESS WHEREOF, the parties have executed this lease as of the date first written above.

_____________________
Landlord

_____________________
Tenant
`;

type LeaseStatus = "pending" | "signed" | "rejected" | "expired";

const Page = () => {
  const [leaseStatus, setLeaseStatus] = useState<LeaseStatus>("pending");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [signatureData, setSignatureData] = useState<{
    svg: string;
    points: SignatureLine[];
    isEmpty: boolean;
  }>({
    svg: "",
    points: [],
    isEmpty: true,
  });
  const [isSignatureSaved, setIsSignatureSaved] = useState(false);

  // Form for rejection reasons
  const form = useForm<RejectLeaseFormData>({
    resolver: zodResolver(rejectLeaseSchema),
    defaultValues: {
      reason: "",
      comments: "",
    },
  });

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
      setIsSignatureSaved(false);
    }
  };

  return (
    <PageWrapper className="py-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageHeader
          title="Lease Agreement"
          description="Review and sign your commercial property lease"
          withBackButton
        />
      </motion.div>

      {/* Status Badge */}
      <div className="mb-6 mt-4">
        <StatusBadge status={leaseStatus} />
      </div>

      <main className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-[3fr_2fr]">
        {/* Lease Agreement Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="overflow-hidden shadow-md">
            <div className="flex items-center justify-between bg-slate-50 px-6 py-4 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Lease Document</h3>
              </div>
              <span className="text-sm text-muted-foreground">
                Reference: LM-2023-1045
              </span>
            </div>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-16rem)] max-h-[calc(100vh-16rem)]">
                <div className="whitespace-pre-wrap p-6 font-mono text-sm">
                  {LEASE_AGREEMENT}
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col gap-6"
        >
          {/* Lease Summary Card */}
          <Card className="shadow-md">
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-medium">Lease Summary</h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Property:</span>
                  <span className="font-medium">Office Unit 301</span>

                  <span className="text-muted-foreground">Term:</span>
                  <span className="font-medium">12 months</span>

                  <span className="text-muted-foreground">Monthly Rent:</span>
                  <span className="font-medium">$2,500.00</span>

                  <span className="text-muted-foreground">
                    Security Deposit:
                  </span>
                  <span className="font-medium">$5,000.00</span>

                  <span className="text-muted-foreground">Start Date:</span>
                  <span className="font-medium">June 1, 2025</span>

                  <span className="text-muted-foreground">End Date:</span>
                  <span className="font-medium">May 31, 2026</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Signature Card */}
          <Card className="shadow-md">
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-medium">Tenant Signature</h3>

              {leaseStatus === "signed" ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="rounded-md border bg-white p-4 dark:bg-slate-950">
                    {/* {signature && (
                      <Image
                        src={signature || "/placeholder.svg"}
                        alt="Tenant Signature"
                        className="mx-auto h-24 w-full object-contain"
                      />
                    )} */}
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-500">
                    Signed on {new Date().toLocaleDateString()}
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
          <Card className="shadow-md">
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-medium">Actions</h3>

              <div className="flex flex-col gap-3">
                {leaseStatus === "pending" && (
                  <>
                    <Button
                      className="gap-2 bg-gradient-to-r from-primary to-primary/80 transition-all hover:from-primary/90 hover:to-primary"
                      onClick={() => {}}
                      //   disabled={!signatureRef || signatureRef.isEmpty()}
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

                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit(handleReject)}
                            className="space-y-4"
                          >
                            <FormField
                              control={form.control}
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
                              control={form.control}
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

                {leaseStatus === "signed" && (
                  <>
                    <div className="rounded-md bg-green-50 p-3 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                      <p className="flex items-center gap-2 text-sm font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        Lease successfully signed
                      </p>
                      <p className="mt-1 text-xs">
                        A copy has been sent to your email.
                      </p>
                    </div>
                    <Button variant="outline" className="gap-2">
                      <FileText className="h-4 w-4" />
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
          "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500",
        status === "rejected" &&
          "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500",
        status === "expired" &&
          "bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-400",
      )}
    >
      {status === "pending" && <Clock className="h-3 w-3" />}
      {status === "signed" && <CheckCircle2 className="h-3 w-3" />}
      {status === "rejected" && <XCircle className="h-3 w-3" />}
      {status === "expired" && <AlertCircle className="h-3 w-3" />}

      <span>
        {status === "pending" && "Pending Signature"}
        {status === "signed" && "Signed"}
        {status === "rejected" && "Rejected"}
        {status === "expired" && "Expired"}
      </span>
    </div>
  );
};

export default Page;
