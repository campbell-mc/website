"use client";

/**
 * OperationalThread — inline notes on any object (incident, report, metric, etc.)
 *
 * Attaches to any entity via object_type + object_id.
 * Role-scoped visibility: only roles in visible_to_roles can see the thread.
 */

import { useState } from "react";
import { CheckCircle, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────

export interface ThreadComment {
  id: string;
  author_role: string;
  content: string;
  created_at: string;
  resolved: boolean;
}

interface OperationalThreadProps {
  object_type: string;
  object_id: string;
  facility_id: string;
  current_user_role: string;
  visible_to_roles: string[];
  initial_comments?: ThreadComment[];
}

// ── Role config ──────────────────────────────────────────────────

const ROLE_LABELS: Record<string, string> = {
  facility_manager: "FM",
  don: "DON",
  ceo: "CEO",
  cfo: "CFO",
  quality_lead: "Quality",
  whs_lead: "WHS",
  hr_manager: "HR",
  team_leader: "TL",
};

const ROLE_COLORS: Record<string, string> = {
  facility_manager: "#1B4332",
  don: "#2D7D73",
  ceo: "#6BAF92",
  cfo: "#D4A017",
  quality_lead: "#C4704A",
  whs_lead: "#8B5CF6",
  hr_manager: "#3B82F6",
  team_leader: "#4B5563", // gray-600
};

function getRoleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getRoleColor(role: string): string {
  return ROLE_COLORS[role] ?? "#6B7280";
}

function getRoleInitial(role: string): string {
  const label = ROLE_LABELS[role];
  if (label) return label.charAt(0);
  return role.charAt(0).toUpperCase();
}

// ── Role Avatar ──────────────────────────────────────────────────

function RoleAvatar({ role, size = "md" }: { role: string; size?: "sm" | "md" }) {
  const color = getRoleColor(role);
  const dims = size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs";

  return (
    <div
      className={`${dims} rounded-full flex items-center justify-center font-bold text-white shrink-0`}
      style={{ backgroundColor: color }}
    >
      {getRoleInitial(role)}
    </div>
  );
}

// ── Timestamp formatter ──────────────────────────────────────────

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return d.toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}

// ── Main Component ───────────────────────────────────────────────

export default function OperationalThread({
  object_type,
  object_id,
  facility_id,
  current_user_role,
  visible_to_roles,
  initial_comments = [],
}: OperationalThreadProps) {
  const [comments, setComments] = useState<ThreadComment[]>(initial_comments);
  const [expanded, setExpanded] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const unresolvedCount = comments.filter((c) => !c.resolved).length;
  const totalCount = comments.length;

  // ── Add note ─────────────────────────────────────────────────

  async function handleAddNote() {
    const content = newNote.trim();
    if (!content || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facility_id,
          object_type,
          object_id,
          author_role: current_user_role,
          content,
        }),
      });

      const data = await res.json();
      if (data.thread) {
        setComments((prev) => [...prev, data.thread]);
        setNewNote("");
      }
    } catch (err) {
      console.error("[OperationalThread] Failed to add note:", err);
    } finally {
      setSubmitting(false);
    }
  }

  // ── Resolve comment ──────────────────────────────────────────

  async function handleResolve(commentId: string) {
    try {
      const res = await fetch(`/api/threads/${commentId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.success) {
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? { ...c, resolved: true } : c))
        );
      }
    } catch (err) {
      console.error("[OperationalThread] Failed to resolve:", err);
    }
  }

  // ── Visible roles label ──────────────────────────────────────

  const visibleLabel = visible_to_roles
    .map((r) => getRoleLabel(r))
    .join(", ");

  // ── Render ───────────────────────────────────────────────────

  return (
    <div className="border border-[#E5E7EB] rounded-xl bg-white overflow-hidden">
      {/* Toggle header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#F9FAFB] transition-colors"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#6B7280]" />
          <span className="text-sm font-medium text-[#374151]">
            {totalCount === 0 ? "Add a note" : `${totalCount} note${totalCount !== 1 ? "s" : ""}`}
          </span>
          {unresolvedCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#C4704A] text-white text-[10px] font-bold">
              {unresolvedCount}
            </span>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-[#9CA3AF]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#9CA3AF]" />
        )}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-[#E5E7EB] px-4 py-3 space-y-3">
          {/* Comments list */}
          {comments.length > 0 && (
            <div className="space-y-2">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`flex gap-3 ${comment.resolved ? "opacity-50" : ""}`}
                >
                  <RoleAvatar role={comment.author_role} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: getRoleColor(comment.author_role) }}
                      >
                        {getRoleLabel(comment.author_role)}
                      </span>
                      <span className="text-[10px] text-[#9CA3AF]">
                        {formatTimestamp(comment.created_at)}
                      </span>
                      {comment.resolved && (
                        <CheckCircle className="w-3.5 h-3.5 text-[#2D7D73]" />
                      )}
                    </div>
                    <p
                      className={`text-sm text-[#374151] mt-0.5 ${
                        comment.resolved ? "line-through" : ""
                      }`}
                    >
                      {comment.content}
                    </p>
                    {!comment.resolved && (
                      <button
                        onClick={() => handleResolve(comment.id)}
                        className="text-[10px] text-[#6B7280] hover:text-[#2D7D73] mt-1 transition-colors"
                      >
                        Mark resolved
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add note input */}
          <div className="flex gap-3">
            <RoleAvatar role={current_user_role} size="sm" />
            <div className="flex-1">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                rows={2}
                className="w-full text-sm border border-[#E5E7EB] rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-[#2D7D73] focus:border-[#2D7D73] placeholder:text-[#9CA3AF]"
              />
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] text-[#9CA3AF]">
                  Visible to {visibleLabel}
                </span>
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim() || submitting}
                  className="text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg transition-colors"
                >
                  {submitting ? "Adding..." : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
