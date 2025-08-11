'use client';

import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";

// ✅ type-only imports (tidak masuk bundle)
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "shared/router";

import { useWebSocket } from "@/hooks/useWebSocket";

// ✅ Infer tipe dari router
type RouterOutput = inferRouterOutputs<AppRouter>;
type Message = RouterOutput["chat"]["getMessages"][number];

export default function DashboardPage() {
  const [message, setMessage] = useState("");

  // ✅ Ambil daftar pesan
  const messagesQuery = trpc.chat.getMessages.useQuery();

  // ✅ Kirim pesan
  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: () => {
      // selesai kirim -> refresh list & reset input
      messagesQuery.refetch();
      setMessage("");
    },
  });

  // ✅ Dengarkan event realtime dari WebSocket
  useWebSocket("ws://localhost:4000", (data: unknown) => {
    if ((data as { type?: string })?.type === "new_message") {
      messagesQuery.refetch();
    }
  });

  // ✅ Hindari re-create fungsi tiap render
  const send = useCallback(() => {
    const content = message.trim();
    if (content) {
      sendMessageMutation.mutate({ content });
    }
  }, [message, sendMessageMutation]);

  if (messagesQuery.isLoading) return <div>Loading...</div>;

  if (messagesQuery.error) {
    return (
      <div style={{ color: "crimson" }}>
        Failed to load messages:{" "}
        {String(messagesQuery.error.message ?? "Unknown error")}
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
