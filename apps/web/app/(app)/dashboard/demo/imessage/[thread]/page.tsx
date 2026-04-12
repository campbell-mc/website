"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getThread, type ThreadMessage } from "../threads";

export default function IMessageThreadPage() {
  const router = useRouter();
  const params = useParams();
  const threadId = params.thread as string;
  const thread = getThread(threadId);
  const endRef = useRef<HTMLDivElement>(null);
  const [extraMessages, setExtraMessages] = useState<ThreadMessage[]>([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [extraMessages, typing]);

  if (!thread) {
    return (
      <div className="max-w-[390px] mx-auto min-h-screen flex items-center justify-center" style={{ background: "#F2F2F7" }}>
        <p className="text-[#8E8E93]">Thread not found</p>
      </div>
    );
  }

  function handleAction(action: { label: string; route?: string; response?: string }) {
    if (action.route) {
      router.push(action.route);
      return;
    }
    if (action.response) {
      // Show typing then response
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setExtraMessages((prev) => [...prev, {
          id: `extra-${Date.now()}`,
          sender: "chris",
          time: "Just now",
          text: action.response!,
        }]);
      }, 1500);
    }
  }

  function handleEmoji(response: string) {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setExtraMessages((prev) => [...prev, {
        id: `extra-${Date.now()}`,
        sender: "chris",
        time: "Just now",
        text: response,
      }]);
    }, 1500);
  }

  const allMessages = [...thread.messages, ...extraMessages];

  return (
    <div className="max-w-[390px] mx-auto min-h-screen flex flex-col" style={{ background: "#F2F2F7" }}>
      {/* iOS status bar */}
      <div className="bg-black text-white px-6 py-2 flex items-center justify-between text-[12px] font-semibold shrink-0">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <span>●●●●</span>
          <span>WiFi</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Thread header */}
      <div className="bg-[#F9F9F9] border-b border-[#E5E5EA] px-4 py-2 flex items-center gap-3 shrink-0">
        <button data-has-handler="true" onClick={() => router.push("/dashboard/demo/imessage")} className="text-[#007AFF] flex items-center">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0" style={{ background: thread.color }}>
          {thread.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold text-black">{thread.name}</p>
          <p className="text-[11px] text-[#8E8E93]">{thread.role}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {allMessages.map((msg, i) => {
          const showTimestamp = i === 0 || allMessages[i - 1].time !== msg.time;
          const isChris = msg.sender === "chris";

          return (
            <div key={msg.id}>
              {/* Timestamp */}
              {showTimestamp && (
                <p className="text-center text-[11px] text-[#8E8E93] uppercase tracking-wide my-3">{msg.time}</p>
              )}

              {/* Message bubble */}
              <div className={`flex gap-2 mb-2 ${isChris ? "" : "flex-row-reverse"}`}>
                {/* CHRIS avatar */}
                {isChris && i === 0 || (isChris && allMessages[i - 1]?.sender !== "chris") ? (
                  <div className="w-8 h-8 rounded-full bg-[#1B4332] flex items-center justify-center text-white text-xs font-bold shrink-0 mt-auto">C</div>
                ) : isChris ? (
                  <div className="w-8 shrink-0" />
                ) : null}

                <div className={`max-w-[75%] px-4 py-3 ${
                  isChris
                    ? msg.urgent ? "bg-[#FEF7F0] rounded-[18px_18px_18px_4px]" : "bg-white rounded-[18px_18px_18px_4px]"
                    : "bg-[#1B4332] text-white rounded-[18px_18px_4px_18px]"
                }`}>
                  <p className="text-[15px] leading-relaxed" style={{ color: isChris ? "#000000" : "#FFFFFF" }}>{msg.text}</p>
                </div>
              </div>

              {/* Action buttons */}
              {isChris && msg.actions && !extraMessages.find((e) => e.id.startsWith("extra")) && (
                <div className="flex flex-wrap gap-2 ml-10 mb-3">
                  {msg.actions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleAction(action)}
                      className={`px-4 py-2 rounded-full text-[14px] font-semibold transition-opacity hover:opacity-90 ${
                        action.variant === "secondary"
                          ? "bg-[#E5E7EB] text-[#374151]"
                          : action.variant === "urgent"
                          ? "bg-[#C4704A] text-white"
                          : "bg-[#1B4332] text-white"
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Emoji actions */}
              {isChris && msg.emojiActions && !extraMessages.find((e) => e.id.startsWith("extra")) && (
                <div className="grid grid-cols-3 gap-2 mx-10 mb-3">
                  {msg.emojiActions.map((ea) => (
                    <button
                      key={ea.emoji}
                      onClick={() => handleEmoji(ea.response)}
                      className="w-16 h-16 bg-white border-2 border-[#E5E7EB] rounded-2xl flex items-center justify-center text-[28px] hover:bg-[#F2F2F7] transition-colors"
                    >
                      {ea.emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {typing && (
          <div className="flex gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#1B4332] flex items-center justify-center text-white text-xs font-bold shrink-0 mt-auto">C</div>
            <div className="bg-white rounded-[18px_18px_18px_4px] px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-[#8E8E93] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-[#8E8E93] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-[#8E8E93] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* iOS home indicator */}
      <div className="flex justify-center py-2 shrink-0">
        <div className="w-32 h-1 rounded-full bg-black/20" />
      </div>
    </div>
  );
}
