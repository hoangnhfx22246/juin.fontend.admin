import axiosPrivate from "../util/axiosPrivate";

export const getUserAPI = async (userId) => {
  const res = await axiosPrivate.get(`/api/user/${userId}`, {
    withCredentials: true,
  });

  return res.data;
};

export const updateUserAPI = async (userId, formData) => {
  const res = await axiosPrivate.patch(`/api/user/${userId}`, formData, {
    withCredentials: true,
  });

  return res.data;
};
