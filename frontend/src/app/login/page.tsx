'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { AuthPageShell } from '@/components/auth/AuthPageShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email.trim().toLowerCase(), password);
      router.push('/dashboard');
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Unable to sign in. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageShell
      title="Welcome Back"
      description="Sign in to your Doctor Tracker account"
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Create Account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 bg-background/60"
            autoComplete="email"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-10 bg-background/60"
            autoComplete="current-password"
            required
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="mt-2 h-10 w-full shadow-sm"
          loading={isLoading}
          loadingText="Signing In..."
        >
          Sign In
        </Button>
      </form>
    </AuthPageShell>
  );
}
