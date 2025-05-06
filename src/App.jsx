import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Root";
import DashboardPage from "./Pages/DashboardPage";
import PrivateRoute from "./Components/Routes/PrivateRoute";
import PublicRoute from "./Components/Routes/PublicRoute";
import LoginPage from "./Pages/Auth/LoginPage";
import ResetPasswordPage from "./Pages/Auth/LoginPage";
import CategoryManager from "./Pages/CategoryManager";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Root />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "categories",
        element: <CategoryManager />,
      },
    ],
  }, // 🔓 Public route
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/forgot-password",
        element: <ResetPasswordPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
