"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const C = { dark: "#1a1218", dark2: "#2d1f2a", copper: "#c89a3c", copperDark: "#8b6914", cream: "#faf7f2", ink: "#f5ede3", inkDark: "#1a1218", inkMuted: "rgba(245,237,227,0.78)", inkMutedLight: "rgba(26,18,24,0.78)", good: "#2d6a4f", warn: "#b5572a", calm: "#8aa888" };

// ── Financial model (MM2-7: no supplement — cost reduction frame) ────────────
interface Inputs {
  sites: number; beds: number; occupancy: number;
  rnMin: number; enMin: number; pcwMin: number;
  rnCost: number; enCost: number; pcwCost: number; agencyPremium: number;
  permAgencySplit: number;
}

const DEFAULTS: Inputs = {
  sites: 15, beds: 80, occupancy: 92,
  rnMin: 35, enMin: 22, pcwMin: 171,
  rnCost: 57, enCost: 48, pcwCost: 46, agencyPremium: 45,
  permAgencySplit: 85,
};

function compute(i: Inputs) {
  const totalTarget = 215;
  const rnTarget = 44;
  const enAllowance = Math.min(i.enMin, rnTarget * 0.10);
  const effectiveRn = i.rnMin + enAllowance;
  const effectiveRnPct = effectiveRn / rnTarget;
  const totalMin = i.rnMin + i.enMin + i.pcwMin;
  const totalPct = totalMin / totalTarget;

  const occupiedBeds = i.sites * i.beds * (i.occupancy / 100);
  const annualDays = 365;
  const residentDays = occupiedBeds * annualDays;

  const permPct = i.permAgencySplit / 100;
  const agencyMult = 1 + (i.agencyPremium / 100);
  const blendedRn = permPct * i.rnCost + (1 - permPct) * i.rnCost * agencyMult;
  const blendedEn = permPct * i.enCost + (1 - permPct) * i.enCost * agencyMult;
  const blendedPcw = permPct * i.pcwCost + (1 - permPct) * i.pcwCost * agencyMult;

  // Current cost of delivery
  const currentCostPRPD = (i.rnMin / 60) * blendedRn + (i.enMin / 60) * blendedEn + (i.pcwMin / 60) * blendedPcw;
  const annualCurrentCost = Math.round(currentCostPRPD * residentDays);

  // Cost at exactly 100% (role mix held constant)
  const scaleToTarget = totalTarget / totalMin;
  const costAtTargetPRPD = currentCostPRPD * (totalMin >= totalTarget ? scaleToTarget : 1);
  const annualTargetCost = Math.round(costAtTargetPRPD * residentDays);
  const annualOverSpend = Math.max(0, annualCurrentCost - annualTargetCost);

  // Buffer analysis
  const bufferPct = Math.max(0, totalPct - 1);
  const overTargetRange = totalPct - 0.85;
  const bufferValue = overTargetRange > 0 ? Math.round(annualOverSpend * (bufferPct / overTargetRange)) : 0;
  const excessValue = annualOverSpend - bufferValue;

  // Three reduction tiers
  const costAt105PRPD = currentCostPRPD * (totalTarget * 1.05 / totalMin);
  const costAt102PRPD = currentCostPRPD * (totalTarget * 1.02 / totalMin);
  const costAt100PRPD = costAtTargetPRPD;

  const savingsTo105 = Math.max(0, Math.round((currentCostPRPD - costAt105PRPD) * residentDays));
  const savingsTo102 = Math.max(0, Math.round((currentCostPRPD - costAt102PRPD) * residentDays));
  const savingsTo100 = annualOverSpend;

  // Diagnosis
  const isOverTarget = totalPct >= 1 && effectiveRnPct >= 1;
  const isUnder = totalPct < 1 || effectiveRnPct < 1;

  let diagnosis: string;
  if (totalPct >= 1.05 && effectiveRnPct >= 1) diagnosis = `Delivering ${Math.round(totalPct * 100)}% — both targets met with headroom. Your over-spend is real.`;
  else if (totalPct >= 1 && effectiveRnPct >= 1) diagnosis = `At ${Math.round(totalPct * 100)}%, you're just above target — limited reduction room without telemetry.`;
  else if (effectiveRnPct < 1 && totalPct >= 1) diagnosis = "RN target not met — regulatory exposure despite total minutes being fine.";
  else if (totalPct < 1 && effectiveRnPct >= 1) diagnosis = "Total minutes below target — Star Rating and Director Declaration risk.";
  else diagnosis = "Both targets failing — regulatory exposure on both dimensions.";

  return {
    totalMin, totalPct: Math.round(totalPct * 100), effectiveRnPct: Math.round(effectiveRnPct * 100),
    occupiedBeds: Math.round(occupiedBeds), residentDays: Math.round(residentDays),
    annualCurrentCost, annualTargetCost, annualOverSpend,
    bufferValue, excessValue,
    savingsTo105, savingsTo102, savingsTo100,
    isOverTarget, isUnder, diagnosis,
  };
}

