import { isAdminAuthenticated } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return <div className="min-h-screen bg-[#0D0802]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#1A1008] flex text-white">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}
