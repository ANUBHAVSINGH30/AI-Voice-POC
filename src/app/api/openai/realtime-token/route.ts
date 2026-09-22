import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is missing" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      "https://api.openai.com/v1/realtime/client_secrets",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session: {
            type: "realtime",
            model: "gpt-realtime-2.1",
            audio: {
              output: {
                voice: "marin",
              },
            },
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI realtime token error:", data);

      return NextResponse.json(
        { error: data },
        { status: response.status }
      );
    }

    return NextResponse.json({
      token: data.value,
    });
  } catch (error) {
    console.error("Failed to create OpenAI realtime token:", error);

    return NextResponse.json(
      { error: "Failed to create realtime token" },
      { status: 500 }
    );
  }
}