import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function BudgetChart({ data }: { data: any[] }) {
  return (
    <BarChart width={400} height={300} data={data}>
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="actual" fill="#8884d8" name="Actual" />
      <Bar dataKey="budget" fill="#82ca9d" name="Budget" />
    </BarChart>
  );
}
