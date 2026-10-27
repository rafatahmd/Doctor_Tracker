'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import { CHART_COLORS, chartAxisStyle, chartGridStroke } from './chart-theme';

interface ChartData {
  name: string;
  count: number;
}

interface MonthlyData {
  month: string;
  doctors: number;
  patients: number;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-popover-foreground shadow-md">
      {label && (
        <p className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</p>
      )}
      <ul className="space-y-1">
        {payload.map((entry) => (
          <li key={entry.name} className="flex items-center gap-2 text-sm">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-semibold tabular-nums">{entry.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChartCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="border-b border-border/60 pb-4">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pt-4">{children}</CardContent>
    </Card>
  );
}

function truncateLabel(name: string, max = 14) {
  return name.length > max ? `${name.slice(0, max)}…` : name;
}

export function PatientsPerDoctorChart({ data }: { data: ChartData[] }) {
  const chartData = data.map((d) => ({
    ...d,
    shortName: truncateLabel(d.name.replace(/^Dr\.\s*/, ''), 18),
  }));

  return (
    <ChartCard
      className="col-span-1 lg:col-span-2"
      title="Patients per doctor"
      description="Top 10 doctors by active patient count"
    >
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
            <CartesianGrid stroke={chartGridStroke} strokeDasharray="4 4" horizontal={false} />
            <XAxis
              type="number"
              tick={chartAxisStyle}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              dataKey="shortName"
              type="category"
              width={120}
              tick={chartAxisStyle}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'color-mix(in oklch, var(--muted) 40%, transparent)' }} />
            <Bar
              dataKey="count"
              name="Patients"
              fill="var(--chart-1)"
              radius={[0, 6, 6, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

function DonutChart({ data, title, description }: { data: ChartData[]; title: string; description?: string }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <ChartCard title={title} description={description}>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={56}
              outerRadius={88}
              paddingAngle={3}
              dataKey="count"
              nameKey="name"
              stroke="var(--card)"
              strokeWidth={2}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={48}
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-xs text-muted-foreground">{value}</span>
              )}
            />
            <text
              x="50%"
              y="42%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-foreground text-2xl font-semibold"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {total}
            </text>
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-xs"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              total
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function DoctorsBySpecializationChart({ data }: { data: ChartData[] }) {
  return (
    <DonutChart
      data={data}
      title="Doctors by specialization"
      description="Distribution across medical fields"
    />
  );
}

export function PatientsByConditionChart({ data }: { data: ChartData[] }) {
  return (
    <DonutChart
      data={data}
      title="Patients by condition"
      description="Most common diagnoses (top 10)"
    />
  );
}

export function MonthlyGrowthChart({ data }: { data: MonthlyData[] }) {
  return (
    <ChartCard
      className="col-span-1 lg:col-span-2"
      title="Registration trend"
      description="New doctors and patients over the last 12 months"
    >
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDoctors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={chartGridStroke} strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="month" tick={chartAxisStyle} tickLine={false} axisLine={false} />
            <YAxis tick={chartAxisStyle} tickLine={false} axisLine={false} allowDecimals={false} width={36} />
            <Tooltip content={<ChartTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingBottom: 8 }}
              formatter={(value) => (
                <span className="text-xs font-medium text-muted-foreground">{value}</span>
              )}
            />
            <Area
              type="monotone"
              dataKey="doctors"
              name="Doctors"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#colorDoctors)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="patients"
              name="Patients"
              stroke="var(--chart-2)"
              strokeWidth={2}
              fill="url(#colorPatients)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
