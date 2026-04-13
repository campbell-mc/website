"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Send, ChevronLeft } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { getRoleConfig, type RoleName } from "@/lib/roles/config";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

// TODO: Replace with real user role from session
const USER_ROLE: RoleName = "don";
const config = getRoleConfig(USER_ROLE);
const coachConfig = config.chris_coach;

// Get suggested prompts for the referring page, or default
function getSuggestedPrompts(pathname: string): string[] {
  // Check if there are route-specific prompts
  for (const [route, prompts] of Object.entries(coachConfig.suggested_prompts)) {
    if (pathname.startsWith(route)) return prompts;
  }
  // Fallback to the first set of prompts
  const allPrompts = Object.values(coachConfig.suggested_prompts);
  return allPrompts[0] || [
    "What should I focus on today?",
    "Help me prepare for a difficult conversation",
    "I'm feeling overwhelmed — what can I let go of?",
  ];
}

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  content: "I'm here whenever you need me. I can help you think through team challenges, prepare for conversations, understand your data, or just work through what's on your mind. What's on your plate today?",
};

export default function CoachPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const suggestedPrompts = getSuggestedPrompts(pathname);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text?: string) {
    const msg = text ?? input.trim();
    if (!msg || streaming) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: msg };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setStreaming(true);

    const aId = `a-${Date.now()}`;
    setMessages((p) => [...p, { id: aId, role: "assistant", content: "", isStreaming: true }]);

    try {
      const res = await fetch("/api/coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })), role: USER_ROLE }),
      });

      const data = res.ok ? await res.json() : null;
      const reply = data?.response ?? "I'm here to help. Could you tell me more about what you're working through?";

      setMessages((p) => p.map((m) => m.id === aId ? { ...m, content: reply, isStreaming: false } : m));
    } catch {
      setMessages((p) => p.map((m) => m.id === aId ? { ...m, content: "I wasn't able to connect just now. Try again in a moment.", isStreaming: false } : m));
    }

    setStreaming(false);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] lg:h-screen">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--border-default)] bg-white/80 backdrop-blur-sm shrink-0">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => router.push("/dashboard")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground shrink-0">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <ChrisAvatar size="small" showGlow={streaming} />
          <div>
            <h1 className="text-base font-semibold text-[var(--brand-forest)]">CHRIS Coach</h1>
            <p className="text-[10px] text-gray-400">{streaming ? "Thinking..." : "Your practice support"}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 animate-slideUp ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              {msg.role === "assistant" && <ChrisAvatar size="small" className="mt-1 shrink-0" />}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-[var(--brand-forest)] text-white rounded-br-md"
                  : "bg-[rgba(27,67,50,0.04)] text-[var(--brand-forest)] rounded-bl-md border border-[rgba(27,67,50,0.08)]"
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                  {msg.isStreaming && (
                    <span className="inline-flex gap-1 ml-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 shrink-0">
          <div className="max-w-2xl mx-auto">
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">Suggestions</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((p) => (
                <button key={p} onClick={() => send(p)} className="text-xs px-3 py-2 rounded-full border border-[var(--border-default)] text-[var(--brand-forest)] hover:bg-[rgba(27,67,50,0.04)] transition-colors">
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-[var(--border-default)] bg-white shrink-0 mb-16 lg:mb-0">
        <div className="max-w-2xl mx-auto flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask CHRIS anything..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-[var(--border-default)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--brand-teal)] focus:ring-2 focus:ring-[rgba(45,125,115,0.12)]"
          />
          <button onClick={() => send()} disabled={!input.trim() || streaming} className="px-4 py-3 rounded-xl text-white disabled:opacity-40 transition-opacity shrink-0" style={{ background: "var(--brand-forest)" }}>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
