import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, purpose } = body;

    console.log("📞 Call details received:");

    if (!name || !purpose) {
      return NextResponse.json(
        {
          error: "Name and purpose are required",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Call details received successfully",
    });
  } catch (error) {
    console.error("Failed to process call details:", error);

    return NextResponse.json(
      {
        error: "Invalid request",
      },
      { status: 400 }
    );
  }
}