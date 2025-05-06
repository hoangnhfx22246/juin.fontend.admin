import axios from "axios";
const env = import.meta.env;

const axiosPublic = axios.create({
  baseURL: env.VITE_BACKEND_URL,
  withCredentials: false, // Không gửi cookie
});

export default axiosPublic;
