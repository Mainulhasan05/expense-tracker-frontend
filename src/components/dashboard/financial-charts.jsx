"use client";

import { useState } from "react";
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

export default function FinancialCharts() {
  const [activeTab, setActiveTab] = useState("pie");

  // Static data for demo
  const pieData = [
    { name: "Income", value: 5250.75, color: "#10B981" },
    { name: "Expenses", value: 3120.45, color: "#EF4444" },
  ];

  const barData = [
    { name: "Jan", income: 4200, expenses: 2800 },
    { name: "Feb", income: 4800, expenses: 3100 },
    { name: "Mar", income: 4200, expenses: 2800 },
    { name: "Feb", income: 4800, expenses: 3100 },
    { name: "Mar", income: 5250, expenses: 3120 },
    { name: "Apr", income: 4900, expenses: 2950 },
    { name: "May", income: 5500, expenses: 3300 },
  ];

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Financial Overview
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("pie")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              activeTab === "pie"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            Distribution
          </button>
          <button
            onClick={() => setActiveTab("bar")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              activeTab === "bar"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            Monthly Trends
          </button>
        </div>
      </div>

      <div className="h-80">
        {activeTab === "pie" ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#10B981" />
              <Bar dataKey="expenses" name="Expenses" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
