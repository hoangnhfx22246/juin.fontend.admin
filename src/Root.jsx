import { Outlet } from "react-router-dom";
import Navbar from "./Components/Layouts/Navbar";
import Sidebar from "./Components/Layouts/Sidebar";
import { useState } from "react";

export default function Root() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State để quản lý trạng thái Sidebar

  return (
    <>
      <Navbar />
      <div className="flex">
        <div
          className={`bg-[#0e0e0e] ${
            isSidebarOpen ? "w-72" : "w-16"
          } duration-500 text-gray-100 mt-16 fixed top-0 bottom-0 left-0 z-10`}
        >
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>
        <div
          className={`${
            isSidebarOpen ? "ml-72" : "ml-16"
          } flex-1 mt-16 duration-500 relative`}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
}
