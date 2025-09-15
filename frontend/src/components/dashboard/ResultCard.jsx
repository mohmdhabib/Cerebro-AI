// frontend/src/components/dashboard/ResultCard.jsx

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
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
    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
      <div className="flex-shrink-0 text-gray-600">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-900 truncate">
          {String(value)}
        </p>
      </div>
    </div>
  );
};

const ResultCard = ({ report }) => {
  const { profile } = useAuth(); // Get user profile to check role
  const {
    id,
    // image_url,
    prediction,
    // confidence,  // Commented out confidence
    created_at,
    status,
    gradcam_image_url,
  } = report;

  // Correctly get patient_name from the nested profiles object
  const patient_name = report.profiles?.full_name;

  // State for doctor analysis
  const [analysis, setAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // Get doctor analysis if it exists in the report data (from the joined query)
  useEffect(() => {
    if (report.doctor_analysis && report.doctor_analysis.length > 0) {
      setAnalysis(report.doctor_analysis[0]);
    }
  }, [report]);

  // Destructure clinical details from the 'analysis' object for the modal and PDF
  const {
    location,
    size_length_cm,
    size_width_cm,
    edema_present,
    contrast_pattern,
    tumor_grade,
    doctor_notes,
    patient_summary,
    recommendation,
  } = analysis || {};

  const [isProcessing, setIsProcessing] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  // const confidencePercentage = confidence
  //   ? (confidence * 100).toFixed(1)
  //   : "0.0";
  const isTumor = prediction && prediction.toLowerCase() !== "no tumor";

  // Helper function to safely format dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "PPP");
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Fetch doctor analysis when modal is opened if not already loaded
  const handleViewAnalysis = async () => {
    if (!analysis && !loadingAnalysis) {
      setLoadingAnalysis(true);
      try {
        const { data } = await api.get(`/reports/${id}/analysis`);
        if (data) {
          setAnalysis(data);
        }
      } catch (error) {
        console.error("Failed to fetch analysis:", error);
        toast.error("Failed to load doctor's analysis");
      } finally {
        setLoadingAnalysis(false);
      }
    }
    setShowAnalysisModal(true);
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
    pdf.text("Cerebro AI - Analysis Report", pageWidth / 2, 16, {
      align: "center",
    });

    // --- Patient & Scan Details ---
    pdf.setFontSize(11);
    pdf.setTextColor("#000000");
    pdf.setFont("helvetica", "bold");
    pdf.text("Patient Information", 15, 40);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Name: ${patient_name || "N/A"}`, 15, 48);
    pdf.text(`Scan Date: ${formatDate(created_at)}`, 15, 54);
    pdf.text(`Report Generated: ${reportDate}`, 105, 48);
    pdf.text(`Report ID: #${report.id}`, 105, 54);
    pdf.text(`Status: ${status || "Pending Review"}`, 105, 60);

    // --- AI & Clinical Findings ---
    pdf.setFont("helvetica", "bold");
    pdf.text("Key Findings", 15, 70);

    let yPosition = 78;
    const addDetail = (label, value) => {
      if (value !== null && value !== undefined && value !== "") {
        pdf.setFont("helvetica", "bold");
        pdf.text(`${label}:`, 20, yPosition);
        pdf.setFont("helvetica", "normal");
        const splitValue = pdf.splitTextToSize(String(value), 130);
        pdf.text(splitValue, 60, yPosition);
        yPosition += splitValue.length * 5 + 2; // Adjust spacing for multiline
      }
    };

    addDetail("AI Prediction", prediction);
    // addDetail("Confidence", `${confidencePercentage}%`);  // Commented out confidence in PDF

    if (analysis) {
      yPosition += 4;
      pdf.setFont("helvetica", "bold");
      pdf.text("Doctor's Analysis", 20, yPosition);
      yPosition += 6;

      addDetail("Tumor Grade", analysis.tumor_grade);
      addDetail("Location", analysis.location);
      addDetail(
        "Size",
        analysis.size_length_cm && analysis.size_width_cm
          ? `${analysis.size_length_cm}cm x ${analysis.size_width_cm}cm`
          : null
      );
      addDetail("Contrast Pattern", analysis.contrast_pattern);
      addDetail("Edema", analysis.edema_present ? "Present" : "Not Present");
      addDetail("Doctor's Notes", analysis.doctor_notes);
      addDetail("Patient Summary", analysis.patient_summary);
      addDetail("Recommendation", analysis.recommendation);
    } else {
      yPosition += 8;
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor("#666666");
      pdf.text("Doctor's analysis is pending review.", 20, yPosition);
    }

    // --- Image Section ---
    // if (gradcam_image_url) {
    //   try {
    //     const imagePath = image_url.split("/scan_images/")[1]?.split("?")[0];
    //     if (!imagePath) throw new Error("Invalid image path");
    //     const response = await api.get(`/image-proxy/${imagePath}`, {
    //       responseType: "blob",
    //     });
    //     const localImageUrl = URL.createObjectURL(response.data);
    //     const img = new Image();
    //     img.src = localImageUrl;
    //     await new Promise((resolve, reject) => {
    //       img.onload = resolve;
    //       img.onerror = reject;
    //     });
    //     pdf.addPage();
    //     pdf.setFontSize(16);
    //     pdf.setFont("helvetica", "bold");
    //     pdf.text("Uploaded MRI Scan", pageWidth / 2, 20, { align: "center" });
    //     const imgWidth = 180;
    //     const imgHeight = (img.height * imgWidth) / img.width;
    //     pdf.addImage(img, "JPEG", 15, 30, imgWidth, imgHeight);
    //     URL.revokeObjectURL(localImageUrl);
    //   } catch (error) {
    //     toast.error("Could not add image to PDF: " + error.message);
    //   }
    // }

    // --- Grad-CAM Image Section ---
    if (gradcam_image_url) {
      try {
        const gradcamPath = gradcam_image_url
          .split("/scan_images/")[1]
          ?.split("?")[0];
        if (!gradcamPath) throw new Error("Invalid Grad-CAM image path");
        const response = await api.get(`/image-proxy/${gradcamPath}`, {
          responseType: "blob",
        });
        const localGradcamUrl = URL.createObjectURL(response.data);
        const gradcamImg = new Image();
        gradcamImg.src = localGradcamUrl;
        await new Promise((resolve, reject) => {
          gradcamImg.onload = resolve;
          gradcamImg.onerror = reject;
        });
        pdf.addPage();
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("Grad-CAM Visualization", pageWidth / 2, 20, {
          align: "center",
        });
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "italic");
        pdf.text(
          "Heat map highlighting regions of interest in the scan",
          pageWidth / 2,
          30,
          { align: "center" }
        );
        pdf.setFont("helvetica", "normal");
        const imgWidth = 180;
        const imgHeight = (gradcamImg.height * imgWidth) / gradcamImg.width;
        pdf.addImage(gradcamImg, "JPEG", 15, 40, imgWidth, imgHeight);
        URL.revokeObjectURL(localGradcamUrl);
      } catch (error) {
        toast.error("Could not add Grad-CAM image to PDF: " + error.message);
      }
    }

    // --- Footer ---
    pdf.setPage(1);
    pdf.setLineWidth(0.2);
    pdf.line(15, 270, pageWidth - 15, 270);
    pdf.setFontSize(8);
    pdf.setTextColor("#808080");
    pdf.text(
      "Disclaimer: This is an AI-assisted report and should not be used as the sole basis for clinical diagnosis or treatment. A qualified medical professional should always be consulted for final interpretation and patient care decisions.",
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
      const fileName = `Cerebro-AI Report-${report.id}.pdf`;
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
      link.download = `Cerebro-AI Report-${report.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      toast.error("Could not generate PDF: " + error.message);
    } finally {
      toast.dismiss(toastId);
      setIsProcessing(false);
    }
  };

  // const getConfidenceColor = () => {  // Commented out getConfidenceColor function
  //   if (confidencePercentage > 85) return "bg-emerald-500";
  //   if (confidencePercentage > 60) return "bg-yellow-500";
  //   return "bg-red-500";
  // };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const AnalysisModal = () => {
    if (!showAnalysisModal) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10 rounded-t-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Medical Analysis Report
                </h3>
                <p className="text-sm text-gray-500 mt-1">Report ID: #{id}</p>
              </div>
              <button
                onClick={() => setShowAnalysisModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <Icon path="M6 18L18 6M6 6l12 12" className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Patient Info */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Icon
                  path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  className="h-4 w-4 mr-2 text-indigo-600"
                />
                Patient Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Patient Name
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {patient_name || "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Scan Date
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {formatDate(created_at)}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Status
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {status || "Pending"}
                  </p>
                </div>
              </div>
            </div>

            {/* Grad-CAM Visualization */}
            {report.gradcam_image_url && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <Icon
                    path="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    className="h-4 w-4 mr-2 text-green-600"
                  />
                  Grad-CAM Visualization
                </h4>
                <div className="bg-gray-50 p-3 rounded-lg border text-center">
                  <img
                    src={report.gradcam_image_url}
                    alt="Grad-CAM Visualization"
                    className="max-h-64 mx-auto rounded-lg shadow-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Heat map highlighting regions of interest in the scan
                  </p>
                </div>
              </div>
            )}

            {loadingAnalysis ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Spinner size="lg" />
                  <p className="text-gray-500 mt-4">Loading analysis...</p>
                </div>
              </div>
            ) : analysis ? (
              <div className="space-y-6">
                {/* Clinical Details */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <Icon
                      path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      className="h-4 w-4 mr-2 text-blue-600"
                    />
                    Clinical Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailItem
                      icon={
                        <Icon
                          path="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          className="h-4 w-4"
                        />
                      }
                      label="Tumor Grade"
                      value={tumor_grade}
                    />
                    <DetailItem
                      icon={
                        <Icon
                          path="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          className="h-4 w-4"
                        />
                      }
                      label="Location"
                      value={location}
                    />
                    <DetailItem
                      icon={
                        <Icon
                          path="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14l-2-16"
                          className="h-4 w-4"
                        />
                      }
                      label="Size"
                      value={
                        size_length_cm && size_width_cm
                          ? `${size_length_cm} × ${size_width_cm} cm`
                          : null
                      }
                    />
                    <DetailItem
                      icon={
                        <Icon
                          path="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          className="h-4 w-4"
                        />
                      }
                      label="Contrast Pattern"
                      value={contrast_pattern}
                    />
                    <DetailItem
                      icon={
                        <Icon
                          path="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          className="h-4 w-4"
                        />
                      }
                      label="Edema"
                      value={
                        edema_present !== undefined
                          ? edema_present
                            ? "Present"
                            : "Not Present"
                          : null
                      }
                    />
                  </div>
                </div>

                {/* Text Fields */}
                {(doctor_notes || patient_summary || recommendation) && (
                  <div className="space-y-4">
                    {doctor_notes && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                          <Icon
                            path="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            className="h-4 w-4 mr-2 text-purple-600"
                          />
                          Doctor's Notes
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                            {doctor_notes}
                          </p>
                        </div>
                      </div>
                    )}

                    {patient_summary && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                          <Icon
                            path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            className="h-4 w-4 mr-2 text-amber-600"
                          />
                          Patient Summary
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                            {patient_summary}
                          </p>
                        </div>
                      </div>
                    )}

                    {recommendation && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                          <Icon
                            path="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                            className="h-4 w-4 mr-2 text-green-600"
                          />
                          Recommendations
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                            {recommendation}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                  <Icon
                    path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    className="h-12 w-12 text-gray-400 mx-auto mb-4"
                  />
                  <h4 className="text-lg font-medium text-gray-600 mb-2">
                    Analysis Pending
                  </h4>
                  <p className="text-gray-500">
                    Doctor's analysis is currently under review and will be
                    available soon.
                  </p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowAnalysisModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleDownloadPdf}
                disabled={isProcessing}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {isProcessing ? (
                  <Spinner size="sm" />
                ) : (
                  <Icon
                    path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    className="h-4 w-4"
                  />
                )}
                {isProcessing ? "Generating..." : "Download PDF"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
        {/* Image Section */}
        <div className="relative">
          <img
            src={
              gradcam_image_url ||
              "https://via.placeholder.com/400x240?text=MRI+Scan"
            }
            alt="Grad-CAM Visualization"
            className="w-full h-48 object-cover"
          />

          {/* Prediction Badge */}
          <div
            className={`absolute top-3 right-3 px-3 py-1.5 text-sm font-semibold text-white rounded-full flex items-center space-x-1.5 shadow-lg ${
              isTumor ? "bg-red-500" : "bg-emerald-500"
            }`}
          >
            <Icon
              path={
                isTumor
                  ? "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              }
              className="h-4 w-4"
            />
            <span>{prediction || "N/A"}</span>
          </div>

          {/* Status Badge */}
          {status && (
            <div
              className={`absolute top-3 left-3 px-3 py-1 text-xs font-medium rounded-full border shadow-sm ${getStatusColor(
                status
              )}`}
            >
              {status}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Patient Info */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <Icon
                path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                className="h-4 w-4 text-indigo-600 flex-shrink-0"
              />
              <span className="text-sm font-medium text-gray-900 truncate">
                {patient_name || "Unknown Patient"}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500 flex-shrink-0 ml-2">
              <Icon
                path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                className="h-3 w-3"
              />
              <span className="hidden sm:inline">{formatDate(created_at)}</span>
              <span className="sm:hidden">
                {format(new Date(created_at), "MMM dd")}
              </span>
            </div>
          </div>

          {/* Analysis Summary */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <Icon
                  path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  className="h-4 w-4 mr-1.5 text-blue-600"
                />
                {analysis ? "Clinical Analysis" : "AI Analysis"}
              </h4>
              {analysis && (
                <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                  Reviewed
                </span>
              )}
            </div>

            {analysis ? (
              <div className="space-y-2">
                {tumor_grade && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Icon
                      path="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      className="h-3 w-3 text-orange-500"
                    />
                    <span className="text-gray-600 text-xs">Grade:</span>
                    <span className="font-medium text-gray-900">
                      {tumor_grade}
                    </span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Icon
                      path="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      className="h-3 w-3 text-blue-500"
                    />
                    <span className="text-gray-600 text-xs">Location:</span>
                    <span className="font-medium text-gray-900">
                      {location}
                    </span>
                  </div>
                )}
                {size_length_cm && size_width_cm && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Icon
                      path="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14l-2-16"
                      className="h-3 w-3 text-purple-500"
                    />
                    <span className="text-gray-600 text-xs">Size:</span>
                    <span className="font-medium text-gray-900">
                      {size_length_cm} × {size_width_cm} cm
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-sm text-amber-600">
                <Icon
                  path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  className="h-3 w-3"
                />
                <span className="italic">Awaiting medical review</span>
              </div>
            )}
          </div>

          {/* Confidence - Commented out */}
          {/* <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700 flex items-center">
                <Icon
                  path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  className="h-3 w-3 mr-1.5 text-indigo-600"
                />
                AI Confidence
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {confidencePercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`${getConfidenceColor()} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${confidencePercentage}%` }}
              ></div>
            </div>
          </div> */}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {/* View Analysis Button */}
            {(analysis || status === "Completed") && (
              <button
                onClick={handleViewAnalysis}
                disabled={loadingAnalysis}
                className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 disabled:opacity-50 transition-colors"
              >
                {loadingAnalysis ? (
                  <Spinner size="sm" />
                ) : (
                  <Icon
                    path="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    className="h-4 w-4"
                  />
                )}
                <span className="hidden sm:inline">
                  {loadingAnalysis ? "Loading..." : "View Analysis"}
                </span>
                <span className="sm:hidden">
                  {loadingAnalysis ? "..." : "View"}
                </span>
              </button>
            )}

            {/* Add Analysis Button for Doctors */}
            {!analysis && profile?.role === "Doctor" && (
              <Link
                to={`/review/${id}`}
                className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-md hover:bg-amber-100 transition-colors"
              >
                <Icon
                  path="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  className="h-4 w-4"
                />
                <span className="hidden sm:inline">Add Analysis</span>
                <span className="sm:hidden">Review</span>
              </Link>
            )}

            {/* Share Button */}
            <button
              onClick={handleShare}
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <Icon
                path="M8.684 13.342c.886-.404 1.5-1.048 1.5-1.842s-.614-1.438-1.5-1.842m.01 3.684a2.986 2.986 0 010-3.684m0 3.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367-2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                className="h-4 w-4"
              />
              <span className="hidden lg:inline">Share</span>
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {isProcessing ? (
                <Spinner size="sm" />
              ) : (
                <Icon
                  path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  className="h-4 w-4"
                />
              )}
              <span className="hidden lg:inline">
                {isProcessing ? "Processing..." : "Download"}
              </span>
              <span className="lg:hidden">{isProcessing ? "..." : "PDF"}</span>
            </button>
          </div>
        </div>
      </div>
      <AnalysisModal />
    </>
  );
};

export default ResultCard;
