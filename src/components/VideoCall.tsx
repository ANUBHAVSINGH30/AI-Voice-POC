"use client";

import { useEffect, useRef, useState } from "react";
import { MeetingProvider, useMeeting } from "@videosdk.live/react-sdk";

// Read token once at module scope.
// NEXT_PUBLIC_ variables are available in the browser.
const VIDEOSDK_TOKEN =
  process.env.NEXT_PUBLIC_VIDEOSDK_AUTH_TOKEN ?? "";

type VideoCallProps = {
  onCallEnded: () => void;
};

type MeetingProps = {
  onCallEnded: () => void;
};

function Meeting({ onCallEnded }: MeetingProps) {
  const [joined, setJoined] = useState(false);

  const { leave } = useMeeting({
    onMeetingJoined: () => {
      console.log("✅ VideoSDK meeting joined");
      setJoined(true);
    },

    onMeetingLeft: (data?: {
      code?: number;
      message?: string;
    }) => {
      console.log(
        "❌ VideoSDK meeting left:",
        data?.code,
        data?.message
      );

      setJoined(false);

      // Tell the parent page that the call has ended.
      onCallEnded();
    },

    onError: (error: {
      code: string;
      message: string;
    }) => {
      console.error(
        "VideoSDK error:",
        error.code,
        error.message
      );
    },
  });

  return (
    <div>
      <p>VideoSDK session</p>

      <p>
        {joined
          ? "🎙️ Microphone connected"
          : "🎙️ Connecting microphone..."}
      </p>

      <button onClick={leave} disabled={!joined}>
        End Call
      </button>
    </div>
  );
}

export default function VideoCall({
  onCallEnded,
}: VideoCallProps) {
  const [meetingId, setMeetingId] = useState<string | null>(
    null
  );

  const [error, setError] = useState<string | null>(null);

  // Prevent creating multiple rooms accidentally.
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) {
      return;
    }

    fetchedRef.current = true;

    async function createMeeting() {
      try {
        const response = await fetch("/api/videosdk/token", {
          method: "POST",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(JSON.stringify(data.error));
        }

        console.log(
          "Created VideoSDK room:",
          data.roomId
        );

        setMeetingId(data.roomId);
      } catch (err) {
        console.error(
          "Failed to create meeting:",
          err
        );

        setError(
          "Failed to create VideoSDK meeting."
        );
      }
    }

    createMeeting();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!meetingId) {
    return <p>Creating VideoSDK meeting...</p>;
  }

  if (!VIDEOSDK_TOKEN) {
    return (
      <p>
        VideoSDK token is missing. Check
        NEXT_PUBLIC_VIDEOSDK_AUTH_TOKEN in .env.local
      </p>
    );
  }

  return (
    <MeetingProvider
      token={VIDEOSDK_TOKEN}
      config={{
        meetingId,
        name: "Test Caller",
        micEnabled: true,
        webcamEnabled: false,
        debugMode: false,
      }}
      joinWithoutUserInteraction
    >
      <Meeting onCallEnded={onCallEnded} />
    </MeetingProvider>
  );
}