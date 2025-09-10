import React, { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import ResultCard from "../components/dashboard/ResultCard";
import Spinner from "../components/shared/Spinner";

const AllReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await api.get("/reports");
        setReports(data);
      } catch (error) {
        toast.error("Failed to fetch reports.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center mt-16">
        <Spinner />
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">All Patient Reports</h1>
      {reports.length === 0 ? (
        <p>No reports have been submitted yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <ResultCard key={report.id} report={report} patientView={false} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllReportsPage;
