"use client";

// Structural decisions for review:
// 1. Supplement gradient bar renders horizontally. The 0-85% floor segment is
//    terracotta at 8% opacity; the 85-100% gradient is a teal-to-amber CSS
//    linear-gradient. User marker is a forest vertical line with dollar annotation.
// 2. "Cheapest legal close" is a new calculation: PCW-only when RN is met,
//    RN+EN top-up then PCW when RN is short. Always <= default fill mix cost.
// 3. Compliance percentages render to 1 decimal place when < 100.0.

import { useState, useMemo } from "react";
import Link from "next/link";

const C = { dark: "#1a1218", dark2: "#2d1f2a", copper: "#c89a3c", copperDark: "#8b6914", cream: "#faf7f2", ink: "#f5ede3", inkDark: "#1a1218", inkMuted: "rgba(245,237,227,0.78)", inkMutedLight: "rgba(26,18,24,0.78)", good: "#2d6a4f", teal: "#2D7D73", warn: "#b5572a", bad: "#b21f1f", amber: "#D4A017" };

// ── Financial model ────────────────────────────────────────────────────────
const AN_ACC_PRICE = 295.64;
const BCT_DELTA_NWAU = 0.113;
const SUPPLEMENT_PRPD = AN_ACC_PRICE * BCT_DELTA_NWAU; // ~$33.41

interface Inputs {
  sites: number; beds: number; occupancy: number;
  rnMin: number; enMin: number; pcwMin: number;
  rnCost: number; enCost: number; pcwCost: number; agencyPremium: number;
  permAgencySplit: number;
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
  const enAllowance = Math.min(i.enMin, rnTarget * 0.10);
  const effectiveRn = i.rnMin + enAllowance;
  const effectiveRnPctRaw = effectiveRn / rnTarget;
  const totalMin = i.rnMin + i.enMin + i.pcwMin;
  const totalPctRaw = totalMin / totalTarget;
  const gatingPctRaw = Math.min(effectiveRnPctRaw, totalPctRaw);

  let supplementFactor: number;
  if (gatingPctRaw >= 1) supplementFactor = 1;
  else if (gatingPctRaw <= 0.85) supplementFactor = 0;
  else supplementFactor = (gatingPctRaw - 0.85) / 0.15;

  const occupiedBeds = i.sites * i.beds * (i.occupancy / 100);
  const annualDays = 365;
  const residentDays = occupiedBeds * annualDays;
  const maxSupplement = Math.round(SUPPLEMENT_PRPD * occupiedBeds * annualDays);
  const currentEntitlement = Math.round(SUPPLEMENT_PRPD * supplementFactor * occupiedBeds * annualDays);
  const gap = maxSupplement - currentEntitlement;

  // Supplement per resident per day at current position
  const currentSuppPRPD = SUPPLEMENT_PRPD * supplementFactor;

  // Blended rates
  const residentDaysPerSite = i.beds * (i.occupancy / 100) * annualDays;
  const permPct = i.permAgencySplit / 100;
  const agencyMult = 1 + (i.agencyPremium / 100);
  const rnBlended = permPct * i.rnCost + (1 - permPct) * i.rnCost * agencyMult;
  const enBlended = permPct * i.enCost + (1 - permPct) * i.enCost * agencyMult;
  const pcwBlended = permPct * i.pcwCost + (1 - permPct) * i.pcwCost * agencyMult;

  // ── CHEAPEST LEGAL CLOSE ──────────────────────────────────────────────
  // When RN is met: fill total gap with PCW only (cheapest role)
  // When RN is short: fill RN gap with RN + max EN allowance, then PCW for remainder
  const extraRnNeeded = Math.max(0, rnTarget - effectiveRn);
  const extraTotalNeeded = Math.max(0, totalTarget - totalMin);

