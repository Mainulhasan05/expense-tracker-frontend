import DashboardSidebar from "../../components/dashboard/sidebar";
import DashboardNavbar from "../../components/dashboard/navbar";
import { ThemeProvider } from "../../components/theme-provider";

export default function DashboardLayout({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <DashboardNavbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}
