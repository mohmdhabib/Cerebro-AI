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
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Spinner />
            </div>
            <div className="absolute -inset-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-ping opacity-20"></div>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-800">
              🧠 Analyzing Your MRI Scan
            </h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              Our advanced AI is carefully examining your scan for detailed
              insights
            </p>
            <p className="text-gray-500 text-sm">
              This process typically takes 30-60 seconds
            </p>
          </div>

          <div className="w-72 bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full animate-pulse transition-all duration-1000"
              style={{ width: "75%" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (analysisResult) {
    const isNoTumor = analysisResult.prediction === "No Tumor";

    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        {/* Results Header */}
        <div className="text-center mb-6">
          <div className="mb-4">
            {isNoTumor ? (
              <div className="inline-flex items-center space-x-3 px-6 py-3 bg-emerald-50 rounded-full border border-emerald-200 shadow-sm">
                <span className="text-3xl">✅</span>
                <span className="text-emerald-700 font-bold text-lg">
                  Great News!
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center space-x-3 px-6 py-3 bg-orange-50 rounded-full border border-orange-200 shadow-sm">
                <span className="text-3xl">⚠️</span>
                <span className="text-orange-700 font-bold text-lg">
                  Requires Attention
                </span>
              </div>
            )}
          </div>

          <h2 className="text-3xl font-bold mb-4">
            {isNoTumor ? (
              <span className="text-emerald-600">No Tumor Detected</span>
            ) : (
              <span className="text-orange-600">Tumor Detected</span>
            )}
          </h2>

          <div className="bg-slate-50 rounded-xl p-4 inline-block border border-slate-200">
            <p className="text-slate-700 text-base font-medium">
              AI Prediction:{" "}
              <span className="font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full ml-2 border border-blue-200">
                {analysisResult.prediction}
              </span>
            </p>
          </div>
        </div>

        {/* Image Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Original Scan */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">📋</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800">
                Original MRI Scan
              </h3>
            </div>
            <div className="relative overflow-hidden rounded-lg border-2 border-slate-200">
              <img
                src={preview}
                alt="Uploaded MRI"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">🤖</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800">
                AI Analysis (Grad-CAM)
              </h3>
            </div>
            <div className="relative overflow-hidden rounded-lg border-2 border-blue-200">
              <img
                src={analysisResult.gradcam_image_url}
                alt="AI Grad-CAM Analysis"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-xs text-slate-600 mt-2 text-center font-medium">
              Heat map highlights areas of AI focus during analysis
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
          <button
            onClick={handleReset}
            className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm"
          >
            <span className="text-lg">🔄</span>
            <span>Analyze Another Scan</span>
          </button>
          <Link
            to="/history"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
          >
            <span className="text-lg">📊</span>
            <span>View Full History</span>
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm text-amber-800 text-center">
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
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
          <span className="text-2xl">🧠</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          MRI Brain Tumor Analysis
        </h2>
        <p className="text-gray-600 text-lg max-w-md mx-auto">
          Upload your MRI scan for AI-powered tumor detection
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            dragActive
              ? "border-blue-400 bg-blue-50 scale-105"
              : file
              ? "border-emerald-400 bg-emerald-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {preview ? (
            <div className="flex flex-col items-center justify-center space-y-6">
              {/* Success Badge */}
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-100 border border-emerald-300 rounded-full">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <span className="text-emerald-700 font-semibold text-sm">
                  Image uploaded successfully
                </span>
              </div>

              {/* Image Preview Container */}
              <div className="relative group">
                <div className="p-4 bg-white border-2 border-emerald-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <img
                    src={preview}
                    alt="MRI Preview"
                    className="w-80 h-64 object-contain rounded-xl mx-auto"
                  />
                </div>

                {/* Hover overlay with info */}
                <div className="absolute inset-0 bg-black/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
                    <p className="text-slate-700 font-medium text-sm">
                      Ready for analysis
                    </p>
                  </div>
                </div>
              </div>

              {/* File Info Card */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4 min-w-64 text-center shadow-sm">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">📄</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm truncate max-w-48">
                      {file.name}
                    </p>
                    <p className="text-slate-500 text-xs">
                      {(file.size / 1024 / 1024).toFixed(2)} MB •{" "}
                      {file.type.split("/")[1].toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-white border-2 border-red-200 text-red-600 font-semibold rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-sm"
                >
                  <span className="text-lg">🗑️</span>
                  <span>Remove</span>
                </button>

                <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <span className="text-emerald-600 text-lg">🚀</span>
                  <span className="text-emerald-700 font-medium text-sm">
                    Ready to analyze
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <label htmlFor="file-upload" className="cursor-pointer block">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto border-2 border-blue-200 shadow-sm">
                  <svg
                    className="w-8 h-8 text-blue-500"
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

                <div className="space-y-2">
                  <p className="text-xl font-semibold text-gray-800">
                    Upload MRI Scan
                  </p>
                  <p className="text-gray-600">
                    Click here or drag and drop your image
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports PNG, JPG files (max 10MB)
                  </p>
                </div>

                <div className="flex justify-center space-x-6 text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <span>🔒</span>
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>🔐</span>
                    <span>Private</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>⚡</span>
                    <span>Fast</span>
                  </div>
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

        {/* Submit Button */}
        <div>
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
                <span>🚀</span>
                <span>Start AI Analysis</span>
              </span>
            )}
          </Button>
        </div>

        {/* Login Warning */}
        {!user && (
          <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-blue-700 text-sm">
              <span className="font-semibold">👤 Login Required:</span> Please
              log in to analyze MRI scans
            </p>
          </div>
        )}
      </form>

      {/* Features Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
            <span className="text-white text-xl">⚡</span>
          </div>
          <h4 className="font-semibold text-slate-800 text-sm mb-1">
            Fast Analysis
          </h4>
          <p className="text-slate-600 text-xs">Results in under 60 seconds</p>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
            <span className="text-white text-xl">🎯</span>
          </div>
          <h4 className="font-semibold text-slate-800 text-sm mb-1">
            AI Precision
          </h4>
          <p className="text-slate-600 text-xs">
            Advanced deep learning models
          </p>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
            <span className="text-white text-xl">🔒</span>
          </div>
          <h4 className="font-semibold text-slate-800 text-sm mb-1">
            Secure & Private
          </h4>
          <p className="text-slate-600 text-xs">Your data stays protected</p>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
