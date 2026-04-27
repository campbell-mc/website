"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, AlertTriangle, CheckCircle, Clock, FileText } from "lucide-react";

interface CorrectiveAction {
  id: string;
  title: string;
  status: "open" | "in_progress" | "overdue" | "closed";
  category: string;
  dueDate: string;
  assignedTo: string;
  description: string;
}

const ACTIONS: CorrectiveAction[] = [
  { id: "CA-2026-001", title: "Infection control — hand hygiene audit", status: "closed", category: "Clinical", dueDate: "15 Feb 2026", assignedTo: "Quality Lead", description: "Hand hygiene compliance below 85% threshold. Staff retraining completed." },
  { id: "CA-2026-002", title: "Falls prevention — bathroom rails Wing A", status: "closed", category: "WHS", dueDate: "28 Feb 2026", assignedTo: "Facility Manager", description: "3 falls in Wing A bathrooms. Additional grab rails installed." },
  { id: "CA-2026-003", title: "Medication management — storage temperatures", status: "in_progress", category: "Clinical", dueDate: "15 Apr 2026", assignedTo: "Quality Lead", description: "Medication fridge temperature logs showing gaps. New digital monitoring being installed." },
  { id: "CA-2026-004", title: "Medication management — PRN protocols", status: "open", category: "Clinical", dueDate: "28 Apr 2026", assignedTo: "Clinical Director", description: "PRN administered without documented assessment on 3 occasions. Protocol review underway." },
  { id: "CA-2026-005", title: "SIRS reporting — notification timeliness", status: "overdue", category: "Governance", dueDate: "5 Apr 2026", assignedTo: "DON", description: "2 SIRS Cat 2 notifications submitted late. Root cause: manual process delays." },
  { id: "CA-2026-006", title: "Workforce training — manual handling", status: "overdue", category: "WHS", dueDate: "1 Apr 2026", assignedTo: "HR Manager", description: "12 staff overdue for manual handling refresher. Training sessions being scheduled." },
];

const STATUS_STYLES: Record<string, { dot: string; label: string }> = {
  open: { dot: "bg-muted-foreground/40", label: "Open" },
  in_progress: { dot: "bg-[hsl(var(--brand-amber))]", label: "In Progress" },
  overdue: { dot: "bg-[hsl(var(--brand-terracotta))]", label: "Overdue" },
  closed: { dot: "bg-[hsl(var(--brand-teal))]", label: "Closed" },
};

export default function CorrectiveActionsPage() {
  const router = useRouter();
  const overdue = ACTIONS.filter((a) => a.status === "overdue").length;
  const open = ACTIONS.filter((a) => a.status === "open" || a.status === "in_progress").length;
  const closed = ACTIONS.filter((a) => a.status === "closed").length;

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-5">
        <button onClick={() => router.push("/dashboard/governance")} className="p-1 -ml-1 hover:bg-muted rounded-lg">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Corrective Actions</p>
          <p className="text-[10px] text-muted-foreground">Mt Gib Gardens Bowral · {ACTIONS.length} total actions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-[hsl(var(--brand-terracotta))]">{overdue}</p>
          <p className="text-[10px] text-muted-foreground">Overdue</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-[hsl(var(--brand-amber))]">{open}</p>
          <p className="text-[10px] text-muted-foreground">Open</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-[hsl(var(--brand-teal))]">{closed}</p>
          <p className="text-[10px] text-muted-foreground">Closed</p>
        </div>
      </div>

      {/* Overdue first */}
      {overdue > 0 && (
        <>
          <p className="text-[11px] font-semibold text-[hsl(var(--brand-terracotta))] uppercase tracking-[0.08em] mb-2">Overdue</p>
          <div className="bg-card rounded-xl border border-border overflow-hidden mb-4">
            {ACTIONS.filter((a) => a.status === "overdue").map((action, i, arr) => (
              <button
                key={action.id}
                onClick={() => router.push(`/dashboard/governance/corrective-actions/${action.id}`)}
                className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${i < arr.length - 1 ? "border-b border-border" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-[hsl(var(--brand-terracotta))] shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-foreground">{action.title}</p>
                      <span className="text-[10px] text-[hsl(var(--brand-terracotta))] shrink-0">Due {action.dueDate}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{action.description}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{action.id} · {action.category} · {action.assignedTo}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Open / In Progress */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Active</p>
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-4">
        {ACTIONS.filter((a) => a.status === "open" || a.status === "in_progress").map((action, i, arr) => {
          const style = STATUS_STYLES[action.status];
          return (
            <button
              key={action.id}
              onClick={() => router.push(`/dashboard/governance/corrective-actions/${action.id}`)}
              className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${i < arr.length - 1 ? "border-b border-border" : ""}`}
            >
              <div className="flex items-start gap-3">
                <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${style.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-foreground">{action.title}</p>
                    <span className="text-[10px] text-muted-foreground shrink-0">Due {action.dueDate}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{action.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{action.id} · {action.category} · {action.assignedTo}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Closed */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Closed</p>
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-8">
        {ACTIONS.filter((a) => a.status === "closed").map((action, i, arr) => (
          <div key={action.id} className={`px-4 py-3 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-[hsl(var(--brand-teal))] shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground">{action.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{action.id} · {action.category} · Closed {action.dueDate}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
