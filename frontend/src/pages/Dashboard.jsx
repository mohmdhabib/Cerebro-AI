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
} from "recharts";

// --- Dummy Data for Fallback and Charts ---
const dummyChartData = {
  growth: [
    { month: "Jan", size: 2.1 },
    { month: "Feb", size: 2.2 },
    { month: "Mar", size: 2.1 },
    { month: "Apr", size: 2.4 },
    { month: "May", size: 2.5 },
    { month: "Jun", size: 2.8 },
  ],
  severity: [
    { name: "Low", count: 3 },
    { name: "Moderate", count: 8 },
    { name: "High", count: 5 },
  ],
  status: [
    { name: "Completed", value: 24 },
    { name: "Pending", value: 5 },
    { name: "Failed", value: 1 },
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

// --- Reusable Summary Card Component ---
const StatCard = ({ title, value, icon, colorClass }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
    <div
      className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}
    >
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

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
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  const { patients: patientDetails, ...scanResults } = latestScan;
  const confidenceData = [{ name: "Confidence", value: stats.confidence }];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Welcome back,{" "}
          {user?.user_metadata?.full_name || user?.email.split("@")[0]}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Here's a summary of your diagnostic activities.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={stats.patients}
          icon={<Users size={24} className="text-sky-600" />}
          colorClass="bg-sky-100"
        />
        <StatCard
          title="Pending Scans"
          value={stats.pending}
          icon={<Clock size={24} className="text-amber-600" />}
          colorClass="bg-amber-100"
        />
        <StatCard
          title="Tumor Detections"
          value={stats.detected}
          icon={<AlertTriangle size={24} className="text-red-600" />}
          colorClass="bg-red-100"
        />
        <StatCard
          title="Avg. Confidence"
          value={`${stats.confidence}%`}
          icon={<CheckCircle size={24} className="text-green-600" />}
          colorClass="bg-green-100"
        />
      </div>

      {/* Main Grid for Latest Scan and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            Latest Scan Result
          </h3>
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={scanResults.image_url}
              alt="MRI Scan"
              className="w-full md:w-1/2 h-64 rounded-lg object-cover bg-slate-100"
            />
            <div className="flex-1">
              <p className="text-sm text-slate-500">
                Patient:{" "}
                <span className="font-medium text-slate-700">
                  {patientDetails.name}
                </span>
              </p>
              <h4 className="font-bold text-xl text-slate-800 mt-2">
                Detected Tumor Area
              </h4>
              <div className="mt-4 space-y-3 text-sm">
                <p>
                  <strong>Tumor Size:</strong> {scanResults.tumor_size || "N/A"}
                </p>
                <p>
                  <strong>Location:</strong> {scanResults.location || "N/A"}
                </p>
                <p className="flex items-center">
                  <strong>Severity:</strong>&nbsp;
                  <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                    {scanResults.severity || "N/A"}
                  </span>
                </p>
                <p>
                  <strong>Confidence Score:</strong>&nbsp;
                  <span className="font-bold text-green-600">
                    {(scanResults.confidence_score * 100).toFixed(0) || "N/A"}%
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 border-t border-slate-200 pt-4">
            <h4 className="font-semibold text-slate-800">
              Follow-up Suggestions
            </h4>
            <p className="text-sm text-slate-600 mt-1">
              {scanResults.follow_up_suggestions || "No suggestions available."}
            </p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Patient Details
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-500">Name</p>
                <p className="font-medium text-slate-800">
                  {patientDetails.name}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Age</p>
                <p className="font-medium text-slate-800">
                  {patientDetails.age}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Medical History</p>
                <p className="font-medium text-slate-800">
                  {patientDetails.medical_history}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 py-2 px-4 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                <Share2 size={16} /> Share Report
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-2 px-4 font-semibold text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200">
                <Download size={16} /> Download PDF
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-2 px-4 font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">
                <MessageSquare size={16} /> Contact Specialist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Grid for Aggregate Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            Tumor Growth Over Time (Example)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dummyChartData.growth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} unit="cm" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="size"
                  stroke="#4f46e5"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Scan Status</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dummyChartData.status}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                >
                  {dummyChartData.status.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#10b981", "#f59e0b", "#ef4444"][index % 3]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
