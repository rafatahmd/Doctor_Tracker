'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, Users, UserPlus, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardsProps {
  totalDoctors: number;
  totalPatients: number;
  newPatientsThisMonth: number;
  avgPatientsPerDoctor: number;
}

export function StatsCards({
  totalDoctors,
  totalPatients,
  newPatientsThisMonth,
  avgPatientsPerDoctor,
}: StatsCardsProps) {
  const stats = [
    {
      title: 'Total doctors',
      value: totalDoctors,
      icon: Stethoscope,
      accent: 'from-blue-500/15 to-blue-600/5 text-blue-700 dark:text-blue-300',
    },
    {
      title: 'Total patients',
      value: totalPatients,
      icon: Users,
      accent: 'from-emerald-500/15 to-emerald-600/5 text-emerald-700 dark:text-emerald-300',
    },
    {
      title: 'New this month',
      value: newPatientsThisMonth,
      icon: UserPlus,
      accent: 'from-violet-500/15 to-violet-600/5 text-violet-700 dark:text-violet-300',
    },
    {
      title: 'Avg patients / doctor',
      value: avgPatientsPerDoctor,
      icon: TrendingUp,
      accent: 'from-amber-500/15 to-amber-600/5 text-amber-800 dark:text-amber-300',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br',
                stat.accent
              )}
            >
              <stat.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums tracking-tight">
              {stat.value.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
