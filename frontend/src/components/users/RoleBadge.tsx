import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ROLE_LABELS, roleBadgeClassName, type UserRole } from '@/lib/roles';

export function RoleBadge({
  role,
  className,
}: {
  role: UserRole;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn('font-medium', roleBadgeClassName[role], className)}
    >
      {ROLE_LABELS[role]}
    </Badge>
  );
}
