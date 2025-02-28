"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  ShoppingBag,
  Coffee,
  Car,
  Home,
  DollarSign,
  Briefcase,
} from "lucide-react";
import { format } from "date-fns";
import EditTransactionDialog from "./edit-transaction-dialog";

export default function TransactionList() {
  // Static data for demonstration
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "expense",
      amount: 45.99,
      category: "food",
      date: new Date(2023, 9, 15),
      icon: Coffee,
    },
    {
      id: 2,
      type: "expense",
      amount: 120.5,
      category: "shopping",
      date: new Date(2023, 9, 12),
      icon: ShoppingBag,
    },
    {
      id: 3,
      type: "expense",
      amount: 35.0,
      category: "transport",
      date: new Date(2023, 9, 10),
      icon: Car,
    },
    {
      id: 4,
      type: "expense",
      amount: 1200.0,
      category: "rent",
      date: new Date(2023, 9, 1),
      icon: Home,
    },
    {
      id: 5,
      type: "income",
      amount: 3500.0,
      category: "salary",
      date: new Date(2023, 9, 1),
      icon: Briefcase,
    },
    {
      id: 6,
      type: "income",
      amount: 250.0,
      category: "freelance",
      date: new Date(2023, 9, 8),
      icon: DollarSign,
    },
  ]);

  const deleteTransaction = (id) => {
    setTransactions(
      transactions.filter((transaction) => transaction.id !== id)
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded-full ${
                      transaction.type === "income"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    <transaction.icon className="h-4 w-4" />
                  </div>
                  <span className="capitalize">{transaction.type}</span>
                </div>
              </TableCell>
              <TableCell className="capitalize">
                {transaction.category}
              </TableCell>
              <TableCell>{format(transaction.date, "MMM dd, yyyy")}</TableCell>
              <TableCell
                className={`text-right font-medium ${
                  transaction.type === "income"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}$
                {transaction.amount.toFixed(2)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <EditTransactionDialog transaction={transaction}>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                    </EditTransactionDialog>
                    <DropdownMenuItem
                      onSelect={() => deleteTransaction(transaction.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
