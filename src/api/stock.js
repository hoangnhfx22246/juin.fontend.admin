import axiosPrivate from "../util/axiosPrivate";
import axiosPublic from "../util/axiosPublic";
import { getCsrfToken } from "./csrfToken";

export const stockAPI = {
  postStockEntry: async () => {
    const response = await axiosPublic.post("/api/stock-entry");
    return response.data;
  },
};
