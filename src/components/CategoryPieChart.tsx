"use client";

import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffbb28",
  "#ff8042",
  "#ff4563",
  "#845EC2",
];

export default function CategoryPieChart({
  transactions,
}: {
  transactions: any[];
}) {
  const data = transactions.reduce((acc, tx) => {
    const existing = acc.find(
      (d: { name: string; value: number }) => d.name === tx.category
    );
    if (existing) {
      existing.value += Number(tx.amount);
    } else {
      acc.push({ name: tx.category, value: Number(tx.amount) });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={150}
        label
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}
