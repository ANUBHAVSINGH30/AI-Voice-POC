"use client";

import dynamic from "next/dynamic";

const RealtimeVoice = dynamic(
  () => import("@/components/RealtimeVoice"),
  {
    ssr: false,
  }
);

export default function Home() {
  return (
    <main className="app">
      <div className="card">
        <h1>AI Voice Assistant</h1>

        <p>
          Test the AI receptionist using OpenAI
          Realtime.
        </p>

        <RealtimeVoice />
      </div>
    </main>
  );
}