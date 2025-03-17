"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Entertainment",
  "Bills",
  "Other",
];

export default function BudgetForm({ onAdd }: { onAdd: () => void }) {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!category || !amount || !month) {
      alert("Please fill all fields");
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/budgets`, {
      method: "POST",
      body: JSON.stringify({ category, amount, month }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setCategory("");
      setAmount("");
      setMonth("");
      onAdd();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <Input
        type="number"
        placeholder="Budget Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />
      <Button type="submit">Set Budget</Button>
    </form>
  );
}
