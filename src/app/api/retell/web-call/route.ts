import { NextResponse } from "next/server";

export async function POST() {
  try {
    const apiKey = process.env.RETELL_API_KEY;
    const agentId = process.env.RETELL_AGENT_ID;

    if (!apiKey) {
      return NextResponse.json(
        { error: "RETELL_API_KEY is not configured" },
        { status: 500 }
      );
    }

    if (!agentId) {
      return NextResponse.json(
        { error: "RETELL_AGENT_ID is not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api.retellai.com/v2/create-web-call",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: agentId,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Retell API error:", response.status, data);

      return NextResponse.json(
        { error: data },
        { status: response.status }
      );
    }

    console.log("Retell web call created:", {
      callId: data.call_id,
      hasAccessToken: Boolean(data.access_token),
      tokenLength: data.access_token?.length,
    });

    return NextResponse.json({
      accessToken: data.access_token,
      callId: data.call_id,
    });
  } catch (error) {
    console.error("Failed to create Retell web call:", error);

    return NextResponse.json(
      { error: "Failed to create Retell web call" },
      { status: 500 }
    );
  }
}