import axiosPublic from "../util/axiosPublic";
import axiosPrivate from "../util/axiosPrivate";
import { getCsrfToken } from "./csrfToken";

// Đăng ký người dùng và tự động đăng nhập
export const registerUserAPI = async (formData) => {
  await getCsrfToken(); // Lấy token CSRF từ server khi Đăng ký người dùng

  const res = await axiosPublic.post("/api/auth/register", formData, {
    withCredentials: true, // cookie sẽ được gửi hoặc nhận về
  });
  return res.data; // trả về user + token
};

// Đăng nhập người dùng
export const loginUserAPI = async (formData) => {
  await getCsrfToken(); // Lấy token CSRF từ server khi đăng nhập

  const res = await axiosPublic.post("/api/auth/login?type=admin", formData, {
    // Để cookie được gửi đi và nhận về từ server
    withCredentials: true, //cookie sẽ được gửi hoặc nhận về
  });
  return res.data; // trả về user + token
};

// Đăng xuất người dùng
export const logoutUserAPI = async () => {
  await getCsrfToken(); // Xác nhận có token CSRF trước khi gửi
  const res = await axiosPrivate.post("/api/auth/logout", null, {
    withCredentials: true,
  });
  return res.data;
};

// Quên mật khẩu
export const forgotPasswordAPI = async (email) => {
  await getCsrfToken(); // Lấy token CSRF từ server khi Đăng ký người dùng

  const res = await axiosPublic.post(
    "/api/auth/forgot-password",
    { email },
    {
      withCredentials: true, // cookie sẽ được gửi hoặc nhận về
    }
  );
  return res.data;
};

// Reset mật khẩu
export const resetPasswordAPI = async (formData) => {
  const token = await getCsrfToken(); // Lấy token CSRF từ server khi Đăng ký người dùng

  const res = await axiosPublic.post(`/api/auth/reset-password`, formData, {
    headers: {
      "X-CSRF-Token": token,
    },
    withCredentials: true, // cookie sẽ được gửi hoặc nhận về
  });
  return res.data;
};
