"use client";

import { useState } from "react";
import {
  CheckCircle,
  Circle,
  Clock,
  Edit,
  Trash2,
  Calendar,
  List,
} from "lucide-react";
import Pagination from "@/components/ui/pagination";

export default function TaskList() {
  // Static data for demo
  const initialTasks = [
    {
      id: 1,
      title: "Review monthly budget",
      dueDate: "2025-03-20",
      completed: false,
    },
    {
      id: 2,
      title: "Pay credit card bill",
      dueDate: "2025-03-15",
      completed: true,
    },
    {
      id: 3,
      title: "Set up automatic savings",
      dueDate: "2025-03-25",
      completed: false,
    },
    {
      id: 4,
      title: "Research investment options",
      dueDate: "2025-04-01",
      completed: false,
    },
    {
      id: 5,
      title: "Update financial goals",
      dueDate: "2025-03-30",
      completed: false,
    },
    {
      id: 6,
      title: "Review insurance policies",
      dueDate: "2025-04-05",
      completed: false,
    },
    {
      id: 7,
      title: "Check credit score",
      dueDate: "2025-04-10",
      completed: false,
    },
    {
      id: 8,
      title: "Organize tax documents",
      dueDate: "2025-03-10",
      completed: true,
    },
    {
      id: 9,
      title: "Set up emergency fund",
      dueDate: "2025-04-15",
      completed: false,
    },
    {
      id: 10,
      title: "Review retirement contributions",
      dueDate: "2025-04-20",
      completed: false,
    },
    {
      id: 11,
      title: "Create budget for vacation",
      dueDate: "2025-04-25",
      completed: false,
    },
    {
      id: 12,
      title: "Research mortgage refinancing",
      dueDate: "2025-05-01",
      completed: false,
    },
  ];

  const [tasks, setTasks] = useState(initialTasks);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [viewAll, setViewAll] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter tasks based on selected date or view all
  const filteredTasks = viewAll
    ? tasks
    : tasks.filter((task) => task.dueDate === selectedDate);

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  // Get current tasks
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);

  const toggleTaskStatus = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Check if a task is overdue
  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && !isToday(dueDate);
  };

  // Check if a task is due today
  const isToday = (dueDate) => {
    const today = new Date();
    const taskDate = new Date(dueDate);
    return today.toDateString() === taskDate.toDateString();
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setViewAll(false);
    setCurrentPage(1);
  };

  const handleViewAllToggle = () => {
    setViewAll(!viewAll);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleViewAllToggle}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              viewAll
                ? "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100"
                : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            {viewAll ? (
              <Calendar className="w-4 h-4 mr-1" />
            ) : (
              <List className="w-4 h-4 mr-1" />
            )}
            {viewAll ? "View by Date" : "View All"}
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {viewAll
            ? "Showing all tasks"
            : `Showing tasks for ${new Date(
                selectedDate
              ).toLocaleDateString()}`}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {currentTasks.length === 0 ? (
            <li className="p-6 text-center text-gray-500 dark:text-gray-400">
              No tasks found for {viewAll ? "any date" : "the selected date"}.
              {!viewAll &&
                " Try selecting a different date or viewing all tasks."}
            </li>
          ) : (
            currentTasks.map((task) => (
              <li
                key={task.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 w-full">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`flex-shrink-0 ${
                        task.completed
                          ? "text-green-500 dark:text-green-400"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {task.completed ? (
                        <CheckCircle size={20} />
                      ) : (
                        <Circle size={20} />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          task.completed
                            ? "text-gray-500 dark:text-gray-400 line-through"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {task.title}
                      </p>

                      <div className="flex items-center mt-1">
                        <Clock size={14} className="mr-1 text-gray-400" />
                        <p
                          className={`text-xs ${
                            isOverdue(task.dueDate) && !task.completed
                              ? "text-red-600 dark:text-red-400 font-medium"
                              : isToday(task.dueDate) && !task.completed
                              ? "text-yellow-600 dark:text-yellow-400 font-medium"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                          {isOverdue(task.dueDate) &&
                            !task.completed &&
                            " (Overdue)"}
                          {isToday(task.dueDate) &&
                            !task.completed &&
                            " (Today)"}
                        </p>
                      </div>
                    </div>

                    <div className="flex-shrink-0 flex space-x-2">
                      <button className="p-1 text-gray-500 rounded-full hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700">
                        <Edit size={16} />
                        <span className="sr-only">Edit</span>
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1 text-gray-500 rounded-full hover:text-red-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-gray-700"
                      >
                        <Trash2 size={16} />
                        <span className="sr-only">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Pagination */}
      {filteredTasks.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
