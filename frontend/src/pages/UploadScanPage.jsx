import React, { useState } from "react";
import { UploadCloud } from "lucide-react";
import { uploadScan } from "../services/api";

const UploadScanPage = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus({ message: "Please select a file to upload.", type: "error" });
      return;
    }

    setLoading(true);
    setStatus({ message: "Uploading...", type: "info" });

    const formData = new FormData();
    formData.append("file", file);
    // In a real app, you'd select a patient from a dropdown.
    // For this example, you need to provide a valid UUID of a patient from your database.
    formData.append("patient_id", "REPLACE_WITH_A_REAL_PATIENT_UUID");

    try {
      await uploadScan(formData);
      setStatus({
        message: "File uploaded successfully! Processing has begun.",
        type: "success",
      });
      setFile(null);
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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Scan</h2>
        <p className="text-gray-600 mb-6">
          Drag and drop MRI/CT scans here or browse from your computer.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:border-cyan-500 transition-colors">
            <UploadCloud className="mx-auto text-gray-400" size={48} />
            <p className="mt-4 text-gray-600">
              {file ? file.name : "Drag and drop files here"}
            </p>
            <p className="text-sm text-gray-500 mt-1">or</p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
            <label
              htmlFor="file-upload"
              className="mt-2 inline-block px-4 py-2 text-sm font-semibold bg-cyan-100 text-cyan-800 rounded-lg hover:bg-cyan-200 cursor-pointer"
            >
              Browse Files
            </label>
          </div>

          {status.message && (
            <p
              className={`mt-4 text-sm text-center ${
                status.type === "error"
                  ? "text-red-600"
                  : status.type === "success"
                  ? "text-green-600"
                  : "text-gray-600"
              }`}
            >
              {status.message}
            </p>
          )}

          <div className="mt-6 text-center">
            <button
              type="submit"
              disabled={!file || loading}
              className="px-8 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Uploading..." : "Upload & Process Scan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadScanPage;
