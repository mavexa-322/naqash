import { redirect } from 'next/navigation';
import { verifyAdminSession } from '@/lib/auth/adminAuth';
import { AdminLoginForm } from './AdminLoginForm';

export const metadata = {
  title: 'Administrator Gateway | Naqash Carpets Gallery',
  description: 'Secure management gateway for Naqash Carpets Gallery administration.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  const session = await verifyAdminSession();
  if (session.isAuthenticated) {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-[#13100F] text-[#F8F5F0] flex flex-col justify-center items-center px-4 py-12 selection:bg-[#C5A265] selection:text-[#13100F]">
      <AdminLoginForm />
    </div>
  );
}
