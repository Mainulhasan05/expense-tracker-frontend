"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  addNewCategory,
  deleteCategoryItem,
} from "@/features/auth/authSlice";

export default function SettingsForm() {
  const { categories } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Static data for demo (remaining settings)
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    currency: "USD",
    newCategory: { name: "", type: "expense" },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNewCategoryChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      newCategory: {
        ...prev.newCategory,
        [name]: value,
      },
    }));
  };

  const addCategory = (e) => {
    e.preventDefault();
    if (!settings.newCategory.name.trim()) return;

    dispatch(
      addNewCategory({
        name: settings.newCategory.name,
        type: settings.newCategory.type,
      })
    );

    // Reset form
    setSettings((prev) => ({
      ...prev,
      newCategory: { name: "", type: "expense" },
    }));
  };

  const deleteCategory = (id) => {
    dispatch(deleteCategoryItem(id));
  };

  const saveSettings = (e) => {
    e.preventDefault();
    // Here you would typically save the settings
    console.log("Settings saved:", settings);
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Appearance Section - unchanged */}

      <form onSubmit={saveSettings}>
        {/* General Settings Section - unchanged */}

        <div className="p-4 mt-6 bg-white rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Custom Categories</h2>

          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              {categories?.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md dark:bg-gray-700"
                >
                  <div className="flex items-center">
                    <span className="text-sm font-medium">{category.name}</span>
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        category.type === "income"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {category.type}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteCategory(category._id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium mb-2">Add New Category</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  name="name"
                  value={settings.newCategory.name}
                  onChange={handleNewCategoryChange}
                  placeholder="Category name"
                  className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <select
                  name="type"
                  value={settings.newCategory.type}
                  onChange={handleNewCategoryChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-auto p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                <button
                  type="button"
                  onClick={addCategory}
                  className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
