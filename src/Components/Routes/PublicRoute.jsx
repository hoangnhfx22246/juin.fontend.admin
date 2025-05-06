import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

export default function PublicRoute() {
  const { currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/", { replace: true }); // dùng replace để tránh ghi đè vào lịch sử trình duyệt
    }
  }, [currentUser, navigate]);

  // Chỉ render Outlet nếu chưa login
  return !currentUser ? <Outlet /> : null;
}
