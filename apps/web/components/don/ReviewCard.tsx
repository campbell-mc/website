"use client";

import { useState } from "react";
import { DeadlineCountdown } from "./DeadlineCountdown";

interface DONReviewItem {
  id: string;
  facilityId: string;
  createdAt: string;
  itemType: string;
  urgency: "immediate" | "urgent" | "routine";
  summary: string;
  fullContext: Record<string, unknown>;
  chrisRecommendation: string | null;
  deadline: string | null;
  status: string;
}

interface ReviewCardProps {
  item: DONReviewItem;
  onApprove: (itemId: string, note?: string) => Promise<void>;
  onModify: (itemId: string, modifications: Record<string, unknown>, note: string) => Promise<void>;
  onReject: (itemId: string, note: string) => Promise<void>;
}

const URGENCY_STYLES = {
  immediate: {
    border: "border-l-4 border-l-red-500",
    badge: "bg-red-100 text-red-800",
    label: "IMMEDIATE",
  },
  urgent: {
    border: "border-l-4 border-l-[#D4A017]",
    badge: "bg-amber-100 text-amber-800",
    label: "URGENT",
  },
  routine: {
    border: "border-l-4 border-l-[#2D7D73]",
    badge: "bg-teal-100 text-teal-800",
    label: "ROUTINE",
  },
};

const ITEM_TYPE_LABELS: Record<string, string> = {
  sirs_classification: "SIRS Report",
  care_minutes_breach: "Care Minutes",
  rn_coverage_response: "RN Coverage",
  welfare_escalation: "Welfare",
  pack_approval: "Pack Approval",
  regulatory_correspondence: "Regulatory",
};

export function ReviewCard({ item, onApprove, onModify, onReject }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showModify, setShowModify] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const style = URGENCY_STYLES[item.urgency];
  const typeLabel = ITEM_TYPE_LABELS[item.itemType] ?? item.itemType;

  async function handleApprove() {
    setLoading(true);
    await onApprove(item.id, note || undefined);
    setLoading(false);
    setShowConfirm(false);
  }

  async function handleModify() {
    setLoading(true);
    await onModify(item.id, {}, note);
    setLoading(false);
    setShowModify(false);
  }

  async function handleReject() {
    setLoading(true);
    await onReject(item.id, note);
    setLoading(false);
    setShowReject(false);
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm ${style.border} mb-3`}>
      {/* Collapsed view — always visible */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${style.badge}`}>
              {style.label}
            </span>
            <span className="text-xs text-gray-500">{typeLabel}</span>
          </div>
          <DeadlineCountdown deadline={item.deadline} />
        </div>

        <p className="text-sm font-medium text-gray-900 mb-1">{item.summary}</p>

        {item.chrisRecommendation && (
          <p className="text-xs text-gray-600 italic">
            CHRIS: {item.chrisRecommendation}
          </p>
        )}

        {/* Action buttons — always visible */}
        <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowConfirm(true)}
            className="flex-1 py-3 rounded-lg text-white font-medium text-sm"
            style={{ background: "var(--forest, #1B4332)", minHeight: "44px" }}
            disabled={loading}
          >
            {loading ? "..." : "APPROVE"}
          </button>
          <button
            onClick={() => { setExpanded(true); setShowModify(true); }}
            className="flex-1 py-3 rounded-lg font-medium text-sm border-2"
            style={{ borderColor: "var(--forest, #1B4332)", color: "var(--forest, #1B4332)", minHeight: "44px" }}
            disabled={loading}
          >
            MODIFY
          </button>
        </div>
      </div>

      {/* Expanded view */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3">
          {/* Full context */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3 max-h-60 overflow-y-auto">
            <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase">Full Context</h4>
            <pre className="text-xs text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(item.fullContext, null, 2)}
            </pre>
          </div>

          {/* Reject option (expanded only, secondary) */}
          {!showReject ? (
            <button
              onClick={() => setShowReject(true)}
              className="text-xs text-gray-400 underline"
            >
              Reject this item...
            </button>
          ) : (
            <div className="bg-red-50 rounded-lg p-3">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Reason for rejection (min 20 characters)..."
                className="w-full p-2 text-sm border rounded-lg mb-2 min-h-[60px]"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleReject}
                  disabled={note.length < 20 || loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium disabled:opacity-40"
                >
                  CONFIRM REJECTION
                </button>
                <button
                  onClick={() => { setShowReject(false); setNote(""); }}
                  className="px-4 py-2 text-gray-500 text-sm"
                >
                  Cancel
                </button>
              </div>
              {note.length > 0 && note.length < 20 && (
                <p className="text-xs text-red-500 mt-1">
                  {20 - note.length} more characters required
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Approve confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--forest)" }}>
              Confirm Approval
            </h3>
            <p className="text-sm text-gray-600 mb-4">{item.summary}</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note..."
              className="w-full p-2 text-sm border rounded-lg mb-4 min-h-[40px]"
            />
            <div className="flex gap-2">
              <button
                onClick={handleApprove}
                disabled={loading}
                className="flex-1 py-3 rounded-lg text-white font-medium"
                style={{ background: "var(--forest)", minHeight: "44px" }}
              >
                {loading ? "Approving..." : "CONFIRM"}
              </button>
              <button
                onClick={() => { setShowConfirm(false); setNote(""); }}
                className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-600"
                style={{ minHeight: "44px" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modify form modal */}
      {showModify && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--forest)" }}>
              Modify & Submit
            </h3>
            <p className="text-sm text-gray-600 mb-3">{item.summary}</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What did you change and why? (required)"
              className="w-full p-2 text-sm border rounded-lg mb-4 min-h-[80px]"
            />
            <div className="flex gap-2">
              <button
                onClick={handleModify}
                disabled={!note || loading}
                className="flex-1 py-3 rounded-lg text-white font-medium disabled:opacity-40"
                style={{ background: "var(--forest)", minHeight: "44px" }}
              >
                {loading ? "Submitting..." : "SUBMIT MODIFIED"}
              </button>
              <button
                onClick={() => { setShowModify(false); setNote(""); }}
                className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-600"
                style={{ minHeight: "44px" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
