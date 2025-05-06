import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./Redux/store.js";
import { Toaster } from "sonner";
import { injectStore } from "./util/setupInterceptors.js";

// ✅ Gọi injectStore trước khi App bắt đầu chạy
injectStore(store);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster richColors closeButton />
      <App />
    </Provider>
  </StrictMode>
);
