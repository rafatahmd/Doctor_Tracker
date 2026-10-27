'use client';

import { useDashboardStats } from '@/hooks/useDashboard';
import { StatsCards } from '@/components/dashboard/StatsCards';
import {
  PatientsPerDoctorChart,
  DoctorsBySpecializationChart,
  PatientsByConditionChart,
  MonthlyGrowthChart,
} from '@/components/dashboard/Charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { AlertCircle } from 'lucide-react';

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function DashboardView() {
  const { data, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <AlertCircle className="h-10 w-10 text-destructive mb-4" />
          <p className="text-muted-foreground">Failed to load dashboard data</p>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <StatsCards
        totalDoctors={data.summary.totalDoctors}
        totalPatients={data.summary.totalPatients}
        newPatientsThisMonth={data.summary.newPatientsThisMonth}
        avgPatientsPerDoctor={data.summary.avgPatientsPerDoctor}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <PatientsPerDoctorChart data={data.patientsPerDoctor} />
        <DoctorsBySpecializationChart data={data.doctorsBySpecialization} />
        <PatientsByConditionChart data={data.patientsByCondition} />
        <MonthlyGrowthChart data={data.monthlyGrowth} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentDoctors.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No doctors yet</p>
              ) : (
                data.recentDoctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-sm">{doctor.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doctor.specialization} • {doctor.hospital}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {format(new Date(doctor.createdAt), 'MMM d')}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentPatients.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No patients yet</p>
              ) : (
                data.recentPatients.map((patient) => (
                  <div
                    key={patient._id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-sm">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {patient.condition} • Dr. {patient.doctor?.name?.replace('Dr. ', '')}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {format(new Date(patient.createdAt), 'MMM d')}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
