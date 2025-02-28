"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Bell, Sun, Moon, ChevronDown, User } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export default function DashboardNavbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState("March 2025");

  const months = [
    "January 2025",
    "February 2025",
    "March 2025",
    "April 2025",
    "May 2025",
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    // Add a class to the body to prevent scrolling when sidebar is open
    document.body.classList.toggle("sidebar-open");

    // Dispatch a custom event that the sidebar can listen to
    const event = new CustomEvent("toggle-sidebar", { detail: !isSidebarOpen });
    window.dispatchEvent(event);
  };

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Open sidebar</span>
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white ml-2 md:ml-0">
              Finance Tracker
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Month Selector */}
            <div className="relative">
              <button
                className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                onClick={() =>
                  document
                    .getElementById("month-dropdown")
                    .classList.toggle("hidden")
                }
              >
                {currentMonth}
                <ChevronDown size={16} className="ml-1" />
              </button>
              <div
                id="month-dropdown"
                className="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10"
              >
                {months.map((month) => (
                  <button
                    key={month}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => {
                      setCurrentMonth(month);
                      document
                        .getElementById("month-dropdown")
                        .classList.add("hidden");
                    }}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
            >
              <span className="sr-only">Toggle theme</span>
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications */}
            <button className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700">
              <span className="sr-only">View notifications</span>
              <Bell size={20} />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <span className="sr-only">Open user menu</span>
                <div className="relative w-8 h-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                  <User className="absolute w-10 h-10 text-gray-400 -left-1" />
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                  <div className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    <div>John Doe</div>
                    <div className="font-medium truncate">
                      john.doe@example.com
                    </div>
                  </div>
                  <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                    <li>
                      <a
                        href="#"
                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Profile
                      </a>
                    </li>
                    <li>
                      <a
                        href="/dashboard/settings"
                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Settings
                      </a>
                    </li>
                  </ul>
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
