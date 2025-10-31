"use client";

import { useEffect, useState } from "react";
import { Trash2, Calendar, ArrowDown, ArrowUp, Edit2 } from "lucide-react";
import Pagination from "@/components/ui/pagination";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTransactions,
  deleteTransactionItem,
  updateTransaction,
} from "@/features/auth/authSlice";
import EditTransactionModal from "./edit-transaction-modal";

export default function TransactionList() {
  const dispatch = useDispatch();
  const { transactions } = useSelector((state) => state.auth);
  const { activeMonth } = useSelector((state) => state.date);

  const [currentPage, setCurrentPage] = useState(1);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    if (activeMonth) {
      dispatch(fetchTransactions({ activeMonth, currentPage: 1 }));
      setCurrentPage(1);
    }
  }, [activeMonth, dispatch]);

  useEffect(() => {
    if (activeMonth) {
      dispatch(fetchTransactions({ activeMonth, currentPage }));
    }
  }, [currentPage, activeMonth, dispatch]);

  const handleDeleteTransaction = (id) => {
    dispatch(deleteTransactionItem(id));
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="space-y-4">
      {/* Desktop view - Table */}
      <div className="hidden md:block bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3">#</th>
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
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions?.transactions?.map((transaction, index) => (
                  <tr
                    key={transaction._id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
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
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingTransaction(transaction)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-all"
                          title="Edit transaction"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTransaction(transaction._id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
                          title="Delete transaction"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile view - Card list */}
      <div className="md:hidden space-y-4">
        {transactions?.transactions?.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center text-gray-500 dark:text-gray-400">
            No transactions found
          </div>
        ) : (
          <div className="space-y-3">
            {transactions?.transactions?.map((transaction, index) => (
              <div
                key={transaction._id}
                className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {transaction.description}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {transaction.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingTransaction(transaction)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteTransaction(transaction._id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(transaction.date).toLocaleDateString()}
                  </div>

                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full mr-2 ${
                        transaction.type === "income"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <span className="flex items-center">
                          <ArrowUp className="w-3 h-3 mr-1" />
                          Income
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <ArrowDown className="w-3 h-3 mr-1" />
                          Expense
                        </span>
                      )}
                    </span>

                    <span
                      className={`font-medium ${
                        transaction.type === "income"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {transactions?.totalPages > 1 && (
        <Pagination
          currentPage={transactions?.currentPage || 1}
          totalPages={transactions?.totalPages || 1}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Edit Modal */}
      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onUpdate={(updatedData) => {
            dispatch(updateTransaction({ id: editingTransaction._id, ...updatedData }));
            setEditingTransaction(null);
          }}
        />
      )}
    </div>
  );
}
