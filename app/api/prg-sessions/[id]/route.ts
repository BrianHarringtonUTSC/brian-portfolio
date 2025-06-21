import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import PRGSession from "@/lib/models/PRGSession";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await dbConnect();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400 }
      );
    }

    const session = await PRGSession.findById(id).lean();

    if (!session) {
      return NextResponse.json(
        { error: "PRG session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error fetching PRG session:", error);
    return NextResponse.json(
      { error: "Failed to fetch PRG session" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await dbConnect();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const session = await PRGSession.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!session) {
      return NextResponse.json(
        { error: "PRG session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error updating PRG session:", error);

    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update PRG session" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await dbConnect();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400 }
      );
    }

    const session = await PRGSession.findByIdAndDelete(id);

    if (!session) {
      return NextResponse.json(
        { error: "PRG session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "PRG session deleted successfully" });
  } catch (error) {
    console.error("Error deleting PRG session:", error);
    return NextResponse.json(
      { error: "Failed to delete PRG session" },
      { status: 500 }
    );
  }
}
