"use client";

import { useState } from "react";
import { Edit, Trash2, MoreVertical } from "lucide-react";
import Pagination from "@/components/ui/pagination";

export default function TransactionList() {
  // Static data for demo
  const initialTransactions = [
    {
      id: 1,
      type: "income",
      category: "Salary",
      amount: 3200,
      date: "2025-03-15",
      description: "Monthly salary",
    },
    {
      id: 2,
      type: "expense",
      category: "Rent",
      amount: 1200,
      date: "2025-03-10",
      description: "Monthly rent",
    },
    {
      id: 3,
      type: "expense",
      category: "Groceries",
      amount: 150.45,
      date: "2025-03-08",
      description: "Weekly groceries",
    },
    {
      id: 4,
      type: "income",
      category: "Freelance",
      amount: 850,
      date: "2025-03-05",
      description: "Website project",
    },
    {
      id: 5,
      type: "expense",
      category: "Utilities",
      amount: 120,
      date: "2025-03-03",
      description: "Electricity bill",
    },
    {
      id: 6,
      type: "expense",
      category: "Dining",
      amount: 85.2,
      date: "2025-03-01",
      description: "Dinner with friends",
    },
    {
      id: 7,
      type: "income",
      category: "Interest",
      amount: 12.5,
      date: "2025-02-28",
      description: "Savings account interest",
    },
    {
      id: 8,
      type: "expense",
      category: "Transportation",
      amount: 60,
      date: "2025-02-25",
      description: "Monthly transit pass",
    },
    {
      id: 9,
      type: "expense",
      category: "Shopping",
      amount: 120.75,
      date: "2025-02-20",
      description: "New clothes",
    },
    {
      id: 10,
      type: "income",
      category: "Bonus",
      amount: 500,
      date: "2025-02-15",
      description: "Performance bonus",
    },
    {
      id: 11,
      type: "expense",
      category: "Entertainment",
      amount: 45.99,
      date: "2025-02-10",
      description: "Movie tickets",
    },
    {
      id: 12,
      type: "expense",
      category: "Healthcare",
      amount: 75,
      date: "2025-02-05",
      description: "Doctor visit",
    },
    {
      id: 13,
      type: "income",
      category: "Refund",
      amount: 35.2,
      date: "2025-02-01",
      description: "Product return",
    },
    {
      id: 14,
      type: "expense",
      category: "Subscription",
      amount: 15.99,
      date: "2025-01-28",
      description: "Streaming service",
    },
    {
      id: 15,
      type: "expense",
      category: "Education",
      amount: 200,
      date: "2025-01-25",
      description: "Online course",
    },
  ];

  const [transactions, setTransactions] = useState(initialTransactions);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  // Get current transactions
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleDeleteTransaction = (id) => {
    setTransactions(
      transactions.filter((transaction) => transaction.id !== id)
    );
    setOpenMenuId(null);
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setOpenMenuId(null); // Close any open menus when changing pages
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Category
                </th>
                <th scope="col" className="px-6 py-3">
                  Description
                </th>
                <th scope="col" className="px-6 py-3">
                  Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                currentTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{transaction.category}</td>
                    <td className="px-6 py-4">{transaction.description}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.type === "income"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {transaction.type.charAt(0).toUpperCase() +
                          transaction.type.slice(1)}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 font-medium ${
                        transaction.type === "income"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}$
                      {transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button
                        onClick={() => toggleMenu(transaction.id)}
                        className="font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {openMenuId === transaction.id && (
                        <div className="absolute right-6 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700">
                          <button
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                            onClick={() => {
                              // Edit functionality would go here
                              setOpenMenuId(null);
                            }}
                          >
                            <Edit size={16} className="mr-2" />
                            Edit
                          </button>
                          <button
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-600"
                            onClick={() =>
                              handleDeleteTransaction(transaction.id)
                            }
                          >
                            <Trash2 size={16} className="mr-2" />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
