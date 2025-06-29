"use client";

import {
  fetchCategoryWiseData,
  fetchTopCategories,
} from "@/features/dashboard/dashboardSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF7C7C",
  "#8DD1E1",
  "#D084D0",
];

export default function CategoryWiseCharts() {
  const { activeMonth } = useSelector((state) => state.date);
  const { categoryWiseData, topCategories, loading } = useSelector(
    (state) => state.dashboard
  );
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("expenses");
  const [viewType, setViewType] = useState("pie"); // pie or bar

  useEffect(() => {
    // Fetch category data for current month
    if (activeMonth) {
      dispatch(fetchCategoryWiseData({ activeMonth }));
      dispatch(fetchTopCategories({ activeMonth, limit: 10 }));
    }
  }, [dispatch, activeMonth]);

  // Prepare data for expense pie chart
  const expensesPieData =
    categoryWiseData?.expenses?.categories?.map((cat, index) => ({
      name: cat.name,
      value: cat.amount,
      color: COLORS[index % COLORS.length],
      percentage: cat.percentage,
    })) || [];

  // Prepare data for income pie chart
  const incomePieData =
    categoryWiseData?.income?.categories?.map((cat, index) => ({
      name: cat.name,
      value: cat.amount,
      color: COLORS[index % COLORS.length],
      percentage: cat.percentage,
    })) || [];

  // Prepare data for top categories bar chart
  const topCategoriesBarData =
    topCategories?.map((cat) => ({
      name: cat.category,
      amount: cat.amount,
      type: cat.type,
      fill: cat.type === "income" ? "#10B981" : "#EF4444",
    })) || [];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    if (percent < 0.05) return null; // Don't show labels for slices less than 5%

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-80 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Category Analysis
        </h2>
        <div className="flex space-x-2">
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="pie">Pie Chart</option>
            <option value="bar">Bar Chart</option>
          </select>

          {viewType === "pie" && (
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab("expenses")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  activeTab === "expenses"
                    ? "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                Expenses
              </button>
              <button
                onClick={() => setActiveTab("income")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  activeTab === "income"
                    ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                Income
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="h-80">
        {viewType === "pie" ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={
                  activeTab === "expenses" ? expensesPieData : incomePieData
                }
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {(activeTab === "expenses"
                  ? expensesPieData
                  : incomePieData
                ).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`$${value.toFixed(2)}`, name]}
                labelFormatter={(label) => `Category: ${label}`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topCategoriesBarData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [`$${value}`, "Amount"]}
                labelFormatter={(label) => `Category: ${label}`}
              />
              <Legend />
              <Bar dataKey="amount" name="Amount">
                {topCategoriesBarData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg dark:bg-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Expenses
          </h3>
          <p className="text-lg font-semibold text-red-600 dark:text-red-400">
            ${categoryWiseData?.expenses?.total?.toFixed(2) || "0.00"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {categoryWiseData?.expenses?.categories?.length || 0} categories
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg dark:bg-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Income
          </h3>
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">
            ${categoryWiseData?.income?.total?.toFixed(2) || "0.00"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {categoryWiseData?.income?.categories?.length || 0} categories
          </p>
        </div>
      </div>
    </div>
  );
}
