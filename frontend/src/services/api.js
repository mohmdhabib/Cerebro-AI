import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:5000/api", // Your Flask backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Auth Functions ---
export const loginUser = (email, password) => {
  return apiClient.post("/auth/login", { email, password });
};

export const signupUser = (email, password) => {
  return apiClient.post("/auth/signup", { email, password });
};

// --- Data Functions ---
export const getPatients = () => apiClient.get("/patients");
export const getReports = () => apiClient.get("/reports");
export const getScans = () => apiClient.get("/scans"); // Add this new function

export const uploadScan = (formData) => {
  return apiClient.post("/scans/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default apiClient;
