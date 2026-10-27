'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Patient, PatientFormData } from '@/hooks/usePatients';
import { useDoctors } from '@/hooks/useDoctors';
import { Loader2 } from 'lucide-react';

interface FormValues {
  name: string;
  age: string;
  gender: string;
  condition: string;
  phone: string;
  email: string;
  doctor: string;
}

interface PatientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient?: Patient | null;
  doctorId?: string;
  onSubmit: (data: PatientFormData) => Promise<void>;
  isLoading?: boolean;
  showDoctorSelect?: boolean;
}

export function PatientForm({
  open,
  onOpenChange,
  patient,
  doctorId,
  onSubmit,
  isLoading,
  showDoctorSelect = false,
}: PatientFormProps) {
  const { data: doctorsData } = useDoctors({ limit: 100 });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      age: '',
      gender: '',
      condition: '',
      phone: '',
      email: '',
      doctor: doctorId || '',
    },
  });

  // Reset form when patient changes or dialog opens
  useEffect(() => {
    if (open) {
      if (patient) {
        reset({
          name: patient.name,
          age: patient.age?.toString() || '',
          gender: patient.gender || '',
          condition: patient.condition,
          phone: patient.phone || '',
          email: patient.email || '',
          doctor: patient.doctor?._id || '',
        });
      } else {
        reset({
          name: '',
          age: '',
          gender: '',
          condition: '',
          phone: '',
          email: '',
          doctor: doctorId || '',
        });
      }
    }
  }, [open, patient, doctorId, reset]);

  const selectedGender = watch('gender');
  const selectedDoctor = watch('doctor');

  const handleFormSubmit = async (data: FormValues) => {
    const cleanData: PatientFormData = {
      name: data.name,
      condition: data.condition,
    };

    if (data.age) {
      const age = parseInt(data.age, 10);
      if (!isNaN(age) && age >= 0 && age <= 150) {
        cleanData.age = age;
      }
    }

    if (data.gender && ['Male', 'Female', 'Other'].includes(data.gender)) {
      cleanData.gender = data.gender as 'Male' | 'Female' | 'Other';
    }

    if (data.phone) cleanData.phone = data.phone;
    if (data.email) cleanData.email = data.email;
    if (data.doctor) cleanData.doctor = data.doctor;

    await onSubmit(cleanData);
    reset();
  };

  const validateName = (value: string) => {
    if (!value || value.length < 2) return 'Name must be at least 2 characters';
    if (value.length > 100) return 'Name must be less than 100 characters';
    return true;
  };

  const validateCondition = (value: string) => {
    if (!value) return 'Condition is required';
    return true;
  };

  const validateAge = (value: string) => {
    if (!value) return true;
    const age = parseInt(value, 10);
    if (isNaN(age) || age < 0 || age > 150) return 'Age must be between 0 and 150';
    return true;
  };

  const validateEmail = (value: string) => {
    if (!value) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Invalid email address';
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {patient ? 'Edit Patient' : 'Add New Patient'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...register('name', { validate: validateName })}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                {...register('age', { validate: validateAge })}
              />
              {errors.age && (
                <p className="text-sm text-destructive">{errors.age.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                value={selectedGender}
                onValueChange={(value) => setValue('gender', value || '')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Input
              id="condition"
              placeholder="Diabetes, Hypertension, etc."
              {...register('condition', { validate: validateCondition })}
            />
            {errors.condition && (
              <p className="text-sm text-destructive">{errors.condition.message}</p>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="patient@email.com"
                {...register('email', { validate: validateEmail })}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          {showDoctorSelect && (
            <div className="space-y-2">
              <Label>Assigned Doctor</Label>
              <Select
                value={selectedDoctor}
                onValueChange={(value) => setValue('doctor', value || '')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctorsData?.doctors.map((doctor) => (
                    <SelectItem key={doctor._id} value={doctor._id}>
                      {doctor.name} - {doctor.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {patient ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                patient ? 'Update Patient' : 'Add Patient'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
