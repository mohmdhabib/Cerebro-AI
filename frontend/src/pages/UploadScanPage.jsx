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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Upload Area */}
          <div>
            <h2 className="text-xl font-bold text-slate-800">Upload Scan</h2>
            <p className="text-sm text-slate-500 mt-1">
              Select a patient and upload their MRI/CT scan image.
            </p>

            <form onSubmit={handleSubmit} className="mt-6">
              <div className="space-y-4">
                {/* Patient Selection Dropdown */}
                <div>
                  <label
                    htmlFor="patient-select"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Select Patient
                  </label>
                  <select
                    id="patient-select"
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">-- Please choose a patient --</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} (Age: {patient.age})
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Drop Area */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ease-in-out
                    ${
                      isDragActive
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-300 hover:border-indigo-400"
                    }`}
                >
                  <input {...getInputProps()} />
                  <UploadCloud className="mx-auto text-slate-400" size={40} />
                  <p className="mt-3 text-sm text-slate-600">
                    {isDragActive
                      ? "Drop the file here..."
                      : "Drag & drop a file here, or click to select"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={!file || !selectedPatient || loading}
                  className="w-full flex justify-center items-center gap-2 px-4 py-2.5 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Uploading & Analyzing...
                    </>
                  ) : (
                    "Upload & Process Scan"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Preview & Status */}
          <div className="bg-slate-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-700">Preview</h3>
            <div className="mt-4 h-full min-h-[200px] flex flex-col items-center justify-center">
              {preview ? (
                <div className="w-full text-center">
                  <img
                    src={preview}
                    alt="Scan preview"
                    className="max-h-48 rounded-md mx-auto shadow-md"
                  />
                  <div className="mt-4 bg-white p-3 rounded-md border text-left text-sm flex items-center">
                    <FileImage size={24} className="text-indigo-500 shrink-0" />
                    <div className="ml-3 overflow-hidden">
                      <p className="font-medium text-slate-700 truncate">
                        {file.name}
                      </p>
                      <p className="text-slate-500">{formatBytes(file.size)}</p>
                    </div>
                    <button
                      onClick={removeFile}
                      className="ml-auto p-1 rounded-full hover:bg-slate-200"
                    >
                      <X size={16} className="text-slate-500" />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  Your selected scan will be previewed here.
                </p>
              )}

              {status.message && (
                <div
                  className={`mt-4 w-full flex items-start gap-3 p-3 text-sm rounded-md ${
                    status.type === "error"
                      ? "bg-red-50 text-red-800"
                      : status.type === "success"
                      ? "bg-green-50 text-green-800"
                      : "bg-blue-50 text-blue-800"
                  }`}
                >
                  {status.type === "error" && (
                    <AlertTriangle size={18} className="shrink-0" />
                  )}
                  {status.type === "success" && (
                    <CheckCircle2 size={18} className="shrink-0" />
                  )}
                  <p>{status.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadScanPage;
