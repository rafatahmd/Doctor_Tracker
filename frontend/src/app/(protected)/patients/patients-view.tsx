'use client';

import { useState } from 'react';
import { PatientFilters } from '@/components/patients/PatientFilters';
import { PatientTable } from '@/components/patients/PatientTable';
import { PatientForm } from '@/components/patients/PatientForm';
import { DataPagination } from '@/components/ui/data-pagination';
import {
  usePatients,
  useUpdatePatient,
  useDeletePatient,
  Patient,
  PatientFilters as PatientFiltersType,
  PatientFormData,
} from '@/hooks/usePatients';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';
import {
  listPageLayoutClassName,
  listPageTableSlotClassName,
} from '@/components/ui/data-table-shell';
import { useAuth } from '@/context/AuthContext';

export function PatientsView() {
  const { isAdmin } = useAuth();
  const [filters, setFilters] = useState<PatientFiltersType>({ page: 1, limit: 10 });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const { data, isLoading } = usePatients(filters);
  const updatePatient = useUpdatePatient();
  const deletePatient = useDeletePatient();

  const handleSubmit = async (formData: PatientFormData) => {
    try {
      if (editingPatient) {
        await updatePatient.mutateAsync({ id: editingPatient._id, data: formData });
        toast.success('Patient updated successfully');
      }
      setIsFormOpen(false);
      setEditingPatient(null);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePatient.mutateAsync(id);
      toast.success('Patient deleted successfully');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to delete patient');
    }
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  return (
    <div className={listPageLayoutClassName}>
      <PageHeader
        title="Manage patients"
        description="Review patient records, conditions, and assigned doctors."
      />

      <PatientFilters filters={filters} onFiltersChange={setFilters} />

      <div className={listPageTableSlotClassName} data-table-slot>
        <PatientTable
          patients={data?.patients || []}
          isLoading={isLoading}
          canMutate={isAdmin}
          onEdit={isAdmin ? handleEdit : undefined}
          onDelete={isAdmin ? handleDelete : undefined}
          isDeleting={deletePatient.isPending}
        />
      </div>

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

      <PatientForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingPatient(null);
        }}
        patient={editingPatient}
        onSubmit={handleSubmit}
        isLoading={updatePatient.isPending}
        showDoctorSelect={true}
      />
    </div>
  );
}
