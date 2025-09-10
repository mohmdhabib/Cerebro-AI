import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import api from "../services/api";
import toast from "react-hot-toast";
import ResultCard from "../components/dashboard/ResultCard";
import Spinner from "../components/shared/Spinner";

const PatientHistoryPage = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) return;
      try {
        const { data } = await api.get("/reports");
        setReports(data);
      } catch (error) {
        toast.error("Failed to fetch your history.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [user]);

  if (loading)
    return (
      <div className="flex justify-center mt-16">
        <Spinner />
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Scan History</h1>
      {reports.length === 0 ? (
        <p>You have not uploaded any scans yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <ResultCard key={report.id} report={report} patientView={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientHistoryPage;
