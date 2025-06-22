import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import PRGSession from "@/lib/models/PRGSession";

interface SessionResponse {
  date: string;
  paperTitle: string;
  paperLink: string;
  slidesLink?: string;
  resources?: string;
  presenter: Array<{
    name: string;
    link: string;
  }>;
}

interface GroupedSessions {
  [year: string]: SessionResponse[];
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const academicYear = searchParams.get("academicYear");

    const query = academicYear ? { academicYear } : {};
    const sessions = await PRGSession.find(query).sort({ date: 1 }).lean();

    const groupedSessions: GroupedSessions = sessions.reduce((acc, session) => {
      const year = session.academicYear;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push({
        date: session.date,
        paperTitle: session.paperTitle,
        paperLink: session.paperLink,
        slidesLink: session.slidesLink,
        resources: session.resources,
        presenter: session.presenter,
      });
      return acc;
    }, {} as GroupedSessions);

    return NextResponse.json(groupedSessions);
  } catch (error) {
    console.error("Error fetching PRG sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch PRG sessions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const session = new PRGSession(body);
    const savedSession = await session.save();

    return NextResponse.json(savedSession, { status: 201 });
  } catch (error) {
    console.error("Error creating PRG session:", error);

    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create PRG session" },
      { status: 500 }
    );
  }
}
