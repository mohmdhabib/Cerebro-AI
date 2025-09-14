import axios from "axios";
import { supabase } from "./supabaseClient";

const api = axios.create({
  baseURL: "http://localhost:8000/api/", // Updated to match backend routes prefix
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
