// BottomNav — DEPRECATED
// Replaced by slide-out sidebar drawer on mobile.
// Kept as empty export to avoid broken imports during migration.

import type { RoleName } from "@/lib/roles/config";

export function BottomNav({ userRole: _userRole }: { userRole: RoleName }) {
  return null;
}
