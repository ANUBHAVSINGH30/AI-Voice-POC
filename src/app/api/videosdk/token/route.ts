import { NextResponse } from "next/server";

export async function POST() {
  const token = process.env.NEXT_PUBLIC_VIDEOSDK_AUTH_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "VideoSDK token is missing" },
      { status: 500 }
    );
  }

  const response = await fetch("https://api.videosdk.live/v2/rooms", {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("VideoSDK room creation failed:", data);

    return NextResponse.json(
      { error: data },
      { status: response.status }
    );
  }

  return NextResponse.json({
    roomId: data.roomId,
  });
}