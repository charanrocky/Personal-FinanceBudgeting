export default function DashboardSummary({
  transactions,
}: {
  transactions: any[];
}) {
  const totalExpenses = transactions.reduce(
    (sum, tx) => sum + Number(tx.amount),
    0
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Total Expenses */}
      <div className="p-4 bg-gray-200 rounded-lg">
        <h2 className="text-lg font-bold">Total Expenses</h2>
        <p>${totalExpenses.toFixed(2)}</p>
      </div>

      {/* Most Recent Transaction */}
      <div className="p-4 bg-gray-200 rounded-lg">
        <h2 className="text-lg font-bold">Recent Transaction</h2>
        <p>
          {transactions.length > 0
            ? `${transactions[0].description} - $${transactions[0].amount}`
            : "No recent transactions"}
        </p>
      </div>
    </div>
  );
}
