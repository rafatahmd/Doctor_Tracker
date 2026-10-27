import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface DashboardStats {
  summary: {
    totalDoctors: number;
    totalPatients: number;
    newDoctorsThisMonth: number;
    newPatientsThisMonth: number;
    avgPatientsPerDoctor: number;
  };
  patientsPerDoctor: { name: string; count: number }[];
  doctorsBySpecialization: { name: string; count: number }[];
  patientsByCondition: { name: string; count: number }[];
  monthlyGrowth: { month: string; doctors: number; patients: number }[];
  recentDoctors: { _id: string; name: string; specialization: string; hospital: string; createdAt: string }[];
  recentPatients: { _id: string; name: string; condition: string; doctor: { name: string }; createdAt: string }[];
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const response = await api.get('/dashboard/stats');
      return response.data.data as DashboardStats;
    },
  });
}
