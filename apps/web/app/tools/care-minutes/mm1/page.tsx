"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const C = { dark: "#1a1218", dark2: "#2d1f2a", copper: "#c89a3c", copperDark: "#8b6914", cream: "#faf7f2", ink: "#f5ede3", inkDark: "#1a1218", inkMuted: "rgba(245,237,227,0.78)", inkMutedLight: "rgba(26,18,24,0.78)", good: "#2d6a4f", warn: "#b5572a", bad: "#b21f1f" };

// ── Financial model (exact per spec) ────────────────────────────────────────
const AN_ACC_PRICE = 295.64;
const BCT_DELTA_NWAU = 0.113;
const SUPPLEMENT_PRPD = AN_ACC_PRICE * BCT_DELTA_NWAU; // ~$33.41

interface Inputs {
  sites: number; beds: number; occupancy: number;
  rnMin: number; enMin: number; pcwMin: number;
  rnCost: number; enCost: number; pcwCost: number; agencyPremium: number;
  permAgencySplit: number; // % permanent (0-100)
}

const DEFAULTS: Inputs = {
  sites: 5, beds: 80, occupancy: 92,
  rnMin: 32, enMin: 18, pcwMin: 148,
  rnCost: 57, enCost: 48, pcwCost: 46, agencyPremium: 65,
  permAgencySplit: 80,
};

function compute(i: Inputs) {
  const totalTarget = 215;
  const rnTarget = 44;
  const enAllowance = Math.min(i.enMin, rnTarget * 0.10); // max 10% of RN target
  const effectiveRn = i.rnMin + enAllowance;
  const effectiveRnPct = effectiveRn / rnTarget;
  const totalMin = i.rnMin + i.enMin + i.pcwMin;
  const totalPct = totalMin / totalTarget;
  const gatingPct = Math.min(effectiveRnPct, totalPct);

  let supplementFactor: number;
  if (gatingPct >= 1) supplementFactor = 1;
  else if (gatingPct <= 0.85) supplementFactor = 0;
  else supplementFactor = (gatingPct - 0.85) / 0.15;

  const occupiedBeds = i.sites * i.beds * (i.occupancy / 100);
  const annualDays = 365;
  const maxSupplement = Math.round(SUPPLEMENT_PRPD * occupiedBeds * annualDays);
  const currentEntitlement = Math.round(SUPPLEMENT_PRPD * supplementFactor * occupiedBeds * annualDays);
  const gap = maxSupplement - currentEntitlement;

  // Diagnosis
  let diagnosis: string;
  if (gatingPct >= 1) diagnosis = "Compliant — earning full supplement";
  else if (effectiveRnPct < 1 && totalPct >= 1) diagnosis = "RN coverage problem — not a total minutes problem";
  else if (totalPct < 1 && effectiveRnPct >= 1) diagnosis = "Total minutes problem — RN is fine";
  else diagnosis = "Both targets failing";

  // Cost to hit 100%
  const extraRnNeeded = Math.max(0, rnTarget - effectiveRn);
  const extraTotalNeeded = Math.max(0, totalTarget - totalMin);
  const extraPcw = extraTotalNeeded * 0.70;
  const extraEn = extraTotalNeeded * 0.20;
  const extraRnResidual = extraTotalNeeded * 0.10 + extraRnNeeded;

  const residentDaysPerSite = i.beds * (i.occupancy / 100) * annualDays;
  const permPct = i.permAgencySplit / 100;
  const agencyMult = 1 + (i.agencyPremium / 100);

  const costPerSite = (
    ((extraRnResidual / 60) * residentDaysPerSite * (permPct * i.rnCost + (1 - permPct) * i.rnCost * agencyMult)) +
    ((extraEn / 60) * residentDaysPerSite * (permPct * i.enCost + (1 - permPct) * i.enCost * agencyMult)) +
    ((extraPcw / 60) * residentDaysPerSite * (permPct * i.pcwCost + (1 - permPct) * i.pcwCost * agencyMult))
  );
  const totalCostToTarget = Math.round(costPerSite * i.sites);
  const netImpact = gap - totalCostToTarget;

  // Scenario C: 105% (defensive headroom)
  const extra105 = totalTarget * 0.05;
  const cost105extra = Math.round((extra105 / 60) * residentDaysPerSite * i.sites * (permPct * i.pcwCost + (1 - permPct) * i.pcwCost * agencyMult));
  const totalCost105 = totalCostToTarget + cost105extra;
  const netImpact105 = gap - totalCost105;

  return {
    totalMin, effectiveRnPct: Math.round(effectiveRnPct * 100), totalPct: Math.round(totalPct * 100),
    gatingPct: Math.round(gatingPct * 100), supplementFactor: Math.round(supplementFactor * 100),
    occupiedBeds: Math.round(occupiedBeds), maxSupplement, currentEntitlement, gap, diagnosis,
    totalCostToTarget, netImpact, totalCost105, netImpact105,
    isSevere: gatingPct < 0.85, isCompliant: gatingPct >= 1,
    bindingTarget: effectiveRnPct < totalPct ? "RN" : "Total",
  };
}

