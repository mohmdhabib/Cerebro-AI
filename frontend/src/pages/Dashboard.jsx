import React, { useState, useEffect } from "react";
import { getScans, getPatients } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import {
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Share2,
  Download,
  MessageSquare,
  TrendingUp,
  Activity,
  Calendar,
  MapPin,
  Eye,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  AreaChart,
  Area,
} from "recharts";

// --- Enhanced Dummy Data for Fallback and Charts ---
const dummyChartData = {
  growth: [
    { month: "Jan", size: 2.1, threshold: 2.5 },
    { month: "Feb", size: 2.2, threshold: 2.5 },
    { month: "Mar", size: 2.1, threshold: 2.5 },
    { month: "Apr", size: 2.4, threshold: 2.5 },
    { month: "May", size: 2.5, threshold: 2.5 },
    { month: "Jun", size: 2.8, threshold: 2.5 },
  ],
  severity: [
    { name: "Low Risk", count: 12, color: "#10b981" },
    { name: "Moderate Risk", count: 8, color: "#f59e0b" },
    { name: "High Risk", count: 5, color: "#ef4444" },
  ],
  status: [
    { name: "Completed", value: 24, color: "#10b981" },
    { name: "Pending", value: 5, color: "#f59e0b" },
    { name: "Failed", value: 1, color: "#ef4444" },
  ],
  weeklyActivity: [
    { day: "Mon", scans: 4, detections: 2 },
    { day: "Tue", scans: 6, detections: 3 },
    { day: "Wed", scans: 3, detections: 1 },
    { day: "Thu", scans: 8, detections: 4 },
    { day: "Fri", scans: 5, detections: 2 },
    { day: "Sat", scans: 2, detections: 1 },
    { day: "Sun", scans: 1, detections: 0 },
  ],
  confidenceMetrics: [
    { category: "Brain Scans", confidence: 94, total: 87 },
    { category: "Lung Scans", confidence: 89, total: 65 },
    { category: "Liver Scans", confidence: 92, total: 43 },
  ],
};

const dummyLatestScan = {
  status: "Completed",
  image_url:
    "https://upload.wikimedia.org/wikipedia/commons/5/5f/Hirnmetastase_MRT-T1_KM.jpg",
  tumor_size: "2.8cm x 3.1cm",
  location: "Right Temporal Lobe",
  severity: "High",
  confidence_score: 0.95,
  follow_up_suggestions:
    "Immediate surgical consultation advised. Follow-up with contrast-enhanced MRI in 4 weeks post-op.",
  patients: {
    name: "Johnathan Doe (Demo)",
    age: 58,
    medical_history: "Recurrent migraines",
    diagnosis_summary: "Suspected Glioblastoma",
    last_consultation: "2025-08-20",
  },
};

