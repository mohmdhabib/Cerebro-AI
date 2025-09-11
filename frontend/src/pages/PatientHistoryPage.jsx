import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import api from "../services/api";
import toast from "react-hot-toast";
import ResultCard from "../components/dashboard/ResultCard";
import Spinner from "../components/shared/Spinner";
import {
  Search,
  Calendar,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Grid3X3,
  List,
  Eye,
  Download,
  Share2,
  Info,
  User,
  Filter,
} from "lucide-react";

const PatientHistoryPage = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

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

  const filteredAndSortedReports = reports
    .filter((report) => {
      const matchesSearch = report.prediction
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "tumor" &&
          report.prediction?.toLowerCase() !== "no tumor") ||
        (filterBy === "no-tumor" &&
          report.prediction?.toLowerCase() === "no tumor");
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "confidence":
          return b.confidence - a.confidence;
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

  const stats = {
    total: reports.length,
    normal: reports.filter((r) => r.prediction?.toLowerCase() === "no tumor")
      .length,
    needsAttention: reports.filter(
      (r) => r.prediction?.toLowerCase() !== "no tumor"
    ).length,
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const ScanCard = ({ report, variant = "grid" }) => {
    const isTumor = report.prediction?.toLowerCase() !== "no tumor";
    const confidence = (report.confidence * 100).toFixed(1);

    if (variant === "list") {
      return (
        <div className="bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-200 p-6">
          <div className="flex items-center gap-4">
            <img
              src={report.image_url}
              alt="MRI Scan"
              className="w-16 h-16 rounded-lg object-cover bg-gray-50"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/64x64?text=MRI";
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">
                  Scan #{report.id}
                </h3>
                <span className="text-sm text-gray-500">
                  {formatDate(report.created_at)}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    isTumor
                      ? "bg-red-50 text-red-700"
                      : "bg-green-50 text-green-700"
                  }`}
                >
                  {isTumor ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {report.prediction || "N/A"}
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <BarChart3 className="w-4 h-4" />
                  <span className="font-medium">{confidence}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (variant === "expanded") {
      return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="md:flex">
            <div className="md:w-1/3 h-64 md:h-auto">
              <img
                src={report.image_url}
                alt="MRI Scan"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x300?text=MRI+Scan";
                }}
              />
            </div>
            <div className="md:w-2/3 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Brain Scan Analysis
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Analyzed on {formatDate(report.created_at)}</span>
                  </div>
                </div>
                <div
                  className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                    isTumor
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {isTumor ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {report.prediction || "N/A"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-blue-700">
                      Confidence Level
                    </p>
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold text-blue-900 mb-2">
                    {confidence}%
                  </p>
                  <div className="bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${confidence}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    {isTumor ? (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <p
                    className={`text-lg font-semibold ${
                      isTumor ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {isTumor ? "Requires Attention" : "Normal"}
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800 mb-1">
                      Important Note
                    </h4>
                    <p className="text-sm text-amber-700">
                      {isTumor
                        ? "Please consult with your healthcare provider to discuss these results and next steps."
                        : "These results look normal, but always follow up with your doctor for a complete evaluation."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Scan ID: {report.id}
                </span>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return <ResultCard key={report.id} report={report} patientView={true} />;
  };

  if (loading)
    return (
      <div className="flex justify-center mt-16">
        <Spinner />
      </div>
    );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            My Scan History
          </h1>
          <p className="text-gray-600">
            Track your brain scan results and monitor your health progress
          </p>
        </div>

        {/* Health Summary */}
        {reports.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-8 mb-8 text-black">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    Hello, {user?.full_name || "Patient"}
                  </h2>
                  <p className="text-blue-600">Here's your health summary</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-blue-600 text-sm">Last scan</p>
                <p className="font-semibold text-lg">
                  {formatDate(
                    Math.max(...reports.map((r) => new Date(r.created_at)))
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  label: "Total Scans",
                  value: stats.total,
                  icon: BarChart3,
                  color: "bg-blue-500/70",
                },
                {
                  label: "Normal Results",
                  value: stats.normal,
                  icon: CheckCircle,
                  color: "bg-green-500/70",
                },
                {
                  label: "Needs Follow-up",
                  value: stats.needsAttention,
                  icon: AlertTriangle,
                  color: "bg-red-500/70",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`${stat.color} rounded-xl p-4 backdrop-blur-sm`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold text-white">
                        {stat.value}
                      </p>
                    </div>
                    <stat.icon className="w-8 h-8 text-white/30" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        {reports.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by diagnosis results..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Scans</option>
                    <option value="tumor">Needs Follow-up</option>
                    <option value="no-tumor">Normal Results</option>
                  </select>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Most Recent</option>
                  <option value="oldest">Oldest First</option>
                  <option value="confidence">Highest Confidence</option>
                </select>

                <div className="flex bg-gray-100 rounded-xl p-1">
                  {[
                    { mode: "grid", icon: Grid3X3, title: "Grid View" },
                    { mode: "list", icon: List, title: "List View" },
                    { mode: "expanded", icon: Eye, title: "Detailed View" },
                  ].map(({ mode, icon: Icon, title }) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === mode
                          ? "bg-white shadow-sm"
                          : "hover:bg-gray-200"
                      }`}
                      title={title}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports */}
        {reports.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No Scans Yet
            </h3>
            <p className="text-gray-600 mb-8">
              You have not uploaded any brain scans yet.
            </p>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-lg font-semibold">
              <Download className="w-5 h-5" />
              Upload Your First Scan
            </button>
          </div>
        ) : filteredAndSortedReports.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-xl">
              No scans match your current filters.
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
            }
          >
            {filteredAndSortedReports.map((report) => (
              <ScanCard key={report.id} report={report} variant={viewMode} />
            ))}
          </div>
        )}

        {/* Health Tips */}
        {reports.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Health Reminders
                </h3>
                <div className="space-y-3 text-gray-700">
                  {[
                    "Regular brain scans help monitor your health over time",
                    "Always consult your healthcare provider about any concerning results",
                    "Keep track of symptoms and share them with your doctor",
                  ].map((tip, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientHistoryPage;
