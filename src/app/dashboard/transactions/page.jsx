import TransactionList from "@/components/transactions/transaction-list";
import TransactionFilters from "@/components/transactions/transaction-filters";
import AddTransactionButton from "@/components/transactions/add-transaction-button";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <AddTransactionButton />
      </div>

      <TransactionFilters />
      <TransactionList />
    </div>
  );
}
