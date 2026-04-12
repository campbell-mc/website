"use client";

import type { RoleName, FeatureAccess } from "@/lib/roles/config";
import { getRoleConfig, hasFeatureAccess } from "@/lib/roles/config";

interface FeatureGateProps {
  feature: keyof ReturnType<typeof getRoleConfig>['features'];
  role: RoleName;
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
  const access = hasFeatureAccess(role, feature);

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
export function useFeatureAccess(feature: keyof ReturnType<typeof getRoleConfig>['features'], role: RoleName): FeatureAccess {
  return hasFeatureAccess(role, feature);
}

/**
 * Check if CHRIS Coach should be shown for this role.
 */
export function shouldShowCoach(role: RoleName): boolean {
  const config = getRoleConfig(role);
  return config.chris_coach.enabled;
}
