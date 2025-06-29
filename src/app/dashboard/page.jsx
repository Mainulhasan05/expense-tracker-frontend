import DashboardWidgets from "@/components/dashboard/widgets";
import FinancialCharts from "@/components/dashboard/financial-charts";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import CategoryWiseCharts from "@/components/dashboard/category-wise-charts";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <DashboardWidgets />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinancialCharts />
        <RecentTransactions />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <CategoryWiseCharts />
      </div>
    </div>
  );
}
