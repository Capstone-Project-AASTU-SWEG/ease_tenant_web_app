"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import {
  Download,
  Printer,
  Copy,
  X,
  Minimize2,
  Maximize2,
  Eye,
  EyeOff,
  Check,
  RefreshCw,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface LeasePDFGeneratorProps {
  leaseTitle: string;
  leaseDescription?: string;
  sections: Array<{
    title: string;
    content: string;
  }>;
  dataValues: Record<string, string>;
  lastUpdated?: Date;
  onClose?: () => void;
  onPdfGenerated?: (pdfBlob: Blob) => void;
  showPreview: boolean;
  generateOnMount?: boolean;
  signatureData?: string;
}

const LeasePDFGenerator: React.FC<LeasePDFGeneratorProps> = ({
  leaseTitle,
  leaseDescription,
  sections,
  dataValues,
  lastUpdated = new Date(),
  onClose,
  onPdfGenerated,
  showPreview: sp,
  generateOnMount = true,
  signatureData,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setShowPreview(sp);
  }, [sp]);

  // Function to replace placeholders with actual values
  const replacePlaceholders = (text: string) => {
    if (!text) return "";

    // Find all [PLACEHOLDER] patterns in the text
    const placeholderRegex = /\[([^\]]+)\]/g;

    return text.replace(placeholderRegex, (match, key) => {
      // Remove the brackets and trim whitespace
      const cleanKey = key.trim();
      // Return the value from dataValues or the original placeholder if not found
      return dataValues[cleanKey] || match;
    });
  };

  const generatePDF = async (returnBlob: boolean) => {
    setIsLoading(true);

    try {
      // Simulate processing time for better UX
      await new Promise((resolve) => setTimeout(resolve, 200));

      const doc = new jsPDF();
      const margin = 20;
      let yPosition = margin;

      // Add title
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(leaseTitle || "Lease Agreement", margin, yPosition);
      yPosition += 10;

      // Add description if exists
      if (leaseDescription) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        const splitDescription = doc.splitTextToSize(
          leaseDescription,
          doc.internal.pageSize.width - margin * 2,
        );
        doc.text(splitDescription, margin, yPosition);
        yPosition += splitDescription.length * 7 + 15; // Adjust spacing
      }

      // Add sections
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");

      sections.forEach((section) => {
        // Check if we need a new page
        if (yPosition > doc.internal.pageSize.height - 30) {
          doc.addPage();
          yPosition = margin;
        }

        // Add section title
        doc.text(section.title || "Untitled Section", margin, yPosition);
        yPosition += 10;

        // Process section content
        const processedContent = replacePlaceholders(section.content);
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");

        const splitContent = doc.splitTextToSize(
          processedContent,
          doc.internal.pageSize.width - margin * 2,
        );

        doc.text(splitContent, margin, yPosition);
        yPosition += splitContent.length * 7 + 15; // Adjust line height and spacing
      });

      // Add signature if provided
      if (signatureData) {
        // Check if we need a new page
        if (yPosition > doc.internal.pageSize.height - 60) {
          doc.addPage();
          yPosition = margin;
        }

        // Add signature title
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Tenant Signature", margin, yPosition);
        yPosition += 10;

        // Add signature date
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text(
          `Signed on ${format(new Date(), "MMMM d, yyyy")}`,
          margin,
          yPosition,
        );
        yPosition += 10;

        // Add signature image
        try {
          // Convert SVG to data URL
          const canvas = document.createElement("canvas");
          canvas.width = 300;
          canvas.height = 100;
          const ctx = canvas.getContext("2d");

          if (ctx) {
            // Create a temporary div to render the SVG
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = signatureData;
            const svgElement = tempDiv.querySelector("svg");

            if (svgElement) {
              // Convert SVG to a data URL
              const svgData = new XMLSerializer().serializeToString(svgElement);
              const svgBlob = new Blob([svgData], {
                type: "image/svg+xml;charset=utf-8",
              });
              const DOMURL = window.URL || window.webkitURL || window;
              const url = DOMURL.createObjectURL(svgBlob);

              // Create an image from the SVG
              const img = new Image();
              img.src = url;

              // Wait for the image to load
              await new Promise((resolve) => {
                img.onload = resolve;
              });

              // Draw the image on the canvas
              ctx.drawImage(img, 0, 0, 300, 100);

              // Get the data URL from the canvas
              const dataUrl = canvas.toDataURL("image/png");

              // Add the signature image to the PDF
              doc.addImage(dataUrl, "PNG", margin, yPosition, 80, 30);

              // Clean up
              DOMURL.revokeObjectURL(url);
            }
          }
        } catch (error) {
          console.error("Error adding signature to PDF:", error);
        }

        yPosition += 40;
      }

      // Add footer with date
      const footerText = `Generated on ${format(new Date(), "PPP")}`;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        footerText,
        doc.internal.pageSize.width - margin,
        doc.internal.pageSize.height - 10,
        { align: "right" },
      );

      // After generating the PDF content:
      if (returnBlob || onPdfGenerated) {
        const pdfBlob = doc.output("blob");
        if (onPdfGenerated) {
          onPdfGenerated(pdfBlob);
        }
        return pdfBlob;
      } else {
        doc.save(`${leaseTitle || "Lease"}.pdf`);
        return null;
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById("lease-preview-content");
    if (printContent) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${leaseTitle || "Lease Agreement"}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { font-size: 24px; margin-bottom: 10px; }
                h2 { font-size: 18px; margin-top: 20px; margin-bottom: 10px; }
                p { font-size: 14px; line-height: 1.5; }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  const copyToClipboard = async () => {
    const content = sections
      .map(
        (section) =>
          `${section.title}\n\n${replacePlaceholders(section.content)}`,
      )
      .join("\n\n");

    const fullText = `${leaseTitle}\n\n${leaseDescription ? leaseDescription + "\n\n" : ""}${content}`;

    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  useEffect(() => {
    if (generateOnMount) {
      generatePDF(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateOnMount]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <Card className="overflow-hidden border-0 shadow-md">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-white p-4 dark:from-slate-900 dark:to-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">
                  {leaseTitle || "Lease Agreement"}
                </h3>
                {lastUpdated && (
                  <Badge variant="outline" className="ml-2 text-xs font-normal">
                    Updated {format(lastUpdated, "MMM d, yyyy")}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setShowPreview(!showPreview)}
                      >
                        {showPreview ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {showPreview ? "Hide Preview" : "Show Preview"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setIsMinimized(!isMinimized)}
                      >
                        {isMinimized ? (
                          <Maximize2 className="h-4 w-4" />
                        ) : (
                          <Minimize2 className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isMinimized ? "Expand" : "Minimize"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {onClose && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
                          onClick={onClose}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Close</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </CardHeader>

          <AnimatePresence>
            {!isMinimized && showPreview && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="p-0">
                  <div
                    id="lease-preview-content"
                    className="scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-slate-50 dark:scrollbar-thumb-slate-700 dark:scrollbar-track-slate-900 max-h-[600px] overflow-auto p-6"
                  >
                    <div className="mx-auto flex flex-col gap-6">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold">
                          {leaseTitle || "Lease Agreement"}
                        </h2>
                        {leaseDescription && (
                          <p className="text-muted-foreground">
                            {leaseDescription}
                          </p>
                        )}
                      </div>

                      {sections?.map((section, index) => (
                        <motion.div
                          key={index}
                          className="space-y-3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <h3 className="text-lg font-semibold">
                            {section.title || `Section ${index + 1}`}
                          </h3>
                          <div className="whitespace-pre-wrap rounded-md bg-slate-50 p-4 text-sm leading-relaxed dark:bg-slate-900">
                            {replacePlaceholders(section.content)}
                          </div>
                        </motion.div>
                      ))}

                      {signatureData && (
                        <motion.div
                          className="space-y-3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <h3 className="text-lg font-semibold">
                            Tenant Signature
                          </h3>
                          <div className="rounded-md bg-white p-4">
                            <div
                              className="h-24 w-full"
                              dangerouslySetInnerHTML={{
                                __html: signatureData,
                              }}
                            />
                            <p className="mt-2 text-xs text-muted-foreground">
                              Signed on {format(new Date(), "MMMM d, yyyy")}
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {sections?.length === 0 && (
                        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-muted-foreground">
                          <FileText className="h-12 w-12 text-slate-300" />
                          <p>
                            No sections added yet. Add sections to preview your
                            template.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>

          <CardFooter
            className={cn(
              "flex flex-wrap items-center justify-between gap-2 border-t bg-slate-50 p-3 dark:bg-slate-900",
              isMinimized && "border-t-0",
            )}
          >
            <div className="flex flex-wrap items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => generatePDF(false)}
                      variant="default"
                      size="sm"
                      className="gap-2 bg-gradient-to-r from-primary to-primary/80 transition-all hover:from-primary/90 hover:to-primary"
                      disabled={sections?.length === 0 || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          Download PDF
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Download as PDF document</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handlePrint}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      disabled={sections?.length === 0}
                    >
                      <Printer className="h-4 w-4" />
                      Print
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Print document</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      disabled={sections?.length === 0}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy to clipboard</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="text-xs text-muted-foreground">
              {sections.length} {sections.length === 1 ? "section" : "sections"}{" "}
              • {Object.keys(dataValues).length} data fields
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default LeasePDFGenerator;
