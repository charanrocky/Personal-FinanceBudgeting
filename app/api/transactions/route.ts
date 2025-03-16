import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Transaction } from "@/models/Transaction";

// ✅ Handle CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow requests from any origin
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}

// ✅ Get All Transactions (Sorted by Date)
export async function GET() {
  await connectToDatabase();

  const transactions = await Transaction.find().sort({ date: -1 });

  return NextResponse.json(
    { success: true, transactions },
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}

// ✅ Create New Transaction
export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const { amount, description, date } = await req.json();

    if (!amount || !description || !date) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const transaction = new Transaction({ amount, description, date });
    await transaction.save();

    return NextResponse.json({ success: true, transaction }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

// ✅ Update Existing Transaction
export async function PUT(req: NextRequest) {
  await connectToDatabase();

  try {
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

    return NextResponse.json({ success: true, transaction }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

// ✅ Delete Transaction
export async function DELETE(req: NextRequest) {
  await connectToDatabase();

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      return NextResponse.json(
        { success: false, message: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Transaction deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
