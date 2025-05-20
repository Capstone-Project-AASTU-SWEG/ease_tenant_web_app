"use client";

import type React from "react";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LeasePreviewMinimalProps {
  leaseTitle: string;
  leaseDescription?: string;
  sections: Array<{
    title: string;
    content: string;
  }>;
  dataValues: Record<string, string>;
  className?: string;
  maxHeight?: string | number;
}

const LeasePreviewMinimal: React.FC<LeasePreviewMinimalProps> = ({
  leaseTitle,
  leaseDescription,
  sections,
  dataValues,
  className,
  maxHeight = "600px",
}) => {
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

  return (
    <div className={cn("relative", className)}>
      <div
        className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
        style={{ maxHeight: maxHeight, overflow: "auto" }}
      >
        <div className="p-6">
          <div className="mx-auto flex flex-col gap-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">
                {leaseTitle || "Lease Agreement"}
              </h2>
              {leaseDescription && (
                <p className="text-muted-foreground">{leaseDescription}</p>
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

            {sections?.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-muted-foreground">
                <FileText className="h-12 w-12 text-slate-300" />
                <p>
                  No sections added yet. Add sections to preview your template.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeasePreviewMinimal;