// --- Enhanced Summary Card Component ---
const StatCard = ({ title, value, icon, colorClass, trend, trendValue }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-300 group">
    <div className="flex items-center justify-between mb-4">
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center ${colorClass} group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      {trend && (
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            trend === "up"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          <TrendingUp
            size={12}
            className={trend === "down" ? "rotate-180" : ""}
          />
          {trendValue}
        </div>
      )}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

// --- Custom Tooltip Components ---
const CustomTooltip = ({ active, payload, label, type = "default" }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-200">
        <p className="font-semibold text-slate-700 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            <span className="font-medium">{entry.dataKey}:</span> {entry.value}
            {type === "size" && "cm"}
            {type === "percentage" && "%"}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- Main Dashboard Component ---
const Dashboard = () => {
  const { user } = useAuth();
  const [latestScan, setLatestScan] = useState(null);
  const [stats, setStats] = useState({
    patients: 0,
    pending: 0,
    detected: 0,
    confidence: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [scansResponse, patientsResponse] = await Promise.all([
          getScans(),
          getPatients(),
        ]);
        const allScans = scansResponse.data;
        const allPatients = patientsResponse.data;

        const pendingScans = allScans.filter(
          (s) => s.status === "Processing"
        ).length;
        const detectedScans = allScans.filter(
          (s) => s.severity && s.severity !== "None"
        ).length;
        const avgConfidence =
          allScans.length > 0
            ? (
                (allScans.reduce(
                  (acc, s) => acc + (s.confidence_score || 0),
                  0
                ) /
                  allScans.length) *
                100
              ).toFixed(0)
            : 0;

        setStats({
          patients: allPatients.length,
          pending: pendingScans,
          detected: detectedScans,
          confidence: avgConfidence,
        });

        const completedScans = allScans.filter(
          (scan) => scan.status === "Completed"
        );
        if (completedScans.length > 0) {
          setLatestScan(completedScans[0]);
        } else {
          setLatestScan(dummyLatestScan);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data. Using dummy data.", err);
        setLatestScan(dummyLatestScan);
        setStats({ patients: 12, pending: 3, detected: 8, confidence: 91 });
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
          <p className="text-slate-600 font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  const { patients: patientDetails, ...scanResults } = latestScan;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Welcome back,{" "}
                {user?.user_metadata?.name || user?.email.split("@")[0]}
              </h1>
              <p className="mt-2 text-slate-600 font-medium">
                Here's your comprehensive diagnostic overview for today
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-200">
              <Calendar size={16} className="text-slate-500" />
              <span className="text-sm font-medium text-slate-600">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Patients"
            value={stats.patients}
            icon={<Users size={28} className="text-sky-600" />}
            colorClass="bg-gradient-to-br from-sky-100 to-sky-50"
            trend="up"
            trendValue="+2.4%"
          />
          <StatCard
            title="Pending Scans"
            value={stats.pending}
            icon={<Clock size={28} className="text-amber-600" />}
            colorClass="bg-gradient-to-br from-amber-100 to-amber-50"
            trend="down"
            trendValue="-1.2%"
          />
          <StatCard
            title="Tumor Detections"
            value={stats.detected}
            icon={<AlertTriangle size={28} className="text-red-600" />}
            colorClass="bg-gradient-to-br from-red-100 to-red-50"
            trend="up"
            trendValue="+5.7%"
          />
          <StatCard
            title="Avg. Confidence"
            value={`${stats.confidence}%`}
            icon={<CheckCircle size={28} className="text-green-600" />}
            colorClass="bg-gradient-to-br from-green-100 to-green-50"
            trend="up"
            trendValue="+0.8%"
          />
        </div>

        {/* Enhanced Main Grid for Latest Scan and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <Eye size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                Latest Scan Result
              </h3>
              <div className="ml-auto px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                {scanResults.status}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="relative group">
                <img
                  src={scanResults.image_url}
                  alt="MRI Scan"
                  className="w-full md:w-80 h-64 rounded-2xl object-cover bg-slate-100 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="flex-1">
                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                  <p className="text-sm font-medium text-slate-600">
                    Patient:{" "}
                    <span className="font-bold text-slate-800">
                      {patientDetails.name}
                    </span>
                  </p>
                </div>

                <h4 className="font-bold text-2xl text-slate-800 mb-6 flex items-center gap-2">
                  <Activity size={24} className="text-red-500" />
                  Detected Tumor Area
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                      Tumor Size
                    </p>
                    <p className="text-lg font-bold text-slate-800">
                      {scanResults.tumor_size || "N/A"}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                    <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide flex items-center gap-1">
                      <MapPin size={12} />
                      Location
                    </p>
                    <p className="text-lg font-bold text-slate-800">
                      {scanResults.location || "N/A"}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl border border-red-100">
                    <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">
                      Severity Level
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 text-sm font-bold bg-red-100 text-red-800 rounded-full">
                        {scanResults.severity || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                      AI Confidence
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-green-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                          style={{
                            width: `${scanResults.confidence_score * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        {(scanResults.confidence_score * 100).toFixed(0) ||
                          "N/A"}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <MessageSquare size={18} className="text-blue-600" />
                Clinical Recommendations
              </h4>
              <p className="text-slate-700 leading-relaxed">
                {scanResults.follow_up_suggestions ||
                  "No suggestions available."}
              </p>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Users size={20} className="text-indigo-600" />
                Patient Details
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Full Name
                  </p>
                  <p className="font-bold text-slate-800 text-lg">
                    {patientDetails.name}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 p-4 bg-blue-50 rounded-xl">
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                      Age
                    </p>
                    <p className="font-bold text-slate-800 text-xl">
                      {patientDetails.age}
                    </p>
                  </div>
                  <div className="flex-1 p-4 bg-green-50 rounded-xl">
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                      Last Visit
                    </p>
                    <p className="font-bold text-slate-800 text-sm">
                      {patientDetails.last_consultation}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl">
                  <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
                    Medical History
                  </p>
                  <p className="font-medium text-slate-800">
                    {patientDetails.medical_history}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60">
              <h3 className="text-lg font-bold text-slate-800 mb-6">
                Quick Actions
              </h3>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-center gap-3 py-4 px-6 font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                  <Share2 size={18} /> Share Report
                </button>
                <button className="w-full flex items-center justify-center gap-3 py-4 px-6 font-semibold text-indigo-700 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl hover:from-indigo-100 hover:to-blue-100 border border-indigo-200 transform hover:scale-105 transition-all duration-200">
                  <Download size={18} /> Download PDF
                </button>
                <button className="w-full flex items-center justify-center gap-3 py-4 px-6 font-semibold text-slate-700 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl hover:from-slate-100 hover:to-gray-100 border border-slate-200 transform hover:scale-105 transition-all duration-200">
                  <MessageSquare size={18} /> Contact Specialist
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Growth Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <TrendingUp className="text-indigo-600" size={24} />
                Tumor Growth Tracking
              </h3>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span className="text-sm font-medium text-slate-600">
                  Size (cm)
                </span>
                <div className="w-3 h-3 rounded-full bg-red-400 ml-4"></div>
                <span className="text-sm font-medium text-slate-600">
                  Threshold
                </span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dummyChartData.growth}>
                  <defs>
                    <linearGradient id="colorSize" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                    unit="cm"
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <Tooltip content={<CustomTooltip type="size" />} />
                  <Area
                    type="monotone"
                    dataKey="size"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fill="url(#colorSize)"
                  />
                  <Line
                    type="monotone"
                    dataKey="threshold"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Enhanced Status Chart */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <Activity className="text-green-600" size={24} />
              Scan Status Overview
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dummyChartData.status}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={8}
                    startAngle={90}
                    endAngle={450}
                  >
                    {dummyChartData.status.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{
                      paddingTop: "20px",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Additional Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Activity Chart */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <Activity className="text-blue-600" size={24} />
              Weekly Activity
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dummyChartData.weeklyActivity} barGap={10}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="scans" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar
                    dataKey="detections"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                  />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Confidence Metrics */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <CheckCircle className="text-emerald-600" size={24} />
              AI Confidence by Category
            </h3>
            <div className="space-y-6">
              {dummyChartData.confidenceMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">
                      {metric.category}
                    </span>
                    <span className="font-bold text-slate-800">
                      {metric.confidence}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${metric.confidence}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500">
                    {metric.total} scans analyzed
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
