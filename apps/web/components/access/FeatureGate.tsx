"use client";

import type { Role, FeatureAccess } from "@/lib/roles/types";
import { getRoleConfig } from "@/lib/roles/config";

interface FeatureGateProps {
  feature: string;
  role: Role;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Single enforcement point for feature access.
 * Wrap every action button, form, approval workflow with this.
 * No role checks anywhere else in the component tree.
 *
 * 'full' — renders children with full interactivity
 * 'read' — renders fallback or read-only wrapper
 * 'hidden' — renders nothing
 */
export function FeatureGate({ feature, role, children, fallback }: FeatureGateProps) {
  const config = getRoleConfig(role);
  const access: FeatureAccess = config.features[feature] ?? "hidden";

  if (access === "hidden") return null;

  if (access === "read") {
    return fallback ? <>{fallback}</> : (
      <div className="opacity-60 pointer-events-none" title="Your role has read access">
        {children}
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Hook for checking feature access in logic (not just rendering).
 */
export function useFeatureAccess(feature: string, role: Role): FeatureAccess {
  const config = getRoleConfig(role);
  return config.features[feature] ?? "hidden";
}

/**
 * Check if CHRIS Coach should be shown for this role.
 */
export function shouldShowCoach(role: Role): boolean {
  const config = getRoleConfig(role);
  return config.chrisCoach.persona !== "readonly";
}
