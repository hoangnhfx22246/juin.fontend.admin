import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/authSlice";
import {
  FiUser,
  FiSettings,
  FiLogOut,
  FiLogIn,
  FiUserPlus,
  FiShoppingBag,
  FiHeart,
  FiCreditCard,
  FiBell,
} from "react-icons/fi";
import { showNotification } from "../../util/notification";

const NavigationUser = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    const logoutPromise = dispatch(logoutUser()).unwrap(); // unwrap để lấy giá trị trả về từ thunk
    showNotification.promise(logoutPromise, {
      loading: "Đang đăng xuất...",
      success: "Đăng xuất thành công!",
      error: "Đăng xuất thất bại!",
    });
    navigate("/");
    setIsDropdownOpen(false);
  };

  // Menu items for logged-in users
  const userMenuItems = [
    {
      name: "My Profile",
      path: "/profile",
      icon: <FiUser />,
      description: "View and edit your profile",
    },
    {
      name: "My Orders",
      path: "/orders",
      icon: <FiShoppingBag />,
      description: "Track your orders",
    },
    {
      name: "Wishlist",
      path: "/wishlist",
      icon: <FiHeart />,
      description: "Your saved items",
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: <FiBell />,
      description: "Your notifications",
      badge: 3, // Optional: Show number of notifications
    },
  ];

  // Menu items for guests
  const guestMenuItems = [
    {
      name: "Sign In",
      path: "/login",
      icon: <FiLogIn />,
      description: "Access your account",
    },
    {
      name: "Create Account",
      path: "/register",
      icon: <FiUserPlus />,
      description: "Join us today",
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Button */}
      <button
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {currentUser ? (
          <>
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-green-500">
              {currentUser.avatar?.url ? (
                <img
                  src={currentUser.avatar?.url}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-medium text-sm">
                    {currentUser.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              )}
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {currentUser.name || "User"}
            </span>
          </>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <FiUser className="w-5 h-5 text-gray-600" />
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
          {currentUser && (
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500">
                  {currentUser.avatar?.url ? (
                    <img
                      src={currentUser.avatar?.url}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 font-medium">
                        {currentUser.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-gray-500">{currentUser.email}</p>
                </div>
              </div>
            </div>
          )}

          <div className="py-2">
            {(currentUser ? userMenuItems : guestMenuItems).map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center px-4 py-2 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setIsDropdownOpen(false)}
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  {React.cloneElement(item.icon, {
                    className: "w-4 h-4 text-gray-600",
                  })}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}

            {currentUser && (
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 hover:bg-gray-50 transition-colors duration-200 text-left"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <FiLogOut className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">Sign Out</p>
                  <p className="text-xs text-gray-500">
                    Log out of your account
                  </p>
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationUser;
