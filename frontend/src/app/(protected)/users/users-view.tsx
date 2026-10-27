'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserTable } from '@/components/users/UserTable';
import { UserForm } from '@/components/users/UserForm';
import { DataPagination } from '@/components/ui/data-pagination';
import {
  useUsers,
  useCreateUser,
  UserFilters,
  UserFormData,
} from '@/hooks/useUsers';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';

export function UsersView() {
  const [filters, setFilters] = useState<UserFilters>({ page: 1, limit: 10 });
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data, isLoading } = useUsers(filters);
  const createUser = useCreateUser();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setFilters({ ...filters, search: value, page: 1 });
  };

  const handleSubmit = async (formData: UserFormData) => {
    try {
      await createUser.mutateAsync(formData);
      toast.success('User created successfully');
      setIsFormOpen(false);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage users"
        description="View and manage application accounts and roles."
        action={
          <Button size="default" className="shadow-sm" onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <UserTable users={data?.users || []} isLoading={isLoading} />

      {data?.pagination && data.pagination.totalCount > 0 && (
        <DataPagination
          currentPage={data.pagination.currentPage}
          totalPages={data.pagination.totalPages}
          totalCount={data.pagination.totalCount}
          hasNextPage={data.pagination.hasNextPage}
          hasPrevPage={data.pagination.hasPrevPage}
          onPageChange={handlePageChange}
        />
      )}

      <UserForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        isLoading={createUser.isPending}
      />
    </div>
  );
}
