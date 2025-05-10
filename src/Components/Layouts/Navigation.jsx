import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCategoryNavigation } from "../../redux/categorySlice"; // Adjust path if needed
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const NavLink = ({
  to,
  children,
  className = "",
  activeClassName = "",
  ...props
}) => {
  const location = useLocation();
  const isActive =
    location.pathname === to ||
    (to !== "/" && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`${className} ${isActive ? activeClassName : ""}`}
      {...props}
    >
      {children}
    </Link>
  );
};

const DropdownMenu = ({ item, level = 0, closeAllMenus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const handleToggle = (e) => {
    e.stopPropagation(); // Prevent parent menus from closing
    setIsOpen(!isOpen);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  if (!item.children || item.children.length === 0) {
    return (
      <NavLink
        to={item.path}
        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap`}
        activeClassName="bg-gray-100 text-gray-900"
        onClick={closeAllMenus} // Close all menus on final link click
      >
        {item.name}
      </NavLink>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleToggle}
        onMouseEnter={() => level === 0 && setIsOpen(true)} // Open top-level on hover for desktop
        onMouseLeave={() => level === 0 && setIsOpen(false)} // Close top-level on mouse leave for desktop
        className={`w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap
                    ${level > 0 ? "hover:bg-gray-200" : ""}`}
      >
        <span>{item.name}</span>
        <ChevronDownIcon
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${
            isOpen
              ? level > 0
                ? "-rotate-90"
                : "rotate-180"
              : level > 0
              ? "-rotate-90"
              : ""
          }`}
        />
      </button>
      {isOpen && (
        <div
          className={`
            ${
              level === 0
                ? "absolute top-full left-0 mt-1"
                : "absolute top-0 left-full ml-1"
            }
            min-w-[200px] bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200
          `}
          onMouseEnter={() => level === 0 && setIsOpen(true)} // Keep open on hover for desktop
          onMouseLeave={() => level === 0 && setIsOpen(false)} // Close on mouse leave for desktop
        >
          {item.children.map((child, index) => (
            <DropdownMenu
              key={index}
              item={child}
              level={level + 1}
              closeAllMenus={closeAllMenus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Navigation = () => {
  const navigationItems = useSelector(selectCategoryNavigation);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeAllMobileMenus = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo or Site Name */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-gray-800">
              MySite
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:ml-6 md:space-x-1">
            {navigationItems.map((item, index) => (
              <div key={index} className="relative">
                {!item.children || item.children.length === 0 ? (
                  <NavLink
                    to={item.path}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    activeClassName="bg-gray-100 text-gray-900"
                  >
                    {item.name}
                  </NavLink>
                ) : (
                  <DropdownMenu item={item} closeAllMenus={() => {}} /> // closeAllMenus not needed for desktop top level
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 z-40 transform shadow-lg bg-white">
          <div className="pt-2 pb-3 space-y-1 px-2">
            {navigationItems.map((item, index) => (
              <div key={index}>
                {!item.children || item.children.length === 0 ? (
                  <NavLink
                    to={item.path}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    activeClassName="bg-indigo-50 border-indigo-500 text-indigo-700"
                    onClick={closeAllMobileMenus}
                  >
                    {item.name}
                  </NavLink>
                ) : (
                  <MobileDropdown
                    item={item}
                    closeAllMenus={closeAllMobileMenus}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// Separate component for mobile dropdown logic to manage its own state
const MobileDropdown = ({ item, closeAllMenus }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!item.children || item.children.length === 0) {
    return (
      <NavLink
        to={item.path}
        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        activeClassName="bg-indigo-50 border-indigo-500 text-indigo-700"
        onClick={closeAllMenus}
      >
        {item.name}
      </NavLink>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
      >
        <span>{item.name}</span>
        <ChevronDownIcon
          className={`w-5 h-5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="pl-4 mt-1 space-y-1">
          {item.children.map((child, index) => (
            <MobileDropdown
              key={index}
              item={child}
              closeAllMenus={closeAllMenus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Navigation;
