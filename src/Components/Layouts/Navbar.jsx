import { useState, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiSun,
  FiMoon,
  FiBell,
  FiSettings,
  FiUser,
  FiPieChart,
  FiUsers,
  FiLogOut,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/authSlice";
import { showNotification } from "../../util/notification";

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth); // lấy thông tin người dùng từ redux store
  const dispatch = useDispatch();

  const menuItems = [
    { icon: FiPieChart, label: "Dashboard", active: true },
    { icon: FiUsers, label: "User Management", active: false },
    { icon: FiSettings, label: "Analytics", active: false },
    { icon: FiSettings, label: "Settings", active: false },
  ];

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  // logout handler
  const handleLogout = () => {
    const logoutPromise = dispatch(logoutUser()).unwrap(); // unwrap để lấy giá trị trả về từ thunk
    showNotification.promise(logoutPromise, {
      loading: "Đang đăng xuất...",
      success: "Đăng xuất thành công!",
      error: "Đăng xuất thất bại!",
    });
    navigate("/");
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg fixed w-full top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              Juin Admin
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
              <FiBell className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
            </button>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              {isDarkMode ? (
                <FiSun className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              ) : (
                <FiMoon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              )}
            </button>

            <div className="relative">
              <button
                onClick={toggleProfile}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={currentUser?.avatar?.url}
                  alt="Profile"
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-gray-700">
                    <p className="font-medium"> {currentUser?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {currentUser?.email}
                    </p>
                  </div>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    My Profile
                  </a>
                  <a
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    Sign out
                  </a>
                </div>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                {isMenuOpen ? (
                  <FiX className="block h-6 w-6" />
                ) : (
                  <FiMenu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  item.active
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <item.icon className="mr-2" />
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
