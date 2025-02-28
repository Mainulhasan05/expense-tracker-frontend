import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TransactionList from "@/components/transactions/transaction-list";
import TransactionFilters from "@/components/transactions/transaction-filters";
import AddTransactionDialog from "@/components/transactions/add-transaction-dialog";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <AddTransactionDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </AddTransactionDialog>
      </div>

      <TransactionFilters />
      <TransactionList />
    </div>
  );
}
