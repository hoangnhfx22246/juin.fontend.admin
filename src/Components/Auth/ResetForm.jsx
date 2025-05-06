import React, { useState, useRef } from "react";
import { FiLock } from "react-icons/fi";
import renderFieldErrors from "../../util/renderFieldErrors";

const ResetForm = ({ onSubmit, isLoading, error }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(password, confirmPassword);
    inputRef.current?.blur(); // Clear focus sau khi submit
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          New Password
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiLock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="password"
            id="password"
            required
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && renderFieldErrors("password", error)}
      </div>
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm New Password
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiLock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            id="confirmPassword"
            required
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && renderFieldErrors("confirmPassword", error)}
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
        {isLoading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
};

export default ResetForm;