  let cheapRnExtra = 0, cheapEnExtra = 0, cheapPcwExtra = 0;
  if (extraRnNeeded > 0) {
    // Need more RN. EN can contribute up to 10% of rnTarget (4.4 min) minus current allowance
    const enHeadroom = Math.max(0, rnTarget * 0.10 - enAllowance);
    const enContrib = Math.min(enHeadroom, extraRnNeeded);
    cheapEnExtra = enContrib;
    cheapRnExtra = extraRnNeeded - enContrib;
    // Remaining total gap (after RN+EN additions counted toward total)
    const totalAfterRnFix = totalMin + cheapRnExtra + cheapEnExtra;
    cheapPcwExtra = Math.max(0, totalTarget - totalAfterRnFix);
  } else {
    // RN is fine. Fill total gap with PCW only
    cheapPcwExtra = extraTotalNeeded;
  }

  const cheapRnHours = (cheapRnExtra / 60) * residentDaysPerSite * i.sites;
  const cheapEnHours = (cheapEnExtra / 60) * residentDaysPerSite * i.sites;
  const cheapPcwHours = (cheapPcwExtra / 60) * residentDaysPerSite * i.sites;
  const cheapCost = Math.round(cheapRnHours * rnBlended + cheapEnHours * enBlended + cheapPcwHours * pcwBlended);

  // ── DEFAULT FILL MIX (70/20/10) ──────────────────────────────────────
  const dfRnExtra = extraTotalNeeded * 0.10 + extraRnNeeded;
  const dfEnExtra = extraTotalNeeded * 0.20;
  const dfPcwExtra = extraTotalNeeded * 0.70;
  const dfRnHours = (dfRnExtra / 60) * residentDaysPerSite * i.sites;
  const dfEnHours = (dfEnExtra / 60) * residentDaysPerSite * i.sites;
  const dfPcwHours = (dfPcwExtra / 60) * residentDaysPerSite * i.sites;
  const dfCost = Math.round(dfRnHours * rnBlended + dfEnHours * enBlended + dfPcwHours * pcwBlended);

  // Net margins
  const cheapMargin = gap - cheapCost;
  const dfMargin = gap - dfCost;

  // Scenario C: 105%
  const extra105Hours = (totalTarget * 0.05 / 60) * residentDaysPerSite * i.sites;
  const cost105 = dfCost + Math.round(extra105Hours * pcwBlended);
  const net105 = gap - cost105;

  // Status
  const isCompliant = gatingPctRaw >= 1;
  const isBelowFloor = gatingPctRaw < 0.85;
  const isInGradient = !isCompliant && !isBelowFloor;
  const rnBelow85 = effectiveRnPctRaw < 0.85;
  const totalBelow85 = totalPctRaw < 0.85;

  // State-aware diagnosis (Issue 3)
  let diagnosis: string;
  let diagColor: string;
  if (isCompliant) { diagnosis = "At target. Full supplement secured."; diagColor = C.good; }
  else if (isInGradient) { diagnosis = `In the gradient. Capturing ${Math.round(supplementFactor * 100)}% of available supplement.`; diagColor = C.amber; }
  else if (rnBelow85 && totalBelow85) { diagnosis = "Below the floor on both. Supplement at zero. Lift both to 85% to enter the gradient."; diagColor = C.warn; }
  else if (rnBelow85) { diagnosis = "Below the floor on RN. Supplement at zero. Lift RN to 85% to enter the gradient."; diagColor = C.warn; }
  else { diagnosis = "Below the floor on total minutes. Supplement at zero. Lift total to 85% to enter the gradient."; diagColor = C.warn; }

  // Gap description (Issue 2)
  let gapDesc: string;
  const totalShort = Math.max(0, totalTarget - totalMin);
  if (isCompliant) gapDesc = "Both targets met.";
  else if (effectiveRnPctRaw >= 1 && totalShort > 0) gapDesc = `You are ${totalShort} minutes short on total minutes. RN is at target.`;
  else if (effectiveRnPctRaw < 0.85 && totalShort > 0) gapDesc = `You are below the 85% RN floor and ${totalShort} minutes short on total. Both must lift before any supplement flows.`;
  else if (effectiveRnPctRaw < 1 && totalPctRaw >= 1) gapDesc = `RN is at ${fmtPct(effectiveRnPctRaw * 100)} of target. Total minutes are met.`;
  else gapDesc = `You are ${totalShort} minutes short on total and RN is at ${fmtPct(effectiveRnPctRaw * 100)} of target.`;

