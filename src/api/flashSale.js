import axiosPrivate from "../util/axiosPrivate";
import axiosPublic from "../util/axiosPublic";
import { getCsrfToken } from "./csrfToken";

export const flashSaleAPI = {
  getFlashSales: async (params) => {
    const response = await axiosPrivate.get("/api/flash-sales", { params });
    return response.data;
  },

  createFlashSales: async (formData) => {
    await getCsrfToken(); // Lấy token CSRF từ server khi Đăng ký người dùng
    const response = await axiosPrivate.post("/api/flash-sales", formData);
    return response.data;
  },

  updateFlashSales: async (id, formData) => {
    await getCsrfToken(); // Lấy token CSRF từ server khi Đăng ký người dùng

    const response = await axiosPrivate.put(`/api/flash-sales/${id}`, formData);
    return response.data;
  },

  deleteFlashSales: async (id) => {
    await getCsrfToken(); // Lấy token CSRF từ server khi Đăng ký người dùng
    const response = await axiosPrivate.delete(`/api/flash-sales/${id}`);
    return response.data;
  },
};
