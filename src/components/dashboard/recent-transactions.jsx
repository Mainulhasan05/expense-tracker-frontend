export default function RecentTransactions() {
  // Static data for demo
  const transactions = [
    {
      id: 1,
      type: "income",
      category: "Salary",
      amount: 3200,
      date: "2025-03-15",
    },
    {
      id: 2,
      type: "expense",
      category: "Rent",
      amount: 1200,
      date: "2025-03-10",
    },
    {
      id: 3,
      type: "expense",
      category: "Groceries",
      amount: 150.45,
      date: "2025-03-08",
    },
    {
      id: 4,
      type: "income",
      category: "Freelance",
      amount: 850,
      date: "2025-03-05",
    },
    {
      id: 5,
      type: "expense",
      category: "Utilities",
      amount: 120,
      date: "2025-03-03",
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Transactions
        </h2>
        <a
          href="/dashboard/transactions"
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
        >
          View all
        </a>
      </div>

      <div className="flow-root">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {transactions.map((transaction) => (
            <li key={transaction.id} className="py-3 sm:py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div
                    className={`p-2 rounded-full ${
                      transaction.type === "income"
                        ? "bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200"
                        : "bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200"
                    }`}
                  >
                    {transaction.type === "income" ? (
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
                    ) : (
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
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    {transaction.category}
                  </p>
                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
                <div
                  className={`inline-flex items-center text-base font-semibold ${
                    transaction.type === "income"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}$
                  {transaction.amount.toFixed(2)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
