"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, AlertTriangle, CheckCircle, MessageSquare, FileText } from "lucide-react";
import { mt_gib_home_care } from "@/lib/seed-data";

const metrics = mt_gib_home_care.combined.metrics;

interface Complaint {
  id: string;
  subject: string;
  client: string;
  status: "open" | "investigating" | "resolved";
  lodgedDate: string;
  category: string;
  description: string;
  daysOpen: number;
}

const COMPLAINTS: Complaint[] = [
  { id: "FB-HC-001", subject: "Missed visit — no notification", client: "Margaret T.", status: "investigating", lodgedDate: "8 Apr 2026", category: "Service Delivery", description: "Worker did not attend scheduled PM visit. Client was not notified of change. Family contacted office next morning.", daysOpen: 5 },
  { id: "FB-HC-002", subject: "Worker punctuality — morning visits", client: "Ronald S.", status: "open", lodgedDate: "11 Apr 2026", category: "Service Delivery", description: "Morning visits consistently arriving 30-45 min late for last 2 weeks. Client medication schedule being disrupted.", daysOpen: 2 },
  { id: "FB-HC-003", subject: "Communication gap — care plan change", client: "Dorothy M.", status: "investigating", lodgedDate: "5 Apr 2026", category: "Communication", description: "Family not informed of care plan changes following hospital discharge. New medication regime not communicated to visiting workers.", daysOpen: 8 },
  { id: "FB-HC-004", subject: "Service quality — cleaning standard", client: "James W.", status: "resolved", lodgedDate: "25 Mar 2026", category: "Service Quality", description: "Domestic assistance not meeting expected standard. Supervisor visit and retraining completed.", daysOpen: 0 },
  { id: "FB-HC-005", subject: "Billing query — statement discrepancy", client: "Evelyn K.", status: "resolved", lodgedDate: "28 Mar 2026", category: "Financial", description: "Quarterly statement showing services not delivered. Adjustment processed and new statement issued.", daysOpen: 0 },
];

const STATUS_STYLES: Record<string, { dot: string; label: string }> = {
  open: { dot: "bg-[hsl(var(--brand-terracotta))]", label: "Open" },
  investigating: { dot: "bg-[hsl(var(--brand-amber))]", label: "Investigating" },
  resolved: { dot: "bg-[hsl(var(--brand-teal))]", label: "Resolved" },
};

const SATISFACTION = [
  { label: "Very Satisfied", pct: 42, color: "#2D7D73" },
  { label: "Satisfied", pct: 35, color: "#4A9E8E" },
  { label: "Neutral", pct: 14, color: "#D4A017" },
  { label: "Dissatisfied", pct: 7, color: "#C4704A" },
  { label: "Very Dissatisfied", pct: 2, color: "#A0522D" },
];

export default function HCFeedbackPage() {
  const router = useRouter();
  const open = COMPLAINTS.filter((c) => c.status !== "resolved");
  const overdue = open.filter((c) => c.daysOpen > 7);

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-5">
        <button onClick={() => router.push("/dashboard/home-care/clients")} className="p-1 -ml-1 hover:bg-muted rounded-lg">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Feedback & Complaints</p>
          <p className="text-[10px] text-muted-foreground">Mt Gib Home Care Southern Highlands</p>
        </div>
      </div>

      {/* Regulatory context */}
      <div className="bg-card rounded-xl p-3 border border-border mb-5">
        <div className="flex items-start gap-2">
          <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            <span className="font-semibold">Support at Home — Feedback requirements:</span> All complaints must be acknowledged within 24 hours and resolved within 14 days. Patterns must be documented and actioned. Escalation to Aged Care Quality & Safety Commission required for unresolved complaints beyond 21 days.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-xl font-bold text-[hsl(var(--brand-amber))]">{open.length}</p>
          <p className="text-[9px] text-muted-foreground">Open</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-xl font-bold text-[hsl(var(--brand-terracotta))]">{overdue.length}</p>
          <p className="text-[9px] text-muted-foreground">Overdue (&gt;7d)</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-xl font-bold text-[hsl(var(--brand-teal))]">{COMPLAINTS.filter((c) => c.status === "resolved").length}</p>
          <p className="text-[9px] text-muted-foreground">Resolved (30d)</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-xl font-bold text-foreground">77%</p>
          <p className="text-[9px] text-muted-foreground">Satisfaction</p>
        </div>
      </div>

      {/* Client Satisfaction */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Client satisfaction — last survey</p>
      <div className="bg-card rounded-xl border border-border p-4 mb-5">
        {SATISFACTION.map((s) => (
          <div key={s.label} className="flex items-center gap-3 mb-2 last:mb-0">
            <span className="text-[10px] text-muted-foreground w-28 shrink-0">{s.label}</span>
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
            </div>
            <span className="text-[10px] font-medium text-foreground w-8 text-right">{s.pct}%</span>
          </div>
        ))}
      </div>

      {/* Open complaints */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Open complaints</p>
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-4">
        {COMPLAINTS.filter((c) => c.status !== "resolved").map((complaint, i, arr) => {
          const style = STATUS_STYLES[complaint.status];
          return (
            <div key={complaint.id} className={`px-4 py-3 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
              <div className="flex items-start gap-3">
                <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${style.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-xs font-medium text-foreground">{complaint.subject}</p>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                      complaint.daysOpen > 7 ? "bg-[hsl(var(--brand-terracotta)/0.1)] text-[hsl(var(--brand-terracotta))]" :
                      "bg-[hsl(var(--brand-amber)/0.1)] text-[hsl(var(--brand-amber))]"
                    }`}>
                      {complaint.daysOpen}d open
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{complaint.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{complaint.id} · {complaint.client} · {complaint.category} · {complaint.lodgedDate}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recently resolved */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Recently resolved</p>
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-8">
        {COMPLAINTS.filter((c) => c.status === "resolved").map((complaint, i, arr) => (
          <div key={complaint.id} className={`flex items-center gap-3 px-4 py-3 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
            <CheckCircle className="w-4 h-4 text-[hsl(var(--brand-teal))] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground">{complaint.subject}</p>
              <p className="text-[10px] text-muted-foreground">{complaint.client} · {complaint.category} · {complaint.lodgedDate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
