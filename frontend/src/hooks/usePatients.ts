import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Patient {
  _id: string;
  name: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  condition: string;
  phone?: string;
  email?: string;
  doctor: {
    _id: string;
    name: string;
    specialization?: string;
    hospital?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PatientFormData {
  name: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  condition: string;
  phone?: string;
  email?: string;
  doctor?: string;
}

export interface PatientsResponse {
  patients: Patient[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface PatientFilters {
  search?: string;
  condition?: string;
  gender?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export function usePatients(filters: PatientFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.condition) params.set('condition', filters.condition);
  if (filters.gender) params.set('gender', filters.gender);
  if (filters.fromDate) params.set('fromDate', filters.fromDate);
  if (filters.toDate) params.set('toDate', filters.toDate);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));

  return useQuery({
    queryKey: ['patients', filters],
    queryFn: async () => {
      const response = await api.get(`/patients?${params.toString()}`);
      return response.data.data as PatientsResponse;
    },
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: ['patients', id],
    queryFn: async () => {
      const response = await api.get(`/patients/${id}`);
      return response.data.data.patient as Patient;
    },
    enabled: !!id,
  });
}

export function useConditions() {
  return useQuery({
    queryKey: ['conditions'],
    queryFn: async () => {
      const response = await api.get('/patients/conditions');
      return response.data.data.conditions as string[];
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PatientFormData }) => {
      const response = await api.put(`/patients/${id}`, data);
      return response.data.data.patient as Patient;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patients', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/patients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
}

// For doctor's patients
export function useDoctorPatients(doctorId: string, filters: PatientFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.condition) params.set('condition', filters.condition);
  if (filters.fromDate) params.set('fromDate', filters.fromDate);
  if (filters.toDate) params.set('toDate', filters.toDate);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));

  return useQuery({
    queryKey: ['doctors', doctorId, 'patients', filters],
    queryFn: async () => {
      const response = await api.get(`/doctors/${doctorId}/patients?${params.toString()}`);
      return response.data.data as PatientsResponse;
    },
    enabled: !!doctorId,
  });
}

export function useAddDoctorPatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ doctorId, data }: { doctorId: string; data: Omit<PatientFormData, 'doctor'> }) => {
      const response = await api.post(`/doctors/${doctorId}/patients`, data);
      return response.data.data.patient as Patient;
    },
    onSuccess: (_, { doctorId }) => {
      queryClient.invalidateQueries({ queryKey: ['doctors', doctorId, 'patients'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['conditions'] });
    },
  });
}

export function useRemoveDoctorPatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ doctorId, patientId }: { doctorId: string; patientId: string }) => {
      await api.delete(`/doctors/${doctorId}/patients/${patientId}`);
    },
    onSuccess: (_, { doctorId }) => {
      queryClient.invalidateQueries({ queryKey: ['doctors', doctorId, 'patients'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
