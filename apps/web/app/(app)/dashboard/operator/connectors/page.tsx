"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Activity, CheckCircle, AlertTriangle, Clock, RefreshCw, Server } from "lucide-react";

interface Connector {
  id: string;
  name: string;
  provider: string;
  facility: string;
  type: string;
  status: "healthy" | "warning" | "stale" | "error";
  lastSync: string;
  recordsProcessed: number;
  errorRate: number;
}

const CONNECTORS: Connector[] = [
  { id: "CON-001", name: "Deputy → Rostering", provider: "Mt Gib Gardens", facility: "Mt Gib Gardens Bowral", type: "rostering", status: "healthy", lastSync: "12 min ago", recordsProcessed: 1247, errorRate: 0 },
  { id: "CON-002", name: "ELMO → HR/Training", provider: "Mt Gib Gardens", facility: "Mt Gib Gardens Bowral", type: "workforce", status: "healthy", lastSync: "15 min ago", recordsProcessed: 892, errorRate: 0.1 },
  { id: "CON-003", name: "Leecare → Clinical", provider: "Mt Gib Gardens", facility: "Mt Gib Gardens Bowral", type: "clinical", status: "healthy", lastSync: "8 min ago", recordsProcessed: 3401, errorRate: 0 },
  { id: "CON-004", name: "RiskMan → Incidents", provider: "Mt Gib Gardens", facility: "Mt Gib Gardens Bowral", type: "incidents", status: "healthy", lastSync: "20 min ago", recordsProcessed: 156, errorRate: 0 },
  { id: "CON-005", name: "Deputy → Rostering", provider: "Southern Cross Aged Care", facility: "Southern Cross Manly", type: "rostering", status: "warning", lastSync: "1.5h ago", recordsProcessed: 743, errorRate: 2.1 },
  { id: "CON-006", name: "ELMO → HR/Training", provider: "Southern Cross Aged Care", facility: "Southern Cross Manly", type: "workforce", status: "warning", lastSync: "2h ago", recordsProcessed: 412, errorRate: 3.8 },
  { id: "CON-007", name: "Deputy → Visits", provider: "Pacific Blue Care Group", facility: "Pacific Blue Liverpool", type: "rostering", status: "stale", lastSync: "4h ago", recordsProcessed: 2104, errorRate: 0 },
  { id: "CON-008", name: "AlayaCare → Clinical", provider: "Pacific Blue Care Group", facility: "Pacific Blue Liverpool", type: "clinical", status: "error", lastSync: "6h ago", recordsProcessed: 0, errorRate: 100 },
];

const STATUS_CONFIG: Record<string, { dot: string; icon: React.ReactNode; label: string }> = {
  healthy: { dot: "bg-[hsl(var(--brand-teal))]", icon: <CheckCircle className="w-4 h-4 text-[hsl(var(--brand-teal))]" />, label: "Healthy" },
  warning: { dot: "bg-[hsl(var(--brand-amber))]", icon: <Clock className="w-4 h-4 text-[hsl(var(--brand-amber))]" />, label: "Warning" },
  stale: { dot: "bg-[hsl(var(--brand-terracotta))]", icon: <AlertTriangle className="w-4 h-4 text-[hsl(var(--brand-terracotta))]" />, label: "Stale" },
  error: { dot: "bg-red-500", icon: <AlertTriangle className="w-4 h-4 text-red-500" />, label: "Error" },
};

export default function ConnectorHealthPage() {
  const router = useRouter();
  const healthy = CONNECTORS.filter((c) => c.status === "healthy").length;
  const unhealthy = CONNECTORS.length - healthy;

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-5">
        <button onClick={() => router.push("/dashboard/operator")} className="p-1 -ml-1 hover:bg-muted rounded-lg">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Connector Health</p>
          <p className="text-[10px] text-muted-foreground">Data pipeline monitoring · {CONNECTORS.length} connectors</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-[hsl(var(--brand-teal))]">{healthy}</p>
          <p className="text-[10px] text-muted-foreground">Healthy</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-[hsl(var(--brand-amber))]">{unhealthy}</p>
          <p className="text-[10px] text-muted-foreground">Needs Attention</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{CONNECTORS.reduce((s, c) => s + c.recordsProcessed, 0).toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Records (24h)</p>
        </div>
      </div>

      {/* Unhealthy connectors first */}
      {unhealthy > 0 && (
        <>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Needs attention</p>
          <div className="bg-card rounded-xl border border-border overflow-hidden mb-5">
            {CONNECTORS.filter((c) => c.status !== "healthy").map((conn, i, arr) => {
              const config = STATUS_CONFIG[conn.status];
              return (
                <div key={conn.id} className={`px-4 py-3 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {config.icon}
                      <div>
                        <p className="text-sm font-medium text-foreground">{conn.name}</p>
                        <p className="text-[10px] text-muted-foreground">{conn.provider} · {conn.facility}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground">Last sync: {conn.lastSync}</p>
                        {conn.errorRate > 0 && <p className="text-[10px] text-[hsl(var(--brand-terracotta))]">{conn.errorRate}% error rate</p>}
                      </div>
                      <button className="p-1.5 hover:bg-muted rounded-lg" title="Retry sync">
                        <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Healthy connectors */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Healthy</p>
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-8">
        {CONNECTORS.filter((c) => c.status === "healthy").map((conn, i, arr) => (
          <div key={conn.id} className={`px-4 py-3 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[hsl(var(--brand-teal))]" />
                <div>
                  <p className="text-sm font-medium text-foreground">{conn.name}</p>
                  <p className="text-[10px] text-muted-foreground">{conn.provider} · {conn.facility}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground">Synced {conn.lastSync}</p>
                <p className="text-[10px] text-muted-foreground">{conn.recordsProcessed.toLocaleString()} records</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
