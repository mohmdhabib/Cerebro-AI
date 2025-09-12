import axios from "axios";
import { supabase } from "./supabaseClient";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Updated to FastAPI backend URL
});

// Interceptor to add the Supabase auth token to every request
api.interceptors.request.use(
  async (config) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
