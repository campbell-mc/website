"use client";

import { useRouter } from "next/navigation";
import { Shield, Users, Activity, AlertTriangle, CheckCircle, Server, ChevronRight } from "lucide-react";

interface Provider {
  id: string;
  name: string;
  facilities: number;
  status: "healthy" | "warning" | "critical";
  connectors: number;
  connectorsHealthy: number;
  lastSync: string;
}

const PROVIDERS: Provider[] = [
  { id: "PRV-001", name: "Knights of the Holy Grail", facilities: 4, status: "healthy", connectors: 6, connectorsHealthy: 6, lastSync: "12 min ago" },
  { id: "PRV-002", name: "Southern Cross Aged Care", facilities: 8, status: "warning", connectors: 8, connectorsHealthy: 6, lastSync: "45 min ago" },
  { id: "PRV-003", name: "Bright Horizons Living", facilities: 3, status: "healthy", connectors: 4, connectorsHealthy: 4, lastSync: "8 min ago" },
  { id: "PRV-004", name: "Pacific Blue Care Group", facilities: 12, status: "critical", connectors: 12, connectorsHealthy: 8, lastSync: "3h ago" },
];

const STATUS_STYLES: Record<string, { dot: string; label: string }> = {
  healthy: { dot: "bg-[hsl(var(--brand-teal))]", label: "Healthy" },
  warning: { dot: "bg-[hsl(var(--brand-amber))]", label: "Warning" },
  critical: { dot: "bg-[hsl(var(--brand-terracotta))]", label: "Critical" },
};

export default function OperatorDashboardPage() {
  const router = useRouter();

  const totalFacilities = PROVIDERS.reduce((sum, p) => sum + p.facilities, 0);
  const totalConnectors = PROVIDERS.reduce((sum, p) => sum + p.connectors, 0);
  const healthyConnectors = PROVIDERS.reduce((sum, p) => sum + p.connectorsHealthy, 0);
  const healthyProviders = PROVIDERS.filter((p) => p.status === "healthy").length;

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <div className="mb-5">
        <h1 className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Operator Dashboard</h1>
        <p className="text-[10px] text-muted-foreground">CHRIS-OS platform operations · {PROVIDERS.length} providers</p>
      </div>

      {/* Platform stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Providers", value: PROVIDERS.length, icon: Users, color: "text-foreground" },
          { label: "Facilities", value: totalFacilities, icon: Shield, color: "text-foreground" },
          { label: "Connectors", value: `${healthyConnectors}/${totalConnectors}`, icon: Server, color: healthyConnectors === totalConnectors ? "text-[hsl(var(--brand-teal))]" : "text-[hsl(var(--brand-amber))]" },
          { label: "Healthy", value: `${healthyProviders}/${PROVIDERS.length}`, icon: CheckCircle, color: healthyProviders === PROVIDERS.length ? "text-[hsl(var(--brand-teal))]" : "text-[hsl(var(--brand-amber))]" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-muted-foreground">{stat.label}</span>
              <stat.icon className="w-4 h-4 text-muted-foreground/60" />
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="bg-card rounded-xl border border-border border-l-4 border-l-[hsl(var(--brand-amber))] p-4 mb-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[hsl(var(--brand-amber))] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">2 providers need attention</p>
            <p className="text-xs text-muted-foreground">Pacific Blue Care Group has 4 stale connectors (&gt;2h). Southern Cross has 2 connectors in warning state.</p>
          </div>
        </div>
      </div>

      {/* Provider list */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">All providers</p>
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-5">
        {PROVIDERS.map((provider, i) => {
          const style = STATUS_STYLES[provider.status];
          return (
            <button
              key={provider.id}
              onClick={() => router.push("/dashboard/operator/providers")}
              className={`w-full flex items-center justify-between px-4 py-4 hover:bg-muted/50 transition-colors text-left ${i < PROVIDERS.length - 1 ? "border-b border-border" : ""}`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${style.dot}`} />
                <div>
                  <p className="text-sm font-semibold text-foreground">{provider.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {provider.facilities} facilities · {provider.connectorsHealthy}/{provider.connectors} connectors · Last sync {provider.lastSync}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                  provider.status === "healthy" ? "bg-[hsl(var(--brand-teal)/0.1)] text-[hsl(var(--brand-teal))]" :
                  provider.status === "warning" ? "bg-[hsl(var(--brand-amber)/0.1)] text-[hsl(var(--brand-amber))]" :
                  "bg-[hsl(var(--brand-terracotta)/0.1)] text-[hsl(var(--brand-terracotta))]"
                }`}>{style.label}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button onClick={() => router.push("/dashboard/operator/providers")} className="bg-card rounded-xl border border-border p-4 text-left hover:bg-muted/50 transition-colors">
          <p className="text-sm font-semibold text-foreground mb-0.5">All Providers</p>
          <p className="text-[10px] text-muted-foreground">View and manage provider configurations</p>
        </button>
        <button onClick={() => router.push("/dashboard/operator/connectors")} className="bg-card rounded-xl border border-border p-4 text-left hover:bg-muted/50 transition-colors">
          <p className="text-sm font-semibold text-foreground mb-0.5">Connector Health</p>
          <p className="text-[10px] text-muted-foreground">Monitor data pipeline status</p>
        </button>
      </div>
    </div>
  );
}
