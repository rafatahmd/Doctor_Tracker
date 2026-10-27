import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  patientCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorFormData {
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
}

export interface DoctorsResponse {
  doctors: Doctor[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface DoctorFilters {
  search?: string;
  specialization?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export function useDoctors(filters: DoctorFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.specialization) params.set('specialization', filters.specialization);
  if (filters.fromDate) params.set('fromDate', filters.fromDate);
  if (filters.toDate) params.set('toDate', filters.toDate);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));

  return useQuery({
    queryKey: ['doctors', filters],
    queryFn: async () => {
      const response = await api.get(`/doctors?${params.toString()}`);
      return response.data.data as DoctorsResponse;
    },
  });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: ['doctors', id],
    queryFn: async () => {
      const response = await api.get(`/doctors/${id}`);
      return response.data.data.doctor as Doctor;
    },
    enabled: !!id,
  });
}

export function useSpecializations() {
  return useQuery({
    queryKey: ['specializations'],
    queryFn: async () => {
      const response = await api.get('/doctors/specializations');
      return response.data.data.specializations as string[];
    },
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DoctorFormData) => {
      const response = await api.post('/doctors', data);
      return response.data.data.doctor as Doctor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['specializations'] });
    },
  });
}

export function useUpdateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: DoctorFormData }) => {
      const response = await api.put(`/doctors/${id}`, data);
      return response.data.data.doctor as Doctor;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['doctors', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['specializations'] });
    },
  });
}

export function useDeleteDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/doctors/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}
