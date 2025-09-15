// frontend/src/pages/ReportReviewPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import Spinner from "../components/shared/Spinner";
import Button from "../components/shared/Button";

const ReportReviewPage = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    doctor_notes: "",
    patient_summary: "",
    location: "",
    size_length_cm: "",
    size_width_cm: "",
    edema_present: false,
    contrast_pattern: "Ring-enhancing",
    tumor_grade: "Low",
    recommendation: "",
    patient_age: "",
    patient_gender: "Male",
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await api.get("/reports");
        const specificReport = data.find((r) => r.id.toString() === reportId);
        if (specificReport) {
          setReport(specificReport);
          setFormData((prev) => ({
            ...prev,
            patient_age: specificReport.patient_age || "",
            patient_gender: specificReport.patient_gender || "Male",
          }));
        } else {
          toast.error("Report not found.");
          navigate("/reports");
        }
      } catch (error) {
        toast.error("Failed to fetch report details.");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportId, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/reports/${reportId}/analysis`, formData);
      toast.success("Analysis submitted successfully!");
      navigate("/reports");
    } catch (error) {
      toast.error("Failed to submit analysis.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !report)
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-gray-600">Loading report details...</p>
        </div>
      </div>
    );

  const inputStyle =
    "w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white";
  const labelStyle = "block text-sm font-semibold text-gray-700 mb-2";

  const getPredictionBadgeStyle = (prediction) => {
    const lowerPrediction = prediction?.toLowerCase() || "";
    if (lowerPrediction.includes("glioma")) {
      return "bg-red-100 text-red-800 border-red-200";
    } else if (lowerPrediction.includes("meningioma")) {
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    } else if (lowerPrediction.includes("no tumor")) {
      return "bg-green-100 text-green-800 border-green-200";
    } else {
      return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <button
                onClick={() => navigate("/reports")}
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Reports
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Medical Report Review
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Report ID: #{report.id} • AI-Assisted Analysis
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                <span className="text-blue-700 text-xs font-medium">
                  UNDER REVIEW
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* AI Analysis Section */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                    />
                  </svg>
                  AI Analysis Results
                </h2>
              </div>

              <div className="p-6">
                {/* Patient Information */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Patient Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Name:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {report.profiles.full_name || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Prediction */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    AI Diagnosis
                  </h3>
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-lg border font-medium text-sm ${getPredictionBadgeStyle(
                      report.prediction
                    )}`}
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {report.prediction}
                  </div>
                </div>

                {/* Grad-CAM Analysis */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Grad-CAM Heatmap Analysis
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-3">
                    {report.gradcam_image_url ? (
                      <img
                        src={report.gradcam_image_url}
                        alt="Grad-CAM Analysis"
                        className="w-full h-auto rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors"
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-center">
                          <svg
                            className="w-8 h-8 mx-auto text-gray-400 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-gray-500 text-sm">Not Available</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 italic">
                    Heatmap highlights regions of interest identified by the AI
                    model
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Assessment Form */}
          <div className="xl:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Clinical Assessment & Documentation
                </h2>
              </div>

              <div className="p-6 space-y-8">
                {/* Patient Demographics */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Patient Demographics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelStyle}>Patient Age</label>
                      <input
                        type="number"
                        name="patient_age"
                        value={formData.patient_age}
                        onChange={handleInputChange}
                        placeholder="Enter age"
                        className={inputStyle}
                        min="0"
                        max="120"
                      />
                    </div>
                    <div>
                      <label className={labelStyle}>Patient Gender</label>
                      <select
                        name="patient_gender"
                        value={formData.patient_gender}
                        onChange={handleInputChange}
                        className={inputStyle}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Clinical Findings */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Clinical Findings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelStyle}>Tumor Location</label>
                      <input
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g., Frontal lobe, left hemisphere"
                        className={inputStyle}
                      />
                    </div>
                    <div>
                      <label className={labelStyle}>Tumor Grade</label>
                      <select
                        name="tumor_grade"
                        value={formData.tumor_grade}
                        onChange={handleInputChange}
                        className={inputStyle}
                      >
                        <option value="Low">Low Grade (I-II)</option>
                        <option value="High">High Grade (III-IV)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className={labelStyle}>Size - Length (cm)</label>
                      <input
                        type="number"
                        name="size_length_cm"
                        value={formData.size_length_cm}
                        onChange={handleInputChange}
                        placeholder="0.0"
                        step="0.1"
                        className={inputStyle}
                      />
                    </div>
                    <div>
                      <label className={labelStyle}>Size - Width (cm)</label>
                      <input
                        type="number"
                        name="size_width_cm"
                        value={formData.size_width_cm}
                        onChange={handleInputChange}
                        placeholder="0.0"
                        step="0.1"
                        className={inputStyle}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className={labelStyle}>Contrast Pattern</label>
                      <select
                        name="contrast_pattern"
                        value={formData.contrast_pattern}
                        onChange={handleInputChange}
                        className={inputStyle}
                      >
                        <option value="Ring-enhancing">Ring-enhancing</option>
                        <option value="Homogeneous">Homogeneous</option>
                        <option value="Heterogeneous">Heterogeneous</option>
                        <option value="Non-enhancing">Non-enhancing</option>
                      </select>
                    </div>
                    <div className="flex items-center mt-6">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="edema_present"
                          checked={formData.edema_present}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div
                          className={`relative w-5 h-5 rounded border-2 transition-all duration-200 ${
                            formData.edema_present
                              ? "bg-blue-600 border-blue-600"
                              : "bg-white border-gray-300"
                          }`}
                        >
                          {formData.edema_present && (
                            <svg
                              className="w-3 h-3 text-white absolute top-0.5 left-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-700">
                          Perilesional Edema Present
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Clinical Notes */}
                <div>
                  <label className={labelStyle}>
                    <svg
                      className="w-4 h-4 inline mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Detailed Clinical Notes
                  </label>
                  <textarea
                    name="doctor_notes"
                    value={formData.doctor_notes}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Enter detailed clinical observations, differential diagnoses, and technical findings..."
                    className={inputStyle}
                  />
                </div>

                {/* Patient Summary */}
                <div>
                  <label className={labelStyle}>
                    <svg
                      className="w-4 h-4 inline mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Patient Summary (Simplified Language)
                  </label>
                  <textarea
                    name="patient_summary"
                    value={formData.patient_summary}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Provide a clear, patient-friendly summary of findings and next steps..."
                    className={inputStyle}
                  />
                </div>

                {/* Recommendations */}
                <div>
                  <label className={labelStyle}>
                    <svg
                      className="w-4 h-4 inline mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    Clinical Recommendations
                  </label>
                  <textarea
                    name="recommendation"
                    value={formData.recommendation}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Treatment recommendations, follow-up requirements, referrals..."
                    className={inputStyle}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    onClick={() => navigate("/reports")}
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 px-6 py-3 rounded-lg font-medium transition-colors flex-1"
                  >
                    Cancel & Return
                  </Button>
                  <Button
                    type="submit"
                    loading={loading}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg transition-all duration-200 flex-1 sm:flex-none"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Submit & Finalize Report
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportReviewPage;
