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

/** Soft, distinct role pills (tables + profile). */
export const roleBadgeClassName: Record<UserRole, string> = {
  admin:
    'border-amber-200/90 bg-amber-50/95 text-amber-950 hover:bg-amber-50/95 dark:border-amber-700/40 dark:bg-amber-500/12 dark:text-amber-100',
  general:
    'border-sky-200/90 bg-sky-100/90 text-sky-900 hover:bg-sky-100/90 dark:border-sky-700/45 dark:bg-sky-500/15 dark:text-sky-200',
};
