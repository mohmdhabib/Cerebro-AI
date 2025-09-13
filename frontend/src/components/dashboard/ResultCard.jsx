// frontend/src/components/dashboard/ResultCard.jsx

import React, { useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import jsPDF from "jspdf";

import Spinner from "../shared/Spinner";
import api from "../../services/api";

const Icon = ({ path, className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const DetailItem = ({ icon, label, value }) => {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex items-center text-sm py-1">
      <div className="flex-shrink-0 w-6 text-slate-500">{icon}</div>
      <span className="text-slate-600 font-medium mr-2">{label}:</span>
      <span className="text-slate-800 font-semibold truncate">
        {String(value)}
      </span>
    </div>
  );
};

const ResultCard = ({ report }) => {
  const {
    image_url,
    prediction,
    confidence,
    created_at,
    patient_name,
    location,
    size_length_cm,
    size_width_cm,
    edema_present,
    contrast_pattern,
    tumor_grade,

  } = report;

  const [isProcessing, setIsProcessing] = useState(false);
  const confidencePercentage = confidence
    ? (confidence * 100).toFixed(1)
    : "0.0";
  const isTumor = prediction && prediction.toLowerCase() !== "no tumor";

  // Helper function to safely format dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "PPP");
    } catch (error) {
      console.error("Invalid date format:", dateString, error);
      return "Invalid Date";
    }
  };

  const generatePdfBlob = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const reportDate = format(new Date(), "PPP");
    const pageWidth = pdf.internal.pageSize.getWidth();

    // --- Header ---
    pdf.setFillColor(79, 70, 229);
    pdf.rect(0, 0, pageWidth, 25, "F");
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor("#FFFFFF");
    pdf.text("BrainScan AI - Analysis Report", pageWidth / 2, 16, {
      align: "center",
    });

    // --- Patient & Scan Details ---
    pdf.setFontSize(11);
    pdf.setTextColor("#000000");
    pdf.setFont("helvetica", "bold");
    pdf.text("Patient Information", 15, 40);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Name: ${patient_name || "N/A"}`, 15, 48);
    // Update this line to use the safe formatDate function
    pdf.text(`Scan Date: ${formatDate(created_at)}`, 15, 54);
    pdf.text(`Report Generated: ${reportDate}`, 105, 48);
    pdf.text(`Report ID: ${report.id}`, 105, 54);

    // --- AI & Clinical Findings ---
    pdf.setFont("helvetica", "bold");
    pdf.text("Key Findings", 15, 70);

    let yPosition = 78;
    const addDetail = (label, value) => {
      if (value !== null && value !== undefined && value !== "") {
        pdf.setFont("helvetica", "bold");
        pdf.text(`${label}:`, 20, yPosition);
        pdf.setFont("helvetica", "normal");
        pdf.text(String(value), 60, yPosition);
        yPosition += 6;
      }
    };

    addDetail("AI Prediction", prediction);
    addDetail("Confidence", `${confidencePercentage}%`);
    addDetail("Tumor Grade", tumor_grade);
    addDetail("Location", location);
    addDetail(
      "Size",
      size_length_cm && size_width_cm
        ? `${size_length_cm}cm x ${size_width_cm}cm`
        : null
    );
    addDetail("Contrast Pattern", contrast_pattern);
    addDetail("Edema", edema_present ? "Present" : "Not Present");

    // --- Image Section ---
    if (image_url) {
      try {
        const imagePath = image_url.split("/scan_images/")[1]?.split("?")[0];
        
        if (!imagePath) {
          throw new Error("Invalid image path");
        }
        
        const response = await api.get(`/image-proxy/${imagePath}`, {
          responseType: "blob",
        });
        
        const localImageUrl = URL.createObjectURL(response.data);
        
        // Create an image element and wait for it to load
        const img = new Image();
        img.src = localImageUrl;
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          // Set a timeout in case the image never loads
          setTimeout(reject, 5000);
        });
        
        // Add the image directly without using html2canvas
        pdf.addPage();
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("Uploaded MRI Scan", pageWidth / 2, 20, { align: "center" });
        
        // Calculate dimensions to maintain aspect ratio
        const imgWidth = 180;
        const imgHeight = (img.height * imgWidth) / img.width;
        
        pdf.addImage(img, "JPEG", 15, 30, imgWidth, imgHeight);
        URL.revokeObjectURL(localImageUrl);
      } catch (error) {
        console.error("Could not add image to PDF:", error);
        toast.error("Could not add image to PDF: " + error.message);
      }
    }

    // --- Footer ---
    pdf.setPage(1); // Return to the first page to draw the footer
    pdf.setLineWidth(0.2);
    pdf.line(15, 270, pageWidth - 15, 270);
    pdf.setFontSize(8);
    pdf.setTextColor("#808080");
    pdf.text(
      "Disclaimer: This is an AI-generated report and requires review by a qualified medical professional.",
      pageWidth / 2,
      280,
      { align: "center", maxWidth: pageWidth - 30 }
    );

    return pdf.output("blob");
  };

  const handleShare = async () => {
    setIsProcessing(true);
    const toastId = toast.loading("Preparing PDF to share...");
    try {
      const pdfBlob = await generatePdfBlob();
      if (!pdfBlob) throw new Error("Failed to generate PDF");
      
      const fileName = `BrainScan-Report-${report.id}.pdf`;
      const pdfFile = new File([pdfBlob], fileName, {
        type: "application/pdf",
      });

      if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        await navigator.share({ files: [pdfFile], title: "Brain Scan Report" });
        toast.success("PDF shared successfully");
      } else {
        throw new Error("File sharing not supported by your browser.");
      }
    } catch (error) {
      console.error("Share error:", error);
      toast.error(error.message || "Could not share PDF.");
    } finally {
      toast.dismiss(toastId);
      setIsProcessing(false);
    }
  };

  const handleDownloadPdf = async () => {
    setIsProcessing(true);
    const toastId = toast.loading("Generating PDF report...");
    try {
      const pdfBlob = await generatePdfBlob();
      if (!pdfBlob) throw new Error("Failed to generate PDF");
      
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `BrainScan-Report-${report.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Could not generate PDF: " + error.message);
    } finally {
      toast.dismiss(toastId);
      setIsProcessing(false);
    }
  };

  const getConfidenceColor = () => {
    if (confidencePercentage > 85) return "bg-green-500";
    if (confidencePercentage > 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="relative">
        {/* Show only the original image */}
        <img
          src={image_url || "https://via.placeholder.com/400x300?text=Image+Not+Available"}
          alt="MRI Scan"
          className="w-full h-56 object-cover"
        />
        <div
          className={`absolute top-3 right-3 px-3 py-1 text-sm font-bold text-white rounded-full flex items-center gap-2 ${
            isTumor ? "bg-red-500/90" : "bg-green-500/90"
          }`}
        >
          <Icon
            path={
              isTumor
                ? "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            }
          />
          <span>{prediction || "N/A"}</span>
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start text-sm text-slate-500 mb-4">
          <div className="flex items-center gap-2 font-semibold text-slate-700 truncate">
            <Icon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            <span className="truncate">
              {patient_name || "Unknown Patient"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
            <Icon
              path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              className="h-4 w-4"
            />
            <span>
              {created_at ? format(new Date(created_at), "PPP") : "N/A"}
            </span>
          </div>
        </div>

    
        <div className="space-y-2 border-t border-b border-gray-100 py-4 mb-4">
          <DetailItem
            icon={<Icon path="M9 17v-2a4 4 0 00-4-4H3V7h2a4 4 0 004-4V3" />}
            label="Grade"
            value={tumor_grade}
          />
          <DetailItem
            icon={
              <Icon path="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M12 11a3 3 0 100-6 3 3 0 000 6z" />
            }
            label="Location"
            value={location}
          />
          <DetailItem
            icon={
              <Icon path="M14 10H3v2h11v-2zm7-4H3v2h18V6zM10 14H3v2h7v-2z" />
            }
            label="Size"
            value={
              size_length_cm && size_width_cm
                ? `${size_length_cm}cm x ${size_width_cm}cm`
                : null
            }
          />
        </div>
        <div className="mt-auto">
          <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-gray-800">
              Confidence Level
            </span>
            <span
              className={`text-sm font-semibold ${getConfidenceColor().replace(
                "bg",
                "text"
              )}`}
            >
              {confidencePercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`${getConfidenceColor()} h-2.5 rounded-full`}
              style={{ width: `${confidencePercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 border-t border-gray-200 px-5 py-3">
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleShare}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50"
          >
            {isProcessing ? (
              <Spinner size="sm" />
            ) : (
              <Icon
                path="M8.684 13.342c.886-.404 1.5-1.048 1.5-1.842s-.614-1.438-1.5-1.842m.01 3.684a2.986 2.986 0 010-3.684m0 3.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367-2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                className="h-4 w-4"
              />
            )}
            Share
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            {isProcessing ? (
              <Spinner size="sm" />
            ) : (
              <Icon
                path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                className="h-4 w-4"
              />
            )}
            {isProcessing ? "Processing..." : "Download PDF"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
