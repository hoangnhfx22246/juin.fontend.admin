import React, { useState, useRef } from "react";
import { FiMail } from "react-icons/fi";
import renderFieldErrors from "../../util/renderFieldErrors";

const RequestForm = ({ onSubmit, isLoading, error }) => {
  const [email, setEmail] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(email);
    inputRef.current?.blur(); // Clear focus sau khi submit
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email của bạn
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="email"
            id="email"
            required
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Điền email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {error && renderFieldErrors("email", error)}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          isLoading
            ? "bg-indigo-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {isLoading ? "Sending..." : "Đặt lại mật khẩu"}
      </button>
    </form>
  );
};

export default RequestForm;
