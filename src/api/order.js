import axiosPrivate from "../util/axiosPrivate";
import axiosPublic from "../util/axiosPublic";
import { getCsrfToken } from "./csrfToken";

export const orderAPI = {
  // Get all orders with pagination and filters
  getOrders: async (params) => {
    const response = await axiosPrivate.get("/api/orders", { params });
    return response.data;
  },
  getOrder: async (id) => {
    const response = await axiosPrivate.get(`/api/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id, newStatus) => {
    await getCsrfToken(); // Lấy token CSRF từ server khi Đăng ký người dùng
    const response = await axiosPrivate.put(`/api/orders/${id}`, newStatus);
    return response.data;
  },
};
