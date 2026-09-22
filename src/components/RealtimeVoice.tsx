"use client";

import { useEffect, useRef, useState } from "react";

export default function RealtimeVoice() {
  const [status, setStatus] = useState("Ready to start");
  const [connected, setConnected] = useState(false);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);

  const startConversation = async () => {
    try {
      setStatus("Getting microphone...");

      // 1. Get microphone access
      const mediaStream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      mediaStreamRef.current = mediaStream;

      // 2. Get temporary OpenAI credential from our server
      setStatus("Connecting to OpenAI...");

      const tokenResponse = await fetch(
        "/api/openai/realtime-token"
      );

      if (!tokenResponse.ok) {
        throw new Error(
          "Failed to get OpenAI realtime token"
        );
      }

      const tokenData = await tokenResponse.json();

      const ephemeralKey = tokenData.token;

      if (!ephemeralKey) {
        throw new Error(
          "OpenAI realtime token was not returned"
        );
      }

      // 3. Create WebRTC peer connection
      const peerConnection = new RTCPeerConnection();

      peerConnectionRef.current = peerConnection;

      // 4. Receive AI audio
      const audioElement = document.createElement("audio");

      audioElement.autoplay = true;

      audioElementRef.current = audioElement;

      peerConnection.ontrack = (event) => {
        console.log("🔊 Received AI audio");

        audioElement.srcObject = event.streams[0];
      };

      // 5. Send microphone audio to OpenAI
      const audioTrack = mediaStream.getAudioTracks()[0];

      peerConnection.addTrack(
        audioTrack,
        mediaStream
      );

      // 6. Create data channel for Realtime events
      const dataChannel =
        peerConnection.createDataChannel(
          "oai-events"
        );

      dataChannelRef.current = dataChannel;

      dataChannel.onopen = () => {
        console.log(
          "✅ OpenAI realtime data channel connected"
        );

        setStatus("Connected — you can speak");
        setConnected(true);
      };

      dataChannel.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          console.log(
            "OpenAI event:",
            message.type
          );
        } catch {
          console.log(
            "Received non-JSON OpenAI event"
          );
        }
      };

      dataChannel.onerror = (error) => {
        console.error(
          "OpenAI data channel error:",
          error
        );
      };

      // 7. Create SDP offer
      setStatus("Starting voice session...");

      const offer =
        await peerConnection.createOffer();

      await peerConnection.setLocalDescription(
        offer
      );

      // 8. Send SDP offer to OpenAI
      const sdpResponse = await fetch(
        "https://api.openai.com/v1/realtime/calls",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ephemeralKey}`,
            "Content-Type": "application/sdp",
          },
          body: offer.sdp,
        }
      );

      if (!sdpResponse.ok) {
        const errorText =
          await sdpResponse.text();

        throw new Error(
          `OpenAI WebRTC connection failed: ${errorText}`
        );
      }

      // 9. Receive OpenAI's SDP answer
      const answerSdp =
        await sdpResponse.text();

      await peerConnection.setRemoteDescription({
        type: "answer",
        sdp: answerSdp,
      });

      console.log(
        "✅ OpenAI Realtime WebRTC connected"
      );

      setStatus(
        "Connected — speak to the AI"
      );
    } catch (error) {
      console.error(
        "Realtime voice error:",
        error
      );

      setStatus(
        error instanceof Error
          ? error.message
          : "Failed to start voice conversation"
      );

      // Clean up if connection failed
      stopConversation();
    }
  };

  const stopConversation = () => {
    console.log(
      "Stopping realtime conversation..."
    );

    // Close data channel
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }

    // Stop microphone
    if (mediaStreamRef.current) {
      mediaStreamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      mediaStreamRef.current = null;
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Remove audio source
    if (audioElementRef.current) {
      audioElementRef.current.srcObject = null;
      audioElementRef.current = null;
    }

    setConnected(false);
    setStatus("Ready to start");
  };

  // Clean up when component is removed
  useEffect(() => {
    return () => {
      stopConversation();
    };
  }, []);

  return (
    <div>
      <p>{status}</p>

      {!connected ? (
        <button onClick={startConversation}>
          Start AI Voice
        </button>
      ) : (
        <button onClick={stopConversation}>
          End AI Voice
        </button>
      )}
    </div>
  );
}