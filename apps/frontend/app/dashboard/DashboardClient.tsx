// saas-ocs/apps/frontend/app/dashboard/DashboardClient.tsx
"use client";

import { useState, useCallback } from "react";
import { trpc } from "lib/trpc";
import { useWebSocket } from "hooks/useWebSocket";
import { useQueryClient } from "@tanstack/react-query";
import type { RouterOutputs } from "@repo/api-types";

type Message = RouterOutputs["chat"]["getMessages"][number];

function invalidateChatMessages(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({
    predicate: (q) => {
      const key = q.queryKey;
      // tRPC query keys biasanya array dan bagian awalnya adalah path procedure
      return Array.isArray(key) && key[0] === "chat" && key[1] === "getMessages";
    },
  });
}

export default function DashboardClient() {
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  // Query pesan (tanpa input → undefined)
  const messagesQuery = trpc.chat.getMessages.useQuery(undefined);

  // Mutation kirim pesan
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();

  const WS_URL =
    process.env.NEXT_PUBLIC_WS_URL ||
    (typeof window !== "undefined"
      ? `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/ws`
      : "ws://localhost:4000");

  useWebSocket(WS_URL, (data: unknown) => {
    if ((data as { type?: string })?.type === "new_message") {
      invalidateChatMessages(queryClient);
    }
  });

  const send = useCallback(() => {
    const content = message.trim();
    if (!content) return;

    sendMessageMutation.mutate(
      { content },
      {
        onSuccess: () => {
          invalidateChatMessages(queryClient);
          setMessage("");
        },
      }
    );
  }, [message, sendMessageMutation, queryClient]);

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
