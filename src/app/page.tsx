"use client";

import dynamic from "next/dynamic";

const RetellVoice = dynamic(
  () => import("@/components/RetellVoice"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="app">
      <div className="card">
        <h1>AI Voice Assistant</h1>

        <p>
          Test the AI receptionist by starting a voice conversation.
        </p>

        <RetellVoice />
      </div>
    </main>
  );
}