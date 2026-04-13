"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

// ---------------------------------------------------------------------------
// Thread data types
// ---------------------------------------------------------------------------

interface ThreadMessage {
  id: string;
  sender: "chris" | "user";
  text: string;
  time: string;
  urgent?: boolean;
  actions?: Array<{
    label: string;
    route?: string;
    variant?: "primary" | "secondary" | "urgent";
    response?: string;
  }>;
}

interface Thread {
  id: string;
  role: string;
  name: string;
  initials: string;
  color: string;
  messages: ThreadMessage[];
}

// ---------------------------------------------------------------------------
// HC iMessage threads — Knights of the Holy Grail (Camelot + Avalon)
// ---------------------------------------------------------------------------

const THREADS: Thread[] = [
  {
    id: "lone-worker",
    role: "HC Manager",
    name: "Guinevere Walsh",
    initials: "GW",
    color: "#C4704A",
    messages: [
      {
        id: "lw1",
        sender: "chris",
        time: "Today 2:14pm",
        urgent: true,
        text: "Guinevere \u2014 lone worker alert. Support worker in Leichhardt has not checked out from a high-risk client visit. 45 minutes overdue. Client has a history of aggression. Marcus Chen (coordinator) has been notified and is attempting contact.",
        actions: [
          { label: "View alert details", variant: "urgent" },
          { label: "Call Marcus", variant: "primary" },
        ],
      },
      {
        id: "lw2",
        sender: "chris",
        time: "Today 2:31pm",
        text: "Update \u2014 Marcus reached the worker by phone. Visit ran over due to a medication issue that needed GP callback. Worker is safe. Marking alert as resolved.",
      },
      {
        id: "lw3",
        sender: "user",
        time: "Today 2:33pm",
        text: "Thanks CHRIS. Can you flag that client for extended visit times in future? The 90-minute window isn\u2019t enough.",
      },
      {
        id: "lw4",
        sender: "chris",
        time: "Today 2:34pm",
        text: "Done. I\u2019ve updated the AlayaCare visit template for this client from 90 to 120 minutes and added a note for the coordinator. This will apply from tomorrow\u2019s schedule.",
      },
    ],
  },
  {
    id: "budget-statements",
    role: "HC Manager",
    name: "Guinevere Walsh",
    initials: "GW",
    color: "#D4A017",
    messages: [
      {
        id: "bs1",
        sender: "chris",
        time: "Today 8:02am",
        urgent: false,
        text: "3 quarterly budget statements are due today \u2014 deadline for Q1 2026 statements under Support at Home. I\u2019ve drafted 2 of the 3. The third is pending AlayaCare sync for Client C-0203.",
        actions: [
          { label: "Review drafts", variant: "primary" },
          { label: "View all statements", variant: "secondary" },
        ],
      },
      {
        id: "bs2",
        sender: "user",
        time: "Today 8:15am",
        text: "Send the 2 that are ready. I\u2019ll review C-0203 when the sync completes.",
      },
      {
        id: "bs3",
        sender: "chris",
        time: "Today 8:16am",
        text: "Approved and sent to Client C-0042 and C-0118. Both statements show their quarterly budget, services delivered, and unspent balance. I\u2019ve filed copies in the compliance record. I\u2019ll notify you when C-0203 is ready.",
      },
    ],
  },
  {
    id: "oracle-finding",
    role: "HC Manager",
    name: "Guinevere Walsh",
    initials: "GW",
    color: "#2D6A4F",
    messages: [
      {
        id: "of1",
        sender: "chris",
        time: "Today 7:45am",
        text: "The Oracle has identified $21,600 in underspend recovery this quarter. 12 clients across Camelot (7) and Avalon (5) are below 75% budget utilisation with 4 weeks remaining. Under Support at Home, these unspent funds return to government at quarter end.",
        actions: [
          { label: "View Oracle report", variant: "primary" },
          { label: "See affected clients", variant: "secondary" },
        ],
      },
      {
        id: "of2",
        sender: "chris",
        time: "Today 7:46am",
        text: "The biggest gap is in Allied Health \u2014 142 hours unfunded across these 12 clients. I\u2019ve drafted an outreach letter for coordinators to contact each client about additional Allied Health and Independence services. Would you like to review it?",
        actions: [
          { label: "Review outreach letter", variant: "primary" },
          {
            label: "Send to coordinators",
            variant: "secondary",
            response:
              "Outreach letters sent to all coordinators. Each letter is personalised with the client\u2019s specific budget position and recommended service categories. I\u2019ll track responses.",
          },
        ],
      },
      {
        id: "of3",
        sender: "user",
        time: "Today 7:52am",
        text: "Review it first please",
      },
      {
        id: "of4",
        sender: "chris",
        time: "Today 7:53am",
        text: "Draft ready for your review. I\u2019ve personalised each letter with the client\u2019s specific budget position and recommended service categories based on their care plan goals.",
      },
    ],
  },
  {
    id: "keeper-psh",
    role: "HC Manager",
    name: "Guinevere Walsh",
    initials: "GW",
    color: "#1B4332",
    messages: [
      {
        id: "kp1",
        sender: "chris",
        time: "Today 6:30am",
        text: "The Keeper has flagged Avalon Home Care \u2014 turnover is running at 34.6%, six points above Camelot. PSH_09 (Remote/Isolated Work) is elevated across both services but significantly worse in Avalon. The Northern Beaches travel burden appears to be the primary driver.",
        actions: [
          { label: "View PSH data", variant: "primary" },
          { label: "View Keeper analysis", variant: "secondary" },
        ],
      },
      {
        id: "kp2",
        sender: "user",
        time: "Today 9:10am",
        text: "What\u2019s the Oracle saying about the travel issue?",
      },
      {
        id: "kp3",
        sender: "chris",
        time: "Today 9:11am",
        text: "The Oracle identified the same pattern \u2014 3 Avalon workers are crossing the Spit Bridge daily when their clients could be served by workers already on the correct side. Fixing the routing would recover 2.1 hours per worker per week and reduce PSH_09 exposure. Estimated annual value: $24,000 in recovered productive capacity.",
      },
    ],
  },
];

