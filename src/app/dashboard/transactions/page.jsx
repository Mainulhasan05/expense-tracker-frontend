import TransactionList from "@/components/transactions/transaction-list";
import TransactionFilters from "@/components/transactions/transaction-filters";
import AddTransactionButton from "@/components/transactions/add-transaction-button";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 p-6 rounded-xl border border-blue-100 dark:border-gray-700 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all your financial transactions</p>
        </div>
        <AddTransactionButton />
      </div>

      <TransactionFilters />
      <TransactionList />
    </div>
  );
}
