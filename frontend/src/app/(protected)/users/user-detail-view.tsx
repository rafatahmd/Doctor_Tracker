'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useUpdateUser, useDeleteUser, UserFormData } from '@/hooks/useUsers';
import { UserForm } from '@/components/users/UserForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ROLE_LABELS, ROLES } from '@/lib/roles';
import { format } from 'date-fns';
import { ArrowLeft, AlertCircle, Mail, User as UserIcon, Shield, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function UserDetailView() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: user, isLoading, error } = useUser(userId);
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const handleSubmit = async (formData: UserFormData) => {
    try {
      await updateUser.mutateAsync({ id: userId, data: formData });
      toast.success('User updated successfully');
      setIsFormOpen(false);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser.mutateAsync(userId);
      toast.success('User deleted successfully');
      router.push('/users');
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || 'Failed to delete user');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !user) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <AlertCircle className="h-10 w-10 text-destructive mb-4" />
          <p className="text-muted-foreground">User not found</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push('/users')}>
            Back to Users
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button variant="ghost" onClick={() => router.push('/users')} className="gap-2 w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setIsFormOpen(true)}>Edit User</Button>
          {user.role === ROLES.GENERAL && (
            <Button
              variant="destructive"
              onClick={() => setDeleteOpen(true)}
              loading={deleteUser.isPending}
              loadingText="Deleting..."
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete User
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-xl">{user.name}</CardTitle>
            <Badge variant={user.role === ROLES.ADMIN ? 'default' : 'secondary'}>
              {ROLE_LABELS[user.role]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Shield className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium">{ROLE_LABELS[user.role]}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{format(new Date(user.createdAt), 'PPP')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last updated</p>
                <p className="font-medium">{format(new Date(user.updatedAt), 'PPP')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <UserForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        user={user}
        onSubmit={handleSubmit}
        isLoading={updateUser.isPending}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Delete {user.name}? This removes their account permanently and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
              loading={deleteUser.isPending}
              loadingText="Deleting..."
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
