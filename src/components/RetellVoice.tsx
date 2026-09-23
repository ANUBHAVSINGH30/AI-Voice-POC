"use client";

import { useEffect, useRef, useState } from "react";
import { RetellWebClient } from "retell-client-js-sdk";

const retellClient = new RetellWebClient();

export default function RetellVoice() {
  const [isCalling, setIsCalling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callStartedRef = useRef(false);

  useEffect(() => {
    const handleCallStarted = () => {
      console.log("✅ Retell call started");
      setIsCalling(true);
      setError(null);
    };

    const handleCallEnded = () => {
      console.log("❌ Retell call ended");
      setIsCalling(false);
      callStartedRef.current = false;
    };

    const handleError = (error: unknown) => {
      console.error("Retell error:", error);
      setError("Something went wrong with the voice call.");
      setIsCalling(false);
      callStartedRef.current = false;
    };

    retellClient.on("call_started", handleCallStarted);
    retellClient.on("call_ended", handleCallEnded);
    retellClient.on("error", handleError);

    return () => {
      retellClient.off("call_started", handleCallStarted);
      retellClient.off("call_ended", handleCallEnded);
      retellClient.off("error", handleError);
    };
  }, []);

  async function startCall() {
    if (callStartedRef.current) return;

    try {
      setError(null);
      callStartedRef.current = true;

      const response = await fetch("/api/retell/web-call", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create Retell call");
      }

      await retellClient.startCall({
        accessToken: data.accessToken,
      });
    } catch (error) {
      console.error("Failed to start Retell call:", error);

      setError("Failed to start voice call.");
      setIsCalling(false);
      callStartedRef.current = false;
    }
  }

  function endCall() {
    retellClient.stopCall();
  }

  return (
    <div>
      {!isCalling ? (
        <button onClick={startCall}>
          Start Call
        </button>
      ) : (
        <button onClick={endCall}>
          End Call
        </button>
      )}

      {error && <p>{error}</p>}
    </div>
  );
}