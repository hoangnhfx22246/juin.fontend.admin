import axios from "axios";
import { setupInterceptors } from "./setupInterceptors";

const env = import.meta.env;

const axiosPrivate = axios.create({
  baseURL: env.VITE_BACKEND_URL,
  withCredentials: true,
});

axiosPrivate.interceptors.request.use(
  async (config) => {
    const csrfToken = JSON.parse(localStorage.getItem("csrfToken"));

    const accessToken = JSON.parse(localStorage.getItem("accessToken"));
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

setupInterceptors(axiosPrivate);

export default axiosPrivate;
