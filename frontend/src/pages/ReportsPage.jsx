import React, { useState, useEffect } from "react";
import { getReports } from "../services/api";
import { Eye, Download, Share2 } from "lucide-react";

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await getReports();
        setReports(response.data); // Directly set the data from the API
      } catch (err) {
        setError("Failed to fetch reports.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading)
    return <div className="text-center p-10">Loading reports...</div>;
  if (error)
    return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
          <p className="mt-1 text-gray-600">
            Generate and manage patient reports.
          </p>
        </div>
        <button className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          + Generate Report
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm font-medium text-gray-700">Filters:</span>
        <select className="px-3 py-2 border rounded-lg text-sm">
          <option>Date Range</option>
        </select>
        <select className="px-3 py-2 border rounded-lg text-sm">
          <option>Patient</option>
        </select>
        <select className="px-3 py-2 border rounded-lg text-sm">
          <option>Report Type</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-600 uppercase">
                Report ID
              </th>
              <th className="p-4 text-sm font-semibold text-gray-600 uppercase">
                Patient
              </th>
              <th className="p-4 text-sm font-semibold text-gray-600 uppercase">
                Date
              </th>
              <th className="p-4 text-sm font-semibold text-gray-600 uppercase">
                Type
              </th>
              <th className="p-4 text-sm font-semibold text-gray-600 uppercase">
                Status
              </th>
              <th className="p-4 text-sm font-semibold text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <tr
                  key={report.report_id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="p-4 font-mono text-sm text-gray-600">
                    {report.report_id}
                  </td>
                  <td className="p-4 font-medium text-gray-800">
                    {report.patients.name}
                  </td>
                  <td className="p-4 text-gray-600">
                    {new Date(report.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-gray-600">{report.report_type}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full ${
                        report.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          report.status === "Completed"
                            ? "bg-green-600"
                            : "bg-yellow-600"
                        }`}
                      ></span>
                      {report.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3 text-gray-500">
                      <Eye
                        size={18}
                        className="cursor-pointer hover:text-gray-800"
                      />
                      <Download
                        size={18}
                        className="cursor-pointer hover:text-gray-800"
                      />
                      <Share2
                        size={18}
                        className="cursor-pointer hover:text-gray-800"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-10 text-gray-500">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsPage;
