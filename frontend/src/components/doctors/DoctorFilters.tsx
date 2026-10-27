'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useSpecializations, DoctorFilters as DoctorFiltersType } from '@/hooks/useDoctors';
import { Search, X, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DoctorFiltersProps {
  filters: DoctorFiltersType;
  onFiltersChange: (filters: DoctorFiltersType) => void;
}

export function DoctorFilters({ filters, onFiltersChange }: DoctorFiltersProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);
  const { data: specializations } = useSpecializations();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== filters.search) {
        onFiltersChange({ ...filters, search, page: 1 });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, filters, onFiltersChange]);

  const handleSpecializationChange = (value: string | null) => {
    onFiltersChange({
      ...filters,
      specialization: !value || value === 'all' ? undefined : value,
      page: 1,
    });
  };

  const handleFromDateChange = (date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      fromDate: date ? format(date, 'yyyy-MM-dd') : undefined,
      page: 1,
    });
    setFromDateOpen(false);
  };

  const handleToDateChange = (date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      toDate: date ? format(date, 'yyyy-MM-dd') : undefined,
      page: 1,
    });
    setToDateOpen(false);
  };

  const clearFilters = () => {
    setSearch('');
    onFiltersChange({ page: 1, limit: filters.limit });
  };

  const hasFilters = search || filters.specialization || filters.fromDate || filters.toDate;

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search doctors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 pl-10 shadow-sm"
        />
      </div>
      
      <Select
        value={filters.specialization || 'all'}
        onValueChange={handleSpecializationChange}
      >
        <SelectTrigger className="h-9 w-full sm:w-[200px]">
          <span className="truncate text-sm">
            {filters.specialization ?? 'All specializations'}
          </span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Specializations</SelectItem>
          {specializations?.map((spec) => (
            <SelectItem key={spec} value={spec}>
              {spec}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover open={fromDateOpen} onOpenChange={setFromDateOpen}>
        <PopoverTrigger
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'w-full sm:w-[140px] justify-start text-left font-normal',
            !filters.fromDate && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {filters.fromDate ? format(new Date(filters.fromDate), 'MMM d, yyyy') : 'From'}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={filters.fromDate ? new Date(filters.fromDate) : undefined}
            onSelect={handleFromDateChange}
          />
        </PopoverContent>
      </Popover>

      <Popover open={toDateOpen} onOpenChange={setToDateOpen}>
        <PopoverTrigger
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'w-full sm:w-[140px] justify-start text-left font-normal',
            !filters.toDate && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {filters.toDate ? format(new Date(filters.toDate), 'MMM d, yyyy') : 'To'}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={filters.toDate ? new Date(filters.toDate) : undefined}
            onSelect={handleToDateChange}
          />
        </PopoverContent>
      </Popover>

      {hasFilters && (
        <Button variant="ghost" onClick={clearFilters} className="w-full sm:w-auto">
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      )}
    </div>
  );
}
