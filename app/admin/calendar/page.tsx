import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { getAllBlocks } from '@/lib/availability';
import AdminCalendar from '@/components/admin/AdminCalendar';

export const dynamic = 'force-dynamic';

export default async function AdminCalendarPage() {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect('/admin/login');

  const blocks = await getAllBlocks();

  return <AdminCalendar initialBlocks={blocks} />;
}