function getThread(id: string): Thread | undefined {
  return THREADS.find((t) => t.id === id);
}

// ---------------------------------------------------------------------------
// Thread labels for the selector
// ---------------------------------------------------------------------------

const THREAD_LABELS: Record<string, { label: string; urgency: string }> = {
  "lone-worker": { label: "Lone Worker Alert", urgency: "bg-[#C4704A]" },
  "budget-statements": { label: "Budget Statements", urgency: "bg-[#D4A017]" },
  "oracle-finding": { label: "Oracle Finding", urgency: "bg-[#2D6A4F]" },
  "keeper-psh": { label: "Keeper Alert", urgency: "bg-[#1B4332]" },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function HCIMessageDemo() {
  const router = useRouter();
  const [activeThread, setActiveThread] = useState<string>("lone-worker");
  const [extraMessages, setExtraMessages] = useState<ThreadMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const thread = getThread(activeThread)!;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [extraMessages, typing]);

  // Reset extra messages when switching threads
  useEffect(() => {
    setExtraMessages([]);
    setTyping(false);
  }, [activeThread]);

  function handleAction(action: {
    label: string;
    route?: string;
    response?: string;
  }) {
    if (action.route) {
      router.push(action.route);
      return;
    }
    if (action.response) {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setExtraMessages((prev) => [
          ...prev,
          {
            id: `extra-${Date.now()}`,
            sender: "chris",
            time: "Just now",
            text: action.response!,
          },
        ]);
      }, 1500);
    }
  }

  const allMessages = [...thread.messages, ...extraMessages];

  return (
    <div
      className="max-w-[390px] mx-auto min-h-screen flex flex-col"
      style={{ background: "#F2F2F7" }}
    >
      {/* iOS status bar */}
      <div className="bg-black text-white px-6 py-2 flex items-center justify-between text-[12px] font-semibold shrink-0">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <span>&#9679;&#9679;&#9679;&#9679;</span>
          <span>WiFi</span>
          <span>&#128267;</span>
        </div>
      </div>

      {/* Thread header */}
      <div className="bg-[#F9F9F9] border-b border-[#E5E5EA] px-4 py-2 flex items-center gap-3 shrink-0">
        <button
          data-has-handler="true"
          onClick={() => router.push("/dashboard/home-care")}
          className="text-[#007AFF] flex items-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
          style={{ background: thread.color }}
        >
          {thread.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold text-black">{thread.name}</p>
          <p className="text-[11px] text-[#8E8E93]">{thread.role}</p>
        </div>
      </div>

      {/* Thread selector */}
      <div className="bg-white border-b border-[#E5E5EA] px-3 py-2 flex gap-2 overflow-x-auto shrink-0">
        {THREADS.map((t) => {
          const meta = THREAD_LABELS[t.id];
          const isActive = t.id === activeThread;
          return (
            <button
              key={t.id}
              data-has-handler="true"
              onClick={() => setActiveThread(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "text-white " + meta.urgency
                  : "bg-[#F2F2F7] text-[#374151] hover:bg-[#E5E5EA]"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isActive ? "bg-white/60" : meta.urgency
                }`}
              />
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {allMessages.map((msg, i) => {
          const showTimestamp =
            i === 0 || allMessages[i - 1].time !== msg.time;
          const isChris = msg.sender === "chris";

          return (
            <div key={msg.id}>
              {/* Timestamp */}
              {showTimestamp && (
                <p className="text-center text-[11px] text-[#8E8E93] uppercase tracking-wide my-3">
                  {msg.time}
                </p>
              )}

              {/* Message bubble */}
              <div
                className={`flex gap-2 mb-2 ${isChris ? "" : "flex-row-reverse"}`}
              >
                {/* CHRIS avatar */}
                {(isChris && i === 0) ||
                (isChris && allMessages[i - 1]?.sender !== "chris") ? (
                  <div className="w-8 h-8 rounded-full bg-[#1B4332] flex items-center justify-center text-white text-xs font-bold shrink-0 mt-auto">
                    C
                  </div>
                ) : isChris ? (
                  <div className="w-8 shrink-0" />
                ) : null}

                <div
                  className={`max-w-[75%] px-4 py-3 ${
                    isChris
                      ? msg.urgent
                        ? "bg-[#FEF7F0] rounded-[18px_18px_18px_4px]"
                        : "bg-white rounded-[18px_18px_18px_4px]"
                      : "bg-[#1B4332] text-white rounded-[18px_18px_4px_18px]"
                  }`}
                >
                  <p
                    className="text-[15px] leading-relaxed"
                    style={{ color: isChris ? "#000000" : "#FFFFFF" }}
                  >
                    {msg.text}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              {isChris &&
                msg.actions &&
                !extraMessages.find((e) => e.id.startsWith("extra")) && (
                  <div className="flex flex-wrap gap-2 ml-10 mb-3">
                    {msg.actions.map((action) => (
                      <button
                        key={action.label}
                        data-has-handler="true"
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
            </div>
          );
        })}

        {/* Typing indicator */}
        {typing && (
          <div className="flex gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#1B4332] flex items-center justify-center text-white text-xs font-bold shrink-0 mt-auto">
              C
            </div>
            <div className="bg-white rounded-[18px_18px_18px_4px] px-4 py-3">
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 rounded-full bg-[#8E8E93] animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-[#8E8E93] animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-[#8E8E93] animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
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
