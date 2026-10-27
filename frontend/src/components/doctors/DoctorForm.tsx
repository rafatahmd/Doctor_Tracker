'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Doctor, DoctorFormData } from '@/hooks/useDoctors';

const doctorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  specialization: z.string().min(1, 'Specialization is required'),
  hospital: z.string().min(1, 'Hospital is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email address'),
});

interface DoctorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor?: Doctor | null;
  onSubmit: (data: DoctorFormData) => Promise<void>;
  isLoading?: boolean;
}

export function DoctorForm({
  open,
  onOpenChange,
  doctor,
  onSubmit,
  isLoading,
}: DoctorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: '',
      specialization: '',
      hospital: '',
      phone: '',
      email: '',
    },
  });

  // Reset form when doctor changes or dialog opens
  useEffect(() => {
    if (open) {
      if (doctor) {
        reset({
          name: doctor.name,
          specialization: doctor.specialization,
          hospital: doctor.hospital,
          phone: doctor.phone,
          email: doctor.email,
        });
      } else {
        reset({
          name: '',
          specialization: '',
          hospital: '',
          phone: '',
          email: '',
        });
      }
    }
  }, [open, doctor, reset]);

  const handleFormSubmit = async (data: DoctorFormData) => {
    await onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {doctor ? 'Edit Doctor' : 'Add New Doctor'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Dr. John Doe"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Input
              id="specialization"
              placeholder="Cardiology"
              {...register('specialization')}
            />
            {errors.specialization && (
              <p className="text-sm text-destructive">{errors.specialization.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hospital">Hospital</Label>
            <Input
              id="hospital"
              placeholder="City General Hospital"
              {...register('hospital')}
            />
            {errors.hospital && (
              <p className="text-sm text-destructive">{errors.hospital.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+1-555-123-4567"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="doctor@hospital.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              loadingText={doctor ? 'Updating...' : 'Creating...'}
            >
              {doctor ? 'Update Doctor' : 'Add Doctor'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
