"use client";

interface Props {
  transactions: any[];
  onDelete: (id: string) => void;
  onEdit: (transaction: any) => void;
}

export default function TransactionList({
  transactions,
  onDelete,
  onEdit,
}: Props) {
  return (
    <div className="space-y-2">
      {transactions.map((tx) => (
        <div
          key={tx._id}
          className="p-4 border rounded-lg flex justify-between"
        >
          <div>
            <p>{tx.description}</p>
            <p>${tx.amount}</p>
            <p>{new Date(tx.date).toLocaleDateString()}</p>
          </div>
          <div className="space-x-2">
            <button onClick={() => onEdit(tx)}>✏️</button>
            <button onClick={() => onDelete(tx._id)}>❌</button>
          </div>
        </div>
      ))}
    </div>
  );
}
