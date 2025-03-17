"use client";

import { useEffect, useState } from "react";

import TransactionList from "@/components/TransactionList";
import BudgetChart from "@/components/BudgetChart";
import BudgetForm from "@/components/BudgetForm";
import TransactionForm from "@/components/TransactionForm";
import CategoryPieChart from "@/components/CategoryPieChart";
import DashboardSummary from "@/components/DashboardSummary";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);

  // ✅ Load transactions and budgets together
  async function loadData() {
    try {
      const [transactionsRes, budgetsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/budgets`),
      ]);

      if (transactionsRes.ok) {
        const data = await transactionsRes.json();
        setTransactions(data.transactions);
      }

      if (budgetsRes.ok) {
        const data = await budgetsRes.json();
        setBudgets(data.budgets);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // ✅ Combine transactions with budgets
  const combinedData = budgets.map((budget) => {
    const actual = transactions
      .filter(
        (tx) =>
          tx.category === budget.category &&
          new Date(tx.date).toISOString().slice(0, 7) === budget.month
      )
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

    return {
      month: budget.month,
      category: budget.category,
      budget: Number(budget.amount),
      actual,
    };
  });

  // ✅ Generate Insights:
  const insights = combinedData.map((data) => ({
    month: data.month,
    category: data.category,
    difference: data.actual - data.budget,
    status: data.actual > data.budget ? "Overspent" : "Within Budget",
  }));

  return (
    <div>
      {/* ✅ Transaction Form */}
      <TransactionForm onAdd={loadData} />

      {/* ✅ Dashboard Summary */}
      <DashboardSummary transactions={transactions} />

      {/* ✅ Category Pie Chart */}
      <CategoryPieChart transactions={transactions} />

      {/* ✅ Budget Form */}
      <BudgetForm onAdd={loadData} />

      {/* ✅ Budget vs Actual Chart */}
      <h2 className="text-xl font-bold mt-4">Budget vs Actual Chart</h2>
      <BudgetChart data={combinedData} />

      {/* ✅ Insights */}
      <h2 className="text-xl font-bold mt-4">Spending Insights</h2>
      <div className="grid grid-cols-2 gap-4">
        {insights.map((insight) => (
          <div
            key={`${insight.month}-${insight.category}`}
            className="p-4 border rounded"
          >
            <p>
              <strong>Month:</strong> {insight.month}
            </p>
            <p>
              <strong>Category:</strong> {insight.category}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  insight.status === "Overspent"
                    ? "text-red-500"
                    : "text-green-500"
                }
              >
                {insight.status}
              </span>
            </p>
            <p>
              <strong>Difference:</strong> ₹{insight.difference}
            </p>
          </div>
        ))}
      </div>

      {/* ✅ Transaction List */}
      <TransactionList transactions={transactions} onRefresh={loadData} />
    </div>
  );
}
