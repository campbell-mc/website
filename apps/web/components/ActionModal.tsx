"use client";

import { useState } from "react";
import { CheckCircle, Mic, X } from "lucide-react";
import { ChrisAvatar } from "./chris/ChrisAvatar";

// ============================================================================
// Reusable Action Modal — every action button in CHRIS opens one of these.
// Variants: confirm, form, voice, assign, schedule, export, feedback
// ============================================================================

export type ActionVariant = "confirm" | "form" | "voice" | "assign" | "schedule" | "export" | "feedback";

interface ActionModalProps {
  open: boolean;
  onClose: () => void;
  variant: ActionVariant;
  title: string;
  description?: string;
  chrisMessage?: string;
  primaryLabel?: string;
  onSubmit?: () => void;
  children?: React.ReactNode;
}

export function ActionModal({ open, onClose, variant, title, description, chrisMessage, primaryLabel = "Submit", onSubmit, children }: ActionModalProps) {
  const [done, setDone] = useState(false);

  if (!open) return null;

  function handleSubmit() {
    onSubmit?.();
    setDone(true);
    setTimeout(() => { setDone(false); onClose(); }, 1500);
  }

  if (done) {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-end lg:items-center justify-center p-4">
        <div className="bg-card rounded-2xl p-8 max-w-sm w-full text-center animate-scaleIn shadow-warm-lg">
          <CheckCircle className="w-12 h-12 text-[hsl(var(--brand-teal))] mx-auto mb-3" />
          <p className="text-base font-semibold text-foreground">Done</p>
          <p className="text-xs text-muted-foreground mt-1">Action recorded. CHRIS has logged this.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end lg:items-center justify-center" onClick={onClose}>
      <div className="bg-card rounded-t-2xl lg:rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto shadow-warm-lg animate-slideUp" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-base font-semibold text-foreground">{title}</p>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-4 h-4 text-muted-foreground" /></button>
        </div>

        <div className="px-5 py-4">
          {/* CHRIS context */}
          {chrisMessage && (
            <div className="flex items-start gap-2 p-3 rounded-lg mb-4" style={{ background: "rgba(27,67,50,0.05)" }}>
              <ChrisAvatar size="small" className="shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">{chrisMessage}</p>
            </div>
          )}

          {description && <p className="text-xs text-muted-foreground mb-4">{description}</p>}

          {/* Variant-specific content */}
          {variant === "confirm" && (
            <p className="text-sm text-foreground mb-4">Are you sure you want to proceed? This action will be recorded.</p>
          )}

          {variant === "form" && children}

          {variant === "voice" && (
            <div className="text-center py-6">
              <button className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 hover:opacity-90 transition-opacity">
                <Mic className="w-8 h-8" />
              </button>
              <p className="text-xs text-muted-foreground">Tap to speak. CHRIS will structure your input.</p>
            </div>
          )}

          {variant === "assign" && (
            <div className="space-y-2 mb-4">
              <p className="text-xs font-medium text-foreground">Assign to:</p>
              {["DON (Sarah Mitchell)", "Quality Lead (Lisa Chen)", "RN in Charge", "Clinical Nurse"].map((role) => (
                <button key={role} className="w-full text-left px-4 py-3 rounded-lg border border-border text-xs text-foreground hover:bg-muted/50">{role}</button>
              ))}
              <div>
                <p className="text-xs font-medium text-foreground mt-3 mb-1">Due date</p>
                <input type="date" className="w-full p-2 border border-border rounded-lg text-sm bg-background" defaultValue={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]} />
              </div>
            </div>
          )}

          {variant === "schedule" && (
            <div className="space-y-3 mb-4">
              <div>
                <p className="text-xs font-medium text-foreground mb-1">Date</p>
                <input type="date" className="w-full p-2 border border-border rounded-lg text-sm bg-background" defaultValue={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]} />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground mb-1">Time</p>
                <input type="time" className="w-full p-2 border border-border rounded-lg text-sm bg-background" defaultValue="09:00" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground mb-1">Reminder</p>
                <select className="w-full p-2 border border-border rounded-lg text-sm bg-background">
                  <option>1 hour before</option>
                  <option>1 day before</option>
                  <option>On the day at 6am</option>
                </select>
              </div>
            </div>
          )}

          {variant === "export" && (
            <div className="space-y-2 mb-4">
              <p className="text-xs text-muted-foreground">CHRIS will generate a complete evidence package including:</p>
              <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                <p className="text-xs text-foreground">✅ All audit records for the selected period</p>
                <p className="text-xs text-foreground">✅ Non-conformances and corrective actions</p>
                <p className="text-xs text-foreground">✅ SIRS submissions with reference numbers</p>
                <p className="text-xs text-foreground">✅ ISO 45003 evidence trail</p>
              </div>
              <p className="text-[10px] text-muted-foreground">Format: PDF report + CSV data appendix</p>
            </div>
          )}

          {variant === "feedback" && (
            <div className="space-y-2 mb-4">
              <textarea placeholder="Why is this not relevant to your context? (optional — helps CHRIS learn)" className="w-full p-3 border border-border rounded-lg text-xs bg-background min-h-[60px]" />
              <p className="text-[10px] text-muted-foreground">Your feedback trains the Bayesian reliability model. CHRIS will adjust recommendations.</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <button onClick={handleSubmit} className="flex-1 py-3 rounded-xl text-sm font-medium text-white bg-primary hover:opacity-90">
              {primaryLabel}
            </button>
            <button onClick={onClose} className="py-3 px-4 rounded-xl text-sm font-medium border border-border text-foreground hover:bg-muted">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Convenience hooks ---

export function useActionModal() {
  const [modal, setModal] = useState<{ open: boolean; variant: ActionVariant; title: string; description?: string; chrisMessage?: string; primaryLabel?: string } | null>(null);

  function openModal(config: Omit<NonNullable<typeof modal>, "open">) {
    setModal({ ...config, open: true });
  }

  function closeModal() {
    setModal(null);
  }

  return { modal, openModal, closeModal };
}
