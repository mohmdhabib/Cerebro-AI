import axios from "axios";
import { supabase } from "./supabaseClient";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Interceptor to add the JWT to every authenticated request
apiClient.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// --- Auth Functions ---
export const loginUser = (email, password) =>
  apiClient.post("/auth/login", { email, password });
export const signupUser = (email, password) =>
  apiClient.post("/auth/signup", { email, password });

// --- Profile Functions ---
export const getProfile = () => apiClient.get("/profile");
export const updateProfile = (profileData) =>
  apiClient.put("/profile", profileData);

// --- Data Functions ---
export const getPatients = () => apiClient.get("/patients");
export const addPatient = (patientData) =>
  apiClient.post("/patients", patientData);
export const getReports = () => apiClient.get("/reports");
export const getScans = () => apiClient.get("/scans");
export const uploadScan = (formData) => {
  return apiClient.post("/scans/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export default apiClient;
