"use client";

import { useState, useEffect, useRef, useCallback, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { ChrisAvatar } from "./ChrisAvatar";
import { X, Send } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────

interface Attachment {
  type: "data_card" | "document_draft" | "outbound_draft" | "data_table";
  title?: string;
  rows?: { label: string; value: string; status?: "good" | "watch" | "act" }[];
  recipient?: string;
  content_preview?: string;
  link?: string;
  columns?: string[];
  data?: Record<string, string>[];
}

interface SuggestedAction {
  label: string;
  type: "navigate" | "respond" | "draft";
  payload: { path?: string; prompt?: string };
}

interface Message {
  id: string;
  sender_type: "user" | "chris" | "system";
  sender_role?: string;
  content: string;
  attachments?: Attachment[];
  suggested_actions?: SuggestedAction[];
  created_at: string;
}

interface CHRISConversationProps {
  context_type: string;
  context_id?: string;
  context_label?: string;
  context_data?: any;
  facility_id: string;
  facility_name: string;
  current_user_role: string;
  mode: "panel" | "fullscreen" | "mobile" | "floating";
  onClose?: () => void;
  className?: string;
}

// ── Design tokens ────────────────────────────────────────────────

const FOREST = "#1B4332";
const TEAL = "#2D7D73";
const AMBER = "#D4A017";
const TERRACOTTA = "#C4704A";

const STATUS_COLORS: Record<string, string> = {
  good: "text-[#2D7D73]",
  watch: "text-[#D4A017]",
  act: "text-[#C4704A]",
};

// ── Mode styles ──────────────────────────────────────────────────

const MODE_CLASSES: Record<CHRISConversationProps["mode"], string> = {
  fullscreen: "h-full",
  panel: "h-full border-l border-gray-200",
  floating: "h-[600px] rounded-2xl shadow-2xl overflow-hidden",
  mobile: "h-full",
};

// ── Helpers ──────────────────────────────────────────────────────

function stripMd(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1");
}

function uid(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ── Attachment renderers ─────────────────────────────────────────

function DataCard({ attachment }: { attachment: Attachment }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mt-2">
      {attachment.title && (
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          {attachment.title}
        </p>
      )}
      <div className="space-y-2">
        {attachment.rows?.map((row, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{row.label}</span>
            <span className={`font-medium ${row.status ? STATUS_COLORS[row.status] : "text-gray-900"}`}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentDraft({ attachment }: { attachment: Attachment }) {
  return (
    <div className="bg-[#FDF6E3] border border-[#D4A017]/30 rounded-xl p-4 mt-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4A017] bg-[#D4A017]/10 px-2 py-0.5 rounded-full">
          Chronicler
        </span>
      </div>
      {attachment.title && (
        <p className="text-sm font-semibold text-gray-900 mb-2">{attachment.title}</p>
      )}
      {attachment.link && (
        <a
          href={attachment.link}
          className="text-sm font-medium text-[#2D7D73] hover:underline"
        >
          Review document &rarr;
        </a>
      )}
    </div>
  );
}

function OutboundDraft({ attachment, onAction }: { attachment: Attachment; onAction?: (prompt: string) => void }) {
  return (
    <div className="bg-[#EFF9F7] border border-[#2D7D73]/20 rounded-xl p-4 mt-2">
      {attachment.recipient && (
        <p className="text-xs font-semibold text-[#2D7D73] mb-1">To: {attachment.recipient}</p>
      )}
      {attachment.content_preview && (
        <p className="text-sm text-gray-700 line-clamp-4 mb-3">{attachment.content_preview}</p>
      )}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onAction?.("approve_and_send")}
          className="text-sm font-medium text-white bg-[#2D7D73] hover:bg-[#236660] px-3 py-1.5 rounded-lg transition-colors"
        >
          Approve and send &rarr;
        </button>
        <button
          onClick={() => onAction?.("edit_draft")}
          className="text-sm font-medium text-[#2D7D73] hover:underline px-3 py-1.5"
        >
          Edit
        </button>
      </div>
      <p className="text-[11px] text-gray-400 mt-2">CHRIS will file a copy</p>
    </div>
  );
}

function DataTable({ attachment }: { attachment: Attachment }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-2">
      {attachment.title && (
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 pt-3 pb-2">
          {attachment.title}
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {attachment.columns?.map((col, i) => (
                <th key={i} className="text-left text-xs font-medium text-gray-500 px-4 py-2">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attachment.data?.map((row, ri) => (
              <tr key={ri} className="border-b border-gray-50 last:border-0">
                {attachment.columns?.map((col, ci) => (
                  <td key={ci} className="px-4 py-2 text-gray-700">
                    {row[col] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AttachmentRenderer({ attachment, onAction }: { attachment: Attachment; onAction?: (prompt: string) => void }) {
  switch (attachment.type) {
    case "data_card":
      return <DataCard attachment={attachment} />;
    case "document_draft":
      return <DocumentDraft attachment={attachment} />;
    case "outbound_draft":
      return <OutboundDraft attachment={attachment} onAction={onAction} />;
    case "data_table":
      return <DataTable attachment={attachment} />;
    default:
      return null;
  }
}

// ── Thinking indicator ───────────────────────────────────────────

function ThinkingDots() {
  return (
    <div className="flex items-center gap-3">
      <ChrisAvatar size="small" />
      <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-gray-400"
            style={{
              animation: "chris-bounce 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────

export function CHRISConversation({
  context_type,
  context_id,
  context_label,
  context_data,
  facility_id,
  facility_name,
  current_user_role,
  mode,
  onClose,
  className = "",
}: CHRISConversationProps) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  // Initialize conversation on mount
  useEffect(() => {
    if (initialized) return;

    async function openConversation() {
      setThinking(true);
      try {
        const res = await fetch("/api/conversations/open", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            context_type,
            context_id,
            context_data,
            facility_id,
            current_user_role,
          }),
        });

        const data = await res.json();
        setConversationId(data.conversation_id);

        const openingMessage: Message = {
          id: uid(),
          sender_type: "chris",
          content: data.content,
          suggested_actions: data.suggested_actions,
          created_at: new Date().toISOString(),
        };

        setMessages([openingMessage]);
      } catch {
        const errorMessage: Message = {
          id: uid(),
          sender_type: "system",
          content: "Could not connect to CHRIS. Please try again.",
          created_at: new Date().toISOString(),
        };
        setMessages([errorMessage]);
      } finally {
        setThinking(false);
        setInitialized(true);
      }
    }

    openConversation();
  }, [initialized, context_type, context_id, context_data, facility_id, current_user_role]);

  // Send a user message
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || thinking) return;

      const userMessage: Message = {
        id: uid(),
        sender_type: "user",
        sender_role: current_user_role,
        content: text.trim(),
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setThinking(true);

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      try {
        const res = await fetch("/api/conversations/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversation_id: conversationId,
            message: text.trim(),
            history: [...messages, userMessage].map((m) => ({
              sender_type: m.sender_type,
              content: m.content,
            })),
            context: {
              context_type,
              context_id,
              context_data,
              facility_id,
              current_user_role,
            },
          }),
        });

        const data = await res.json();

        const chrisMessage: Message = {
          id: uid(),
          sender_type: "chris",
          content: data.content,
          attachments: data.attachments,
          suggested_actions: data.suggested_actions,
          created_at: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, chrisMessage]);
      } catch {
        const errorMessage: Message = {
          id: uid(),
          sender_type: "system",
          content: "Message failed to send. Please try again.",
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setThinking(false);
      }
    },
    [thinking, conversationId, messages, context_type, context_id, context_data, facility_id, current_user_role],
  );

  // Handle suggested action clicks
  const handleActionClick = useCallback(
    (action: SuggestedAction) => {
      switch (action.type) {
        case "navigate":
          if (action.payload.path) {
            router.push(action.payload.path);
          }
          break;
        case "respond":
          if (action.payload.prompt) {
            sendMessage(action.payload.prompt);
          }
          break;
        case "draft":
          if (action.payload.prompt) {
            sendMessage(action.payload.prompt);
          }
          break;
      }
    },
    [router, sendMessage],
  );

  // Handle textarea key events
  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  // Auto-resize textarea
  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }

  // ── Render ───────────────────────────────────────────────────

  return (
    <div className={`flex flex-col bg-white ${MODE_CLASSES[mode]} ${className}`}>
      {/* Bounce keyframes */}
      <style>{`
        @keyframes chris-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 shrink-0">
        <div className="w-8 h-8 rounded-full bg-[#1B4332] flex items-center justify-center">
          <span className="text-white font-bold text-xs">C</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {context_label || facility_name}
          </p>
          {context_label && (
            <p className="text-xs text-gray-500 truncate">{facility_name}</p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => {
          // System message
          if (msg.sender_type === "system") {
            return (
              <div key={msg.id} className="flex justify-center">
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {msg.content}
                </span>
              </div>
            );
          }

          // User message
          if (msg.sender_type === "user") {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[80%] bg-[#1B4332] rounded-2xl rounded-tr-sm px-4 py-3">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#ffffff" }}>{msg.content}</p>
                </div>
              </div>
            );
          }

          // CHRIS message
          return (
            <div key={msg.id} className="flex items-start gap-3">
              <ChrisAvatar size="small" className="shrink-0 mt-0.5" />
              <div className="max-w-[85%] space-y-1">
                <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3">
                  <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
                    {stripMd(msg.content)}
                  </p>
                </div>

                {/* Attachments */}
                {msg.attachments?.map((att, i) => (
                  <AttachmentRenderer
                    key={i}
                    attachment={att}
                    onAction={(prompt) => sendMessage(prompt)}
                  />
                ))}

                {/* Suggested actions */}
                {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {msg.suggested_actions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(action)}
                        className="text-sm text-[#2D7D73] bg-[#EFF9F7] hover:bg-[#E0F2EF] px-3 py-1.5 rounded-full transition-colors font-medium"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Thinking state */}
        {thinking && <ThinkingDots />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-gray-200 px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask CHRIS anything..."
            rows={1}
            className="flex-1 resize-none text-sm text-gray-900 placeholder-gray-400 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200 focus:outline-none focus:border-[#2D7D73] focus:ring-1 focus:ring-[#2D7D73]/20 transition-colors"
            style={{ maxHeight: 120 }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || thinking}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors shrink-0 ${
              input.trim() && !thinking
                ? "bg-[#1B4332] text-white hover:bg-[#163728]"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[11px] text-gray-400 mt-1.5 text-center">
          Enter to send &middot; Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
