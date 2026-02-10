import axios from "axios";
import { supabase } from "@/lib/supabaseClient";

// ✅ API base URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://ssb-backend-production-a40d.up.railway.app";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// 🔐 Attach Supabase access token
api.interceptors.request.use(
  async (config) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
