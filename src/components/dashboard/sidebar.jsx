"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Receipt,
  CheckSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Transactions",
      href: "/dashboard/transactions",
      icon: Receipt,
    },
    {
      title: "Tasks",
      href: "/dashboard/tasks",
      icon: CheckSquare,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`bg-card border-r relative ${
        collapsed ? "w-16" : "w-64"
      } transition-all duration-300 flex flex-col`}
    >
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed && <h2 className="font-bold text-xl">Finance</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={`${collapsed ? "mx-auto" : ""}`}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={`w-full justify-start ${
                    collapsed ? "px-2" : "px-3"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      pathname === item.href ? "text-primary" : ""
                    }`}
                  />
                  {!collapsed && <span className="ml-2">{item.title}</span>}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
