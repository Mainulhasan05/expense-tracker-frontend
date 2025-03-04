"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Bell, Sun, Moon, ChevronDown } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { fetchProfile } from "@/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import ProfileImage from "./ProfileImage";
import { setActiveMonth } from "@/features/date/dateSlice";
import Link from "next/link";

export default function DashboardNavbar() {
  const { user } = useSelector((state) => state.auth);
  const { activeMonth } = useSelector((state) => state.date);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();

  // State for UI elements
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  // Refs for dropdown containers
  const profileRef = useRef(null);
  const monthDropdownRef = useRef(null);

  // Memoize the months array
  const months = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) =>
      dayjs().subtract(i, "month").format("MMMM YYYY")
    ).reverse();
  }, []);

  // Handle month selection
  const handleMonthChange = (month) => {
    dispatch(setActiveMonth(month));
    Cookies.set("activeMonth", month, { expires: 30 });
    setIsMonthDropdownOpen(false);
  };

  // Initial setup
  useEffect(() => {
    dispatch(fetchProfile());
    const storedMonth = Cookies.get("activeMonth");
    const defaultMonth = storedMonth || months[months.length - 1]; // Latest month by default
    dispatch(setActiveMonth(defaultMonth));
  }, [dispatch]); // Removed `months` from dependencies

  // Close sidebar on page navigation
  useEffect(() => {
    const handleRouteChange = () => {
      if (isSidebarOpen) {
        setIsSidebarOpen(false);
        document.body.classList.remove("sidebar-open");

        // Dispatch event to notify sidebar of state change
        const event = new CustomEvent("toggle-sidebar", { detail: false });
        window.dispatchEvent(event);
      }
    };

    window.addEventListener("routeChangeStart", handleRouteChange);

    return () => {
      window.removeEventListener("routeChangeStart", handleRouteChange);
    };
  }, [isSidebarOpen]);

  // Handle clicks outside of dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      // Close profile dropdown if clicked outside
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }

      // Close month dropdown if clicked outside
      if (
        monthDropdownRef.current &&
        !monthDropdownRef.current.contains(event.target)
      ) {
        setIsMonthDropdownOpen(false);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    Cookies.remove("finance-tracker-token");
    router.push("/");
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);

    // Toggle body class for preventing scroll
    document.body.classList.toggle("sidebar-open", newState);

    // Dispatch event for sidebar component
    const event = new CustomEvent("toggle-sidebar", { detail: newState });
    window.dispatchEvent(event);
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
              aria-controls="mobile-menu"
              aria-expanded={isSidebarOpen}
            >
              <span className="sr-only">
                {isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              </span>
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link href="/dashboard" className="flex items-center">
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white ml-2 md:ml-0">
                Finance Tracker
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Month Selector */}
            <div className="relative" ref={monthDropdownRef}>
              <button
                className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                aria-expanded={isMonthDropdownOpen}
                aria-haspopup="true"
              >
                <span className="max-w-[100px] sm:max-w-none truncate">
                  {activeMonth}
                </span>
                <ChevronDown size={16} className="ml-1 flex-shrink-0" />
              </button>

              {isMonthDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-600">
                  {months.map((month) => (
                    <button
                      key={month}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                        month === activeMonth
                          ? "bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white font-medium"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                      onClick={() => handleMonthChange(month)}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
              aria-label={`Switch to ${
                theme === "dark" ? "light" : "dark"
              } mode`}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications */}
            <button
              className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
              aria-label="View notifications"
            >
              <Bell size={20} />
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
              >
                <span className="sr-only">Open user menu</span>
                <ProfileImage user={user} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 z-10 border border-gray-200 dark:border-gray-600">
                  <div className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    <div className="font-medium">{user?.name}</div>
                    <div className="truncate text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </div>
                  </div>
                  <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                    <li>
                      <Link
                        href="/dashboard/profile"
                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/dashboard/settings"
                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Settings
                      </Link>
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
