import React, { useEffect } from "react";
import { format } from "date-fns";

const ResultCard = ({ report, patientView = true }) => {
  const { image_url, prediction, confidence, created_at, patient_name } =
    report;
  const confidencePercentage = (confidence * 100).toFixed(1);
  const isTumor = prediction && prediction.toLowerCase() !== "no tumor";

  useEffect(() => {
    // Debug the image URL
    console.log(`Image URL for report: ${image_url}`);

    // Test if the URL is accessible
    fetch(image_url, { method: "HEAD" })
      .then((response) => {
        console.log(`Image URL status: ${response.status}`);
      })
      .catch((error) => {
        console.error(`Error checking image URL: ${error}`);
      });
  }, [image_url]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <img
        src={image_url}
        alt="MRI Scan"
        className="w-full h-56 object-cover"
        onError={(e) => {
          console.error(`Image failed to load: ${image_url}`);
          e.target.src =
            "https://via.placeholder.com/400x300?text=Image+Not+Available";
        }}
      />
      <div className="p-4">
        <h3
          className={`text-xl font-bold ${
            isTumor ? "text-red-600" : "text-green-600"
          }`}
        >
          {prediction || "N/A"}
        </h3>
        <p className="text-sm font-semibold text-blue-600">
          Confidence: {confidencePercentage}%
        </p>
        <div className="text-xs text-gray-500 mt-4">
          {!patientView && <p>Patient: {patient_name || "N/A"}</p>}
          <p>Analyzed on: {format(new Date(created_at), "PPP")}</p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
