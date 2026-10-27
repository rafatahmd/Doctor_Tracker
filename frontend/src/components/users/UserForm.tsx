'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AppUser, UserFormData } from '@/hooks/useUsers';
import { ROLE_LABELS, ROLES, UserRole } from '@/lib/roles';
import { Loader2 } from 'lucide-react';

const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum([ROLES.GENERAL, ROLES.ADMIN]),
});

const editUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: 'Password must be at least 6 characters',
    }),
  role: z.enum([ROLES.GENERAL, ROLES.ADMIN]),
});

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: AppUser | null;
  onSubmit: (data: UserFormData) => Promise<void>;
  isLoading?: boolean;
}

function UserFormFields({
  isEdit,
  isAdminUser,
  register,
  control,
  errors,
  isLoading,
  onCancel,
}: {
  isEdit: boolean;
  isAdminUser: boolean;
  register: ReturnType<typeof useForm<UserFormData>>['register'];
  control: ReturnType<typeof useForm<UserFormData>>['control'];
  errors: ReturnType<typeof useForm<UserFormData>>['formState']['errors'];
  isLoading?: boolean;
  onCancel: () => void;
}) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" className="w-full" {...register('name')} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" className="w-full" {...register('email')} />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          {isEdit ? 'New password (optional)' : 'Password'}
        </Label>
        <Input id="password" type="password" className="w-full" {...register('password')} />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Role</Label>
        {isAdminUser ? (
          <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted/50 px-3 text-sm">
            {ROLE_LABELS.admin}
          </div>
        ) : (
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value as UserRole)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ROLES.GENERAL}>
                    {ROLE_LABELS.general}
                  </SelectItem>
                  <SelectItem value={ROLES.ADMIN}>{ROLE_LABELS.admin}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        )}
        {isAdminUser && (
          <p className="text-xs text-muted-foreground">Admin role cannot be changed.</p>
        )}
        {errors.role && (
          <p className="text-sm text-destructive">{errors.role.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? 'Save changes' : 'Create user'}
        </Button>
      </div>
    </>
  );
}

export function UserForm({
  open,
  onOpenChange,
  user,
  onSubmit,
  isLoading,
}: UserFormProps) {
  const isEdit = !!user;
  const isAdminUser = user?.role === ROLES.ADMIN;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(isEdit ? editUserSchema : createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: ROLES.GENERAL,
    },
  });

  useEffect(() => {
    if (open) {
      if (user) {
        reset({
          name: user.name,
          email: user.email,
          password: '',
          role: user.role,
        });
      } else {
        reset({
          name: '',
          email: '',
          password: '',
          role: ROLES.GENERAL,
        });
      }
    }
  }, [open, user, reset]);

  const handleFormSubmit = async (data: UserFormData) => {
    const payload: Partial<UserFormData> = { ...data };
    if (isEdit && !payload.password) {
      delete payload.password;
    }
    if (isEdit && isAdminUser) {
      delete payload.role;
    }
    await onSubmit(payload as UserFormData);
  };

  const formBody = (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4"
    >
      <UserFormFields
        isEdit={isEdit}
        isAdminUser={isAdminUser}
        register={register}
        control={control}
        errors={errors}
        isLoading={isLoading}
        onCancel={() => onOpenChange(false)}
      />
    </form>
  );

  if (isEdit) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full max-w-none sm:max-w-none inset-y-0 h-full border-l p-0"
        >
          <div className="flex h-full flex-col">
            <SheetHeader className="border-b px-6 py-5 text-left">
              <SheetTitle className="text-xl">Edit user</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-6 py-6">{formBody}</div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
        </DialogHeader>
        {formBody}
      </DialogContent>
    </Dialog>
  );
}
