import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, purpose } = body;

    if (!name || !purpose) {
      return NextResponse.json(
        {
          error: "Name and purpose are required",
        },
        { status: 400 }
      );
    }

    // Fixed callback time for the current POC
    const callbackTime = new Date("2026-09-25T16:00:00+05:30");

    const call = await prisma.call.create({
      data: {
        name,
        purpose,
        callbackTime,
      },
    });

    console.log("📞 Call saved to database:", call);

    return NextResponse.json({
      success: true,
      message: "Call details saved successfully",
      call,
    });
  } catch (error) {
    console.error("Failed to save call details:", error);

    return NextResponse.json(
      {
        error: "Failed to save call details",
      },
      { status: 500 }
    );
  }
}