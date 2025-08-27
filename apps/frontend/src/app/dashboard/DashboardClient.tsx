// apps/frontend/src/app/dashboard/DashboardClient.tsx
"use client";

import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useWebSocket } from "@/hooks/useWebSocket";
import type { RouterOutputs } from "@repo/backend";

type Message = RouterOutputs["chat"]["getMessages"][number];

export default function DashboardClient() {
  const [message, setMessage] = useState("");
  const utils = trpc.useUtils();

  // Beri argumen: `undefined` kalau tidak ada input
  const messagesQuery = trpc.chat.getMessages.useQuery(undefined);

  // Tanpa options di hook; pasang onSuccess di argumen mutate
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();

  // Realtime: invalidasi cache saat ada event
  useWebSocket("ws://localhost:4000", (data: unknown) => {
    if ((data as { type?: string })?.type === "new_message") {
      utils.chat.getMessages.invalidate();
    }
  });

  const send = useCallback(() => {
    const content = message.trim();
    if (!content) return;
    sendMessageMutation.mutate(
      { content },
      {
        onSuccess: () => {
          utils.chat.getMessages.invalidate();
          setMessage("");
        },
      }
    );
  }, [message, sendMessageMutation, utils]);

  if (messagesQuery.isLoading) return <div>Loading...</div>;

  if (messagesQuery.error) {
    return (
      <div style={{ color: "crimson" }}>
        Failed to load messages: {String(messagesQuery.error.message ?? "Unknown error")}
      </div>
    );
  }

  return (
    <div>
      <h1>Dashboard Chat</h1>

      <div
        style={{
          height: 300,
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: "8px",
          marginBottom: "1rem",
        }}
      >
        {messagesQuery.data?.map((msg: Message) => (
          <div key={msg.id}>
            <strong>{msg.direction === "inbound" ? "Client" : "You"}:</strong>{" "}
            {msg.content}
          </div>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
        className="border px-2 py-1 mr-2"
        onKeyDown={(e) => {
          if (e.key === "Enter") send();
        }}
      />

      <button
        onClick={send}
        disabled={sendMessageMutation.isPending || !message.trim()}
        className="bg-blue-500 text-white px-4 py-1 rounded disabled:opacity-50"
        aria-busy={sendMessageMutation.isPending}
      >
        {sendMessageMutation.isPending ? "Sending..." : "Send"}
      </button>
    </div>
  );
}
