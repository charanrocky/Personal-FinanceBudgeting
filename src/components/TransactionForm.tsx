"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Transaction {
  _id?: string;
  amount: number;
  description: string;
  date: string;
}

interface Props {
  onSave: () => void;
  existingTransaction?: Transaction;
}

export default function TransactionForm({
  onSave,
  existingTransaction,
}: Props) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (existingTransaction) {
      setAmount(existingTransaction.amount.toString());
      setDescription(existingTransaction.description);
      setDate(existingTransaction.date.split("T")[0]);
    }
  }, [existingTransaction]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!amount || !description || !date) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      amount: Number(amount),
      description,
      date,
    };

    let res;
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    if (existingTransaction?._id) {
      res = await fetch(`${BASE_URL}/api/transactions`, {
        method: "PUT",
        body: JSON.stringify({ id: existingTransaction._id, ...payload }),
        headers: { "Content-Type": "application/json" },
      });
    } else {
      res = await fetch(`${BASE_URL}/api/transactions`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });
    }

    if (res.ok) {
      setAmount("");
      setDescription("");
      setDate("");
      onSave();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Button type="submit">
        {existingTransaction ? "Update" : "Add"} Transaction
      </Button>
    </form>
  );
}
