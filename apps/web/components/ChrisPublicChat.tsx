"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const OPENING_MESSAGE = `You're looking at CHRIS — the operational intelligence layer for aged care.

Ask me anything about care minutes, SIRS obligations, workforce pressure, psychosocial compliance, AN-ACC revenue, or what it actually takes to lead in this sector right now. No login required.`;

const SUGGESTION_CHIPS = [
  "What keeps a DON up at night?",
  "How do I reduce agency costs?",
  "How does care minutes compliance work?",
];

export default function ChrisPublicChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: OPENING_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [hasUserSent, setHasUserSent] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Scroll only the chat container — not the page
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  async function sendMessage(text?: string) {
    const content = text ?? input.trim();
    if (!content || streaming || rateLimited) return;

    setHasUserSent(true);
    const userMessage: Message = { role: "user", content };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setStreaming(true);

    // Add empty assistant message to stream into
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat-public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (res.status === 429) {
        setRateLimited(true);
        setMessages((prev) => prev.slice(0, -1));
        setStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: updated[updated.length - 1].content + chunk,
          };
          return updated;
        });
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setStreaming(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="bg-white border border-[#1B4332]/12 rounded-2xl overflow-hidden flex flex-col" style={{ maxHeight: 420 }}>
      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={msg.role === "user" ? "max-w-[80%]" : "max-w-[85%]"}>
              {msg.role === "assistant" && (
                <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1 font-medium">CHRIS</p>
              )}
              <div
                className={
                  msg.role === "user"
                    ? "bg-[#1B4332] text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm leading-relaxed"
                    : "bg-stone-50 text-stone-800 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap"
                }
              >
                {msg.content}
                {msg.role === "assistant" && msg.content === "" && streaming && (
                  <span className="inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-pulse" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-pulse" style={{ animationDelay: "300ms" }} />
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Suggestion chips — before first user message */}
      {!hasUserSent && !streaming && (
        <div className="flex gap-2 px-4 pb-2 flex-wrap">
          {SUGGESTION_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => sendMessage(chip)}
              className="border border-[#1B4332]/15 rounded-full px-3 py-1.5 text-xs text-stone-500 hover:border-[#1B4332]/30 hover:text-[#1B4332] transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Rate limit message */}
      {rateLimited && (
        <div className="px-4 pb-2">
          <p className="text-xs text-stone-400 mb-1">You've reached the limit for this session.</p>
          <a href="#demo-section" className="text-xs font-medium text-[#2D7D73] hover:underline">
            Enter the demo →
          </a>
        </div>
      )}

      {/* Input bar */}
      <div className="border-t border-[#1B4332]/8 flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder={rateLimited ? "Limit reached" : "Ask CHRIS anything about aged care..."}
          disabled={streaming || rateLimited}
          className="flex-1 px-4 py-3.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none bg-transparent disabled:opacity-50"
        />
        <button
          onClick={() => sendMessage()}
          disabled={streaming || !input.trim() || rateLimited}
          className="px-3 py-3.5 text-[#1B4332] disabled:opacity-30 hover:opacity-70 transition-opacity"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
