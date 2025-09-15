import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import api from "../services/api";
import toast from "react-hot-toast";
import ResultCard from "../components/dashboard/ResultCard";
import Spinner from "../components/shared/Spinner";
import ChatBot from "../components/chatbot/ChatBot";
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
  RadialLinearScale,
  Filler,
} from "chart.js";
import { Pie, Bar, Line, Doughnut, PolarArea, Radar } from "react-chartjs-2";
import { Link } from "react-router-dom";

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
  Legend,
  RadialLinearScale,
  Filler
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
  const safeReports = Array.isArray(reports) ? reports : [];

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
    const severityData = {};
    const timeAnalysis = {};
    const riskAssessment = {};

    if (!Array.isArray(reports)) {
      return {
        predictionCounts,
        confidenceData,
        monthlyData,
        severityData,
        timeAnalysis,
        riskAssessment,
      };
    }

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

      // For severity analysis (based on confidence and prediction type)
      const severity =
        report.confidence > 0.8
          ? "High"
          : report.confidence > 0.6
          ? "Medium"
          : "Low";
      severityData[severity] = (severityData[severity] || 0) + 1;

      // For time-based analysis
      const hour = new Date(report.created_at).getHours();
      const timeSlot =
        hour < 6
          ? "Night"
          : hour < 12
          ? "Morning"
          : hour < 18
          ? "Afternoon"
          : "Evening";
      timeAnalysis[timeSlot] = (timeAnalysis[timeSlot] || 0) + 1;

      // For risk assessment
      const isHighRisk =
        prediction.toLowerCase() !== "notumor" && report.confidence > 0.7;
      riskAssessment[isHighRisk ? "High Risk" : "Low Risk"] =
        (riskAssessment[isHighRisk ? "High Risk" : "Low Risk"] || 0) + 1;
    });

    return {
      predictionCounts,
      confidenceData,
      monthlyData,
      severityData,
      timeAnalysis,
      riskAssessment,
    };
  };

  const {
    predictionCounts,
    confidenceData,
    monthlyData,
    severityData,
    timeAnalysis,
    riskAssessment,
  } = safeReports.length
    ? prepareChartData()
    : {
        predictionCounts: {},
        confidenceData: {},
        monthlyData: {},
        severityData: {},
        timeAnalysis: {},
        riskAssessment: {},
      };

  const chartColors = [
    "#6366F1",
    "#8B5CF6",
    "#EC4899",
    "#EF4444",
    "#F59E0B",
    "#10B981",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#6366F1",
  ];

  // Professional color schemes
  const professionalBlue = [
    "#1E40AF",
    "#3B82F6",
    "#60A5FA",
    "#93C5FD",
    "#DBEAFE",
  ];
  const medicalRed = ["#DC2626", "#EF4444", "#F87171", "#FCA5A5", "#FEE2E2"];
  const healthGreen = ["#059669", "#10B981", "#34D399", "#6EE7B7", "#D1FAE5"];

  // Chart configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 15,
          usePointStyle: true,
          font: { size: 12, weight: "500" },
          color: "#374151",
        },
      },
    },
  };

  // Patient-specific charts data
  const patientCharts = {
    personalProgress: {
      labels: Object.keys(monthlyData).slice(-6),
      datasets: [
        {
          label: "Your Scans",
          data: Object.keys(monthlyData)
            .slice(-6)
            .map((month) =>
              Object.values(monthlyData[month] || {}).reduce(
                (sum, val) => sum + val,
                0
              )
            ),
          borderColor: "#6366F1",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    riskAssessment: {
      labels: Object.keys(riskAssessment),
      datasets: [
        {
          data: Object.values(riskAssessment),
          backgroundColor: ["#EF4444", "#10B981"],
          borderWidth: 0,
        },
      ],
    },
    confidenceRadar: {
      labels: [
        "Accuracy",
        "Consistency",
        "Reliability",
        "Precision",
        "Detection Rate",
      ],
      datasets: [
        {
          label: "Your Scan Quality",
          data: [85, 90, 88, 92, 87],
          borderColor: "#8B5CF6",
          backgroundColor: "rgba(139, 92, 246, 0.2)",
          pointBackgroundColor: "#8B5CF6",
        },
      ],
    },
  };

  // Doctor-specific charts data
  const doctorCharts = {
    patientOverview: {
      labels: Object.keys(predictionCounts),
      datasets: [
        {
          data: Object.values(predictionCounts),
          backgroundColor: chartColors,
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    },
    departmentStats: {
      labels: ["Radiology", "Neurology", "Oncology", "Emergency", "General"],
      datasets: [
        {
          label: "Cases Handled",
          data: [45, 38, 29, 52, 33],
          backgroundColor: professionalBlue,
          borderRadius: 8,
        },
      ],
    },
    timeDistribution: {
      labels: Object.keys(timeAnalysis),
      datasets: [
        {
          data: Object.values(timeAnalysis),
          backgroundColor: ["#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"],
        },
      ],
    },
    weeklyTrends: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Normal Cases",
          data: [12, 15, 18, 14, 16, 8, 5],
          backgroundColor: healthGreen[0],
        },
        {
          label: "Abnormal Cases",
          data: [3, 5, 7, 4, 6, 2, 1],
          backgroundColor: medicalRed[0],
        },
      ],
    },
    performanceMetrics: {
      labels: [
        "Diagnostic Accuracy",
        "Response Time",
        "Patient Satisfaction",
        "Case Complexity",
        "Technology Usage",
      ],
      datasets: [
        {
          label: "Performance Score",
          data: [94, 87, 91, 85, 89],
          borderColor: "#EC4899",
          backgroundColor: "rgba(236, 72, 153, 0.2)",
          pointBackgroundColor: "#EC4899",
        },
      ],
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6">
            <Spinner />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            Loading Dashboard
          </h3>
          <p className="text-slate-600">Preparing your medical insights...</p>
        </div>
      </div>
    );
  }

  const tumorDetectedCount = safeReports.filter(
    (r) => r.prediction && r.prediction.toLowerCase() !== "notumor"
  ).length;
  const latestScanDate =
    safeReports.length > 0
      ? new Date(safeReports[0].created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";

  const isPatient = profile?.role === "Patient";
  const isDoctor = profile?.role === "Doctor" || profile?.role === "Admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Professional Header */}
        <div className="relative overflow-hidden bg-white rounded-3xl border shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          <div className="relative px-8 py-12 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-blue-100 font-medium">
                    {isPatient
                      ? "Patient Portal"
                      : "Medical Professional Dashboard"}
                  </span>
                </div>
                <h1 className="text-4xl font-bold mb-3 tracking-tight">
                  Welcome,{" "}
                  {profile?.full_name?.split(" ")[0] ||
                    user?.email?.split("@")[0]}
                </h1>
                <p className="text-blue-100 text-lg">
                  {isPatient
                    ? "Monitor your brain scan results and health insights"
                    : "Advanced medical imaging analysis and patient management"}
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                  <DashboardIcon
                    path={
                      isPatient
                        ? "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        : "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    }
                    className="w-12 h-12 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        </div>

        {safeReports.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <DashboardIcon
                path="M12 6v6m0 0v6m0-6h6m-6 0H6"
                className="w-12 h-12 text-blue-600"
              />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              {isPatient
                ? "Start Your Health Journey"
                : "No Patient Data Available"}
            </h3>
            <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
              {isPatient
                ? "Upload your first brain scan to begin AI-powered medical analysis and get personalized health insights."
                : "No patient reports are currently available in the system."}
            </p>
            {isPatient && (
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                Upload Your First Scan
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Enhanced Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <DashboardIcon
                      path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      className="w-6 h-6 text-white"
                    />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800">
                      {safeReports.length}
                    </div>
                    <div className="text-xs text-green-600 font-semibold">
                      +12% this month
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">
                  Total Scans
                </h3>
                <p className="text-sm text-slate-500">
                  {isPatient
                    ? "Your scans analyzed"
                    : "Patient scans processed"}
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <DashboardIcon
                      path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                      className="w-6 h-6 text-white"
                    />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800">
                      {tumorDetectedCount}
                    </div>
                    <div className="text-xs text-red-600 font-semibold">
                      Requires attention
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">
                  {isPatient ? "Abnormal Findings" : "Positive Cases"}
                </h3>
                <p className="text-sm text-slate-500">Critical detections</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <DashboardIcon
                      path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      className="w-6 h-6 text-white"
                    />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800">
                      {(
                        ((safeReports.length - tumorDetectedCount) /
                          safeReports.length) *
                          100 || 0
                      ).toFixed(0)}
                      %
                    </div>
                    <div className="text-xs text-green-600 font-semibold">
                      Healthy rate
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">
                  Normal Results
                </h3>
                <p className="text-sm text-slate-500">
                  Percentage of healthy scans
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <DashboardIcon
                      path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      className="w-6 h-6 text-white"
                    />
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-800">
                      {latestScanDate}
                    </div>
                    <div className="text-xs text-purple-600 font-semibold">
                      Most recent
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">
                  Latest Activity
                </h3>
                <p className="text-sm text-slate-500">Last scan processed</p>
              </div>
            </div>

            {/* Role-Specific Analytics */}
            {Object.keys(predictionCounts).length > 0 && (
              <div className="space-y-8">
                {isPatient && (
                  <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                          <DashboardIcon
                            path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            className="w-5 h-5 text-blue-600"
                          />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-slate-800">
                            Your Health Analytics
                          </h2>
                          <p className="text-slate-600">
                            Personal medical insights and progress tracking
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Personal Progress */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                            <DashboardIcon
                              path="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                              className="w-4 h-4 text-white"
                            />
                          </div>
                          Your Scan History
                        </h3>
                        <div className="h-64">
                          <Line
                            data={patientCharts.personalProgress}
                            options={chartOptions}
                          />
                        </div>
                      </div>

                      {/* Risk Assessment */}
                      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                            <DashboardIcon
                              path="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              className="w-4 h-4 text-white"
                            />
                          </div>
                          Risk Assessment
                        </h3>
                        <div className="h-64">
                          <Doughnut
                            data={patientCharts.riskAssessment}
                            options={chartOptions}
                          />
                        </div>
                      </div>

                      {/* Quality Metrics */}
                      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                            <DashboardIcon
                              path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              className="w-4 h-4 text-white"
                            />
                          </div>
                          Scan Quality
                        </h3>
                        <div className="h-64">
                          <Radar
                            data={patientCharts.confidenceRadar}
                            options={{
                              ...chartOptions,
                              scales: {
                                r: {
                                  beginAtZero: true,
                                  max: 100,
                                  grid: { color: "rgba(148, 163, 184, 0.2)" },
                                  pointLabels: { font: { size: 11 } },
                                },
                              },
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {isDoctor && (
                  <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mr-4">
                          <DashboardIcon
                            path="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            className="w-5 h-5 text-indigo-600"
                          />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-slate-800">
                            Medical Professional Dashboard
                          </h2>
                          <p className="text-slate-600">
                            Advanced patient management and diagnostic insights
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* First Row of Doctor Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                      {/* Patient Overview */}
                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
                            <DashboardIcon
                              path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              className="w-4 h-4 text-white"
                            />
                          </div>
                          Patient Diagnoses
                        </h3>
                        <div className="h-64">
                          <Pie
                            data={doctorCharts.patientOverview}
                            options={chartOptions}
                          />
                        </div>
                      </div>

                      {/* Department Statistics */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                            <DashboardIcon
                              path="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              className="w-4 h-4 text-white"
                            />
                          </div>
                          Department Overview
                        </h3>
                        <div className="h-64">
                          <Bar
                            data={doctorCharts.departmentStats}
                            options={chartOptions}
                          />
                        </div>
                      </div>

                      {/* Time Distribution */}
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center mr-3">
                            <DashboardIcon
                              path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              className="w-4 h-4 text-white"
                            />
                          </div>
                          Daily Activity
                        </h3>
                        <div className="h-64">
                          <PolarArea
                            data={doctorCharts.timeDistribution}
                            options={chartOptions}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Second Row of Doctor Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Weekly Trends */}
                      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center mr-3">
                            <DashboardIcon
                              path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              className="w-4 h-4 text-white"
                            />
                          </div>
                          Weekly Case Distribution
                        </h3>
                        <div className="h-64">
                          <Bar
                            data={doctorCharts.weeklyTrends}
                            options={{
                              ...chartOptions,
                              scales: {
                                x: { grid: { display: false } },
                                y: {
                                  beginAtZero: true,
                                  grid: { color: "rgba(148, 163, 184, 0.1)" },
                                },
                              },
                            }}
                          />
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-100">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                          <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center mr-3">
                            <DashboardIcon
                              path="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                              className="w-4 h-4 text-white"
                            />
                          </div>
                          Performance Analysis
                        </h3>
                        <div className="h-64">
                          <Radar
                            data={doctorCharts.performanceMetrics}
                            options={{
                              ...chartOptions,
                              scales: {
                                r: {
                                  beginAtZero: true,
                                  max: 100,
                                  grid: { color: "rgba(148, 163, 184, 0.2)" },
                                  pointLabels: { font: { size: 10 } },
                                },
                              },
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* General Analytics Section */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mr-4">
                        <DashboardIcon
                          path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          className="w-5 h-5 text-slate-600"
                        />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                          Comprehensive Analytics
                        </h2>
                        <p className="text-slate-600">
                          Detailed analysis of scan results and trends
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Enhanced Diagnosis Distribution */}
                    <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-100">
                      <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-violet-500 rounded-xl flex items-center justify-center mr-3">
                          <DashboardIcon
                            path="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512a9.025 9.025 0 015.488 5.488z"
                            className="w-5 h-5 text-white"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800">
                          Diagnosis Distribution
                        </h3>
                      </div>
                      <div className="h-80 flex items-center justify-center">
                        <Pie
                          data={{
                            labels: Object.keys(predictionCounts),
                            datasets: [
                              {
                                data: Object.values(predictionCounts),
                                backgroundColor: chartColors,
                                borderWidth: 3,
                                borderColor: "#fff",
                                hoverBorderWidth: 4,
                              },
                            ],
                          }}
                          options={{
                            ...chartOptions,
                            plugins: {
                              ...chartOptions.plugins,
                              tooltip: {
                                callbacks: {
                                  label: function (context) {
                                    const total = context.dataset.data.reduce(
                                      (a, b) => a + b,
                                      0
                                    );
                                    const percentage = (
                                      (context.raw / total) *
                                      100
                                    ).toFixed(1);
                                    return `${context.label}: ${context.raw} (${percentage}%)`;
                                  },
                                },
                              },
                            },
                          }}
                        />
                      </div>
                    </div>

                    {/* Enhanced Confidence Analysis */}
                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100">
                      <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center mr-3">
                          <DashboardIcon
                            path="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                            className="w-5 h-5 text-white"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800">
                          Confidence Analysis
                        </h3>
                      </div>
                      <div className="h-80">
                        <Bar
                          data={{
                            labels: Object.keys(confidenceData),
                            datasets: [
                              {
                                label: "Average Confidence (%)",
                                data: Object.entries(confidenceData).map(
                                  ([key, values]) => {
                                    const avg =
                                      values.reduce(
                                        (sum, val) => sum + val,
                                        0
                                      ) / values.length;
                                    return (avg * 100).toFixed(1);
                                  }
                                ),
                                backgroundColor: "rgba(20, 184, 166, 0.8)",
                                borderColor: "#14B8A6",
                                borderWidth: 2,
                                borderRadius: 8,
                                borderSkipped: false,
                              },
                              {
                                label: "Min Confidence (%)",
                                data: Object.entries(confidenceData).map(
                                  ([key, values]) => {
                                    const min = Math.min(...values);
                                    return (min * 100).toFixed(1);
                                  }
                                ),
                                backgroundColor: "rgba(239, 68, 68, 0.6)",
                                borderColor: "#EF4444",
                                borderWidth: 2,
                                borderRadius: 8,
                              },
                            ],
                          }}
                          options={{
                            ...chartOptions,
                            scales: {
                              y: {
                                beginAtZero: true,
                                max: 100,
                                title: {
                                  display: true,
                                  text: "Confidence Level (%)",
                                  font: { size: 12, weight: "600" },
                                  color: "#374151",
                                },
                                grid: { color: "rgba(148, 163, 184, 0.1)" },
                              },
                              x: {
                                grid: { display: false },
                                ticks: { color: "#6B7280" },
                              },
                            },
                          }}
                        />
                      </div>
                    </div>

                    {/* Enhanced Monthly Trends */}
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
                      <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center mr-3">
                          <DashboardIcon
                            path="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            className="w-5 h-5 text-white"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800">
                          Monthly Trends
                        </h3>
                      </div>
                      <div className="h-80">
                        <Line
                          data={{
                            labels: Object.keys(monthlyData).sort((a, b) => {
                              const months = [
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
                              return months.indexOf(a) - months.indexOf(b);
                            }),
                            datasets: Object.keys(predictionCounts).map(
                              (prediction, index) => ({
                                label: prediction,
                                data: Object.keys(monthlyData)
                                  .sort((a, b) => {
                                    const months = [
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
                                    return (
                                      months.indexOf(a) - months.indexOf(b)
                                    );
                                  })
                                  .map(
                                    (month) =>
                                      monthlyData[month][prediction] || 0
                                  ),
                                borderColor:
                                  chartColors[index % chartColors.length],
                                backgroundColor: `${
                                  chartColors[index % chartColors.length]
                                }33`,
                                fill: index === 0,
                                tension: 0.4,
                                pointRadius: 4,
                                pointHoverRadius: 6,
                                borderWidth: 3,
                              })
                            ),
                          }}
                          options={{
                            ...chartOptions,
                            interaction: {
                              intersect: false,
                              mode: "index",
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                title: {
                                  display: true,
                                  text: "Number of Cases",
                                  font: { size: 12, weight: "600" },
                                  color: "#374151",
                                },
                                grid: { color: "rgba(148, 163, 184, 0.1)" },
                              },
                              x: {
                                grid: { display: false },
                                ticks: { color: "#6B7280" },
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Recent Activity */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mr-4">
                    <DashboardIcon
                      path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      className="w-5 h-5 text-indigo-600"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                      Recent Activity
                    </h2>
                    <p className="text-slate-600">
                      Latest scan results and diagnostic updates
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center space-x-2 bg-slate-100 rounded-xl px-4 py-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-700">
                    Live Updates
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {safeReports.slice(0, 6).map((report, index) => (
                  <div
                    key={report.id}
                    className="group flex items-center p-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border border-slate-200 hover:border-blue-200 hover:shadow-lg transform hover:scale-[1.01]"
                  >
                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden mr-6 flex-shrink-0 shadow-lg">
                      <img
                        src={report.gradcam_image_url}
                        alt="Brain scan"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target;
                          target.style.display = "none";
                          const nextSibling = target.nextSibling;
                          if (nextSibling) {
                            nextSibling.style.display = "flex";
                          }
                        }}
                      />
                      <div className="w-full h-full hidden items-center justify-center bg-slate-100">
                        <DashboardIcon
                          path="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          className="w-6 h-6 text-slate-400"
                        />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-600">
                          #{index + 1}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 mr-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-slate-800 truncate text-lg">
                          {report.prediction || "Pending Analysis"}
                        </h4>
                        <div className="flex items-center space-x-3">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm ${
                              report.prediction &&
                              report.prediction.toLowerCase() !== "notumor"
                                ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                                : "bg-gradient-to-r from-green-500 to-green-600 text-white"
                            }`}
                          >
                            {(report.confidence * 100).toFixed(1)}% confidence
                          </span>
                          <div
                            className={`w-3 h-3 rounded-full ${
                              report.prediction &&
                              report.prediction.toLowerCase() !== "notumor"
                                ? "bg-red-400 animate-pulse"
                                : "bg-green-400"
                            }`}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500 font-medium">
                          Processed on{" "}
                          {new Date(report.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {safeReports.length > 6 && (
                <div className="mt-8 text-center">
                  <Link
                    to={profile?.role === "Patient" ? "/history" : "/reports"}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    View All {safeReports.length} Reports
                    <DashboardIcon
                      path="M13 7l5 5m0 0l-5 5m5-5H6"
                      className="w-4 h-4 ml-2 inline"
                    />
                  </Link>
                </div>
              )}
            </div>

            {/* Enhanced All Reports Grid */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mr-4">
                    <DashboardIcon
                      path="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H7a2 2 0 00-2 2v2m0 0h10"
                      className="w-5 h-5 text-amber-600"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                      Complete Medical Records
                    </h2>
                    <p className="text-slate-600">
                      Comprehensive overview of all diagnostic analyses
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <select className="px-4 py-2 border border-slate-300 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Results</option>
                    <option>Normal</option>
                    <option>Abnormal</option>
                    <option>High Confidence</option>
                  </select>
                  <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors duration-200">
                    <DashboardIcon
                      path="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      className="w-4 h-4 text-slate-600"
                    />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {safeReports.map((report, index) => (
                  <div
                    key={report.id}
                    className="group transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="relative">
                      <ResultCard report={report} />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xs font-bold text-white">
                          #{index + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {safeReports.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <DashboardIcon
                      path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      className="w-10 h-10 text-slate-400"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    No Medical Records Found
                  </h3>
                  <p className="text-slate-600">
                    Start by uploading your first brain scan for analysis.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <ChatBot />
    </div>
  );
};

export default Dashboard;
