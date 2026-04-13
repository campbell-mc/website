"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Users, Phone, AlertTriangle, Calendar, Mail, FileText } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { resident_intelligence, facility } from "@/lib/seed-data";

const fe = resident_intelligence.family_engagement;

export default function FamilyEngagementPage() {
  const router = useRouter();

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button data-has-handler="true" onClick={() => router.push("/dashboard/residents")} className="p-1 -ml-1 hover:bg-muted rounded-lg">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Family Engagement</p>
            <p className="text-[10px] text-muted-foreground">{facility.name} · {fe.total_registered_contacts} registered family contacts</p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {[
          { value: `${Math.round(fe.engagement_rate * 100)}%`, label: "Engagement rate", color: fe.engagement_rate >= 0.7 ? "text-[hsl(var(--brand-teal))]" : "text-[hsl(var(--brand-amber))]" },
          { value: fe.residents_no_contact_30d.toString(), label: "No contact 30d", color: "text-[hsl(var(--brand-amber))]" },
          { value: fe.residents_no_contact_90d.toString(), label: "No contact 90d+", color: fe.residents_no_contact_90d > 0 ? "text-[hsl(var(--brand-terracotta))]" : "text-[hsl(var(--brand-teal))]" },
          { value: fe.care_review_invitations_sent.toString(), label: "Review invitations", color: "text-foreground" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl p-4 border border-border text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[8px] text-muted-foreground leading-tight mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* CHRIS insight */}
      <div className="rounded-xl p-5 mb-5" style={{ background: "rgba(27,67,50,0.05)" }}>
        <div className="flex items-start gap-3">
          <ChrisAvatar size="small" showGlow className="shrink-0 mt-0.5" />
          <p className="text-sm text-foreground leading-relaxed font-serif-accent">
            {fe.residents_no_contact_90d} residents have had no documented family contact in over 90 days. Proactive outreach to these families is important — both for the resident&apos;s emotional wellbeing and to demonstrate ongoing engagement under Quality Standard 2. Two of these residents are in dementia wings where Resident Voice scores are declining, making family connection even more critical as a proxy for resident experience.
          </p>
        </div>
      </div>

      {/* Low engagement detail */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">No family contact 90+ days</p>
      {fe.no_contact_detail.map((r) => (
        <div key={r.wing} className="bg-card rounded-xl p-4 border border-border border-l-4 border-l-[hsl(var(--brand-terracotta))] mb-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[hsl(var(--brand-terracotta))] shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground mb-1">{r.wing}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                {r.days_since_contact} days since last documented family contact
              </p>
              <div className="flex gap-2">
                <button data-has-handler="true" onClick={() => router.push("/dashboard/residents/families")} className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Log outreach
                </button>
                <button data-has-handler="true" onClick={() => router.push("/dashboard/residents/families")} className="text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">Flag for social worker</button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Care review participation */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2 mt-5">Care review family participation</p>
      <div className="bg-card rounded-xl p-4 border border-border mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">{fe.care_review_family_participated} of {fe.care_review_invitations_sent} families participated in care reviews this month</p>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-2 mb-2">
          <div className="bg-[hsl(var(--brand-forest))] rounded-full h-2" style={{ width: `${(fe.care_review_family_participated / fe.care_review_invitations_sent) * 100}%` }} />
        </div>
        {fe.care_review_family_not_invited > 0 && (
          <div className="flex items-start gap-2 mt-2 p-2.5 rounded-lg bg-[hsl(var(--brand-amber)/0.06)]">
            <AlertTriangle className="w-3.5 h-3.5 text-[hsl(var(--brand-amber))] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[hsl(var(--brand-amber))]">
              {fe.care_review_family_not_invited} care review completed without family invitation. Quality Standard 2 requires consumer and representative involvement in care planning.
            </p>
          </div>
        )}
      </div>

      {/* Communication log */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Recent communication log</p>
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-5">
        {[
          { date: "8 Apr 2026", type: "Phone call", wing: "Grevillea Wing", note: "Family updated on care plan review outcomes. Discussed social activities." },
          { date: "5 Apr 2026", type: "Email", wing: "Wattle Wing", note: "Monthly update sent. Family acknowledged receipt, no concerns raised." },
        ].map((entry) => (
          <div key={`${entry.date}-${entry.wing}`} className="px-4 py-3 border-b border-border last:border-b-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {entry.type === "Phone call" ? <Phone className="w-3 h-3 text-muted-foreground" /> : <Mail className="w-3 h-3 text-muted-foreground" />}
                <span className="text-xs font-medium text-foreground">{entry.type} — {entry.wing}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">{entry.date}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{entry.note}</p>
          </div>
        ))}
      </div>

      {/* Monthly family update */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Monthly family update</p>
      <div className="bg-card rounded-xl p-4 border border-border mb-16">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium text-foreground">April 2026 family update</p>
              <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${fe.monthly_update_status === "draft_ready" ? "bg-[hsl(var(--brand-teal)/0.1)] text-[hsl(var(--brand-teal))]" : "bg-muted text-muted-foreground"}`}>
                {fe.monthly_update_status === "draft_ready" ? "Draft ready" : fe.monthly_update_status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              CHRIS has prepared a draft monthly family communication covering facility activities, staffing updates, and seasonal reminders. Review and send to {fe.total_registered_contacts} registered contacts.
            </p>
            <div className="flex gap-2">
              <button data-has-handler="true" onClick={() => router.push("/dashboard/residents/families")} className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Review draft</button>
              <button data-has-handler="true" onClick={() => router.push("/dashboard/residents/families")} className="text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">Edit before sending</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
