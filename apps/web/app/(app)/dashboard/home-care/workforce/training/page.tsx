"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";

/* ── colours ── */
const forest = "#1B4332";
const teal = "#2D7D73";
const amber = "#D4A017";
const terracotta = "#C4704A";

/* ── Training data ── */
const trainingTypes = [
  { name: "Fire Safety", compliance: 98.9 },
  { name: "Infection Control", compliance: 97.8 },
  { name: "Personal Care", compliance: 96.6 },
  { name: "Manual Handling", compliance: 94.4 },
  { name: "Elder Abuse", compliance: 91.0 },
  { name: "Lone Worker Safety", compliance: 87.6 },
  { name: "Medication Assistance", compliance: 83.1 },
  { name: "Dementia Care", compliance: 76.4 },
  { name: "Managing Challenging Behaviour", compliance: 71.9 },
];

function complianceColor(pct: number) {
  if (pct >= 95) return teal;
  if (pct >= 85) return forest;
  if (pct >= 80) return amber;
  return terracotta;
}

export default function TrainingCompliancePage() {
  const router = useRouter();

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <button
          onClick={() => router.push("/dashboard/home-care/workforce")}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          Home Care <ChevronRight className="w-3 h-3" /> Workforce <ChevronRight className="w-3 h-3" /> Training
        </button>

        {/* Header */}
        <div>
          <h1 className="text-[28px] font-bold text-foreground">Training Compliance</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Mt Gib Gardens · Home Care · Camelot and Avalon
          </p>
        </div>

        {/* 3 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm font-medium text-muted-foreground mb-1">Overall Compliance</p>
            <p className="text-3xl font-bold" style={{ color: amber }}>88%</p>
            <p className="text-xs text-muted-foreground mt-1">mandatory training current</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm font-medium text-muted-foreground mb-1">Fully Current</p>
            <p className="text-3xl font-bold" style={{ color: teal }}>72 / 89</p>
            <p className="text-xs text-muted-foreground mt-1">workers with all modules complete</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm font-medium text-muted-foreground mb-1">Workers with Gaps</p>
            <p className="text-3xl font-bold" style={{ color: terracotta }}>17</p>
            <p className="text-xs text-muted-foreground mt-1">one or more modules overdue</p>
          </div>
        </div>

        {/* CHRIS Note */}
        <div
          className="rounded-2xl border-l-4 p-5"
          style={{
            borderColor: terracotta,
            backgroundColor: `${terracotta}08`,
          }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: terracotta }} />
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">CHRIS Intelligence Note</p>
              <p className="text-[15px] md:text-sm text-foreground leading-relaxed">
                <strong>Managing Challenging Behaviour</strong> has the lowest compliance at{" "}
                <strong>71.9%</strong>. This directly correlates with the elevated{" "}
                <strong>PSH_10 Violence &amp; Aggression</strong> domain score (2.7). Prioritising
                this training module will address both compliance gaps and psychosocial hazard exposure.
              </p>
            </div>
          </div>
        </div>

        {/* Training Types */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Mandatory Training Modules — Sorted by Compliance
          </h2>
          <div className="space-y-3">
            {[...trainingTypes].reverse().map((t) => (
              <div key={t.name} className="flex items-center gap-3">
                <span className="text-xs text-foreground w-56 shrink-0 truncate">{t.name}</span>
                <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${t.compliance}%`,
                      backgroundColor: complianceColor(t.compliance),
                    }}
                  />
                </div>
                <span
                  className="text-sm font-bold w-14 text-right"
                  style={{ color: complianceColor(t.compliance) }}
                >
                  {t.compliance}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Credentials */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Credential Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* WWVP */}
            <div className="rounded-xl bg-muted/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" style={{ color: teal }} />
                  <p className="text-sm font-semibold text-foreground">WWVP</p>
                </div>
                <p className="text-lg font-bold" style={{ color: teal }}>86 / 89</p>
              </div>
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" style={{ color: amber }} />
                <p className="text-xs" style={{ color: amber }}>
                  3 expiring within 60 days
                </p>
              </div>
            </div>
            {/* AHPRA */}
            <div className="rounded-xl bg-muted/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" style={{ color: teal }} />
                  <p className="text-sm font-semibold text-foreground">AHPRA</p>
                </div>
                <p className="text-lg font-bold" style={{ color: teal }}>12 / 12</p>
              </div>
              <p className="text-xs text-muted-foreground">All registrations current</p>
            </div>
          </div>
        </div>
    </div>
  );
}
