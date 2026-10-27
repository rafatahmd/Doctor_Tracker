'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DoctorFilters } from '@/components/doctors/DoctorFilters';
import { DoctorTable } from '@/components/doctors/DoctorTable';
import { DoctorForm } from '@/components/doctors/DoctorForm';
import { DataPagination } from '@/components/ui/data-pagination';
import {
  useDoctors,
  useCreateDoctor,
  useUpdateDoctor,
  useDeleteDoctor,
  Doctor,
  DoctorFilters as DoctorFiltersType,
  DoctorFormData,
} from '@/hooks/useDoctors';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';
import { useAuth } from '@/context/AuthContext';

export function DoctorsView() {
  const { isAdmin } = useAuth();
  const [filters, setFilters] = useState<DoctorFiltersType>({ page: 1, limit: 10 });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const { data, isLoading } = useDoctors(filters);
  const createDoctor = useCreateDoctor();
  const updateDoctor = useUpdateDoctor();
  const deleteDoctor = useDeleteDoctor();

  const handleSubmit = async (formData: DoctorFormData) => {
    try {
      if (editingDoctor) {
        await updateDoctor.mutateAsync({ id: editingDoctor._id, data: formData });
        toast.success('Doctor updated successfully');
      } else {
        await createDoctor.mutateAsync(formData);
        toast.success('Doctor created successfully');
      }
      setIsFormOpen(false);
      setEditingDoctor(null);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoctor.mutateAsync(id);
      toast.success('Doctor deleted successfully');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to delete doctor');
    }
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage doctors"
        description="Search, filter, and maintain doctor records across your organization."
        action={
          isAdmin ? (
            <Button size="default" className="shadow-sm" onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Doctor
            </Button>
          ) : undefined
        }
      />

      <DoctorFilters filters={filters} onFiltersChange={setFilters} />

      <DoctorTable
        doctors={data?.doctors || []}
        isLoading={isLoading}
        canMutate={isAdmin}
        onEdit={isAdmin ? handleEdit : undefined}
        onDelete={isAdmin ? handleDelete : undefined}
        isDeleting={deleteDoctor.isPending}
      />

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

      <DoctorForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingDoctor(null);
        }}
        doctor={editingDoctor}
        onSubmit={handleSubmit}
        isLoading={createDoctor.isPending || updateDoctor.isPending}
      />
    </div>
  );
}
