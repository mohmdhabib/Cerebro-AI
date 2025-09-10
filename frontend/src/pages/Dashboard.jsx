import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import api from "../services/api";
import toast from "react-hot-toast";
import ResultCard from "../components/dashboard/ResultCard";
import Spinner from "../components/shared/Spinner";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Enhanced Icon component for dashboard
const DashboardIcon = ({ path, className = "w-6 h-6" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d={path}
    />
  </svg>
);

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/reports");
        setReports(data);
      } catch (error) {
        toast.error("Failed to fetch reports.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReports();
    }
  }, [user]);

  // Prepare data for charts
  const prepareChartData = () => {
    const predictionCounts = {};
    const confidenceData = {};
    const monthlyData = {};

    reports.forEach((report) => {
      // For prediction type pie chart
      const prediction = report.prediction || "Unknown";
      predictionCounts[prediction] = (predictionCounts[prediction] || 0) + 1;

      // For confidence level data
      if (!confidenceData[prediction]) {
        confidenceData[prediction] = [];
      }
      confidenceData[prediction].push(report.confidence);

      // For monthly trend data
      const month = new Date(report.created_at).toLocaleString("default", {
        month: "short",
      });
      if (!monthlyData[month]) {
        monthlyData[month] = {};
      }
      monthlyData[month][prediction] =
        (monthlyData[month][prediction] || 0) + 1;
    });

    return { predictionCounts, confidenceData, monthlyData };
  };

  const { predictionCounts, confidenceData, monthlyData } = reports.length
    ? prepareChartData()
    : { predictionCounts: {}, confidenceData: {}, monthlyData: {} };

  const chartColors = [
    "#4F46E5",
    "#06B6D4",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
  ];

  // Prepare pie chart data
  const pieChartData = {
    labels: Object.keys(predictionCounts),
    datasets: [
      {
        data: Object.values(predictionCounts),
        backgroundColor: chartColors,
        borderWidth: 0,
        borderRadius: 8,
      },
    ],
  };

  // Prepare bar chart data for average confidence
  const confidenceChartData = {
    labels: Object.keys(confidenceData),
    datasets: [
      {
        label: "Average Confidence (%)",
        data: Object.entries(confidenceData).map(([key, values]) => {
          const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
          return (avg * 100).toFixed(1);
        }),
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        borderColor: "#4F46E5",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Prepare line chart data for monthly trends
  const monthsOrder = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const sortedMonths = Object.keys(monthlyData).sort(
    (a, b) => monthsOrder.indexOf(a) - monthsOrder.indexOf(b)
  );
  const allPredictions = Object.keys(predictionCounts);

  const lineChartData = {
    labels: sortedMonths,
    datasets: allPredictions.map((prediction, index) => ({
      label: prediction,
      data: sortedMonths.map((month) => monthlyData[month][prediction] || 0),
      borderColor: chartColors[index % chartColors.length],
      backgroundColor: `${chartColors[index % chartColors.length]}33`, // Add alpha for fill
      fill: true,
      tension: 0.3,
    })),
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-slate-600 font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  const tumorDetectedCount = reports.filter(
    (r) => r.prediction && r.prediction.toLowerCase() !== "notumor"
  ).length;
  const latestScanDate =
    reports.length > 0
      ? new Date(reports[0].created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border border-blue-100 shadow-sm">
        <div className="relative px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-3 tracking-tight">
                Welcome back,{" "}
                {profile?.full_name?.split(" ")[0] ||
                  user?.email?.split("@")[0]}
                !
              </h1>
              <p className="text-slate-600 text-lg font-medium">
                {profile?.role} Dashboard - Brain Scan Analysis Overview
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-24 h-24 bg-blue-100 rounded-3xl flex items-center justify-center">
                <DashboardIcon
                  path="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  className="w-12 h-12 text-blue-600"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200/30 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-200/30 rounded-full blur-xl"></div>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <DashboardIcon
              path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              className="w-10 h-10 text-slate-400"
            />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No Reports Found
          </h3>
          <p className="text-slate-600 text-lg mb-6">
            {profile?.role === "Patient"
              ? "Upload your first brain scan to get started with AI-powered analysis."
              : "No patient reports are available yet."}
          </p>
          {profile?.role === "Patient" && (
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md">
              Upload First Scan
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <DashboardIcon
                    path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    className="w-8 h-8 text-blue-600"
                  />
                </div>
                <span className="text-4xl font-bold text-slate-800">
                  {reports.length}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Total Scans
              </h3>
              <p className="text-slate-500 text-sm">Brain scans analyzed</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
                  <DashboardIcon
                    path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                    className="w-8 h-8 text-red-600"
                  />
                </div>
                <span className="text-4xl font-bold text-slate-800">
                  {tumorDetectedCount}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Tumors Detected
              </h3>
              <p className="text-slate-500 text-sm">Positive findings</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
                  <DashboardIcon
                    path="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m0 0h3a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3m0 0V7"
                    className="w-8 h-8 text-green-600"
                  />
                </div>
                <span className="text-2xl font-bold text-slate-800">
                  {latestScanDate}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Latest Scan
              </h3>
              <p className="text-slate-500 text-sm">Most recent analysis</p>
            </div>
          </div>

          {/* Analytics Section */}
          {Object.keys(predictionCounts).length > 0 && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Analytics Overview
                </h2>
                <p className="text-slate-600">
                  Comprehensive analysis of scan results and patterns
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Diagnosis Distribution */}
                <div className="bg-slate-50 rounded-2xl p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-3">
                      <DashboardIcon
                        path="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512a9.025 9.025 0 015.488 5.488z"
                        className="w-6 h-6 text-purple-600"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Diagnosis Distribution
                    </h3>
                  </div>
                  <div className="h-80 flex items-center justify-center">
                    <Pie
                      data={pieChartData}
                      options={{
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                            labels: {
                              padding: 20,
                              usePointStyle: true,
                              font: {
                                size: 11,
                                weight: "500",
                              },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                {/* Confidence Levels */}
                <div className="bg-slate-50 rounded-2xl p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mr-3">
                      <DashboardIcon
                        path="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                        className="w-6 h-6 text-indigo-600"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Confidence by Diagnosis
                    </h3>
                  </div>
                  <div className="h-80">
                    <Bar
                      data={confidenceChartData}
                      options={{
                        maintainAspectRatio: false,
                        responsive: true,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 100,
                            title: {
                              display: true,
                              text: "Confidence (%)",
                              font: {
                                size: 12,
                                weight: "600",
                              },
                            },
                            grid: {
                              color: "rgba(148, 163, 184, 0.1)",
                            },
                          },
                          x: {
                            grid: {
                              display: false,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                {/* Scan Trends Line Chart */}
                <div className="bg-slate-50 rounded-2xl p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mr-3">
                      <DashboardIcon
                        path="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        className="w-6 h-6 text-cyan-600"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Scan Trends
                    </h3>
                  </div>
                  <div className="h-80">
                    <Line
                      data={lineChartData}
                      options={{
                        maintainAspectRatio: false,
                        responsive: true,
                        plugins: {
                          legend: {
                            position: "bottom",
                            labels: {
                              padding: 20,
                              usePointStyle: true,
                              font: {
                                size: 11,
                                weight: "500",
                              },
                            },
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: "Number of Scans",
                              font: {
                                size: 12,
                                weight: "600",
                              },
                            },
                            grid: {
                              color: "rgba(148, 163, 184, 0.1)",
                            },
                          },
                          x: {
                            grid: {
                              display: false,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Recent Activity
                </h2>
                <p className="text-slate-600">
                  Latest scan results and analysis
                </p>
              </div>
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                <DashboardIcon
                  path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  className="w-6 h-6 text-cyan-600"
                />
              </div>
            </div>

            <div className="space-y-4">
              {reports.slice(0, 5).map((report) => (
                <div
                  key={report.id}
                  className="flex items-center p-6 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all duration-200"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden mr-6 flex-shrink-0">
                    <img
                      src={report.image_url}
                      alt="Brain scan"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target;
                        target.style.display = "none";
                        const nextSibling = target.nextSibling;
                        if (nextSibling) {
                          nextSibling.style.display = "flex";
                        }
                      }}
                    />
                    <div className="w-full h-full hidden items-center justify-center">
                      <DashboardIcon
                        path="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        className="w-6 h-6 text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-slate-800 truncate">
                        {report.prediction || "Unknown"}
                      </h4>
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium ${
                          report.prediction &&
                          report.prediction.toLowerCase() !== "notumor"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {(report.confidence * 100).toFixed(1)}% confidence
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">
                      {new Date(report.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {reports.length > 5 && (
              <div className="mt-6 text-center">
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:bg-blue-50 px-6 py-3 rounded-xl transition-all duration-200">
                  View all {reports.length} reports →
                </button>
              </div>
            )}
          </div>

          {/* All Reports Grid */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  All Reports
                </h2>
                <p className="text-slate-600">
                  Complete overview of all scan analyses
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <DashboardIcon
                  path="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  className="w-6 h-6 text-amber-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="transform hover:scale-[1.02] transition-transform duration-300"
                >
                  <ResultCard report={report} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
