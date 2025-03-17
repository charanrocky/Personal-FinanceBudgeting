import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Budget } from "@/models/Budget";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { category, amount, month } = await req.json();

    if (!category || !amount || !month) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const budget = new Budget({ category, amount, month });
    await budget.save();

    return NextResponse.json({ success: true, budget }, { status: 201 });
  } catch (error) {
    console.error("Failed to create budget:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create budget" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const budgets = await Budget.find().sort({ month: -1 });

    return NextResponse.json({ success: true, budgets }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch budgets:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch budgets" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    const budget = await Budget.findByIdAndDelete(id);
    if (!budget) {
      return NextResponse.json(
        { success: false, message: "Budget not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Budget deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete budget:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete budget" },
      { status: 500 }
    );
  }
}
