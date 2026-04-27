"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

const C = { dark: "#1a1218", dark2: "#2d1f2a", copper: "#c89a3c", copperDark: "#8b6914", cream: "#faf7f2", ink: "#f5ede3", inkDark: "#1a1218", inkMuted: "rgba(245,237,227,0.78)", inkMutedLight: "rgba(26,18,24,0.78)", good: "#2d6a4f", warn: "#b5572a" };

type Message = { role: "user" | "assistant"; content: string };

function stripMd(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").replace(/__(.+?)__/g, "$1").replace(/_(.+?)_/g, "$1").replace(/^#{1,6}\s+/gm, "").replace(/`(.+?)`/g, "$1").replace(/\[(.+?)\]\(.+?\)/g, "$1");
}

const OPENING = `I'm the CHRIS psychosocial risk assessor. I'll evaluate your organisation against the seven pillars of a defensible psychosocial risk system — the standard regulators apply in 2026.

This takes 12–15 minutes. I'll ask questions conversationally. You answer in your own words. At the end, you'll receive a maturity score, your strongest and weakest pillars, and the three highest-priority controls for your context.

Before we start: are you an aged care provider, an NDIS provider, or both?`;

export default function PSHAssessment() {
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: OPENING }]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [showCapture, setShowCapture] = useState(false);
  const [captureEmail, setCaptureEmail] = useState("");
  const [captureName, setCaptureName] = useState("");
  const [captureRole, setCaptureRole] = useState("");
  const [captureOrg, setCaptureOrg] = useState("");
  const [captured, setCaptured] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRAF = useRef(0);

  const scrollToBottom = useCallback(() => {
    cancelAnimationFrame(scrollRAF.current);
    scrollRAF.current = requestAnimationFrame(() => {
      const el = containerRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  // Count exchanges to detect end-of-assessment
  const exchangeCount = messages.filter((m) => m.role === "user").length;

  async function send(text?: string) {
    const content = text ?? input.trim();
    if (!content || streaming) return;
    const userMsg: Message = { role: "user", content };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setStreaming(true);
    setMessages((p) => [...p, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat-public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated.map((m) => ({ role: m.role, content: m.content })) }),
      });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setMessages((p) => {
            const u = [...p];
            u[u.length - 1] = { role: "assistant", content: u[u.length - 1].content + chunk };
            return u;
          });
        }
      }
    } catch {} finally {
      setStreaming(false);
      inputRef.current?.focus();
      // After ~15 exchanges, suggest the report capture
      if (exchangeCount >= 14) setTimeout(() => setShowCapture(true), 2000);
    }
  }

  async function handleCapture(e: React.FormEvent) {
    e.preventDefault();
    try { await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: captureEmail, name: captureName, role: captureRole, organisation: captureOrg, workflow_interest: "psh_assessment" }) }); } catch {}
    setCaptured(true);
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "system-ui, sans-serif", backgroundColor: C.dark }}>
      {/* Nav */}
      <nav style={{ borderBottom: "1px solid rgba(245,237,227,0.08)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 lg:px-16 py-4">
          <Link href="/v2" className="text-[15px] font-medium tracking-tight" style={{ color: C.ink }}>CHRIS<span style={{ color: C.copper }}>·</span>OS</Link>
          <a href="/v2#book" className="text-[13px] font-medium px-5 py-2 rounded" style={{ backgroundColor: C.copper, color: C.dark }}>Book a conversation</a>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-3xl mx-auto px-6 lg:px-16 py-10 text-center">
        <div className="text-[11px] font-medium tracking-[0.12em] uppercase mb-4" style={{ color: C.copper }}>PSH self-assessment · 12–15 minutes · No signup</div>
        <h1 className="text-[clamp(1.3rem,3vw,2rem)] font-normal leading-[1.2] mb-3" style={{ fontFamily: "Georgia, serif", color: C.ink }}>
          Where does your organisation actually stand <em className="italic" style={{ color: C.copper }}>on psychosocial risk?</em>
        </h1>
        <p className="text-[14px] leading-[1.65] max-w-xl mx-auto" style={{ color: C.inkMuted }}>
          Every Australian jurisdiction now has formal regulations requiring you to identify, assess, control and review psychosocial hazards. This assessment evaluates your organisation against the standard regulators apply in 2026.
        </p>
      </div>

      {/* Chat */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-6 lg:px-16 pb-6">
        <div className="rounded-xl overflow-hidden flex flex-col" style={{ backgroundColor: C.cream, height: "500px" }}>
          <div ref={containerRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4" style={{ overscrollBehavior: "contain" }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={msg.role === "user" ? "max-w-[80%]" : "max-w-[85%]"}>
                  {msg.role === "assistant" && <p className="text-[10px] uppercase tracking-wider mb-1 font-medium" style={{ color: C.copperDark }}>CHRIS</p>}
                  <div className="rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap"
                    style={msg.role === "user" ? { backgroundColor: C.dark, color: C.ink, borderBottomRightRadius: 4 } : { backgroundColor: "#fff", color: C.inkDark, borderBottomLeftRadius: 4 }}>
                    {msg.role === "assistant" ? stripMd(msg.content) : msg.content}
                    {msg.role === "assistant" && msg.content === "" && streaming && (
                      <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: C.copper }} /><span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: C.copper, animationDelay: "150ms" }} /><span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: C.copper, animationDelay: "300ms" }} /></span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center px-4 py-3 border-t" style={{ borderColor: "rgba(26,18,24,0.06)" }}>
            <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Type your answer..." disabled={streaming}
              className="flex-1 px-3 py-2 text-[14px] bg-transparent focus:outline-none disabled:opacity-50" style={{ color: C.inkDark }} />
            <button onClick={() => send()} disabled={streaming || !input.trim()}
              className="px-4 py-2 rounded text-[13px] font-medium disabled:opacity-30" style={{ backgroundColor: C.copper, color: C.dark }}>Send</button>
          </div>
        </div>

        <p className="text-[11px] text-center mt-3" style={{ color: "rgba(245,237,227,0.35)" }}>
          This assessment is general information, not legal advice. For decisions of consequence, consult a WHS lawyer admitted in your jurisdiction.
        </p>
      </div>

      {/* Capture modal */}
      {showCapture && !captured && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setShowCapture(false)}>
          <form onSubmit={handleCapture} className="bg-white rounded-xl p-6 max-w-md w-full space-y-3" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[16px] font-semibold" style={{ color: C.inkDark }}>Get your full compliance report</h3>
            <p className="text-[13px]" style={{ color: "rgba(26,18,24,0.5)" }}>18–22 page report: maturity score, gap analysis, officer due diligence exposure, 90-day remediation pathway.</p>
            <input required type="text" value={captureName} onChange={(e) => setCaptureName(e.target.value)} placeholder="Name" className="w-full px-4 py-2.5 rounded border text-[13px] focus:outline-none" style={{ borderColor: "rgba(26,18,24,0.12)" }} />
            <input required type="text" value={captureRole} onChange={(e) => setCaptureRole(e.target.value)} placeholder="Role / title" className="w-full px-4 py-2.5 rounded border text-[13px] focus:outline-none" style={{ borderColor: "rgba(26,18,24,0.12)" }} />
            <input required type="text" value={captureOrg} onChange={(e) => setCaptureOrg(e.target.value)} placeholder="Organisation" className="w-full px-4 py-2.5 rounded border text-[13px] focus:outline-none" style={{ borderColor: "rgba(26,18,24,0.12)" }} />
            <input required type="email" value={captureEmail} onChange={(e) => setCaptureEmail(e.target.value)} placeholder="Work email" className="w-full px-4 py-2.5 rounded border text-[13px] focus:outline-none" style={{ borderColor: "rgba(26,18,24,0.12)" }} />
            <button type="submit" className="w-full py-3 rounded text-[14px] font-medium hover:opacity-90" style={{ backgroundColor: C.copper, color: C.dark }}>Send my report →</button>
          </form>
        </div>
      )}
    </div>
  );
}
