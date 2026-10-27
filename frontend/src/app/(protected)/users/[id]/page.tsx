import { AdminGuard } from '@/components/layout/AdminGuard';
import { UserDetailView } from '../user-detail-view';

export const instant = false;

export default function UserDetailPage() {
  return (
    <AdminGuard>
      <UserDetailView />
    </AdminGuard>
  );
}
