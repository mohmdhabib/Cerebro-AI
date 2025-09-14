// frontend/src/components/UploadForm.jsx

import React, { useState, useContext } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import Button from "./shared/Button";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Spinner from "./shared/Spinner";

const UploadForm = () => {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setAnalysisResult(null);
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
        setAnalysisResult(null);
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
      const { data: newReport } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Analysis complete!");
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
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Spinner />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              🧠 Analyzing Your Scan
            </h3>
            <p className="text-gray-600 text-lg">
              Our AI is carefully examining your MRI scan...
            </p>
            <p className="text-gray-500 text-sm mt-2">
              This process typically takes 30-60 seconds
            </p>
          </div>
          <div className="w-64 bg-gray-200 rounded-full h-2 mt-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (analysisResult) {
    const isNoTumor = analysisResult.prediction === "No Tumor";

    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="mb-4">
            {isNoTumor ? (
              <div className="inline-flex items-center space-x-2 px-6 py-3 bg-green-50 rounded-full border border-green-200">
                <span className="text-2xl">✅</span>
                <span className="text-green-700 font-bold text-xl">
                  Great News!
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center space-x-2 px-6 py-3 bg-orange-50 rounded-full border border-orange-200">
                <span className="text-2xl">⚠️</span>
                <span className="text-orange-700 font-bold text-xl">
                  Requires Attention
                </span>
              </div>
            )}
          </div>

          <h2 className="text-3xl font-bold mb-3">
            {isNoTumor ? (
              <span className="text-green-600">No Tumor Detected</span>
            ) : (
              <span className="text-orange-600">Tumor Detected</span>
            )}
          </h2>

          <div className="bg-gray-50 rounded-lg p-4 inline-block">
            <p className="text-gray-700 text-lg">
              AI Prediction:{" "}
              <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {analysisResult.prediction}
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Original Scan */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              {/* <span className="text-xl">🔬</span> */}
              <h3 className="text-lg font-semibold text-gray-800">
                Original MRI Scan
              </h3>
            </div>
            <div className="relative group">
              <img
                src={preview}
                alt="Uploaded MRI"
                className="w-full h-134 object-cover rounded-lg shadow-md border border-gray-200 group-hover:shadow-lg transition-shadow duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              {/* <span className="text-xl">🤖</span> */}
              <h3 className="text-lg font-semibold text-gray-800">
                AI Analysis (Grad-CAM)
              </h3>
            </div>
            <div className="relative group">
              <img
                src={analysisResult.gradcam_image_url}
                alt="AI Grad-CAM Analysis"
                className="w-full h-134 object-cover rounded-lg shadow-md border border-blue-200 group-hover:shadow-lg transition-shadow duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center">
              Heat map shows areas of AI focus during analysis
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleReset}
            className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm"
          >
            <span>🔄</span>
            <span>Analyze Another Scan</span>
          </button>
          <Link
            to="/history"
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
          >
            <span>📊</span>
            <span>View Full History</span>
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 text-center">
            <span className="font-semibold">⚠️ Medical Disclaimer:</span> This
            AI analysis is for informational purposes only. Always consult with
            qualified healthcare professionals for proper medical diagnosis and
            treatment.
          </p>
        </div>
      </div>
    );
  }

  // Upload Form UI
  return (
    <div className="bg-white rounded-2xl shadow-xl p-7 border border-gray-100">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🧠 MRI Brain Tumor Analysis
        </h2>
        <p className="text-gray-600 text-lg">
          Upload your MRI scan for AI-powered tumor detection
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            dragActive
              ? "border-blue-400 bg-blue-50"
              : file
              ? "border-green-400 bg-green-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {preview ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                <img
                  src={preview}
                  alt="MRI Preview"
                  className="max-h-64 rounded-lg shadow-lg object-contain mx-auto border border-gray-200"
                />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">✓</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 inline-block">
                <p className="font-semibold text-gray-700 text-sm">
                  {file.name}
                </p>
                <p className="text-gray-500 text-xs">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="text-sm font-semibold text-red-600 hover:text-red-700 underline hover:no-underline transition-all duration-200"
              >
                🗑️ Remove Image
              </button>
            </div>
          ) : (
            <label htmlFor="file-upload" className="cursor-pointer block">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto border-2 border-blue-200">
                  <svg
                    className="w-10 h-10 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-xl font-semibold text-gray-800 mb-1">
                    Upload MRI Scan
                  </p>
                  <p className="text-gray-600">
                    Click here or drag and drop your image
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Supports PNG, JPG files (max 10MB)
                  </p>
                </div>

                <div className="flex justify-center space-x-4 text-xs text-gray-400">
                  <span>✓ Secure</span>
                  <span>✓ Private</span>
                  <span>✓ Fast Analysis</span>
                </div>
              </div>

              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/jpg"
              />
            </label>
          )}
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            loading={loading}
            disabled={!file || !user}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <Spinner />
                <span>🔍 Analyzing Scan...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                {/* <span>🚀</span> */}
                <span>Start AI Analysis</span>
              </span>
            )}
          </Button>
        </div>

        {!user && (
          <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700 text-sm">
              <span className="font-semibold">👤 Login Required:</span> Please
              log in to analyze MRI scans
            </p>
          </div>
        )}
      </form>

      {/* Features Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-2xl mb-2 block">⚡</span>
          <h4 className="font-semibold text-gray-800 text-sm">Fast Analysis</h4>
          <p className="text-gray-600 text-xs">Results in under 60 seconds</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-2xl mb-2 block">🎯</span>
          <h4 className="font-semibold text-gray-800 text-sm">AI Precision</h4>
          <p className="text-gray-600 text-xs">Advanced deep learning models</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-2xl mb-2 block">🔒</span>
          <h4 className="font-semibold text-gray-800 text-sm">
            Secure & Private
          </h4>
          <p className="text-gray-600 text-xs">Your data stays protected</p>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
