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
  { id: "CA-HC-001", title: "Missed visit notification — process gap", status: "overdue", category: "Service Delivery", dueDate: "5 Apr 2026", assignedTo: "Operations Manager", description: "3 missed visits without client notification in March. Process requires automated SMS when visit cancelled." },
  { id: "CA-HC-002", title: "Lone worker check-in — compliance gap", status: "in_progress", category: "WHS", dueDate: "20 Apr 2026", assignedTo: "WHS Lead", description: "12% of visits without lone worker check-in completion. App reminder system being enhanced." },
  { id: "CA-HC-003", title: "Medication administration — documentation", status: "open", category: "Clinical", dueDate: "30 Apr 2026", assignedTo: "Clinical Lead", description: "Medication administration not consistently documented in AlayaCare. Training refresh scheduled for all care workers." },
  { id: "CA-HC-004", title: "Budget statement timeliness — Q2 delays", status: "closed", category: "Financial", dueDate: "15 Mar 2026", assignedTo: "Finance Officer", description: "6 budget statements delivered late in Q2. Automated generation now in place." },
  { id: "CA-HC-005", title: "Worker screening — NDIS clearance currency", status: "closed", category: "Compliance", dueDate: "28 Feb 2026", assignedTo: "HR Manager", description: "4 staff with expired NDIS Worker Screening checks identified. All renewed and verified." },
];

const STATUS_STYLES: Record<string, { dot: string; label: string }> = {
  open: { dot: "bg-muted-foreground/40", label: "Open" },
  in_progress: { dot: "bg-[hsl(var(--brand-amber))]", label: "In Progress" },
  overdue: { dot: "bg-[hsl(var(--brand-terracotta))]", label: "Overdue" },
  closed: { dot: "bg-[hsl(var(--brand-teal))]", label: "Closed" },
};

export default function HCCorrectiveActionsPage() {
  const router = useRouter();
  const overdue = ACTIONS.filter((a) => a.status === "overdue").length;
  const active = ACTIONS.filter((a) => a.status === "open" || a.status === "in_progress").length;
  const closed = ACTIONS.filter((a) => a.status === "closed").length;

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-5">
        <button onClick={() => router.push("/dashboard/home-care/compliance")} className="p-1 -ml-1 hover:bg-muted rounded-lg">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Corrective Actions</p>
          <p className="text-[10px] text-muted-foreground">Mt Gib Home Care Southern Highlands · {ACTIONS.length} total</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-[hsl(var(--brand-terracotta))]">{overdue}</p>
          <p className="text-[10px] text-muted-foreground">Overdue</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-[hsl(var(--brand-amber))]">{active}</p>
          <p className="text-[10px] text-muted-foreground">Active</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-[hsl(var(--brand-teal))]">{closed}</p>
          <p className="text-[10px] text-muted-foreground">Closed</p>
        </div>
      </div>

      {/* Overdue */}
      {overdue > 0 && (
        <>
          <p className="text-[11px] font-semibold text-[hsl(var(--brand-terracotta))] uppercase tracking-[0.08em] mb-2">Overdue</p>
          <div className="bg-card rounded-xl border border-border overflow-hidden mb-4">
            {ACTIONS.filter((a) => a.status === "overdue").map((action, i, arr) => (
              <div key={action.id} className={`px-4 py-3 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
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
              </div>
            ))}
          </div>
        </>
      )}

      {/* Active */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Active</p>
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-4">
        {ACTIONS.filter((a) => a.status === "open" || a.status === "in_progress").map((action, i, arr) => {
          const style = STATUS_STYLES[action.status];
          return (
            <div key={action.id} className={`px-4 py-3 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
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
            </div>
          );
        })}
      </div>

      {/* Closed */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Closed</p>
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-8">
        {ACTIONS.filter((a) => a.status === "closed").map((action, i, arr) => (
          <div key={action.id} className={`flex items-center gap-3 px-4 py-3 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
            <CheckCircle className="w-4 h-4 text-[hsl(var(--brand-teal))] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground">{action.title}</p>
              <p className="text-[10px] text-muted-foreground">{action.id} · {action.category} · Closed {action.dueDate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
