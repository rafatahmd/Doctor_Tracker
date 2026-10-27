'use client';

import { useEffect, useMemo } from 'react';
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
import { PHONE_PLACEHOLDER, isOptionalEmailValid } from '@/lib/utils';
import { Patient, PatientFormData } from '@/hooks/usePatients';
import { Doctor, useDoctors } from '@/hooks/useDoctors';

function getDoctorId(doctor: Patient['doctor'] | undefined): string {
  if (!doctor) return '';
  if (typeof doctor === 'string') return doctor;
  return doctor._id ?? '';
}

function formatDoctorLabel(doctor: Pick<Doctor, 'name' | 'specialization'>): string {
  return doctor.specialization ? `${doctor.name} - ${doctor.specialization}` : doctor.name;
}

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
          doctor: getDoctorId(patient.doctor),
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

  const doctorOptions = useMemo(() => {
    const list = [...(doctorsData?.doctors ?? [])];
    const assigned = patient?.doctor;
    if (assigned && typeof assigned === 'object' && assigned._id && assigned.name) {
      if (!list.some((d) => d._id === assigned._id)) {
        list.unshift({
          _id: assigned._id,
          name: assigned.name,
          specialization: assigned.specialization ?? '',
          hospital: assigned.hospital ?? '',
          phone: '',
          email: '',
          createdAt: '',
          updatedAt: '',
        });
      }
    }
    return list;
  }, [doctorsData?.doctors, patient?.doctor]);

  const selectedDoctorOption = doctorOptions.find((d) => d._id === selectedDoctor);

  const handleFormSubmit = async (data: FormValues) => {
    const age = parseInt(data.age, 10);
    const cleanData: PatientFormData = {
      name: data.name,
      condition: data.condition,
      phone: data.phone.trim(),
      age,
      gender: data.gender as 'Male' | 'Female' | 'Other',
    };

    if (data.email.trim()) cleanData.email = data.email.trim();
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
    if (!value?.trim()) return 'Age is required';
    const age = parseInt(value, 10);
    if (isNaN(age) || age < 0 || age > 150) return 'Age must be between 0 and 150';
    return true;
  };

  const validateGender = (value: string) => {
    if (!value || !['Male', 'Female', 'Other'].includes(value)) {
      return 'Gender is required';
    }
    return true;
  };

  const validatePhone = (value: string) => {
    if (!value?.trim()) return 'Phone is required';
    return true;
  };

  const validateEmail = (value: string) =>
    isOptionalEmailValid(value) ? true : 'Invalid email address';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{patient ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
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
              <input type="hidden" {...register('gender', { validate: validateGender })} />
              <Select
                value={selectedGender}
                onValueChange={(value) =>
                  setValue('gender', value || '', { shouldValidate: true })
                }
              >
                <SelectTrigger className="w-full" aria-invalid={!!errors.gender}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-destructive">{errors.gender.message}</p>
              )}
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
                placeholder={PHONE_PLACEHOLDER}
                {...register('phone', { validate: validatePhone })}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
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
                value={selectedDoctor || undefined}
                onValueChange={(value) => setValue('doctor', value || '')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select doctor">
                    {selectedDoctorOption ? formatDoctorLabel(selectedDoctorOption) : null}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {doctorOptions.map((doctor) => (
                    <SelectItem key={doctor._id} value={doctor._id}>
                      {formatDoctorLabel(doctor)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              loadingText={patient ? 'Updating...' : 'Creating...'}
            >
              {patient ? 'Update Patient' : 'Add Patient'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
