import axiosPublic from "../util/axiosPublic";

// Lấy token CSRF từ server để bảo vệ khỏi các cuộc tấn công CSRF
export const getCsrfToken = async () => {
  const savedToken = JSON.parse(localStorage.getItem("csrfToken"));

  if (savedToken) return savedToken; // nếu đã có thì không cần gọi server nữa

  const res = await axiosPublic.get("/api/auth/csrf-token", {
    withCredentials: true,
  });
  localStorage.setItem("csrfToken", JSON.stringify(res.data.csrfToken)); // lưu token vào localStorage

  return res.data.csrfToken;
};
