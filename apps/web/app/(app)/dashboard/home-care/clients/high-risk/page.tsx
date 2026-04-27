"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, AlertTriangle, ShieldAlert, Phone, MapPin, Clock, Heart } from "lucide-react";
import { mt_gib_home_care } from "@/lib/seed-data";

const metrics = mt_gib_home_care.combined.metrics;

interface HighRiskClient {
  id: string;
  name: string;
  age: number;
  service: string;
  riskLevel: "critical" | "high";
  riskFactors: string[];
  lastVisit: string;
  nextVisit: string;
  carePlanStatus: "current" | "overdue" | "review_due";
  notes: string;
}

const HIGH_RISK_CLIENTS: HighRiskClient[] = [
  { id: "HC-001", name: "Margaret T.", age: 87, service: "Camelot Home Care", riskLevel: "critical", riskFactors: ["Falls risk", "Lives alone", "Medication complexity"], lastVisit: "Today 9:30am", nextVisit: "Tomorrow 8:00am", carePlanStatus: "current", notes: "3 falls in last 6 months. OT review completed. Enhanced monitoring in place." },
  { id: "HC-015", name: "Ronald S.", age: 91, service: "Camelot Home Care", riskLevel: "critical", riskFactors: ["Cognitive decline", "Lives alone", "Carer fatigue"], lastVisit: "Today 11:00am", nextVisit: "Tomorrow 9:00am", carePlanStatus: "review_due", notes: "MMSE score declining. Primary carer (daughter) showing signs of burnout. Respite referral pending." },
  { id: "HC-023", name: "Dorothy M.", age: 84, service: "Mt Gib Home Care Southern Highlands", riskLevel: "high", riskFactors: ["Diabetes management", "Vision impairment"], lastVisit: "Yesterday 2:00pm", nextVisit: "Today 3:00pm", carePlanStatus: "current", notes: "BSL levels unstable this week. Endocrinologist appointment booked for 18 Apr." },
  { id: "HC-031", name: "James W.", age: 79, service: "Mt Gib Home Care Southern Highlands", riskLevel: "high", riskFactors: ["Post-surgical", "Pain management", "Mobility limitations"], lastVisit: "Today 7:30am", nextVisit: "Today 4:00pm", carePlanStatus: "current", notes: "Hip replacement 2 weeks ago. Physio program on track. Pain medication review needed." },
  { id: "HC-044", name: "Evelyn K.", age: 92, service: "Camelot Home Care", riskLevel: "high", riskFactors: ["Nutritional risk", "Social isolation", "Falls history"], lastVisit: "Yesterday 10:00am", nextVisit: "Tomorrow 10:00am", carePlanStatus: "overdue", notes: "Weight loss 3kg in 2 months. Meal delivery service arranged. Social worker visit scheduled." },
  { id: "HC-052", name: "Arthur B.", age: 88, service: "Mt Gib Home Care Southern Highlands", riskLevel: "high", riskFactors: ["Wandering risk", "Sundowning", "Carer stress"], lastVisit: "Today 8:00am", nextVisit: "Today 5:30pm", carePlanStatus: "current", notes: "GPS tracker in place. Evening check-in calls established. Dementia support referral completed." },
];

const RISK_DOT: Record<string, string> = {
  critical: "bg-[hsl(var(--brand-terracotta))]",
  high: "bg-[hsl(var(--brand-amber))]",
};

const CARE_PLAN_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  current: { bg: "bg-[hsl(var(--brand-teal)/0.1)]", text: "text-[hsl(var(--brand-teal))]", label: "Current" },
  overdue: { bg: "bg-[hsl(var(--brand-terracotta)/0.1)]", text: "text-[hsl(var(--brand-terracotta))]", label: "Overdue" },
  review_due: { bg: "bg-[hsl(var(--brand-amber)/0.1)]", text: "text-[hsl(var(--brand-amber))]", label: "Review Due" },
};

export default function HighRiskClientsPage() {
  const router = useRouter();
  const critical = HIGH_RISK_CLIENTS.filter((c) => c.riskLevel === "critical").length;

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-5">
        <button onClick={() => router.push("/dashboard/home-care/clients")} className="p-1 -ml-1 hover:bg-muted rounded-lg">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">High Risk Clients</p>
          <p className="text-[10px] text-muted-foreground">Mt Gib Home Care · {HIGH_RISK_CLIENTS.length} clients requiring enhanced monitoring</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-[hsl(var(--brand-terracotta))]">{critical}</p>
          <p className="text-[10px] text-muted-foreground">Critical</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-[hsl(var(--brand-amber))]">{HIGH_RISK_CLIENTS.length - critical}</p>
          <p className="text-[10px] text-muted-foreground">High Risk</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{HIGH_RISK_CLIENTS.filter((c) => c.carePlanStatus !== "current").length}</p>
          <p className="text-[10px] text-muted-foreground">Plans Needing Review</p>
        </div>
      </div>

      {/* CHRIS insight */}
      <div className="bg-card rounded-xl border border-border border-l-4 border-l-[hsl(var(--brand-amber))] p-4 mb-5">
        <div className="flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-[hsl(var(--brand-amber))] shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">CHRIS Sentinel:</span> {critical} clients at critical risk level. Margaret T. and Ronald S. both live alone with multiple compounding risk factors. Recommend weekly case conference review for all critical clients.
          </p>
        </div>
      </div>

      {/* Client list */}
      {HIGH_RISK_CLIENTS.map((client) => {
        const badge = CARE_PLAN_BADGE[client.carePlanStatus];
        return (
          <div key={client.id} className="bg-card rounded-xl border border-border p-4 mb-3">
            <div className="flex items-start gap-3">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${RISK_DOT[client.riskLevel]}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{client.name}</p>
                    <span className="text-[10px] text-muted-foreground">{client.age}y</span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{client.riskLevel}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {client.riskFactors.map((rf) => (
                    <span key={rf} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{rf}</span>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed mb-2">{client.notes}</p>
                <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Last: {client.lastVisit}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Next: {client.nextVisit}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
