// frontend/src/components/UploadForm.jsx

import React, { useState, useContext } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import Button from "./shared/Button";
import { Link } from "react-router-dom"; // Use Link for navigation
import { AuthContext } from "../contexts/AuthContext";
import ResultCard from "./dashboard/ResultCard"; // Import ResultCard to display results

const UploadForm = () => {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // --- NEW: State to hold the analysis result ---
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setAnalysisResult(null); // Clear previous result when a new file is chosen
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith("image/")) {
        setFile(droppedFile);
        setPreview(URL.createObjectURL(droppedFile));
        setAnalysisResult(null); // Clear previous result
      } else {
        toast.error("Please upload a valid image file.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // The API now returns the newly created report
      const { data: newReport } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Analysis complete!");
      // --- NEW: Store the result to display it ---
      setAnalysisResult(newReport);
    } catch (error) {
      toast.error("Analysis failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setAnalysisResult(null);
  };

  // If a result has been received, show the ResultCard
  if (analysisResult) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Analysis Complete
        </h2>
        <p className="text-gray-600 mb-8">
          Here are the results for the uploaded scan.
        </p>
        <div className="max-w-md mx-auto">
          <ResultCard report={analysisResult} />
        </div>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={handleReset}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
          >
            Analyze Another Scan
          </button>
          <Link
            to="/history"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all"
          >
            View Full History
          </Link>
        </div>
      </div>
    );
  }

  // Otherwise, show the upload form
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {preview ? (
          <div>
            <img
              src={preview}
              alt="MRI Preview"
              className="max-h-60 rounded-lg shadow-md object-contain mx-auto"
            />
            <p className="font-medium text-gray-800 mt-4">{file.name}</p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-2 text-sm font-semibold text-red-600 hover:text-red-800"
            >
              Remove Image
            </button>
          </div>
        ) : (
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </div>
            <p className="font-semibold text-gray-900">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-500 mt-1">PNG or JPG (max. 10MB)</p>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              onChange={handleFileChange}
              accept="image/png, image/jpeg"
            />
          </label>
        )}
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          loading={loading}
          disabled={!file || !user}
          fullWidth
        >
          {loading ? "Analyzing Scan..." : "Start Analysis"}
        </Button>
      </div>
    </form>
  );
};

export default UploadForm;
