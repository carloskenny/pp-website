import { ProtectedRoute } from '@/components/auth/protected-route';
import { AdminShell } from '@/components/layout/admin-shell';

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ProtectedRoute>
      <AdminShell>{children}</AdminShell>
    </ProtectedRoute>
  );
}
