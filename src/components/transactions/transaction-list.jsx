"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import Pagination from "@/components/ui/pagination";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTransactions,
  deleteTransactionItem,
} from "@/features/auth/authSlice";

export default function TransactionList() {
  const dispatch = useDispatch();
  const { transactions } = useSelector((state) => state.auth);
  const { activeMonth } = useSelector((state) => state.date);

  useEffect(() => {
    if (activeMonth) {
      dispatch(fetchTransactions({ activeMonth, currentPage: 1 }));
    }
  }, [activeMonth]);

  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    if (activeMonth) {
      dispatch(fetchTransactions({ activeMonth, currentPage }));
    }
  }, [currentPage]);

  const handleDeleteTransaction = (id) => {
    dispatch(deleteTransactionItem(id));
  };

  return (
    <div className="space-y-4 p-4 w-full overflow-x-auto">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions?.transactions?.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions?.transactions?.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-3">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{transaction.category}</td>
                    <td className="px-4 py-3">{transaction.description}</td>
                    <td className="px-4 py-3">
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
                      className={`px-4 py-3 font-medium ${
                        transaction.type === "income"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}$
                      {transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteTransaction(transaction._id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
        currentPage={transactions?.currentPage || 1}
        totalPages={transactions?.totalPages || 1}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
