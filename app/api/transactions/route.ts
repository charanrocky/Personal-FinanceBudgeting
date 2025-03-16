import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Transaction } from "@/models/Transaction";



export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Allow requests from any origin
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}

export async function GET() {
  await connectToDatabase();
  
  const transactions = await Transaction.find({});
  
  return NextResponse.json(transactions, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Allow requests from any origin
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { amount, description, date } = await req.json();

  const transaction = new Transaction({ amount, description, date });
  await transaction.save();

  return NextResponse.json({ success: true, transaction });
}

export async function PUT(req: NextRequest) {
  await connectToDatabase();

  const { id, amount, description, date } = await req.json();

  if (!id || !amount || !description || !date) {
    return NextResponse.json(
      { success: false, message: "All fields are required" },
      { status: 400 }
    );
  }

  const transaction = await Transaction.findByIdAndUpdate(
    id,
    { amount, description, date },
    { new: true }
  );

  if (!transaction) {
    return NextResponse.json(
      { success: false, message: "Transaction not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, transaction });
}
export async function GET() {
  await connectToDatabase();
  const transactions = await Transaction.find().sort({ date: -1 });
  return NextResponse.json({ success: true, transactions });
}
export async function DELETE(req: NextRequest) {
  await connectToDatabase();
  const { id } = await req.json();

  await Transaction.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
