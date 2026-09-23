import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const calls = await prisma.call.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      calls,
    });
  } catch (error) {
    console.error("Failed to fetch calls:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch calls",
      },
      { status: 500 }
    );
  }
}