import React, { useState, useEffect } from "react";
import { getPatients } from "../services/api";
import { Search } from "lucide-react";

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getPatients();
        setPatients(response.data); // Directly set the data from the API
      } catch (err) {
        setError("Failed to fetch patients.");
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const getDiagnosisColor = (summary) => {
    if (!summary) return "bg-gray-100 text-gray-800";
    const lowerCaseSummary = summary.toLowerCase();
    if (lowerCaseSummary.includes("confirmed"))
      return "bg-red-100 text-red-800";
    if (lowerCaseSummary.includes("suspected"))
      return "bg-yellow-100 text-yellow-800";
    if (lowerCaseSummary.includes("no tumor"))
      return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  if (loading)
    return <div className="text-center p-10">Loading patients...</div>;
  if (error)
    return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Patient History</h1>
          <p className="mt-1 text-gray-600">
            Manage and view patient records with ease.
          </p>
        </div>
        <button className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          + Add New Patient
        </button>
      </div>

      <div className="relative mb-6">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search patients by name, ID, or diagnosis"
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-600 uppercase">
                Name
              </th>
              <th className="p-4 text-sm font-semibold text-gray-600 uppercase">
                Age
              </th>
              <th className="p-4 text-sm font-semibold text-gray-600 uppercase">
                Last Consultation
              </th>
              <th className="p-4 text-sm font-semibold text-gray-600 uppercase">
                Diagnosis Summary
              </th>
              <th className="p-4 text-sm font-semibold text-gray-600 uppercase"></th>
            </tr>
          </thead>
          <tbody>
            {patients.length > 0 ? (
              patients.map((patient) => (
                <tr
                  key={patient.id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="p-4 font-medium text-gray-800">
                    {patient.name}
                  </td>
                  <td className="p-4 text-gray-600">{patient.age}</td>
                  <td className="p-4 text-gray-600">
                    {patient.last_consultation}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getDiagnosisColor(
                        patient.diagnosis_summary
                      )}`}
                    >
                      {patient.diagnosis_summary || "N/A"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="font-medium text-blue-600 hover:underline">
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-10 text-gray-500">
                  No patient data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientsPage;
