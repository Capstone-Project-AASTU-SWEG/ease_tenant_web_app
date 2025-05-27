import { jsPDF } from "jspdf";
import { format } from "date-fns";

interface LeasePDFOptions {
  leaseTitle: string;
  leaseDescription?: string;
  sections: Array<{
    title: string;
    content: string;
  }>;
  dataValues: Record<string, string>;
  managerSignatureSvg?: string; // SVG string for manager's signature
  tenantSignatureSvg?: string; // SVG string for tenant's signature
}

export async function generateLeasePDF(
  options: LeasePDFOptions,
): Promise<Blob> {
  const {
    leaseTitle,
    leaseDescription,
    sections,
    dataValues,
    managerSignatureSvg,
    tenantSignatureSvg,
  } = options;

  const doc = new jsPDF();
  const margin = 20;
  let yPosition = margin;

  // Helper function to replace placeholders
  const replacePlaceholders = (text: string) => {
    if (!text) return "";
    const placeholderRegex = /\[([^\]]+)\]/g;
    return text.replace(placeholderRegex, (match, key) => {
      return dataValues[key.trim()] || match;
    });
  };

  // Add watermark
  doc.setTextColor(220, 220, 220);
  doc.setFontSize(40);
  doc.setFont("helvetica", "italic");
  doc.text(
    "DRAFT",
    doc.internal.pageSize.width / 2,
    doc.internal.pageSize.height / 2,
    { align: "center", angle: 45 },
  );

  // Reset text color for content
  doc.setTextColor(0, 0, 0);

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
    yPosition += splitDescription.length * 7 + 15;
  }

  // Add sections
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");

  for (const section of sections) {
    // Check if we need a new page (leave space for signatures)
    if (yPosition > doc.internal.pageSize.height - 100) {
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
    yPosition += splitContent.length * 7 + 15;
  }

  // Add signature sections
  if (yPosition > doc.internal.pageSize.height - 100) {
    doc.addPage();
    yPosition = margin;
  }

  // Helper function to add SVG signature
  const addSignature = (svgString: string, x: number, y: number) => {
    try {
      // Convert SVG to data URL
      const svgDataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;
      doc.addImage(svgDataUrl, "SVG", x, y, 80, 40);
      return true;
    } catch (error) {
      console.error("Error adding signature:", error);
      return false;
    }
  };

  // Manager signature section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Property Manager:", margin, yPosition);
  yPosition += 10;

  if (
    managerSignatureSvg &&
    !addSignature(managerSignatureSvg, margin, yPosition)
  ) {
    // Fallback to line if SVG fails
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition + 5, margin + 80, yPosition + 5);
  }
  yPosition += 45;

  // Manager name and date
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Name: ${dataValues["managerName"] || "________________"}`,
    margin,
    yPosition,
  );
  doc.text(`Date: ${format(new Date(), "PPP")}`, margin + 60, yPosition);
  yPosition += 15;

  // Tenant signature section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Tenant:", margin, yPosition);
  yPosition += 10;

  if (
    tenantSignatureSvg &&
    !addSignature(tenantSignatureSvg, margin, yPosition)
  ) {
    // Fallback to line if SVG fails
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition + 5, margin + 80, yPosition + 5);
  }
  yPosition += 45;

  // Tenant name and date
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Name: ${dataValues["tenantName"] || "________________"}`,
    margin,
    yPosition,
  );
  doc.text(`Date: ${format(new Date(), "PPP")}`, margin + 60, yPosition);

  // Add footer
  const footerText = `Generated on ${format(new Date(), "PPP")}`;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    footerText,
    doc.internal.pageSize.width - margin,
    doc.internal.pageSize.height - 10,
    { align: "right" },
  );

  // Return the PDF as a Blob
  return doc.output("blob");
}

// Example usage:
/*
const pdfBlob = await generateLeasePDF({
  leaseTitle: "Sample Lease Agreement",
  sections: [
    {
      title: "Section 1",
      content: "This is the lease content with [placeholder]"
    }
  ],
  dataValues: {
    placeholder: "replaced value",
    managerName: "John Smith",
    tenantName: "Jane Doe"
  },
  managerSignatureSvg: "<svg>...</svg>",
  tenantSignatureSvg: "<svg>...</svg>"
});

// To download:
const url = URL.createObjectURL(pdfBlob);
const a = document.createElement('a');
a.href = url;
a.download = 'lease.pdf';
a.click();
URL.revokeObjectURL(url);
*/
