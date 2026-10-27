import { AdminGuard } from '@/components/layout/AdminGuard';
import { UsersView } from './users-view';

export const instant = false;

export default function UsersPage() {
  return (
    <AdminGuard>
      <UsersView />
    </AdminGuard>
  );
}