function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000) return (n < 0 ? "−$" : "$") + (Math.abs(n) / 1_000_000).toFixed(1) + "M";
  if (Math.abs(n) >= 1_000) return (n < 0 ? "−$" : "$") + Math.round(Math.abs(n) / 1_000).toLocaleString() + "K";
  return "$" + Math.round(Math.abs(n)).toLocaleString();
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
        className="w-full cursor-pointer" style={{ accentColor: C.calm }} />
    </div>
  );
}

export default function MM27Calculator() {
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
    try { await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, name: emailName, role: emailRole, organisation: emailOrg, workflow_interest: "care_minutes_mm2_7", calculator_data: { overSpend: r.annualOverSpend, totalPct: r.totalPct, savingsTo100: r.savingsTo100, diagnosis: r.diagnosis } }) }); } catch {}
    setEmailSent(true);
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <nav className="sticky top-0 z-50" style={{ backgroundColor: C.dark, borderBottom: "1px solid rgba(245,237,227,0.08)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 lg:px-16 py-4">
          <Link href="/v2" className="text-[15px] font-medium tracking-tight" style={{ color: C.ink }}>Chris<span style={{ color: C.copper }}>·</span>OS</Link>
          <div className="flex items-center gap-4">
            <Link href="/tools/care-minutes" className="text-[13px] hidden md:block" style={{ color: C.inkMuted }}>← Care minutes hub</Link>
            <a href="/v2#book" className="text-[13px] font-medium px-5 py-2 rounded" style={{ backgroundColor: C.copper, color: C.dark }}>Book a conversation</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ backgroundColor: C.dark }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-16 py-12 lg:py-16 text-center">
          <div className="text-[11px] font-medium tracking-[0.12em] uppercase mb-5" style={{ color: C.calm }}>MM2–7 cost calculator · for regional / rural / remote operators</div>
          <h1 className="text-[clamp(1.3rem,3vw,2rem)] font-normal leading-[1.2] mb-4" style={{ fontFamily: "Georgia, serif", color: C.ink }}>
            Your funding doesn&apos;t change on 1 April 2026.{" "}
            <em className="italic" style={{ color: C.copper }}>But your over-spend is real, and your board is asking.</em>
          </h1>
          <p className="text-[14px] leading-[1.65] max-w-xl mx-auto" style={{ color: C.inkMuted }}>
            If your homes are running above target, you&apos;re paying for it. Model your delivery from 85% to 110% in role-aware detail. Find the over-spend. See what risk-assured reduction is worth.
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
                <p className="text-[10px] font-medium uppercase tracking-wider mb-4 pb-2 border-b" style={{ color: "rgba(26,18,24,0.35)", borderColor: "rgba(26,18,24,0.06)" }}>Portfolio profile</p>
                <Slider label="Sites" value={inp.sites} min={1} max={40} step={1} display={String(inp.sites)} onChange={set("sites")} />
                <Slider label="Beds per site" value={inp.beds} min={30} max={180} step={5} display={String(inp.beds)} onChange={set("beds")} />
                <Slider label="Occupancy" value={inp.occupancy} min={70} max={100} step={1} display={`${inp.occupancy}%`} onChange={set("occupancy")} />
              </div>

              <div className="bg-white rounded-xl p-5 border" style={{ borderColor: "rgba(26,18,24,0.06)" }}>
                <p className="text-[10px] font-medium uppercase tracking-wider mb-4 pb-2 border-b" style={{ color: "rgba(26,18,24,0.35)", borderColor: "rgba(26,18,24,0.06)" }}>Current delivery (minutes / resident / day)</p>
                <Slider label="RN minutes" value={inp.rnMin} min={0} max={80} step={1} display={String(inp.rnMin)} sublabel="Counts toward both targets" onChange={set("rnMin")} />
                <Slider label="EN minutes" value={inp.enMin} min={0} max={50} step={1} display={String(inp.enMin)} sublabel="Capped at 10% of RN target (4.4 min)" onChange={set("enMin")} />
                <Slider label="PCW / AIN minutes" value={inp.pcwMin} min={80} max={260} step={2} display={String(inp.pcwMin)} sublabel="Total target only" onChange={set("pcwMin")} />
                <div className="mt-3 pt-3 border-t" style={{ borderColor: "rgba(26,18,24,0.06)" }}>
                  <div className="flex justify-between text-[12px]"><span style={{ color: "rgba(26,18,24,0.5)" }}>Total minutes</span><span className="font-medium" style={{ color: r.totalPct >= 100 ? C.good : C.warn }}>{r.totalMin} / 215 ({r.totalPct}%)</span></div>
                  <div className="flex justify-between text-[12px] mt-1"><span style={{ color: "rgba(26,18,24,0.5)" }}>Effective RN</span><span className="font-medium" style={{ color: r.effectiveRnPct >= 100 ? C.good : C.warn }}>{r.effectiveRnPct}%</span></div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border" style={{ borderColor: "rgba(26,18,24,0.06)" }}>
                <p className="text-[10px] font-medium uppercase tracking-wider mb-4 pb-2 border-b" style={{ color: "rgba(26,18,24,0.35)", borderColor: "rgba(26,18,24,0.06)" }}>Staffing costs (loaded $/hr)</p>
                <Slider label="RN" value={inp.rnCost} min={40} max={90} step={1} display={`$${inp.rnCost}`} onChange={set("rnCost")} />
                <Slider label="EN" value={inp.enCost} min={35} max={70} step={1} display={`$${inp.enCost}`} onChange={set("enCost")} />
                <Slider label="PCW / AIN" value={inp.pcwCost} min={30} max={65} step={1} display={`$${inp.pcwCost}`} onChange={set("pcwCost")} />
                <Slider label="Agency premium" value={inp.agencyPremium} min={20} max={80} step={5} display={`+${inp.agencyPremium}%`} onChange={set("agencyPremium")} />
                <Slider label="Permanent / agency split" value={inp.permAgencySplit} min={50} max={100} step={5} display={`${inp.permAgencySplit}% perm`} onChange={set("permAgencySplit")} />
                <p className="text-[10px] mt-2" style={{ color: "rgba(26,18,24,0.3)" }}>Defaults: MA000018, MA000034 (Oct 2025) + 30% on-costs. Agency premium lower for NFP regional cohort.</p>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              {/* Headline */}
              <div className="rounded-xl p-6 text-center" style={{ backgroundColor: C.dark }}>
                <p className="text-[11px] uppercase tracking-[0.1em] mb-2" style={{ color: "rgba(245,237,227,0.45)" }}>
                  {r.isOverTarget ? "Your annualised over-spend vs 100% target" : "Your annual delivery cost"}
                </p>
                <p className="text-[clamp(2rem,5vw,3.5rem)] font-light tracking-tight leading-none mb-2" style={{ color: r.isOverTarget ? C.copper : r.isUnder ? C.warn : C.calm }}>
                  {r.isOverTarget ? fmt(r.annualOverSpend) : fmt(r.annualCurrentCost)}
                </p>
                <p className="text-[12px]" style={{ color: "rgba(245,237,227,0.45)" }}>
                  {inp.sites} site{inp.sites > 1 ? "s" : ""} · {r.occupiedBeds} occupied beds · {r.totalPct}% of target
                </p>
              </div>

              {/* Diagnosis */}
              <div className="rounded-xl px-4 py-3 border" style={{ backgroundColor: "#fff", borderColor: "rgba(26,18,24,0.06)", borderLeftWidth: 3, borderLeftColor: r.isOverTarget ? C.calm : C.warn }}>
                <p className="text-[13px] font-medium" style={{ color: r.isOverTarget ? C.inkDark : C.warn }}>{r.diagnosis}</p>
                <p className="text-[11px] mt-1" style={{ color: "rgba(26,18,24,0.5)" }}>Total: {r.totalPct}% · RN: {r.effectiveRnPct}% · {r.residentDays.toLocaleString()} resident days/year</p>
              </div>

              {/* Buffer analysis — only when over target */}
              {r.isOverTarget && r.annualOverSpend > 0 && (
                <div className="bg-white rounded-xl p-5 border" style={{ borderColor: "rgba(26,18,24,0.06)" }}>
                  <p className="text-[10px] font-medium uppercase tracking-wider mb-3" style={{ color: "rgba(26,18,24,0.35)" }}>Buffer analysis</p>
                  <p className="text-[12px] leading-relaxed mb-3" style={{ color: "rgba(26,18,24,0.5)" }}>
                    Of your {fmt(r.annualOverSpend)} over-spend, how much is paying for safety margin vs genuinely excess?
                  </p>
                  <div className="space-y-2 text-[12px]">
                    <div className="flex justify-between"><span style={{ color: "rgba(26,18,24,0.5)" }}>Safety buffer value</span><span className="font-medium" style={{ color: C.calm }}>{fmt(r.bufferValue)}</span></div>
                    <div className="flex justify-between"><span style={{ color: "rgba(26,18,24,0.5)" }}>Excess cost (recoverable)</span><span className="font-medium" style={{ color: C.copper }}>{fmt(r.excessValue)}</span></div>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden mt-3 flex" style={{ backgroundColor: "rgba(26,18,24,0.04)" }}>
                    <div className="h-full transition-all duration-500" style={{ width: `${r.annualOverSpend > 0 ? (r.bufferValue / r.annualOverSpend) * 100 : 0}%`, backgroundColor: C.calm }} />
                    <div className="h-full transition-all duration-500" style={{ width: `${r.annualOverSpend > 0 ? (r.excessValue / r.annualOverSpend) * 100 : 0}%`, backgroundColor: C.copper }} />
                  </div>
                  <div className="flex justify-between text-[10px] mt-1">
                    <span style={{ color: C.calm }}>Buffer</span>
                    <span style={{ color: C.copper }}>Excess</span>
                  </div>
                  <p className="text-[11px] mt-3 leading-relaxed" style={{ color: "rgba(26,18,24,0.4)" }}>
                    CHRIS-OS narrows the buffer needed — real-time telemetry catches drift earlier, so you can safely operate closer to target.
                  </p>
                </div>
              )}

              {/* Three reduction tiers — only when over target */}
              {r.isOverTarget && r.annualOverSpend > 0 && (
                <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "rgba(26,18,24,0.06)" }}>
                  <p className="text-[10px] font-medium uppercase tracking-wider px-5 py-3 border-b" style={{ color: "rgba(26,18,24,0.35)", borderColor: "rgba(26,18,24,0.06)" }}>Three reduction tiers</p>
                  <div className="divide-y" style={{ borderColor: "rgba(26,18,24,0.04)" }}>
                    <div className="px-5 py-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-[12px] font-medium" style={{ color: C.inkDark }}>105% · Immediate (low risk)</span>
                        <span className="text-[12px] font-medium" style={{ color: C.good }}>{fmt(r.savingsTo105)}</span>
                      </div>
                      <p className="text-[11px]" style={{ color: "rgba(26,18,24,0.4)" }}>Natural attrition + non-replacement of departing agency. Negligible operational risk.</p>
                    </div>
                    <div className="px-5 py-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-[12px] font-medium" style={{ color: C.inkDark }}>102% · 90-day (moderate risk)</span>
                        <span className="text-[12px] font-medium" style={{ color: C.good }}>{fmt(r.savingsTo102)}</span>
                      </div>
                      <p className="text-[11px]" style={{ color: "rgba(26,18,24,0.4)" }}>Active reduction in identified over-delivery pockets. Needs site-level analysis.</p>
                    </div>
                    <div className="px-5 py-3" style={{ backgroundColor: "rgba(200,154,60,0.04)" }}>
                      <div className="flex justify-between mb-1">
                        <span className="text-[12px] font-medium" style={{ color: C.inkDark }}>100% · Mid-term (requires telemetry)</span>
                        <span className="text-[12px] font-medium" style={{ color: C.copper }}>{fmt(r.savingsTo100)}</span>
                      </div>
                      <p className="text-[11px]" style={{ color: "rgba(26,18,24,0.4)" }}>Full reduction to target. Requires CHRIS-OS telemetry to be safe — risk of dropping below target on a bad week without real-time visibility.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cost breakdown */}
              <div className="bg-white rounded-xl p-5 border" style={{ borderColor: "rgba(26,18,24,0.06)" }}>
                <p className="text-[10px] font-medium uppercase tracking-wider mb-3" style={{ color: "rgba(26,18,24,0.35)" }}>Cost breakdown</p>
                <div className="space-y-2 text-[12px]">
                  <div className="flex justify-between"><span style={{ color: "rgba(26,18,24,0.5)" }}>Annual cost at current {r.totalPct}% delivery</span><span className="font-medium" style={{ color: C.inkDark }}>{fmt(r.annualCurrentCost)}</span></div>
                  <div className="flex justify-between"><span style={{ color: "rgba(26,18,24,0.5)" }}>Annual cost at 100% delivery</span><span className="font-medium" style={{ color: C.calm }}>{fmt(r.annualTargetCost)}</span></div>
                  <div className="flex justify-between pt-2 border-t" style={{ borderColor: "rgba(26,18,24,0.04)" }}>
                    <span className="font-semibold" style={{ color: C.inkDark }}>Annual over-spend</span>
                    <span className="font-semibold" style={{ color: r.annualOverSpend > 0 ? C.copper : C.calm }}>{fmt(r.annualOverSpend)}</span>
                  </div>
                </div>
              </div>

              {/* Under-target warning */}
              {r.isUnder && (
                <div className="rounded-xl px-5 py-4 border" style={{ backgroundColor: "rgba(181,87,42,0.04)", borderColor: "rgba(181,87,42,0.15)", borderLeftWidth: 3, borderLeftColor: C.warn }}>
                  <p className="text-[13px] font-medium mb-1" style={{ color: C.warn }}>Below target — different conversation</p>
                  <p className="text-[12px] leading-relaxed" style={{ color: "rgba(26,18,24,0.5)" }}>
                    Your MM2-7 funding doesn&apos;t change, but you still carry Star Rating consequences, Director Declaration personal liability, and ACQSC enforcement risk. The same regulatory teeth apply — the only difference is there&apos;s no supplement to lose.
                  </p>
                </div>
              )}

              {/* 31 October countdown */}
              <div className="rounded-xl px-4 py-3 text-center" style={{ backgroundColor: "rgba(200,154,60,0.06)", border: "1px solid rgba(200,154,60,0.12)" }}>
                <p className="text-[13px] italic" style={{ fontFamily: "Georgia, serif", color: C.copper }}>
                  31 October 2026 — first audited Care Minutes Performance Statement. Director Declaration personal liability begins.
                </p>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <a href="/v2#book" className="block w-full text-center py-3.5 rounded-lg text-[14px] font-medium hover:opacity-90 transition-colors" style={{ backgroundColor: C.copper, color: C.dark }}>Book a 30-minute board conversation</a>
                <button onClick={() => setShowEmail(true)} className="block w-full text-center py-3 rounded-lg text-[13px] font-medium border hover:opacity-80 transition-colors" style={{ borderColor: "rgba(26,18,24,0.15)", color: C.inkDark }}>Email me the full reduction model</button>
              </div>

              <p className="text-[11px] text-center" style={{ color: "rgba(26,18,24,0.35)" }}>
                Modelled estimate. Actual figures depend on roster efficiency, agency reliance, and AN-ACC casemix. Reducing without operational visibility risks dropping below target.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Email modal */}
      {showEmail && !emailSent && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setShowEmail(false)}>
          <form onSubmit={handleEmail} className="bg-white rounded-xl p-6 max-w-md w-full space-y-3" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[16px] font-semibold" style={{ color: C.inkDark }}>Get your full reduction model</h3>
            <p className="text-[13px]" style={{ color: "rgba(26,18,24,0.5)" }}>12–15 page report: per-shift heat maps, three-tier reduction plan, board paper template, 12-month timeline, Director Declaration checklist.</p>
            <input required type="text" value={emailName} onChange={(e) => setEmailName(e.target.value)} placeholder="Name" className="w-full px-4 py-2.5 rounded border text-[13px] focus:outline-none" style={{ borderColor: "rgba(26,18,24,0.12)" }} />
            <select value={emailRole} onChange={(e) => setEmailRole(e.target.value)} className="w-full px-4 py-2.5 rounded border text-[13px] focus:outline-none" style={{ borderColor: "rgba(26,18,24,0.12)" }}>
              <option value="">Select role</option>
              {["CEO", "CFO", "DON", "COO", "Facility Manager", "Other"].map((r) => <option key={r} value={r}>{r}</option>)}
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
            <p className="text-[13px] mt-2" style={{ color: "rgba(26,18,24,0.5)" }}>Check your inbox. We&apos;ll follow up within 48 hours.</p>
          </div>
        </div>
      )}
    </div>
  );
}