  return {
    totalMin, effectiveRn: Math.round(effectiveRn * 10) / 10, enAllowance: Math.round(enAllowance * 10) / 10,
    effectiveRnPct: effectiveRnPctRaw * 100, totalPct: totalPctRaw * 100,
    gatingPct: gatingPctRaw * 100, supplementFactor: supplementFactor * 100,
    occupiedBeds: Math.round(occupiedBeds), residentDays: Math.round(residentDays),
    maxSupplement, currentEntitlement, gap, currentSuppPRPD: Math.round(currentSuppPRPD * 100) / 100,
    diagnosis, diagColor, gapDesc,
    cheapCost, cheapMargin, cheapRnExtra: Math.round(cheapRnExtra * 10) / 10, cheapEnExtra: Math.round(cheapEnExtra * 10) / 10, cheapPcwExtra: Math.round(cheapPcwExtra * 10) / 10,
    dfCost, dfMargin,
    cost105, net105,
    isCompliant, isBelowFloor, isInGradient,
    bindingTarget: effectiveRnPctRaw < totalPctRaw ? "RN" : "Total",
  };
}

function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000) return (n < 0 ? "−$" : "$") + (Math.abs(n) / 1_000_000).toFixed(1) + "M";
  if (Math.abs(n) >= 1_000) return (n < 0 ? "−$" : "$") + Math.round(Math.abs(n) / 1_000).toLocaleString() + "K";
  return "$" + Math.round(Math.abs(n)).toLocaleString();
}

