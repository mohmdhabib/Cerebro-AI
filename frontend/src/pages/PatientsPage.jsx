import React, { useState, useEffect, useMemo } from "react";
import { getPatients, addPatient } from "../services/api";
import { Search, Loader2, ArrowUpDown, X, UserPlus } from "lucide-react";

// --- Add Patient Modal Component ---
const AddPatientModal = ({ isOpen, onClose, onPatientAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    last_consultation: "",
    medical_history: "",
    diagnosis_summary: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await addPatient(formData);
      onPatientAdded(response.data); // Pass new patient data back to parent
      onClose(); // Close modal on success
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add patient.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-slate-800">
            Add New Patient
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="p-2 border rounded-md"
            />
            <input
              name="age"
              type="number"
              onChange={handleChange}
              placeholder="Age"
              className="p-2 border rounded-md"
            />
            <input
              name="last_consultation"
              type="date"
              onChange={handleChange}
              placeholder="Last Consultation"
              className="p-2 border rounded-md"
            />
            <input
              name="diagnosis_summary"
              onChange={handleChange}
              placeholder="Diagnosis Summary"
              className="p-2 border rounded-md"
            />
            <textarea
              name="medical_history"
              onChange={handleChange}
              placeholder="Medical History"
              className="p-2 border rounded-md md:col-span-2"
              rows="3"
            ></textarea>
          </div>
          {error && <p className="px-6 text-sm text-red-600">{error}</p>}
          <div className="flex justify-end p-4 border-t bg-slate-50 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border rounded-md mr-2 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border rounded-md hover:bg-indigo-700 disabled:bg-slate-400"
            >
              {loading ? "Saving..." : "Save Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Patients Page Component ---
const PatientsPage = () => {
  const [allPatients, setAllPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for search, sorting, and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 10;

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getPatients();
        setAllPatients(response.data);
      } catch (err) {
        setError("Failed to fetch patients.");
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const sortedAndFilteredPatients = useMemo(() => {
    let filtered = [...allPatients].filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.diagnosis_summary &&
          p.diagnosis_summary.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [allPatients, searchQuery, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown size={14} className="ml-2 text-slate-400" />;
    }
    return sortConfig.direction === "ascending" ? "▲" : "▼";
  };

  // Pagination logic
  const totalPages = Math.ceil(
    sortedAndFilteredPatients.length / patientsPerPage
  );
  const currentPatients = sortedAndFilteredPatients.slice(
    (currentPage - 1) * patientsPerPage,
    currentPage * patientsPerPage
  );

  const handlePatientAdded = (newPatient) => {
    setAllPatients((prev) => [newPatient, ...prev]);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  if (error)
    return (
      <div className="text-center p-10 text-red-500 bg-red-50 rounded-lg">
        {error}
      </div>
    );

  return (
    <div>
      <AddPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPatientAdded={handlePatientAdded}
      />

      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Patient History
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage and view patient records with ease.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <UserPlus size={18} /> Add New Patient
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search patients by name or diagnosis..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th
                className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("name")}
              >
                <div className="flex items-center">
                  Name {getSortIcon("name")}
                </div>
              </th>
              <th
                className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("age")}
              >
                <div className="flex items-center">
                  Age {getSortIcon("age")}
                </div>
              </th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Last Consultation
              </th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Diagnosis Summary
              </th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {currentPatients.length > 0 ? (
              currentPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-800">
                    {patient.name}
                  </td>
                  <td className="p-4 text-sm text-slate-600">{patient.age}</td>
                  <td className="p-4 text-sm text-slate-600">
                    {patient.last_consultation}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      {patient.diagnosis_summary || "N/A"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="font-medium text-sm text-indigo-600 hover:underline">
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-10 text-slate-500">
                  <p className="font-medium">No patients found.</p>
                  <p className="text-sm mt-1">
                    Try adjusting your search or add a new patient.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-slate-600">
            Showing page {currentPage} of {totalPages}
          </p>
          {/* Pagination component would go here */}
        </div>
      )}
    </div>
  );
};

export default PatientsPage;
