export type UserRole = 'general' | 'admin';

export const ROLES = {
  GENERAL: 'general' as const,
  ADMIN: 'admin' as const,
};

export const ROLE_LABELS: Record<UserRole, string> = {
  general: 'General User',
  admin: 'Admin',
};

export function isAdminRole(role: UserRole | undefined): boolean {
  return role === ROLES.ADMIN;
}
