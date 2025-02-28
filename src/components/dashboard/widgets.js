export default function DashboardWidgets() {
  // Static data for demo
  const financialData = {
    income: 5250.75,
    expenses: 3120.45,
    netBalance: 5250.75 - 3120.45,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Income Widget */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center">
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-base font-medium text-gray-500 dark:text-gray-400">
              Total Income
            </h3>
            <span className="text-2xl font-bold leading-none text-gray-900 dark:text-white">
              ${financialData.income.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Expenses Widget */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center">
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-base font-medium text-gray-500 dark:text-gray-400">
              Total Expenses
            </h3>
            <span className="text-2xl font-bold leading-none text-gray-900 dark:text-white">
              ${financialData.expenses.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Net Balance Widget */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center">
          <div
            className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${
              financialData.netBalance >= 0
                ? "bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200"
                : "bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200"
            }`}
          >
            {financialData.netBalance >= 0 ? (
              <span className="text-xl">🟢</span>
            ) : (
              <span className="text-xl">🔴</span>
            )}
          </div>
          <div className="ml-3">
            <h3 className="text-base font-medium text-gray-500 dark:text-gray-400">
              Net Balance
            </h3>
            <span
              className={`text-2xl font-bold leading-none ${
                financialData.netBalance >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              ${financialData.netBalance.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
