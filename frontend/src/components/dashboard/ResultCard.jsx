// frontend/src/components/dashboard/ResultCard.jsx

import React, { useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import Spinner from "../shared/Spinner";

const Icon = ({ path, className = "h-4 w-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const ResultCard = ({ report, patientView = true }) => {
  const { prediction, confidence, created_at, patient_name } = report;
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const confidencePercentage = (confidence * 100).toFixed(1);
  const isTumor = prediction && prediction.toLowerCase() !== "no tumor";

  // --- HELPER FUNCTION TO GENERATE THE PDF BLOB ---
  const generatePdfBlob = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const reportDate = format(new Date(), "PPP");
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Header
    pdf.setFillColor(79, 70, 229);
    pdf.rect(0, 0, pageWidth, 30, "F");
    pdf.setFontSize(22);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor("#FFFFFF");
    pdf.text("BrainScan AI - Analysis Report", pageWidth / 2, 18, {
      align: "center",
    });

    // Patient & Scan Details
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor("#000000");
    pdf.text(`Patient Name:`, 20, 50);
    pdf.setFont("helvetica", "bold");
    pdf.text(patient_name || "N/A", 55, 50);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Scan Date:`, 20, 60);
    pdf.setFont("helvetica", "bold");
    pdf.text(format(new Date(created_at), "PPP"), 55, 60);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Report Generated:`, 110, 50);
    pdf.setFont("helvetica", "bold");
    pdf.text(reportDate, 150, 50);

    // Analysis Results Box
    pdf.setDrawColor(229, 231, 235);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(15, 75, pageWidth - 30, 40, 3, 3, "S");
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(79, 70, 229);
    pdf.text("Analysis Results", 25, 88);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor("#000000");
    pdf.text("Prediction:", 90, 88);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(isTumor ? "#DC2626" : "#16A34A");
    pdf.text(prediction || "N/A", 125, 88);
    pdf.setTextColor("#000000");
    pdf.text("Confidence:", 90, 98);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${confidencePercentage}%`, 125, 98);

    // Footer & Disclaimer
    pdf.setLineWidth(0.2);
    pdf.line(15, 270, pageWidth - 15, 270);
    pdf.setFontSize(8);
    pdf.setTextColor("#808080");
    pdf.text(
      "Disclaimer: This is an AI-generated report...",
      pageWidth / 2,
      280,
      { align: "center", maxWidth: pageWidth - 30 }
    );

    return pdf.output("blob");
  };

  // --- UPGRADED SHARE FUNCTIONALITY ---
  const handleShare = async () => {
    setIsSharing(true);
    const toastId = toast.loading("Preparing to share...");

    try {
      const pdfBlob = generatePdfBlob();
      const fileName = `BrainScan-Report-${report.id}.pdf`;
      const pdfFile = new File([pdfBlob], fileName, {
        type: "application/pdf",
      });

      const shareData = {
        files: [pdfFile],
        title: "Brain Scan Report",
        text: `Here is the AI analysis report for ${
          patient_name || "the patient"
        }.`,
      };

      // Check if the browser can share these files
      if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        await navigator.share(shareData);
        toast.success("Report shared successfully!");
      } else {
        // Fallback for browsers that can't share files
        throw new Error("File sharing not supported.");
      }
    } catch (error) {
      // Fallback to copying text if file sharing fails or is not supported
      const shareText = `BrainScan AI Report\n- Prediction: ${prediction}\n- Confidence: ${confidencePercentage}%`;
      await navigator.clipboard.writeText(shareText);
      toast.success(
        "File sharing not available. Report details copied to clipboard!"
      );
    } finally {
      toast.dismiss(toastId);
      setIsSharing(false);
    }
  };

  // --- DOWNLOAD FUNCTIONALITY ---
  const handleDownloadPdf = () => {
    setIsDownloading(true);
    try {
      const pdfBlob = generatePdfBlob();
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `BrainScan-Report-${report.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Download started!");
    } catch (error) {
      toast.error("Could not generate PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  const getConfidenceColor = () => {
    if (confidencePercentage > 85) return "bg-green-500";
    if (confidencePercentage > 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* ... (UI part of the card remains the same) ... */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start text-sm text-gray-500 mb-4">
          {!patientView && (
            <div className="flex items-center gap-2 font-semibold text-gray-700 truncate">
              <Icon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              <span className="truncate">
                {patient_name || "Unknown Patient"}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1 ml-auto flex-shrink-0">
            <Icon path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            <span>{format(new Date(created_at), "PPP")}</span>
          </div>
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
            disabled={isSharing || isDownloading}
            className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSharing ? (
              <Spinner size="sm" />
            ) : (
              <Icon path="M8.684 13.342c.886-.404 1.5-1.048 1.5-1.842s-.614-1.438-1.5-1.842m.01 3.684a2.986 2.986 0 010-3.684m0 3.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            )}
            {isSharing ? "Sharing..." : "Share"}
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading || isSharing}
            className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <Spinner size="sm" />
            ) : (
              <Icon path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            )}
            {isDownloading ? "Downloading..." : "Download PDF"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
