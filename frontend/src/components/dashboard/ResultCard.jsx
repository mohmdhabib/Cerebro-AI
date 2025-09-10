import React from "react";
import { format } from "date-fns";

const ResultCard = ({ report }) => {
  const { image_url, prediction, confidence, created_at, profiles } = report;
  const confidencePercentage = (confidence * 100).toFixed(1);
  const isHighConfidence = confidence > 0.9;
  const isTumor = prediction !== "No Tumor";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <img
        src={image_url}
        alt="MRI Scan"
        className="w-full h-56 object-cover"
      />
      <div className="p-4">
        <h3
          className={`text-xl font-bold ${
            isTumor ? "text-red-600" : "text-green-600"
          }`}
        >
          {prediction}
        </h3>
        <p
          className={`text-sm font-semibold ${
            isHighConfidence ? "text-blue-600" : "text-yellow-600"
          }`}
        >
          Confidence: {confidencePercentage}%
        </p>
        <div className="text-xs text-gray-500 mt-4">
          <p>Patient: {profiles?.full_name || "N/A"}</p>
          <p>Analyzed on: {format(new Date(created_at), "PPP")}</p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
