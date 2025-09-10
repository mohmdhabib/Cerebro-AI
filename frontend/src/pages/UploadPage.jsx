import React from "react";
import UploadForm from "../components/UploadForm";

const UploadPage = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Upload MRI Scan</h1>
        <p className="text-gray-600 mb-6 text-center">
          Please upload a JPEG or PNG file of a brain MRI scan for analysis.
        </p>
        <UploadForm />
      </div>
    </div>
  );
};

export default UploadPage;
