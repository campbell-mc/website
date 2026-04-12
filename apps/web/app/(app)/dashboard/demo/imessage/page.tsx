"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { THREADS } from "./threads";

export default function IMessageDemoHub() {
  const router = useRouter();

  return (
    <div className="max-w-[390px] mx-auto min-h-screen" style={{ background: "#F2F2F7" }}>
      {/* iOS status bar */}
      <div className="bg-black text-white px-6 py-2 flex items-center justify-between text-[12px] font-semibold">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <span>●●●●</span>
          <span>WiFi</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-[#F2F2F7] px-4 pt-2 pb-3">
        <div className="flex items-center gap-2 mb-3">
          <button data-has-handler="true" onClick={() => router.push("/dashboard")} className="text-[#007AFF] text-sm font-medium flex items-center">
            <ChevronLeft className="w-5 h-5" />Back
          </button>
        </div>
        <h1 className="text-[34px] font-bold text-black leading-tight">Messages</h1>
      </div>

      {/* Thread list */}
      <div className="bg-white">
        {THREADS.map((thread, i) => {
          const lastMsg = thread.messages[thread.messages.length - 1];
          const preview = lastMsg.sender === "chris" ? lastMsg.text : `You: ${lastMsg.text}`;

          return (
            <button
              key={thread.id}
              data-has-handler="true"
              onClick={() => router.push(`/dashboard/demo/imessage/${thread.id}`)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F2F2F7] transition-colors ${i < THREADS.length - 1 ? "border-b border-[#E5E5EA]" : ""}`}
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-semibold" style={{ background: thread.color }}>
                {thread.initials}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-[15px] font-semibold text-black">{thread.name}</p>
                  <span className="text-[12px] text-[#8E8E93]">{lastMsg.time.split(" ")[1] || lastMsg.time}</span>
                </div>
                <p className="text-[13px] text-[#8E8E93] truncate">{preview.substring(0, 60)}...</p>
                <p className="text-[11px] text-[#8E8E93]">{thread.role}</p>
              </div>

              {/* Unread dot */}
              {thread.messages.some((m) => m.sender === "chris" && m.actions) && (
                <div className="w-3 h-3 rounded-full bg-[#007AFF] shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* iOS home indicator */}
      <div className="flex justify-center py-2">
        <div className="w-32 h-1 rounded-full bg-black/20" />
      </div>
    </div>
  );
}
