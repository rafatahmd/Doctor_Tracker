'use client';

import { Stethoscope, Users, UserPlus, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardsProps {
  totalDoctors: number;
  totalPatients: number;
  newPatientsThisMonth: number;
  avgPatientsPerDoctor: number;
}

type StatConfig = {
  title: string;
  value: number;
  icon: typeof Stethoscope;
  cardClass: string;
  iconClass: string;
  labelClass: string;
  valueClass: string;
  glowClass: string;
};

export function StatsCards({
  totalDoctors,
  totalPatients,
  newPatientsThisMonth,
  avgPatientsPerDoctor,
}: StatsCardsProps) {
  const stats: StatConfig[] = [
    {
      title: 'Total Doctors',
      value: totalDoctors,
      icon: Stethoscope,
      cardClass:
        'border-sky-200/90 bg-gradient-to-br from-sky-100/90 via-white to-sky-50/50 dark:border-sky-800/50 dark:from-sky-950/50 dark:via-card dark:to-sky-900/25',
      iconClass: 'bg-sky-500 text-white shadow-md shadow-sky-500/35',
      labelClass: 'text-sky-800/70 dark:text-sky-200/80',
      valueClass: 'text-sky-950 dark:text-sky-50',
      glowClass: 'bg-sky-400/20',
    },
    {
      title: 'Total Patients',
      value: totalPatients,
      icon: Users,
      cardClass:
        'border-teal-200/90 bg-gradient-to-br from-teal-100/80 via-white to-emerald-50/60 dark:border-teal-800/50 dark:from-teal-950/45 dark:via-card dark:to-emerald-900/20',
      iconClass: 'bg-teal-600 text-white shadow-md shadow-teal-600/35',
      labelClass: 'text-teal-900/70 dark:text-teal-200/80',
      valueClass: 'text-teal-950 dark:text-teal-50',
      glowClass: 'bg-teal-400/20',
    },
    {
      title: 'New This Month',
      value: newPatientsThisMonth,
      icon: UserPlus,
      cardClass:
        'border-violet-200/90 bg-gradient-to-br from-violet-100/75 via-white to-purple-50/50 dark:border-violet-800/50 dark:from-violet-950/45 dark:via-card dark:to-purple-900/25',
      iconClass: 'bg-violet-600 text-white shadow-md shadow-violet-600/35',
      labelClass: 'text-violet-900/70 dark:text-violet-200/80',
      valueClass: 'text-violet-950 dark:text-violet-50',
      glowClass: 'bg-violet-400/20',
    },
    {
      title: 'Avg Patients / Doctor',
      value: avgPatientsPerDoctor,
      icon: TrendingUp,
      cardClass:
        'border-amber-200/90 bg-gradient-to-br from-amber-100/70 via-white to-orange-50/50 dark:border-amber-800/45 dark:from-amber-950/40 dark:via-card dark:to-orange-900/20',
      iconClass: 'bg-amber-500 text-amber-950 shadow-md shadow-amber-500/35',
      labelClass: 'text-amber-900/70 dark:text-amber-200/80',
      valueClass: 'text-amber-950 dark:text-amber-50',
      glowClass: 'bg-amber-400/25',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className={cn(
            'group relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-200',
            'hover:-translate-y-0.5 hover:shadow-md',
            stat.cardClass
          )}
        >
          <div
            className={cn(
              'pointer-events-none absolute -right-6 -top-8 size-28 rounded-full blur-2xl',
              stat.glowClass
            )}
            aria-hidden
          />
          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-3">
              <p className={cn('text-sm font-medium', stat.labelClass)}>{stat.title}</p>
              <p className={cn('text-3xl font-bold tabular-nums tracking-tight', stat.valueClass)}>
                {stat.value.toLocaleString()}
              </p>
            </div>
            <div
              className={cn(
                'flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105',
                stat.iconClass
              )}
            >
              <stat.icon className="size-5" strokeWidth={2.25} aria-hidden />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
