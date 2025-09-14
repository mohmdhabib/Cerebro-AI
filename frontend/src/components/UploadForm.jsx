// frontend/src/components/UploadForm.jsx

import React, { useState, useContext } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import Button from "./shared/Button";
import { Link } from "react-router-dom"; // Use Link for navigation
import { AuthContext } from "../contexts/AuthContext";
import Spinner from "./shared/Spinner"; // Import Spinner

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
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // The API now returns the newly created report
      const { data: newReport } = await api.post("/", formData, {
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

  if (loading) {
    return (
      <div className="text-center p-8">
        <Spinner />
        <p className="text-lg font-semibold text-blue-300 mt-4">
          Analyzing your scan...
        </p>
        <p className="text-gray-400">This may take a few moments.</p>
      </div>
    );
  }

  // If a result has been received, show the ResultCard
  if (analysisResult) {
    return (
      <div className="text-center">
        {/* <h2 className="text-3xl font-bold text-white mb-4">
          Analysis Complete
        </h2> */}
          <h2 className="py-[4px]">
          {analysisResult.predicted_class === "No Tumor" ? (
           <b><span className="text-green-400 text-3xl ">Great news! No tumor detected.</span></b> 
          ) : (
            <b><span className="text-red-400 text-3xl">Attention: Tumor detected.</span></b>
          )}
          </h2>
             
    
        <p className="text-gray-300 mb-7 mt-2 text-xl">
          The AI model predicted:{" "}
          <span className="font-bold text-blue-400">
            {analysisResult.predicted_class}
          </span>
        </p>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
            <h3 className="text-lg font-semibold mb-3 text-white">
              Your Scan
            </h3>
            <img
              src={preview}
              alt="Uploaded MRI"
              className="w-full h-94 object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10">
            <h3 className="text-lg font-semibold mb-3 text-white">
              AI Heatmap (Grad-CAM)
            </h3>
            <img
              src={`data:image/png;base64,${analysisResult.gradcam}`}
              alt="Grad-CAM"
              className="w-full h-94 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={handleReset}
            className="px-6 py-3 border-2 border-gray-600 text-gray-300 font-semibold rounded-xl hover:bg-gray-700 hover:border-gray-500 transition-all"
          >
            Analyze Another Scan
          </button>
          <Link
            to="/history"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md"
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
          dragActive
            ? "border-blue-500 bg-blue-500/10"
            : "border-gray-600 hover:border-blue-500/50"
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
              className="max-h-60 rounded-lg shadow-lg object-contain mx-auto"
            />
            <p className="font-medium text-gray-200 mt-4">{file.name}</p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-2 text-sm font-semibold text-red-500 hover:text-red-400"
            >
              Remove Image
            </button>
          </div>
        ) : (
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </div>
            <p className="font-semibold text-white">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-400 mt-1">PNG or JPG (max. 10MB)</p>
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

      <div className="pt-4">
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
