"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import {
  Home,
  DollarSign,
  CheckSquare,
  Settings,
  Users,
  LogOut,
  Shield,
  BarChart3,
  Music,
  Brain
} from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleToggleSidebar = (event) => {
      setIsOpen(event.detail);
    };

    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("toggle-sidebar", handleToggleSidebar);
    document.addEventListener("mousedown", handleClickOutside);

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("toggle-sidebar", handleToggleSidebar);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isActive = (path) => {
    // Handle admin routes specially
    if (path === "/dashboard/admin") {
      return pathname === path || pathname.startsWith("/dashboard/admin/");
    }
    return pathname === path;
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Transactions", href: "/dashboard/transactions", icon: DollarSign },
    // { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare }, // Hidden for now
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    // Admin only items
    {
      name: "Admin Dashboard",
      href: "/dashboard/admin",
      icon: BarChart3,
      admin: true,
    },
    {
      name: "User Management",
      href: "/dashboard/admin/users",
      icon: Users,
      admin: true,
    },
    {
      name: "Voice Services",
      href: "/dashboard/admin/voice-services",
      icon: Music,
      admin: true,
    },
    {
      name: "AI Parser Accounts",
      href: "/dashboard/admin/clarifai",
      icon: Brain,
      admin: true,
    },
  ];

  // Get user role from Redux store
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role || "user";

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logging out...");
    // For example:
    // Cookies.remove("finance-tracker-token");
    // router.push("/");
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-50 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto flex flex-col">
          <ul className="space-y-2 font-medium flex-grow">
            {navItems.map((item) => {
              if (item.admin && userRole !== "admin") return null;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-2 rounded-lg group ${
                      isActive(item.href)
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                        : "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon
                      className={`w-5 h-5 transition duration-75 ${
                        isActive(item.href)
                          ? "text-blue-600 dark:text-blue-200"
                          : "text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                      }`}
                    />
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <button
            onClick={handleLogout}
            className="flex items-center p-2 mt-auto text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <LogOut className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