function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000) return (n > 0 ? "$" : "−$") + (Math.abs(n) / 1_000_000).toFixed(1) + "M";
  if (Math.abs(n) >= 1_000) return (n > 0 ? "$" : "−$") + Math.round(Math.abs(n) / 1_000).toLocaleString() + "K";
  return "$" + Math.round(n).toLocaleString();
}

function Slider({ label, value, min, max, step, display, onChange, sublabel }: {
  label: string; value: number; min: number; max: number; step: number;
  display: string; onChange: (v: number) => void; sublabel?: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-baseline mb-1">
        <div><span className="text-[13px] font-medium" style={{ color: C.inkDark }}>{label}</span>
          {sublabel && <p className="text-[10px]" style={{ color: "rgba(26,18,24,0.4)" }}>{sublabel}</p>}
        </div>
        <span className="text-[14px] font-semibold" style={{ color: C.inkDark }}>{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full cursor-pointer" style={{ accentColor: C.copper }} />
    </div>
  );
}

export default function MM1Calculator() {
  const [inp, setInp] = useState(DEFAULTS);
  const [showEmail, setShowEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [emailName, setEmailName] = useState("");
  const [emailRole, setEmailRole] = useState("");
  const [emailOrg, setEmailOrg] = useState("");
  const set = (k: keyof Inputs) => (v: number) => setInp((p) => ({ ...p, [k]: v }));
  const r = useMemo(() => compute(inp), [inp]);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    try { await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, name: emailName, role: emailRole, organisation: emailOrg, workflow_interest: "care_minutes_mm1", calculator_data: { gap: r.gap, netImpact: r.netImpact, gatingPct: r.gatingPct, diagnosis: r.diagnosis } }) }); } catch {}
    setEmailSent(true);
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <nav className="sticky top-0 z-50" style={{ backgroundColor: C.dark, borderBottom: "1px solid rgba(245,237,227,0.08)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 lg:px-16 py-4">
          <Link href="/v2" className="text-[15px] font-medium tracking-tight" style={{ color: C.ink }}>CHRIS<span style={{ color: C.copper }}>·</span>OS</Link>
          <div className="flex items-center gap-4">
            <Link href="/tools/care-minutes" className="text-[13px] hidden md:block" style={{ color: C.inkMuted }}>← Care minutes hub</Link>
            <a href="/v2#book" className="text-[13px] font-medium px-5 py-2 rounded" style={{ backgroundColor: C.copper, color: C.dark }}>Book a conversation</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ backgroundColor: C.dark }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-16 py-12 lg:py-16 text-center">
          <div className="text-[11px] font-medium tracking-[0.12em] uppercase mb-5" style={{ color: C.copper }}>Care minutes · supplement calculator · MM1</div>
          <h1 className="text-[clamp(1.3rem,3vw,2rem)] font-normal leading-[1.2] mb-4" style={{ fontFamily: "Georgia, serif", color: C.ink }}>
            From 1 April 2026, for every metropolitan home, the BCT is gone.{" "}
            <em className="italic" style={{ color: C.copper }}>It only comes back if you hit 100% of both targets.</em>
          </h1>
          <p className="text-[14px] leading-[1.65] max-w-xl mx-auto" style={{ color: C.inkMuted }}>
            Model your facility against the gradient. See three scenarios priced. Each role accounted for. No signup.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section style={{ backgroundColor: C.cream }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-16 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Inputs */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5 border" style={{ borderColor: "rgba(26,18,24,0.06)" }}>
                <p className="text-[10px] font-medium uppercase tracking-wider mb-4 pb-2 border-b" style={{ color: "rgba(26,18,24,0.35)", borderColor: "rgba(26,18,24,0.06)" }}>Provider profile</p>
                <Slider label="Sites" value={inp.sites} min={1} max={30} step={1} display={String(inp.sites)} onChange={set("sites")} />
                <Slider label="Beds per site" value={inp.beds} min={30} max={180} step={5} display={String(inp.beds)} onChange={set("beds")} />
                <Slider label="Occupancy" value={inp.occupancy} min={70} max={100} step={1} display={`${inp.occupancy}%`} onChange={set("occupancy")} />
              </div>

              <div className="bg-white rounded-xl p-5 border" style={{ borderColor: "rgba(26,18,24,0.06)" }}>
                <p className="text-[10px] font-medium uppercase tracking-wider mb-4 pb-2 border-b" style={{ color: "rgba(26,18,24,0.35)", borderColor: "rgba(26,18,24,0.06)" }}>Current delivery (minutes / resident / day)</p>
                <Slider label="RN minutes" value={inp.rnMin} min={0} max={65} step={1} display={String(inp.rnMin)} sublabel="Counts toward both targets" onChange={set("rnMin")} />
                <Slider label="EN minutes" value={inp.enMin} min={0} max={40} step={1} display={String(inp.enMin)} sublabel="Capped at 10% of RN target (4.4 min)" onChange={set("enMin")} />
                <Slider label="PCW / AIN minutes" value={inp.pcwMin} min={80} max={220} step={2} display={String(inp.pcwMin)} sublabel="Total target only" onChange={set("pcwMin")} />
                <div className="mt-3 pt-3 border-t" style={{ borderColor: "rgba(26,18,24,0.06)" }}>
                  <div className="flex justify-between text-[12px]"><span style={{ color: "rgba(26,18,24,0.5)" }}>Total minutes</span><span className="font-medium" style={{ color: r.totalPct >= 100 ? C.good : C.warn }}>{r.totalMin} / 215</span></div>
                  <div className="flex justify-between text-[12px] mt-1"><span style={{ color: "rgba(26,18,24,0.5)" }}>Effective RN</span><span className="font-medium" style={{ color: r.effectiveRnPct >= 100 ? C.good : C.warn }}>{r.effectiveRnPct}%</span></div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border" style={{ borderColor: "rgba(26,18,24,0.06)" }}>
                <p className="text-[10px] font-medium uppercase tracking-wider mb-4 pb-2 border-b" style={{ color: "rgba(26,18,24,0.35)", borderColor: "rgba(26,18,24,0.06)" }}>Staffing costs (loaded $/hr)</p>
                <Slider label="RN" value={inp.rnCost} min={40} max={90} step={1} display={`$${inp.rnCost}`} onChange={set("rnCost")} />
                <Slider label="EN" value={inp.enCost} min={35} max={70} step={1} display={`$${inp.enCost}`} onChange={set("enCost")} />
                <Slider label="PCW / AIN" value={inp.pcwCost} min={30} max={65} step={1} display={`$${inp.pcwCost}`} onChange={set("pcwCost")} />
                <Slider label="Agency premium" value={inp.agencyPremium} min={30} max={100} step={5} display={`+${inp.agencyPremium}%`} onChange={set("agencyPremium")} />
                <Slider label="Permanent / agency split" value={inp.permAgencySplit} min={50} max={100} step={5} display={`${inp.permAgencySplit}% perm`} onChange={set("permAgencySplit")} />
                <p className="text-[10px] mt-2" style={{ color: "rgba(26,18,24,0.3)" }}>Defaults: MA000018, MA000034 (Oct 2025) + 30% on-costs.</p>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              {/* Headline */}
              <div className="rounded-xl p-6 text-center" style={{ backgroundColor: C.dark }}>
                <p className="text-[11px] uppercase tracking-[0.1em] mb-2" style={{ color: "rgba(245,237,227,0.45)" }}>
                  {r.isCompliant ? "You're earning full supplement" : "Your projected supplement funding gap"}
                </p>
                <p className="text-[clamp(2rem,5vw,3.5rem)] font-light tracking-tight leading-none mb-2" style={{ color: r.isCompliant ? C.good : r.isSevere ? C.bad : C.warn }}>
                  {r.isCompliant ? fmt(r.maxSupplement) : fmt(r.gap)}
                </p>
                <p className="text-[12px]" style={{ color: "rgba(245,237,227,0.45)" }}>
                  annually · {inp.sites} site{inp.sites > 1 ? "s" : ""} · {r.occupiedBeds} occupied beds
                </p>
              </div>

              {/* Diagnosis */}
              <div className="rounded-xl px-4 py-3 border" style={{ backgroundColor: "#fff", borderColor: "rgba(26,18,24,0.06)", borderLeftWidth: 3, borderLeftColor: r.isCompliant ? C.good : C.warn }}>
                <p className="text-[13px] font-medium" style={{ color: r.isCompliant ? C.good : C.warn }}>{r.diagnosis}</p>
                <p className="text-[11px] mt-1" style={{ color: "rgba(26,18,24,0.5)" }}>Binding target: {r.bindingTarget} at {r.gatingPct}% · Supplement factor: {r.supplementFactor}%</p>
              </div>

              {/* 3-scenario table */}
              {!r.isCompliant && (
                <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "rgba(26,18,24,0.06)" }}>
                  <p className="text-[10px] font-medium uppercase tracking-wider px-5 py-3 border-b" style={{ color: "rgba(26,18,24,0.35)", borderColor: "rgba(26,18,24,0.06)" }}>Three scenarios</p>
                  <div className="divide-y" style={{ borderColor: "rgba(26,18,24,0.04)" }}>
                    {/* Scenario A — Stay */}
                    <div className="px-5 py-3">
                      <div className="flex justify-between mb-1"><span className="text-[12px] font-medium" style={{ color: C.inkDark }}>A · Stay where you are</span><span className="text-[12px] font-medium" style={{ color: C.warn }}>−{fmt(r.gap)}</span></div>
                      <p className="text-[11px]" style={{ color: "rgba(26,18,24,0.4)" }}>Forfeit supplement. ACQSC enforcement risk. Director Declaration exposure.</p>
                    </div>
                    {/* Scenario B — Hit 100% */}
                    <div className="px-5 py-3">
                      <div className="flex justify-between mb-1"><span className="text-[12px] font-medium" style={{ color: C.inkDark }}>B · Hit 100% on both targets</span><span className="text-[12px] font-medium" style={{ color: r.netImpact > 0 ? C.good : C.warn }}>{r.netImpact > 0 ? "+" : ""}{fmt(r.netImpact)}</span></div>
                      <p className="text-[11px]" style={{ color: "rgba(26,18,24,0.4)" }}>Supplement secured: {fmt(r.gap)} recovered. Staffing cost: {fmt(r.totalCostToTarget)}.</p>
                    </div>
                    {/* Scenario C — Hit 105% */}
                    <div className="px-5 py-3">
                      <div className="flex justify-between mb-1"><span className="text-[12px] font-medium" style={{ color: C.inkDark }}>C · Hit 105% (defensive headroom)</span><span className="text-[12px] font-medium" style={{ color: r.netImpact105 > 0 ? C.good : C.warn }}>{r.netImpact105 > 0 ? "+" : ""}{fmt(r.netImpact105)}</span></div>
                      <p className="text-[11px]" style={{ color: "rgba(26,18,24,0.4)" }}>Buy headroom against a bad quarter. Cost: {fmt(r.totalCost105)}.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Breakdown */}
              <div className="bg-white rounded-xl p-5 border" style={{ borderColor: "rgba(26,18,24,0.06)" }}>
                <p className="text-[10px] font-medium uppercase tracking-wider mb-3" style={{ color: "rgba(26,18,24,0.35)" }}>Breakdown</p>
                <div className="space-y-2 text-[12px]">
                  <div className="flex justify-between"><span style={{ color: "rgba(26,18,24,0.5)" }}>Maximum supplement available</span><span className="font-medium" style={{ color: C.inkDark }}>{fmt(r.maxSupplement)}</span></div>
                  <div className="flex justify-between"><span style={{ color: "rgba(26,18,24,0.5)" }}>Current entitlement ({r.supplementFactor}%)</span><span className="font-medium" style={{ color: C.good }}>{fmt(r.currentEntitlement)}</span></div>
                  <div className="h-2 bg-[#f5f3f0] rounded-full overflow-hidden my-2">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${r.supplementFactor}%`, backgroundColor: r.supplementFactor > 70 ? C.good : r.supplementFactor > 30 ? C.warn : C.bad }} />
                  </div>
                  <div className="flex justify-between pt-2 border-t" style={{ borderColor: "rgba(26,18,24,0.04)" }}>
                    <span className="font-medium" style={{ color: C.inkDark }}>Funding gap</span>
                    <span className="font-semibold" style={{ color: C.warn }}>{fmt(r.gap)}</span>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <a href="/v2#book" className="block w-full text-center py-3.5 rounded-lg text-[14px] font-medium hover:opacity-90 transition-colors" style={{ backgroundColor: C.copper, color: C.dark }}>Book a 30-minute diagnostic call</a>
                <button onClick={() => setShowEmail(true)} className="block w-full text-center py-3 rounded-lg text-[13px] font-medium border hover:opacity-80 transition-colors" style={{ borderColor: "rgba(26,18,24,0.15)", color: C.inkDark }}>Email me the full model</button>
              </div>

              <p className="text-[11px] text-center" style={{ color: "rgba(26,18,24,0.35)" }}>
                Modelled estimate. Actual figures depend on roster efficiency, agency reliance, and AN-ACC casemix.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Email modal */}
      {showEmail && !emailSent && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setShowEmail(false)}>
          <form onSubmit={handleEmail} className="bg-white rounded-xl p-6 max-w-md w-full space-y-3" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[16px] font-semibold" style={{ color: C.inkDark }}>Email your funding model</h3>
            <p className="text-[13px]" style={{ color: "rgba(26,18,24,0.5)" }}>Three-scenario decision frame priced to your inputs, with staffing plan and Director Declaration checklist.</p>
            <input required type="text" value={emailName} onChange={(e) => setEmailName(e.target.value)} placeholder="Name" className="w-full px-4 py-2.5 rounded border text-[13px] focus:outline-none" style={{ borderColor: "rgba(26,18,24,0.12)" }} />
            <select value={emailRole} onChange={(e) => setEmailRole(e.target.value)} className="w-full px-4 py-2.5 rounded border text-[13px] focus:outline-none" style={{ borderColor: "rgba(26,18,24,0.12)" }}>
              <option value="">Select role</option>
              {["CEO", "CFO", "DON", "Facility Manager", "COO", "Other"].map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <input required type="text" value={emailOrg} onChange={(e) => setEmailOrg(e.target.value)} placeholder="Organisation" className="w-full px-4 py-2.5 rounded border text-[13px] focus:outline-none" style={{ borderColor: "rgba(26,18,24,0.12)" }} />
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Work email" className="w-full px-4 py-2.5 rounded border text-[13px] focus:outline-none" style={{ borderColor: "rgba(26,18,24,0.12)" }} />
            <button type="submit" className="w-full py-3 rounded text-[14px] font-medium hover:opacity-90" style={{ backgroundColor: C.copper, color: C.dark }}>Send the full model →</button>
          </form>
        </div>
      )}
      {showEmail && emailSent && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setShowEmail(false)}>
          <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
            <p className="text-[16px] font-semibold" style={{ color: C.inkDark }}>Sent.</p>
            <p className="text-[13px] mt-2" style={{ color: "rgba(26,18,24,0.5)" }}>Check your inbox. We&apos;ll follow up within 24 hours.</p>
          </div>
        </div>
      )}
    </div>
  );
}
