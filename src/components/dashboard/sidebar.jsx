"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  DollarSign,
  CheckSquare,
  Settings,
  Users,
  // categories icon
} from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Listen for toggle-sidebar event from navbar
  useEffect(() => {
    const handleToggleSidebar = (event) => {
      setIsOpen(event.detail);
    };

    window.addEventListener("toggle-sidebar", handleToggleSidebar);

    // On larger screens, sidebar is always open
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false); // Reset mobile sidebar state
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("toggle-sidebar", handleToggleSidebar);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isActive = (path) => {
    return pathname === path;
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Transactions", href: "/dashboard/transactions", icon: DollarSign },
    { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
    { name: "Categories", href: "/dashboard/settings", icon: Settings },
    // Admin only
    // {
    //   name: "User Management",
    //   href: "/dashboard/users",
    //   icon: Users,
    //   admin: true,
    // },
  ];

  // Static user role for demo
  const userRole = "admin";

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
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
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
        </div>
      </aside>
    </>
  );
}
