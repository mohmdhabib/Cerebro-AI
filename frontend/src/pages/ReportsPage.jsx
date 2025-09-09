import React, { useState, useEffect, useMemo } from "react";
import { getReports, getPatients } from "../services/api";
import { Eye, Download, Share2, Search, Loader2 } from "lucide-react";

// --- Pagination Component ---
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm font-medium text-slate-600 bg-white border rounded-md disabled:opacity-50"
      >
        Previous
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-3 py-1 text-sm font-medium border rounded-md ${
            currentPage === number
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-slate-600"
          }`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm font-medium text-slate-600 bg-white border rounded-md disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

// --- Main Reports Page Component ---
const ReportsPage = () => {
  const [allReports, setAllReports] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for filters and pagination
  const [filters, setFilters] = useState({ patient: "all", status: "all" });
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsResponse, patientsResponse] = await Promise.all([
          getReports(),
          getPatients(),
        ]);
        setAllReports(reportsResponse.data);
        setPatients(patientsResponse.data);
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Memoized filtering logic
  const filteredReports = useMemo(() => {
    return allReports.filter((report) => {
      const patientMatch =
        filters.patient === "all" || report.patients.name === filters.patient;
      const statusMatch =
        filters.status === "all" ||
        report.status.toLowerCase() === filters.status;
      return patientMatch && statusMatch;
    });
  }, [allReports, filters]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(
    indexOfFirstReport,
    indexOfLastReport
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 text-red-500 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Reports
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Generate and manage patient reports.
          </p>
        </div>
        <button className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
          + Generate Report
        </button>
      </div>

      {/* Filters Card */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-slate-700">Filters:</span>
          <select
            name="patient"
            onChange={handleFilterChange}
            className="px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Patients</option>
            {patients.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
          <select
            name="status"
            onChange={handleFilterChange}
            className="px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Reports Table Card */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Report ID
              </th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Date
              </th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Type
              </th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {currentReports.length > 0 ? (
              currentReports.map((report) => (
                <tr key={report.report_id} className="hover:bg-slate-50">
                  <td className="p-4 font-mono text-sm text-slate-600">
                    {report.report_id}
                  </td>
                  <td className="p-4 font-medium text-slate-800">
                    {report.patients.name}
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {new Date(report.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {report.report_type}
                  </td>
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
                    <div className="flex gap-3 text-slate-500">
                      <button
                        title="View Report"
                        className="hover:text-indigo-600"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        title="Download PDF"
                        className="hover:text-indigo-600"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        title="Share Report"
                        className="hover:text-indigo-600"
                      >
                        <Share2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-10 text-slate-500">
                  No reports found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-slate-600">
            Showing {indexOfFirstReport + 1} to{" "}
            {Math.min(indexOfLastReport, filteredReports.length)} of{" "}
            {filteredReports.length} results
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
