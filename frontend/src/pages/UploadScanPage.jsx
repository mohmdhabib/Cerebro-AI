import React, { useState, useEffect } from "react";
import {
  UploadCloud,
  FileImage,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { uploadScan, getPatients } from "../services/api";
import { useDropzone } from "react-dropzone";

const UploadScanPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  // Fetch patients for the dropdown menu
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getPatients();
        setPatients(response.data);
      } catch (error) {
        setStatus({
          message: "Could not load patient list.",
          type: "error",
        });
      }
    };
    fetchPatients();
  }, []);

  // Configure react-dropzone
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setStatus({ message: "", type: "" });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".gif", ".jpeg", ".jpg"] },
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus({ message: "Please select a file to upload.", type: "error" });
      return;
    }
    if (!selectedPatient) {
      setStatus({ message: "Please select a patient.", type: "error" });
      return;
    }

    setLoading(true);
    setStatus({
      message: "Uploading & initializing analysis...",
      type: "info",
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("patient_id", selectedPatient);

    try {
      await uploadScan(formData);
      setStatus({
        message: "Scan uploaded successfully! Analysis is now in progress.",
        type: "success",
      });
      setFile(null);
      setPreview(null);
      setSelectedPatient("");
    } catch (error) {
      setStatus({
        message:
          error.response?.data?.error || "Upload failed. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper to format file size
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
            <UploadCloud className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Medical Scan Upload
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Upload and analyze medical imaging scans with our advanced
            AI-powered diagnostic system. Select a patient and upload their MRI
            or CT scan for instant analysis.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden backdrop-blur-sm bg-white/95">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left Column: Upload Form */}
            <div className="p-8 lg:p-10 border-r border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-sm">1</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Upload Details
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Patient Selection */}
                <div className="space-y-2">
                  <label
                    htmlFor="patient-select"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Select Patient
                  </label>
                  <div className="relative">
                    <select
                      id="patient-select"
                      value={selectedPatient}
                      onChange={(e) => setSelectedPatient(e.target.value)}
                      className="block w-full px-4 py-3 pr-10 bg-white border-2 border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 cursor-pointer transition-all duration-200 hover:border-indigo-300 hover:shadow-md appearance-none"
                      style={{
                        backgroundImage: "none",
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                      }}
                    >
                      <option value="" className="text-slate-500">
                        Choose a patient
                      </option>
                      {patients.map((patient) => (
                        <option
                          key={patient.id}
                          value={patient.id}
                          className="text-slate-700 py-2"
                        >
                          {patient.name} (Age: {patient.age})
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-slate-400 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Enhanced File Drop Area */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Medical Scan Image
                  </label>
                  <div
                    {...getRootProps()}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ease-in-out group
                      ${
                        isDragActive
                          ? "border-indigo-500 bg-indigo-50 scale-[1.02]"
                          : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50"
                      }`}
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                          isDragActive
                            ? "bg-indigo-100 scale-110"
                            : "bg-slate-100 group-hover:bg-indigo-50"
                        }`}
                      >
                        <UploadCloud
                          className={`transition-all duration-300 ${
                            isDragActive
                              ? "text-indigo-600"
                              : "text-slate-500 group-hover:text-indigo-500"
                          }`}
                          size={32}
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">
                        {isDragActive
                          ? "Drop your scan here"
                          : "Upload Medical Scan"}
                      </h3>
                      <p className="text-sm text-slate-600 mb-2">
                        {isDragActive
                          ? "Release to upload your file"
                          : "Drag & drop your scan here, or click to browse"}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="px-2 py-1 bg-slate-100 rounded-full">
                          PNG
                        </span>
                        <span className="px-2 py-1 bg-slate-100 rounded-full">
                          JPG
                        </span>
                        <span className="px-2 py-1 bg-slate-100 rounded-full">
                          GIF
                        </span>
                        <span className="text-slate-400">•</span>
                        <span>Max 10MB</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Submit Button */}
                <button
                  type="submit"
                  disabled={!file || !selectedPatient || loading}
                  className="w-full flex justify-center items-center gap-3 px-6 py-4 font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl shadow-lg hover:shadow-xl disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100 relative overflow-hidden"
                >
                  {loading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-700 flex items-center justify-center">
                      <Loader2 className="animate-spin mr-2" size={20} />
                      <span>Processing...</span>
                    </div>
                  )}
                  {!loading && (
                    <>
                      <UploadCloud size={20} />
                      Upload & Analyze Scan
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Column: Preview & Status */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-700">
                  Preview & Status
                </h3>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 min-h-[400px] flex flex-col">
                {preview ? (
                  <div className="text-center flex-1">
                    <div className="mb-4">
                      <img
                        src={preview}
                        alt="Scan preview"
                        className="max-h-64 w-auto rounded-xl mx-auto shadow-lg border border-slate-200"
                      />
                    </div>

                    {/* Enhanced File Info Card */}
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-100 text-left">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <FileImage size={20} className="text-indigo-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-slate-800 truncate text-sm">
                              {file.name}
                            </p>
                            <p className="text-slate-500 text-xs">
                              {formatBytes(file.size)} • Image File
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={removeFile}
                          className="w-8 h-8 rounded-full hover:bg-red-100 flex items-center justify-center transition-colors duration-200 group"
                        >
                          <X
                            size={16}
                            className="text-slate-500 group-hover:text-red-500"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                    <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                      <FileImage size={32} className="text-slate-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-slate-600 mb-2">
                      No Scan Selected
                    </h4>
                    <p className="text-sm text-slate-500 max-w-xs">
                      Upload a medical scan image to see the preview and file
                      details here.
                    </p>
                  </div>
                )}

                {/* Enhanced Status Messages */}
                {status.message && (
                  <div
                    className={`mt-4 flex items-start gap-3 p-4 text-sm rounded-xl border-2 transition-all duration-300 ${
                      status.type === "error"
                        ? "bg-red-50 text-red-800 border-red-200"
                        : status.type === "success"
                        ? "bg-green-50 text-green-800 border-green-200"
                        : "bg-blue-50 text-blue-800 border-blue-200"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        status.type === "error"
                          ? "bg-red-100"
                          : status.type === "success"
                          ? "bg-green-100"
                          : "bg-blue-100"
                      }`}
                    >
                      {status.type === "error" && (
                        <AlertTriangle size={14} className="text-red-600" />
                      )}
                      {status.type === "success" && (
                        <CheckCircle2 size={14} className="text-green-600" />
                      )}
                      {status.type === "info" && (
                        <Loader2
                          size={14}
                          className="text-blue-600 animate-spin"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{status.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Supported formats: PNG, JPG, GIF • Maximum file size: 10MB •
            <span className="font-medium">
              {" "}
              Secure & HIPAA compliant processing
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadScanPage;
