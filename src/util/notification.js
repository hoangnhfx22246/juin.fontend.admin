import { toast } from "sonner";

export const showNotification = {
  success: (message) => {
    toast.success(message, {
      duration: 3000,
      position: "top-right",
    });
  },
  error: (message) => {
    toast.error(message, {
      duration: 4000,
      position: "top-right",
    });
  },
  warning: (message) => {
    toast.warning(message, {
      duration: 4000,
      position: "top-right",
    });
  },
  info: (message) => {
    toast.info(message, {
      duration: 3000,
      position: "top-right",
    });
  },
  promise: async (promise, messages) => {
    return toast.promise(promise, {
      loading: messages.loading || "Loading...",
      success: messages.success || "Success!",
      error: messages.error || "Error occurred",
      position: "top-right", // Đặt vị trí ở đây
    });
  },
  custom: (message, options = {}) => {
    toast(message, {
      duration: 3000,
      position: "top-right",
      ...options,
    });
  },
};
