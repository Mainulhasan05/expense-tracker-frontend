import DashboardSidebar from "@/components/dashboard/sidebar";
import DashboardNavbar from "@/components/dashboard/navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardNavbar />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-4 md:p-6 pt-20 md:ml-64">{children}</main>
      </div>
    </div>
  );
}
