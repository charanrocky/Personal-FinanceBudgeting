"use client";

import { useState, useEffect } from "react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import Chart from "@/components/Chart";
export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [editTransaction, setEditTransaction] = useState<any>(null);

  async function fetchTransactions() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/transactions`
    );
    const data = await res.json();
    setTransactions(data.transactions);
  }

  async function deleteTransaction(id: string) {
    await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/transactions`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    });
    fetchTransactions();
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  type Transaction = {
    _id: string;
    amount: number;
    description: string;
    date: string;
  };

  const chartData = transactions.reduce<{ month: string; total: number }[]>(
    (acc, tx: Transaction) => {
      if (!tx.date || isNaN(new Date(tx.date).getTime())) return acc; // Skip invalid dates

      const month = new Date(tx.date).toLocaleString("en-US", {
        month: "short",
      });
      const amount = Number(tx.amount) || 0; // Handle invalid amounts as 0

      if (amount === 0) return acc; // Skip zero or invalid amounts

      const existing = acc.find((d) => d.month === month);

      if (existing) {
        existing.total += amount;
      } else {
        acc.push({ month, total: amount });
      }

      return acc;
    },
    []
  );

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <TransactionForm
        onSave={fetchTransactions}
        existingTransaction={editTransaction}
      />
      <TransactionList
        transactions={transactions}
        onDelete={deleteTransaction}
        onEdit={setEditTransaction}
      />
      <Chart data={chartData} />
    </div>
  );
}
