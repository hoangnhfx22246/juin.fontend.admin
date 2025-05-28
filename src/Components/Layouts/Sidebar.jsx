import React, { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import {
  AiOutlineUser,
  AiOutlineSetting,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaShoppingBag, FaFire, FaBoxes } from "react-icons/fa";
import { IoIosFlash } from "react-icons/io";
import { FiMessageSquare, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [openMenus, setOpenMenus] = useState([]);

  const toggleMenu = (name) => {
    setOpenMenus((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const menus = [
    {
      name: "Thống kê",
      link: "/",
      icon: MdDashboard,
      roles: ["admin"],
    },
    {
      name: "Sản phẩm",
      icon: FaShoppingBag,
      roles: ["admin"],
      children: [
        { name: "sản phẩm", link: "/products" },
        { name: "danh mục", link: "/categories" },
        { name: "Thêm sản phẩm", link: "/products/add" },
      ],
    },
    {
      name: "Đơn hàng",
      link: "/orders",
      icon: AiOutlineShoppingCart,
      roles: ["admin"],
    },
    {
      name: "Chương trình ưu đãi",
      link: "/flash-sales",
      icon: IoIosFlash,
      roles: ["admin"],
    },
    {
      name: "Sản phẩm nổi bật",
      link: "/featured-products",
      icon: FaFire,
      roles: ["admin"],
    },
    {
      name: "Profile",
      link: "/profile",
      icon: AiOutlineUser,
      roles: ["admin", "advisor"],
    },
    {
      name: "Messages",
      link: "/chat",
      icon: FiMessageSquare,
      roles: ["admin", "advisor"],
    },
    {
      name: "Settings",
      link: "/settings",
      icon: AiOutlineSetting,
      roles: ["admin"],
    },
  ];

  const filteredMenus = menus.filter((menu) => menu.roles.includes("admin"));

  return (
    <div className="w-full h-full px-4">
      <div className="py-3 flex justify-end">
        <HiMenuAlt3
          size={26}
          className="cursor-pointer"
          onClick={() => toggleSidebar()}
        />
      </div>

      <div className="mt-4 flex flex-col gap-4 relative">
        {filteredMenus.map((menu, i) => {
          const hasChildren = !!menu.children;
          const isExpanded = openMenus.includes(menu.name);

          const MenuContent = (
            <div
              onClick={() => {
                if (hasChildren) toggleMenu(menu.name);
              }}
              className="group flex items-center justify-between text-sm font-medium p-2 hover:bg-gray-800 rounded-md cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                {React.createElement(menu.icon, { size: "20" })}
                <h2
                  className={`whitespace-pre duration-500 ${
                    !isOpen && "opacity-0 translate-x-28 overflow-hidden"
                  }`}
                >
                  {menu.name}
                </h2>
                <h2
                  className={`${
                    isOpen && "hidden"
                  } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
                >
                  {menu.name}
                </h2>
              </div>

              {hasChildren && isOpen && (
                <FiChevronRight
                  className={`text-gray-400 transition-transform duration-300 ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                  size={16}
                />
              )}
            </div>
          );

          return (
            <div key={i}>
              {hasChildren ? (
                MenuContent
              ) : (
                <Link to={menu.link}>{MenuContent}</Link>
              )}

              {/* Submenu (animated) */}
              <AnimatePresence>
                {hasChildren && isExpanded && isOpen && (
                  <motion.div
                    className="ml-7 mt-1 flex flex-col gap-1"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {menu.children.map((child, idx) => (
                      <Link
                        to={child.link}
                        key={idx}
                        className="text-sm text-gray-300 hover:text-white px-2 py-1 rounded-md hover:bg-gray-700"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
