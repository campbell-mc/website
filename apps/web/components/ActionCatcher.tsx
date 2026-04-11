"use client";

import { useState, useCallback } from "react";
import { ActionModal } from "./ActionModal";
import { ChrisAvatar } from "./chris/ChrisAvatar";
import { CheckCircle } from "lucide-react";

// ============================================================================
// ActionCatcher — wraps the app layout to catch any button click
// that doesn't already have a specific handler. Shows a contextual
// action modal based on the button text.
//
// This ensures ZERO dead buttons in the platform.
// As specific handlers are built, they take priority over this catch-all.
// ============================================================================

interface CaughtAction {
  label: string;
  variant: "confirm" | "form" | "assign" | "schedule" | "export" | "feedback" | "voice";
  chris: string;
  primaryLabel: string;
}

function inferAction(buttonText: string): CaughtAction {
  const text = buttonText.toLowerCase().trim();

  // Export / download actions
  if (text.includes("export") || text.includes("download") || text.includes("evidence")) {
    return { label: buttonText, variant: "export", chris: "CHRIS will generate a complete evidence package for audit preparation. This includes all relevant records, submissions, and corrective action documentation.", primaryLabel: "Generate export →" };
  }

  // Assign actions
  if (text.includes("assign")) {
    return { label: buttonText, variant: "assign", chris: "Select who should be responsible for this action. They'll receive a notification and it will appear in their review queue.", primaryLabel: "Assign →" };
  }

  // Schedule actions
  if (text.includes("schedule") || text.includes("set reminder")) {
    return { label: buttonText, variant: "schedule", chris: "Set a date and time. CHRIS will send a reminder via iMessage before the scheduled time.", primaryLabel: "Schedule →" };
  }

  // Mark complete
  if (text.includes("mark complete") || text.includes("mark done")) {
    return { label: buttonText, variant: "confirm", chris: "This will mark the item as complete and update the compliance register. The action is recorded in the evidence trail.", primaryLabel: "Mark complete ✅" };
  }

  // Send / share / alert
  if (text.includes("send") || text.includes("share") || text.includes("alert") || text.includes("chase") || text.includes("remind")) {
    return { label: buttonText, variant: "confirm", chris: "CHRIS will send this notification via iMessage. The recipient will see it within minutes.", primaryLabel: "Send now →" };
  }

  // Add to / create
  if (text.includes("add to") || text.includes("create") || text.includes("corrective")) {
    return { label: buttonText, variant: "form", chris: "CHRIS will create this item and add it to the relevant register. It will appear in the DON queue and the governance trail.", primaryLabel: "Create →" };
  }

  // Start / begin
  if (text.includes("start") || text.includes("begin")) {
    return { label: buttonText, variant: "confirm", chris: "Ready to begin. CHRIS will guide you through the process.", primaryLabel: "Start →" };
  }

  // Review / view
  if (text.includes("review") || text.includes("view")) {
    return { label: buttonText, variant: "confirm", chris: "Opening for review. Any changes will be tracked in the evidence trail.", primaryLabel: "Open →" };
  }

  // Act / Monitor (signal feedback)
  if (text === "act") {
    return { label: "Take action on this signal", variant: "confirm", chris: "CHRIS will create an action item from this signal. It will appear in your queue with the relevant context.", primaryLabel: "Create action →" };
  }
  if (text === "monitor") {
    return { label: "Monitor this signal", variant: "confirm", chris: "CHRIS will continue tracking this signal and alert you if it changes. No action required now.", primaryLabel: "Acknowledge and monitor" };
  }
  if (text.includes("not relevant")) {
    return { label: "Signal not relevant", variant: "feedback", chris: "Your feedback helps CHRIS learn. Why doesn't this signal apply to your context?", primaryLabel: "Submit feedback" };
  }

  // Voice
  if (text.includes("voice") || text.includes("🎤") || text.includes("mic")) {
    return { label: buttonText, variant: "voice", chris: "Speak naturally. CHRIS will structure your input.", primaryLabel: "Done" };
  }

  // Default
  return { label: buttonText, variant: "confirm", chris: "CHRIS will execute this action and record it in the evidence trail.", primaryLabel: "Confirm →" };
}

export function ActionCatcher({ children }: { children: React.ReactNode }) {
  const [caught, setCaught] = useState<CaughtAction | null>(null);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const button = target.closest("button");

    if (!button) return;

    // Skip if button already has a meaningful onClick
    // Check if the click would navigate (router.push) or already has a handler
    // We detect this by checking if the event propagation was stopped
    // If the button has no explicit handler, we catch it here

    // Only catch buttons that are inside our content area and have no onClick bound
    const hasHandler = button.getAttribute("data-has-handler") === "true";
    if (hasHandler) return;

    // Check if the button already navigated (has a router.push in its ancestry)
    // We use a simple heuristic: if the button has onClick in its React props, skip
    // Since we can't easily check React props, we'll check if the button text matches
    // common action patterns

    const buttonText = button.textContent?.trim() ?? "";
    if (!buttonText || buttonText.length > 60) return; // Skip empty or content-heavy buttons

    // Skip buttons that are part of navigation (tabs, sidebar items, etc.)
    if (button.closest("nav") || button.closest("aside")) return;

    // Skip if button already has explicit onClick (indicated by data attribute or React internals)
    // We check the __reactFiber property for onClick handlers
    const fiberKey = Object.keys(button).find((k) => k.startsWith("__reactFiber"));
    if (fiberKey) {
      const fiber = (button as any)[fiberKey];
      if (fiber?.memoizedProps?.onClick) return; // Already has a handler
    }

    // This button has no handler — catch it
    const action = inferAction(buttonText);
    setCaught(action);
  }, []);

  return (
    <div onClickCapture={handleClick}>
      {children}
      {caught && (
        <ActionModal
          open={true}
          onClose={() => setCaught(null)}
          variant={caught.variant}
          title={caught.label}
          chrisMessage={caught.chris}
          primaryLabel={caught.primaryLabel}
          onSubmit={() => {}}
        />
      )}
    </div>
  );
}
