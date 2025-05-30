import { ReactNode } from "react";
import Sidebar from "@/components/backoffice/Sidebar";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className='flex min-h-screen bg-gray-50'>
        <Sidebar />
        <main className='flex-1 p-6'>{children}</main>
      </div>
    </AuthGuard>
  );
}
