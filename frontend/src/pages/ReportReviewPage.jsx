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
      <div className="flex justify-center mt-16">
        <Spinner />
      </div>
    );

  const inputStyle = "w-full p-2 border border-gray-300 rounded-md shadow-sm";

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        Review AI Analysis for Report #{report.id}
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            AI Preliminary Findings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* <div>
                            <h3 className="font-medium text-center text-sm text-gray-600 mb-2">Original MRI</h3>
                            <img src={report.image_url} alt="Original MRI Scan" className="w-full h-auto rounded-md border" />
                        </div> */}
            <div>
              <h3 className="font-medium text-center text-sm text-gray-600 mb-2">
                Grad-CAM Analysis
              </h3>
              {report.gradcam_image_url ? (
                <img
                  src={report.gradcam_image_url}
                  alt="Grad-CAM Analysis"
                  className="w-full h-auto rounded-md border"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md border">
                  <p className="text-gray-500 text-sm">Not Available</p>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <p>
              <strong>AI Prediction:</strong>{" "}
              <span className="font-mono text-indigo-600">
                {report.prediction}
              </span>
            </p>
            <p>
              <strong>Patient Name:</strong>{" "}
              {report.profiles.full_name || "N/A"}
            </p>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md space-y-4"
        >
          <h2 className="text-xl font-semibold mb-4">
            Doctor's Clinical Notes & Analysis
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">
                Tumor Location
              </label>
              <input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={inputStyle}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Tumor Grade</label>
              <select
                name="tumor_grade"
                value={formData.tumor_grade}
                onChange={handleInputChange}
                className={inputStyle}
              >
                <option>Low</option>
                <option>High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Patient Age</label>
              <input
                type="number"
                name="patient_age"
                value={formData.patient_age}
                onChange={handleInputChange}
                className={inputStyle}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Patient Gender
              </label>
              <select
                name="patient_gender"
                value={formData.patient_gender}
                onChange={handleInputChange}
                className={inputStyle}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Doctor's Notes</label>
            <textarea
              name="doctor_notes"
              value={formData.doctor_notes}
              onChange={handleInputChange}
              rows={4}
              className={inputStyle}
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium">
              Patient Summary (Simplified)
            </label>
            <textarea
              name="patient_summary"
              value={formData.patient_summary}
              onChange={handleInputChange}
              rows={3}
              className={inputStyle}
            ></textarea>
          </div>

          <Button type="submit" loading={loading} fullWidth>
            Submit & Finalize Report
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ReportReviewPage;