// Issue 4: one decimal when < 100, no decimal at 100+
function fmtPct(v: number): string {
  if (v >= 100) return `${Math.floor(v)}%`;
  return `${Math.round(v * 10) / 10}%`;
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

// Issue 1: Supplement gradient bar
function GradientBar({ gatingPct, supplementFactor, currentSuppPRPD, currentEntitlement, maxSupplement }: {
  gatingPct: number; supplementFactor: number; currentSuppPRPD: number; currentEntitlement: number; maxSupplement: number;
}) {
  // Position: 0% = left edge, 85% = floor, 100% = right edge
  // Map gatingPct to bar position: 0-85 maps to 0-56.7% of bar, 85-100 maps to 56.7-100%
  const floorWidth = 56.7; // 85/150 * 100 (visual proportion)
  let markerPos: number;
  if (gatingPct <= 0) markerPos = 0;
  else if (gatingPct <= 85) markerPos = (gatingPct / 85) * floorWidth;
  else if (gatingPct >= 100) markerPos = 100;
  else markerPos = floorWidth + ((gatingPct - 85) / 15) * (100 - floorWidth);

  const isBelowFloor = gatingPct < 85;
  const isAtTarget = gatingPct >= 100;

  return (
    <div className="bg-white rounded-xl p-5 border" style={{ borderColor: "rgba(26,18,24,0.06)" }}>
      <p className="text-[10px] font-medium uppercase tracking-wider mb-4" style={{ color: "rgba(26,18,24,0.35)" }}>Supplement gradient</p>

      {/* Bar */}
      <div className="relative h-6 rounded-full overflow-hidden mb-2" style={{ backgroundColor: "rgba(26,18,24,0.03)" }}>
        {/* Floor segment (0-85%): terracotta low opacity */}
        <div className="absolute left-0 top-0 h-full rounded-l-full" style={{ width: `${floorWidth}%`, backgroundColor: "rgba(181,87,42,0.08)" }} />
        {/* Gradient segment (85-100%): teal to amber */}
        <div className="absolute top-0 h-full rounded-r-full" style={{ left: `${floorWidth}%`, right: 0, background: `linear-gradient(90deg, ${C.teal}, ${C.amber})` }} />
        {/* 85% divider */}
        <div className="absolute top-0 h-full w-px" style={{ left: `${floorWidth}%`, backgroundColor: "rgba(26,18,24,0.15)" }} />

        {/* User marker */}
        <div className="absolute top-0 h-full transition-all duration-500" style={{ left: `${Math.min(markerPos, 99)}%` }}>
          <div className="w-0.5 h-full" style={{ backgroundColor: C.good }} />
          <div className="absolute -top-1 -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2" style={{ backgroundColor: C.good, borderColor: "#fff" }} />
        </div>
      </div>

      {/* Labels */}
      <div className="relative h-14 text-[9px]">
        {/* Floor label */}
        <div className="absolute" style={{ left: 0 }}>
          <p className="font-semibold" style={{ color: C.warn }}>$0</p>
          <p style={{ color: "rgba(26,18,24,0.35)" }}>Below 85%</p>
        </div>
        {/* 85% label */}
        <div className="absolute -translate-x-1/2" style={{ left: `${floorWidth}%` }}>
          <p className="font-semibold" style={{ color: "rgba(26,18,24,0.4)" }}>85%</p>
          <p style={{ color: "rgba(26,18,24,0.3)" }}>Floor</p>
        </div>
        {/* User position label */}
        {!isAtTarget && (
          <div className="absolute -translate-x-1/2 text-center" style={{ left: `${Math.max(10, Math.min(markerPos, 90))}%` }}>
            <p className="font-bold" style={{ color: C.good }}>{fmtPct(gatingPct)}</p>
            <p className="font-semibold" style={{ color: isBelowFloor ? C.warn : C.good }}>
              {isBelowFloor ? "Zero" : `$${currentSuppPRPD.toFixed(2)}/day`}
            </p>
            <p style={{ color: "rgba(26,18,24,0.35)" }}>{isBelowFloor ? "Below floor" : fmt(currentEntitlement) + "/yr"}</p>
          </div>
        )}
        {/* 100% label */}
        <div className="absolute right-0 text-right">
          <p className="font-semibold" style={{ color: C.amber }}>100%</p>
          <p style={{ color: "rgba(26,18,24,0.35)" }}>${SUPPLEMENT_PRPD.toFixed(2)}/day</p>
          <p style={{ color: "rgba(26,18,24,0.35)" }}>{fmt(maxSupplement)}/yr</p>
        </div>
      </div>

      <p className="text-[10px] leading-relaxed" style={{ color: "rgba(26,18,24,0.35)" }}>
        Supplement scales linearly between 85% and 100% on the lower of total minutes and RN minutes compliance. Below 85% on either, supplement is zero.
      </p>
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
    try { await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, name: emailName, role: emailRole, organisation: emailOrg, workflow_interest: "care_minutes_mm1", calculator_data: { gap: r.gap, gatingPct: r.gatingPct, diagnosis: r.diagnosis, cheapCost: r.cheapCost, cheapMargin: r.cheapMargin } }) }); } catch {}
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
          <div className="text-[11px] font-medium tracking-[0.12em] uppercase mb-5" style={{ color: C.copper }}>Care minutes · supplement calculator · MM1</div>
          <h1 className="text-[clamp(1.3rem,3vw,2rem)] font-bold leading-[1.2] mb-4" style={{ color: "#ffffff" }}>
            The supplement scales from 85% to 100%. See where you sit on the curve.
          </h1>
          <p className="text-[14px] leading-[1.65] max-w-xl mx-auto" style={{ color: "rgba(245,237,227,0.65)" }}>
            Model your facility against the gradient. See the cheapest legal close and the default fill mix, priced to your inputs. No signup.
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
                <div className="mt-3 pt-3 border-t space-y-1.5" style={{ borderColor: "rgba(26,18,24,0.06)" }}>
                  <div className="flex justify-between text-[12px]"><span style={{ color: "rgba(26,18,24,0.5)" }}>Total minutes</span><span className="font-medium" style={{ color: r.totalPct >= 100 ? C.good : C.warn }}>{r.totalMin} / 215 ({fmtPct(r.totalPct)})</span></div>
                  <div className="flex justify-between text-[12px]"><span style={{ color: "rgba(26,18,24,0.5)" }}>Effective RN</span><span className="font-medium" style={{ color: r.effectiveRnPct >= 100 ? C.good : C.warn }}>{r.effectiveRn} / 44 ({fmtPct(r.effectiveRnPct)})</span></div>
                  {r.enAllowance > 0 && <p className="text-[10px] leading-relaxed" style={{ color: "rgba(26,18,24,0.35)" }}>Effective RN = {inp.rnMin} RN + {r.enAllowance} EN allowance = {r.effectiveRn} min</p>}
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
              {/* Issue 6: Two-number headline tile */}
              <div className="rounded-xl p-6" style={{ backgroundColor: C.dark }}>
                <p className="text-[10px] uppercase tracking-[0.1em] mb-4" style={{ color: "rgba(245,237,227,0.4)" }}>Your supplement position</p>
                {r.isCompliant ? (
                  <div>
                    <p className="text-[clamp(2rem,5vw,3rem)] font-light tracking-tight leading-none" style={{ color: C.good }}>{fmt(r.maxSupplement)}</p>
                    <p className="text-[12px] mt-2" style={{ color: "rgba(245,237,227,0.5)" }}>Full supplement secured at {fmtPct(r.gatingPct)} gating.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[clamp(1.5rem,4vw,2.5rem)] font-light tracking-tight leading-none" style={{ color: r.isBelowFloor ? C.warn : C.teal }}>{r.isBelowFloor ? "$0" : fmt(r.currentEntitlement)}</p>
                      <p className="text-[11px] mt-1.5" style={{ color: "rgba(245,237,227,0.45)" }}>{r.isBelowFloor ? "Below the 85% floor" : `Secured at ${fmtPct(r.gatingPct)} gating`}</p>
                    </div>
                    <div>
                      <p className="text-[clamp(1.5rem,4vw,2.5rem)] font-light tracking-tight leading-none" style={{ color: r.isBelowFloor ? C.warn : C.amber }}>{r.isBelowFloor ? fmt(r.maxSupplement) : fmt(r.gap)}</p>
                      <p className="text-[11px] mt-1.5" style={{ color: "rgba(245,237,227,0.45)" }}>{r.isBelowFloor ? "At risk. Lift gating to start capturing." : "Available by hitting 100%"}</p>
                    </div>
                  </div>
                )}
                <p className="text-[10px] mt-3" style={{ color: "rgba(245,237,227,0.3)" }}>
                  {inp.sites} site{inp.sites > 1 ? "s" : ""} · {r.occupiedBeds} occupied beds · {r.residentDays.toLocaleString()} resident days/yr
                </p>
              </div>

              {/* Issue 3: State-aware diagnosis */}
              <div className="rounded-xl px-4 py-3 border" style={{ backgroundColor: "#fff", borderColor: "rgba(26,18,24,0.06)", borderLeftWidth: 3, borderLeftColor: r.diagColor }}>
                <p className="text-[13px] font-medium" style={{ color: r.diagColor }}>{r.diagnosis}</p>
                <p className="text-[11px] mt-1" style={{ color: "rgba(26,18,24,0.5)" }}>Binding target: {r.bindingTarget} at {fmtPct(r.gatingPct)}. Supplement factor: {fmtPct(r.supplementFactor)}.</p>
              </div>

              {/* Issue 1: Supplement gradient */}
              <GradientBar gatingPct={r.gatingPct} supplementFactor={r.supplementFactor} currentSuppPRPD={r.currentSuppPRPD} currentEntitlement={r.currentEntitlement} maxSupplement={r.maxSupplement} />

              {/* Issue 5: Supplement position with "already secured" */}
              <div className="bg-white rounded-xl p-5 border" style={{ borderColor: "rgba(26,18,24,0.06)" }}>
                <p className="text-[10px] font-medium uppercase tracking-wider mb-3" style={{ color: "rgba(26,18,24,0.35)" }}>Supplement position</p>
                <div className="space-y-2 text-[12px]">
                  <div className="flex justify-between"><span style={{ color: "rgba(26,18,24,0.5)" }}>Maximum supplement available</span><span className="font-medium" style={{ color: C.inkDark }}>{fmt(r.maxSupplement)}</span></div>
                  <div className="flex justify-between items-start">
                    <div><span style={{ color: "rgba(26,18,24,0.5)" }}>Current entitlement ({fmtPct(r.supplementFactor)})</span>
                      <p className="text-[10px]" style={{ color: "rgba(26,18,24,0.35)" }}>{r.isBelowFloor ? "Supplement at zero. Lift gating to 85% to start capturing." : "Already secured at current delivery."}</p>
                    </div>
                    <span className="font-medium shrink-0" style={{ color: r.isBelowFloor ? C.warn : C.good }}>{fmt(r.currentEntitlement)}</span>
                  </div>
                  <div className="h-2 bg-[#f5f3f0] rounded-full overflow-hidden my-2">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(r.supplementFactor, 100)}%`, backgroundColor: r.supplementFactor > 70 ? C.good : r.supplementFactor > 30 ? C.amber : C.warn }} />
                  </div>
                  <div className="flex justify-between"><span style={{ color: "rgba(26,18,24,0.5)" }}>Supplement to capture</span><span className="font-medium" style={{ color: C.amber }}>{fmt(r.gap)}</span></div>
                  <div className="flex justify-between pt-2 border-t" style={{ borderColor: "rgba(26,18,24,0.04)" }}>
                    <span className="font-semibold" style={{ color: C.inkDark }}>Total at 100%</span>
                    <span className="font-semibold" style={{ color: C.inkDark }}>{fmt(r.maxSupplement)}</span>
                  </div>
                </div>
              </div>

              {/* Issue 2: What it takes to hit 100% */}
              {!r.isCompliant && (r.cheapCost > 0 || r.dfCost > 0) && (
                <div className="bg-white rounded-xl p-5 border" style={{ borderColor: "rgba(26,18,24,0.06)" }}>
                  <p className="text-[10px] font-medium uppercase tracking-wider mb-2" style={{ color: "rgba(26,18,24,0.35)" }}>What it takes to hit 100%</p>
                  <p className="text-[12px] mb-4" style={{ color: "rgba(26,18,24,0.5)" }}>{r.gapDesc}</p>

                  {/* Cheapest legal close */}
                  <div className="rounded-lg p-3 mb-3" style={{ backgroundColor: "rgba(45,125,115,0.04)", border: "1px solid rgba(45,125,115,0.1)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: C.teal }}>Cheapest legal close</p>
                    <p className="text-[10px] mb-2" style={{ color: "rgba(26,18,24,0.4)" }}>
                      {r.cheapRnExtra > 0 ? `+${r.cheapRnExtra} RN min, ` : ""}{r.cheapEnExtra > 0 ? `+${r.cheapEnExtra} EN min, ` : ""}+{r.cheapPcwExtra} PCW min per resident per day.
                    </p>
                    <div className="space-y-1 text-[12px]">
                      <div className="flex justify-between"><span style={{ color: "rgba(26,18,24,0.5)" }}>Additional direct labour cost</span><span className="font-medium" style={{ color: C.warn }}>{fmt(r.cheapCost)}</span></div>
                      <div className="flex justify-between"><span style={{ color: "rgba(26,18,24,0.5)" }}>Supplement captured</span><span className="font-medium" style={{ color: C.good }}>{fmt(r.gap)}</span></div>
                      <div className="flex justify-between pt-1 border-t" style={{ borderColor: "rgba(26,18,24,0.04)" }}>
                        <span className="font-semibold" style={{ color: C.inkDark }}>Net margin on rostering</span>
                        <span className="font-semibold" style={{ color: r.cheapMargin > 0 ? C.good : C.warn }}>{r.cheapMargin > 0 ? "+" : ""}{fmt(r.cheapMargin)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Default fill mix */}
                  <div className="rounded-lg p-3 mb-3" style={{ backgroundColor: "rgba(26,18,24,0.02)", border: "1px solid rgba(26,18,24,0.06)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: "rgba(26,18,24,0.4)" }}>Default fill mix (70% PCW, 20% EN, 10% RN)</p>
                    <div className="space-y-1 text-[12px] mt-2">
                      <div className="flex justify-between"><span style={{ color: "rgba(26,18,24,0.5)" }}>Additional direct labour cost</span><span className="font-medium" style={{ color: C.warn }}>{fmt(r.dfCost)}</span></div>
                      <div className="flex justify-between"><span style={{ color: "rgba(26,18,24,0.5)" }}>Supplement captured</span><span className="font-medium" style={{ color: C.good }}>{fmt(r.gap)}</span></div>
                      <div className="flex justify-between pt-1 border-t" style={{ borderColor: "rgba(26,18,24,0.04)" }}>
                        <span className="font-semibold" style={{ color: C.inkDark }}>Net margin on rostering</span>
                        <span className="font-semibold" style={{ color: r.dfMargin > 0 ? C.good : C.warn }}>{r.dfMargin > 0 ? "+" : ""}{fmt(r.dfMargin)}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] leading-relaxed" style={{ color: "rgba(26,18,24,0.35)" }}>
                    Direct labour only. Does not include recruitment, training, supervision, or absence backfill.<br />
                    Award rates loaded at 1.30. {inp.permAgencySplit}% perm, {100 - inp.permAgencySplit}% agency at +{inp.agencyPremium}%. All editable above.
                  </p>
                </div>
              )}

              {/* Three scenarios */}
              {!r.isCompliant && (
                <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "rgba(26,18,24,0.06)" }}>
                  <p className="text-[10px] font-medium uppercase tracking-wider px-5 py-3 border-b" style={{ color: "rgba(26,18,24,0.35)", borderColor: "rgba(26,18,24,0.06)" }}>Three scenarios</p>
                  <div className="divide-y" style={{ borderColor: "rgba(26,18,24,0.04)" }}>
                    <div className="px-5 py-3">
                      <div className="flex justify-between mb-1"><span className="text-[12px] font-medium" style={{ color: C.inkDark }}>A. Stay where you are</span><span className="text-[12px] font-medium" style={{ color: C.warn }}>−{fmt(r.gap)}</span></div>
                      <p className="text-[11px]" style={{ color: "rgba(26,18,24,0.4)" }}>Forfeit supplement. ACQSC enforcement risk. Director Declaration exposure.</p>
                    </div>
                    <div className="px-5 py-3">
                      <div className="flex justify-between mb-1"><span className="text-[12px] font-medium" style={{ color: C.inkDark }}>B. Hit 100% (cheapest close)</span><span className="text-[12px] font-medium" style={{ color: r.cheapMargin > 0 ? C.good : C.warn }}>{r.cheapMargin > 0 ? "+" : ""}{fmt(r.cheapMargin)}</span></div>
                      <p className="text-[11px]" style={{ color: "rgba(26,18,24,0.4)" }}>Labour cost: {fmt(r.cheapCost)}. Supplement captured: {fmt(r.gap)}.</p>
                    </div>
                    <div className="px-5 py-3">
                      <div className="flex justify-between mb-1"><span className="text-[12px] font-medium" style={{ color: C.inkDark }}>C. Hit 105% (defensive headroom)</span><span className="text-[12px] font-medium" style={{ color: r.net105 > 0 ? C.good : C.warn }}>{r.net105 > 0 ? "+" : ""}{fmt(r.net105)}</span></div>
                      <p className="text-[11px]" style={{ color: "rgba(26,18,24,0.4)" }}>Buy headroom against a bad quarter. Total cost: {fmt(r.cost105)}.</p>
                    </div>
                  </div>
                </div>
              )}

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
