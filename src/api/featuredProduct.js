import axiosPrivate from "../util/axiosPrivate";
import axiosPublic from "../util/axiosPublic";
import { getCsrfToken } from "./csrfToken";

export const featuredProductAPI = {
  getFeaturedProducts: async (params) => {
    const response = await axiosPrivate.get("/api/featured-products", {
      params,
    });
    return response.data;
  },

  createFeaturedProducts: async (formData) => {
    await getCsrfToken(); // Lấy token CSRF từ server khi Đăng ký người dùng
    const response = await axiosPrivate.post(
      "/api/featured-products",
      formData
    );
    return response.data;
  },

  updateFeaturedProducts: async (id, formData) => {
    await getCsrfToken(); // Lấy token CSRF từ server khi Đăng ký người dùng

    const response = await axiosPrivate.put(
      `/api/featured-products/${id}`,
      formData
    );
    return response.data;
  },

  deleteFeaturedProducts: async (id) => {
    await getCsrfToken(); // Lấy token CSRF từ server khi Đăng ký người dùng
    const response = await axiosPrivate.delete(`/api/featured-products/${id}`);
    return response.data;
  },
};
