import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import RequestForm from "../../Components/Auth/RequestForm";
import ResetForm from "../../Components/Auth/ResetForm";
import { forgotPasswordAPI, resetPasswordAPI } from "../../api/auth";
import { showNotification } from "../../util/notification";

const ResetPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");

  const handleRequestReset = async (email) => {
    setError("");
    setSuccess("");
    setIsLoading(true);
    showNotification.info("Đang gửi yêu cầu...");
    try {
      await forgotPasswordAPI(email);
      setSuccess("Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.");
      showNotification.success("Vui lòng kiểm tra email của bạn");
    } catch (err) {
      setError(
        err.response?.data?.errors ||
          "mail gửi đi không thành công. Hãy thử lại sau"
      );
      showNotification.error("Không gửi được email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (password, confirmPassword) => {
    setError("");
    setSuccess("");
    setIsLoading(true);
    showNotification.info("Đang đặt lại mật khẩu...");
    try {
      await resetPasswordAPI({ password, confirmPassword, token: resetToken });
      showNotification.success("Đặt lại mật khẩu thành công");
      localStorage.removeItem("csrfToken"); // Xoá token sau khi đặt lại mật khẩu
      setSuccess("Mật khẩu đã được đặt lại thành công. Hãy đăng nhập lại.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.errors ||
          "Không thể đặt lại mật khẩu. Hãy thử lại sau"
      );
      showNotification.error("Không thể đặt lại mật khẩu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-lg bg-white">
      <h2 className="text-2xl font-bold text-center mb-4">
        {resetToken ? "Đặt lại mật khẩu" : "Quên mật khẩu"}
      </h2>

      {success && (
        <div className="text-green-500 text-center mb-4">{success}</div>
      )}

      {resetToken ? (
        <ResetForm
          onSubmit={handleResetPassword}
          isLoading={isLoading}
          error={error}
        />
      ) : (
        <RequestForm
          onSubmit={handleRequestReset}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
};

export default ResetPasswordPage;
