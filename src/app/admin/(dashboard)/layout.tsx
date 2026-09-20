import { ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { verifyAdminSession } from '@/lib/auth/adminAuth';
import { adminLogoutAction } from '../login/actions';
import { 
  ExternalLink, 
  LogOut, 
  ShieldCheck 
} from 'lucide-react';
import { AdminSidebarNav } from './AdminSidebarNav';

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const session = await verifyAdminSession();

  if (!session.isAuthenticated) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-68 bg-white border-r border-[#DFD7C9] p-6 pb-14 md:pb-8 flex flex-col gap-6 shrink-0 shadow-xs">
        {/* Brand header */}
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#5C1D24] text-[#FAF7F2] flex items-center justify-center font-serif font-bold text-base shadow-xs">
              N
            </div>
            <div>
              <Link href="/admin" className="font-heading text-lg font-bold text-[#5C1D24] tracking-tight block hover:opacity-90 transition-opacity">
                Naqash Admin
              </Link>
              <p className="text-[10px] uppercase tracking-widest text-[#8A7F79] font-medium">
                Gallery Management
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <AdminSidebarNav />

        {/* Sidebar Footer */}
        <div className="mt-auto pt-6 border-t border-[#EFE8DE] flex flex-col gap-4">
          {/* Admin User Badge */}
          <div className="p-3 rounded-xl bg-[#F8F4ED] border border-[#E8DFC8]/60 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#5C1D24]/10 text-[#5C1D24] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-[#2C2523] truncate">
                {session.email || 'Administrator'}
              </p>
              <p className="text-[9px] uppercase tracking-wider text-[#8A7F79] font-medium">
                Verified Admin
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <Link
              href="/"
              target="_blank"
              className="text-xs uppercase tracking-wider font-semibold text-[#5C1D24] hover:underline flex items-center gap-1.5"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            {/* Logout Action */}
            <form action={adminLogoutAction}>
              <button
                type="submit"
                className="text-xs font-medium text-red-700 hover:text-red-900 hover:bg-red-50 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Sign out of Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl overflow-x-auto">
        {children}
      </main>
    </div>
  );
}
