"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { EASE } from "../constants";
import { TypingDots } from "./_shared";

export type HandoffStageProps = { prefersReduced: boolean; locale: string };

type Sender = "user" | "ai" | "human";

export default function HandoffStage({ prefersReduced, locale }: HandoffStageProps) {
  const script = useMemo(
    () =>
      locale === "tr"
        ? ([
            { sender: "user",  text: "Tedaviden sonra dikişlerim kanamaya başladı, ne yapmalıyım?" },
            { sender: "ai",    text: "Bu durum özel dikkat gerektiriyor. Sizi sağlık ekibimize bağlıyorum." },
            { sender: "human", text: "Merhaba, benim adım Ayşe. Hemşireyim, görüşmeyi devralıyorum ve size yardımcı olacağım." },
          ] as Array<{ sender: Sender; text: string }>)
        : ([
            { sender: "user",  text: "My stitches started bleeding after the treatment, what should I do?" },
            { sender: "ai",    text: "This needs special attention. I’ll connect you with our medical staff." },
            { sender: "human", text: "Hello, my name is Ella. I’m a nurse, and I’ll take over the conversation to assist you further." },
          ] as Array<{ sender: Sender; text: string }>),
    [locale]
  );

  const [idx, setIdx] = useState(prefersReduced ? script.length : 1);
  const [typing, setTyping] = useState(!prefersReduced);

  useEffect(() => {
    if (prefersReduced) return;
    if (idx < script.length) {
      const next = script[idx];
      const isAgent = next.sender !== "user";
      const preDelay = isAgent ? 450 : 280;

      const t1 = window.setTimeout(() => setTyping(isAgent), preDelay);
      const t2 = window.setTimeout(() => {
        setIdx((n) => n + 1);
        setTyping(false);
      }, preDelay + (isAgent ? 950 : 160));

      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [idx, prefersReduced, script]);

  const laneOffset = (sender: Sender) => (sender === "user" ? "ml-12 md:ml-24" : "mr-12 md:mr-24");

  return (
    <motion.div
      key="handoff-simulated-chat"
      initial={{ opacity: 0, scale: 0.985, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="relative w-full max-w-[560px] aspect-[4/3] flex items-center justify-center mx-auto"
      aria-label="Chat simulation with AI → human handoff"
    >
      <div className="flex-1 flex flex-col justify-center p-3.5 md:p-5">
        <div className="flex-1">
          <div className="flex flex-col gap-3 md:gap-3.5">
            <AnimatePresence initial={false}>
              {script.slice(0, idx).map((m, i) => (
                <motion.div
                  key={`${i}-${m.sender}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: EASE }}
                  className={`${m.sender === "user" ? "self-end" : "self-start"} ${laneOffset(m.sender)}`}
                >
                  <ChatBubble sender={m.sender}>{m.text}</ChatBubble>
                </motion.div>
              ))}

              {typing && !prefersReduced && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: EASE }}
                  className={`self-start inline-flex items-center rounded-2xl px-3 py-2 bg-white border border-black/10 shadow-sm ${laneOffset("ai")}`}
                >
                  <TypingDots />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-2 right-3 text-[10px] md:text-[11px] text-foreground/60">
          Seamless AI → Human handoff (simulated)
        </div>
      </div>
    </motion.div>
  );
}

function ChatBubble({ sender, children }: { sender: Sender; children: ReactNode }) {
  const isUser = sender === "user";
  const bg = isUser ? "#F2F8FC" : "#FFFFFF";
  const elevation = isUser ? "shadow-md" : "shadow-sm";
  const widthClass = isUser ? "max-w-[86%] md:max-w-[78%]" : "max-w-[90%] md:max-w-[82%]";
  return (
    <div className={`${widthClass} rounded-2xl px-4 py-2.5 border border-black/10 ${elevation}`} style={{ background: bg }}>
      <div className="text-[0.98rem] leading-snug">{children}</div>
    </div>
  );
}
