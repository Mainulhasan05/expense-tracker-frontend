"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, addNewTransaction } from "@/features/auth/authSlice";

export default function AddTransactionButton() {
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    type: "expense",
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "type" ? { category: "" } : {}), // Reset category when type changes
    }));
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dispatch addNewTransaction action with formData
    dispatch(addNewTransaction(formData));

    setIsModalOpen(false);

    // Reset form
    setFormData({
      type: "expense",
      category: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
    });
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Transaction
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl dark:bg-gray-900 border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-t-xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                Add New Transaction
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:bg-white/80 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-lg p-2 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid gap-5 mb-6">
                <div>
                  <label className="block mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Transaction Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.type === "expense"
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-500"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <input
                        type="radio"
                        id="type-expense"
                        name="type"
                        value="expense"
                        checked={formData.type === "expense"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className={`text-2xl mb-1 ${formData.type === "expense" ? "text-red-600" : "text-gray-400"}`}>
                          💸
                        </div>
                        <span className={`text-sm font-medium ${formData.type === "expense" ? "text-red-700 dark:text-red-400" : "text-gray-600 dark:text-gray-400"}`}>
                          Expense
                        </span>
                      </div>
                    </label>
                    <label
                      className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.type === "income"
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-500"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <input
                        type="radio"
                        id="type-income"
                        name="type"
                        value="income"
                        checked={formData.type === "income"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className={`text-2xl mb-1 ${formData.type === "income" ? "text-green-600" : "text-gray-400"}`}>
                          💰
                        </div>
                        <span className={`text-sm font-medium ${formData.type === "income" ? "text-green-700 dark:text-green-400" : "text-gray-600 dark:text-gray-400"}`}>
                          Income
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-all"
                  >
                    <option value="">Select a category</option>
                    {/* use filter to show only categories of selected type */}
                    {categories &&
                      categories
                        ?.filter((cat) => cat.type === formData.type)
                        .map((cat) => (
                          <option key={cat.name} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                    {/* {categories &&
                      categories?.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))} */}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="amount"
                      className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200"
                    >
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      placeholder="0.00"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="date"
                      className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200"
                    >
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200"
                  >
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Add notes about this transaction..."
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg shadow-blue-500/30 transition-all"
                >
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
