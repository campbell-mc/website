// ============================================================================
// CHRIS Coach Persona System Prompts
//
// DEPRECATED: Persona text is now defined directly in each role's
// chris_coach.persona field in config.ts. This file provides a fallback
// lookup for any code still referencing getCoachPersona().
// ============================================================================

import type { RoleName } from "./config";
import { getRoleConfig } from "./config";

/**
 * Get the CHRIS Coach persona system prompt for a role.
 * Now reads directly from the role config's chris_coach.persona field.
 */
export function getCoachPersona(role: RoleName): string {
  const config = getRoleConfig(role);
  return config.chris_coach.persona;
}
