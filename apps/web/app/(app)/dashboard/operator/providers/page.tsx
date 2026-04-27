"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Users, Shield, Activity, CheckCircle, AlertTriangle, Settings } from "lucide-react";

interface Facility {
  id: string;
  name: string;
  careType: string;
  beds: number;
  connectorStatus: "healthy" | "warning" | "stale";
  lastSync: string;
  agents: number;
  agentsActive: number;
}

const PROVIDERS = [
  {
    id: "PRV-001",
    name: "Mt Gib Gardens",
    status: "healthy" as const,
    facilities: [
      { id: "FAC-001", name: "Mt Gib Gardens Bowral", careType: "Residential", beds: 120, connectorStatus: "healthy" as const, lastSync: "12 min ago", agents: 6, agentsActive: 6 },
      { id: "FAC-002", name: "Mt Gib Gardens Moss Vale", careType: "Residential", beds: 85, connectorStatus: "healthy" as const, lastSync: "15 min ago", agents: 6, agentsActive: 6 },
      { id: "FAC-005", name: "Mt Gib Home Care Southern Highlands", careType: "Home Care", beds: 247, connectorStatus: "healthy" as const, lastSync: "8 min ago", agents: 5, agentsActive: 5 },
      { id: "FAC-007", name: "Mt Gib NDIS Services", careType: "NDIS", beds: 64, connectorStatus: "healthy" as const, lastSync: "20 min ago", agents: 4, agentsActive: 4 },
    ],
  },
  {
    id: "PRV-002",
    name: "Southern Cross Aged Care",
    status: "warning" as const,
    facilities: [
      { id: "FAC-010", name: "Southern Cross Bondi", careType: "Residential", beds: 95, connectorStatus: "healthy" as const, lastSync: "30 min ago", agents: 6, agentsActive: 5 },
      { id: "FAC-011", name: "Southern Cross Manly", careType: "Residential", beds: 110, connectorStatus: "warning" as const, lastSync: "1.5h ago", agents: 6, agentsActive: 4 },
    ],
  },
];

const CONNECTOR_DOT: Record<string, string> = {
  healthy: "bg-[hsl(var(--brand-teal))]",
  warning: "bg-[hsl(var(--brand-amber))]",
  stale: "bg-[hsl(var(--brand-terracotta))]",
};

export default function ProvidersPage() {
  const router = useRouter();

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-5">
        <button onClick={() => router.push("/dashboard/operator")} className="p-1 -ml-1 hover:bg-muted rounded-lg">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">All Providers</p>
          <p className="text-[10px] text-muted-foreground">{PROVIDERS.length} providers · {PROVIDERS.reduce((s, p) => s + p.facilities.length, 0)} facilities</p>
        </div>
      </div>

      {PROVIDERS.map((provider) => (
        <div key={provider.id} className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-2 h-2 rounded-full ${provider.status === "healthy" ? "bg-[hsl(var(--brand-teal))]" : "bg-[hsl(var(--brand-amber))]"}`} />
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">{provider.name}</p>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {provider.facilities.map((fac, i) => (
              <div key={fac.id} className={`px-4 py-3 ${i < provider.facilities.length - 1 ? "border-b border-border" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${CONNECTOR_DOT[fac.connectorStatus]}`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{fac.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {fac.careType} · {fac.beds} {fac.careType === "Home Care" ? "clients" : fac.careType === "NDIS" ? "participants" : "beds"} · {fac.agentsActive}/{fac.agents} agents active
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-muted-foreground">Synced {fac.lastSync}</span>
                    <button className="p-1.5 hover:bg-muted rounded-lg">
                      <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
