// ============================================================================
// Role Types — backwards compatibility layer
// The canonical config is now in config.ts with RoleName.
// This file re-exports for files that import Role from here.
// ============================================================================

export type { RoleName as Role, RoleName, RoleConfig, FeatureAccess, DataScope, NotificationType } from "./config";
