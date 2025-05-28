import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Root";
import DashboardPage from "./Pages/DashboardPage";
import PrivateRoute from "./Components/Routes/PrivateRoute";
import PublicRoute from "./Components/Routes/PublicRoute";
import LoginPage from "./Pages/Auth/LoginPage";
import ResetPasswordPage from "./Pages/Auth/ResetPasswordPage";
import CategoryManager from "./Pages/CategoryManager";
import ProductManager from "./Pages/ProductManager";
import ProductForm from "./Components/Products/ProductForm/ProductForm";
import FlashSalePage from "./Pages/FlashSalePage";
import FlashSaleForm from "./Components/FlashSale/FlashSaleForm";
import FeaturedProductPage from "./Pages/FeaturedProductPage";
import FeaturedProductForm from "./Components/FeaturedProduct/FeaturedProductForm";
import OrderManagement from "./Pages/OrderManagement";
import OrderDetail from "./Pages/OrderDetail";
import StockEntryForm from "./Components/Stock/StockEntry/StockEntryForm";

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
      {
        path: "products",
        element: <ProductManager />,
      },
      {
        path: "products/add",
        element: <ProductForm />,
      },
      {
        path: "products/edit",
        element: <ProductForm />,
      },
      {
        path: "products/edit",
        element: <ProductForm />,
      },
      {
        path: "flash-sales",
        element: <FlashSalePage />,
      },
      {
        path: "flash-sales/add",
        element: <FlashSaleForm />,
      },
      {
        path: "flash-sales/edit",
        element: <FlashSaleForm />,
      },
      {
        path: "featured-products",
        element: <FeaturedProductPage />,
      },
      {
        path: "featured-products/add",
        element: <FeaturedProductForm />,
      },
      {
        path: "featured-products/edit",
        element: <FeaturedProductForm />,
      },
      {
        path: "orders",
        element: <OrderManagement />,
      },
      {
        path: "orders/:id",
        element: <OrderDetail />,
      },
      {
        path: "stock-entry/add",
        element: <StockEntryForm />,
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
