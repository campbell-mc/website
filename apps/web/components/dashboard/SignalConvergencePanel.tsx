"use client";

import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp, MessageSquare, Share2 } from "lucide-react";

interface DataPoint {
  domain: string;
  metric: string;
  value: string | number;
  context: string;
}

interface ConvergenceSignal {
  id: string;
  type: "causal" | "predictive" | "amplifying" | "exonerating";
  confidence: "strong" | "emerging" | "novel";
  headline: string;
  domains: string[];
  explanation: string;
  dataPoints: DataPoint[];
  implication: string;
  recommendedAction: string;
  ownerRole?: string;
}

interface SignalConvergencePanelProps {
  signals: ConvergenceSignal[];
  title?: string;
  className?: string;
}

const TYPE_CONFIG = {
  causal: { label: "CAUSAL", color: "text-[var(--brand-terracotta)]", bg: "bg-[rgba(196,112,74,0.08)]" },
  predictive: { label: "PREDICTIVE", color: "text-[var(--brand-amber)]", bg: "bg-[rgba(212,160,23,0.08)]" },
  amplifying: { label: "AMPLIFYING", color: "text-red-600", bg: "bg-red-50" },
  exonerating: { label: "EXONERATING", color: "text-[var(--brand-teal)]", bg: "bg-[rgba(45,125,115,0.08)]" },
};

const CONFIDENCE_CONFIG = {
  strong: { label: "STRONG", border: "border-solid", borderColor: "border-[var(--brand-amber)]" },
  emerging: { label: "EMERGING", border: "border-dashed", borderColor: "border-[var(--brand-amber)]" },
  novel: { label: "NOVEL", border: "border-dashed", borderColor: "border-gray-300" },
};

const DOMAIN_LABELS: Record<string, string> = {
  clinical: "Clinical",
  workforce: "Workforce",
  financial: "Financial",
  psh: "PSH",
  operational: "Operational",
  governance: "Governance",
};

export function SignalConvergencePanel({ signals, title = "Signal Convergence", className = "" }: SignalConvergencePanelProps) {
  if (signals.length === 0) return null;

  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-base font-semibold text-[var(--brand-forest)] mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[var(--brand-amber)]" />
        {title}
      </h2>
      <div className="space-y-3">
        {signals.map((signal) => (
          <SignalCard key={signal.id} signal={signal} />
        ))}
      </div>
    </div>
  );
}

function SignalCard({ signal }: { signal: ConvergenceSignal }) {
  const [expanded, setExpanded] = useState(false);
  const type = TYPE_CONFIG[signal.type];
  const conf = CONFIDENCE_CONFIG[signal.confidence];

  return (
    <div className={`rounded-xl border-l-4 ${conf.borderColor} bg-white shadow-warm-sm overflow-hidden`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left p-4">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${type.bg} ${type.color}`}>
            {type.label}
          </span>
          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${conf.border} ${conf.borderColor} text-gray-500`}>
            {conf.label}
          </span>
          {signal.domains.map((d) => (
            <span key={d} className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-[rgba(27,67,50,0.06)] text-gray-500">
              {DOMAIN_LABELS[d] ?? d}
            </span>
          ))}
        </div>

        {/* Headline */}
        <p className="text-sm font-semibold text-[var(--brand-forest)] mb-1">{signal.headline}</p>

        {/* Expand toggle */}
        <div className="flex items-center gap-1 text-[10px] text-gray-400">
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? "Less" : "Details"}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3 animate-slideUp">
          {/* Explanation */}
          <p className="text-sm text-gray-700 leading-relaxed mb-3">{signal.explanation}</p>

          {/* Data points */}
          <div className="bg-[rgba(27,67,50,0.03)] rounded-lg p-3 mb-3">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Supporting Data</p>
            <div className="space-y-1.5">
              {signal.dataPoints.map((dp, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className="font-medium text-[var(--brand-forest)] w-16 shrink-0">{DOMAIN_LABELS[dp.domain] ?? dp.domain}</span>
                  <span className="text-gray-600">{dp.metric}: <strong>{dp.value}</strong> — {dp.context}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Implication */}
          <p className="text-xs text-gray-500 italic mb-3">{signal.implication}</p>

          {/* Action */}
          <div className="card-forest rounded-lg p-3 mb-3">
            <p className="text-xs font-semibold text-[var(--brand-forest)] mb-1">Recommended Action</p>
            <p className="text-xs text-gray-700">{signal.recommendedAction}</p>
            {signal.ownerRole && (
              <p className="text-[10px] text-gray-400 mt-1">Owner: {signal.ownerRole}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-[var(--brand-forest)] text-white hover:opacity-90">
              <MessageSquare className="w-3 h-3" /> Discuss with CHRIS
            </button>
            <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-[var(--border-default)] text-[var(--brand-forest)] hover:bg-[rgba(27,67,50,0.04)]">
              <Share2 className="w-3 h-3" /> Share with ELT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
