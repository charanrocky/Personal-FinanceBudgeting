"use client";

import { useEffect, useState } from "react";
import TransactionForm from "@/components/TransactionForm";
import CategoryPieChart from "@/components/CategoryPieChart";
import DashboardSummary from "@/components/DashboardSummary";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  async function loadTransactions() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/transactions`
    );
    if (res.ok) {
      const data = await res.json();
      setTransactions(data.transactions);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <div>
      <TransactionForm onAdd={loadTransactions} />
      <DashboardSummary transactions={transactions} />
      <CategoryPieChart transactions={transactions} />
    </div>
  );
}
