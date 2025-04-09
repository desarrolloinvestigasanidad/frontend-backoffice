"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { CertificateData } from "@/types/certificate";

export async function generatePDF(element: HTMLElement, data: CertificateData) {
  try {
    // Create canvas from the DOM element
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    // Generate filename based on certificate data
    let filename = "certificado";

    if (data.type === "chapter") {
      filename += "_capitulo";
    } else if (data.type === "book") {
      filename += "_libro";
    } else if (data.type === "region") {
      filename += `_${data.region.toLowerCase().replace(/\s+/g, "_")}`;
    }

    if (data.authors.length > 0) {
      const authorName = data.authors[0].split(" ")[0].toLowerCase();
      filename += `_${authorName}`;
    }

    filename += ".pdf";

    // Download PDF
    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
}
