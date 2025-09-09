import React, { useState, useEffect } from "react";
import { getScans } from "../services/api";
import { Share2, Download, MessageSquare } from "lucide-react";

const Dashboard = () => {
  const [latestScan, setLatestScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLatestScan = async () => {
      try {
        const response = await getScans();
        // Find the most recent scan that is "Completed"
        const completedScans = response.data.filter(
          (scan) => scan.status === "Completed"
        );
        if (completedScans.length > 0) {
          setLatestScan(completedScans[0]); // The list is already sorted by newest
        } else {
          setError("No completed scans found to display on the dashboard.");
        }
      } catch (err) {
        setError("Failed to fetch recent scan data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestScan();
  }, []);

  if (loading)
    return <div className="text-center p-10">Loading Dashboard Data...</div>;

  if (error || !latestScan) {
    return (
      <div className="text-center p-10 bg-white rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-700">
          Dashboard Unavailable
        </h3>
        <p className="text-gray-500 mt-2">
          {error ||
            "Please upload and process a scan to see dashboard results."}
        </p>
      </div>
    );
  }

  const { patients: patientDetails, ...scanResults } = latestScan;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Results Panel */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Results Panel (Latest Scan)
          </h3>
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={scanResults.image_url}
              alt="MRI Scan"
              className="w-full md:w-1/2 rounded-lg object-cover bg-gray-100"
            />
            <div>
              <h4 className="font-bold text-lg">Detected Tumor Area</h4>
              <p className="text-sm text-gray-600 mt-1">
                Annotated scan for {patientDetails.name}.
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <strong>Tumor Size:</strong> {scanResults.tumor_size || "N/A"}
                </p>
                <p>
                  <strong>Location:</strong> {scanResults.location || "N/A"}
                </p>
                <p>
                  <strong>Severity:</strong>{" "}
                  <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                    {scanResults.severity || "N/A"}
                  </span>
                </p>
                <p>
                  <strong>Confidence Score:</strong>{" "}
                  <span className="font-bold text-green-600">
                    {scanResults.confidence_score * 100 || "N/A"}%
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 border-t pt-4">
            <h4 className="font-semibold text-gray-800">
              Follow-up Suggestions
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {scanResults.follow_up_suggestions || "No suggestions available."}
            </p>
          </div>
        </div>

        {/* Interactive Charts & Graphs */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-gray-800">
            Interactive Charts & Graphs
          </h3>
          <p className="text-gray-500 mt-2">
            Chart components would be rendered here.
          </p>
        </div>
      </div>

      {/* Side Column */}
      <div className="space-y-6">
        {/* Patient Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Patient Details
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-medium">{patientDetails.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Age</p>
              <p className="font-medium">{patientDetails.age}</p>
            </div>
            <div>
              <p className="text-gray-500">Medical History</p>
              <p className="font-medium">{patientDetails.medical_history}</p>
            </div>
            <div>
              <p className="text-gray-500">Diagnosis Summary</p>
              <p className="font-medium">{patientDetails.diagnosis_summary}</p>
            </div>
            <div>
              <p className="text-gray-500">Last Consultation</p>
              <p className="font-medium">{patientDetails.last_consultation}</p>
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-2 py-2 px-4 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
              <Share2 size={16} /> Share Report
            </button>
            <button className="w-full flex items-center justify-center gap-2 py-2 px-4 font-semibold text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200">
              <Download size={16} /> Download PDF
            </button>
            <button className="w-full flex items-center justify-center gap-2 py-2 px-4 font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
              <MessageSquare size={16} /> Contact Specialist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
