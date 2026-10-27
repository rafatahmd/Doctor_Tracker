import { ProtectedLayoutClient } from './ProtectedLayoutClient';

// Auth + client data fetching; navigations may wait on the client
export const instant = false;

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayoutClient>{children}</ProtectedLayoutClient>;
}
