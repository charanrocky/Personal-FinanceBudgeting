"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function Chart({ data }: { data: any[] }) {
  return (
    <BarChart width={500} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="total" fill="#8884d8" />
    </BarChart>
  );
}
