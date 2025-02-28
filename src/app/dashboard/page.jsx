import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCharts } from "@/components/dashboard/charts";
import { ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react";

export default function DashboardPage() {
  // Static data for demonstration
  const financialData = {
    income: 5280,
    expenses: 3450,
    netBalance: 5280 - 3450,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Income Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${financialData.income.toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-green-500">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>12% from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${financialData.expenses.toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-red-500">
              <ArrowDownRight className="mr-1 h-4 w-4" />
              <span>8% from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Net Balance Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${financialData.netBalance.toLocaleString()}
            </div>
            <div
              className={`flex items-center text-sm ${
                financialData.netBalance > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {financialData.netBalance > 0 ? (
                <>
                  <span className="mr-1">🟢</span>
                  <span>Positive balance</span>
                </>
              ) : (
                <>
                  <span className="mr-1">🔴</span>
                  <span>Negative balance</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <DashboardCharts />
    </div>
  );
}
