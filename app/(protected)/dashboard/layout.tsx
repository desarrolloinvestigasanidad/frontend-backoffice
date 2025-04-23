// app/(protected)/dashboard/layout.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "../../context/UserContext";
import Sidebar from "@/components/backoffice/Sidebar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  // ► Si ya terminó la carga y no hay usuario → /login
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // ► Mientras comprobamos la sesión, mostramos un loader simple
  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-50'>
        Cargando…
      </div>
    );
  }

  // ► Usuario autenticado → render normal
  return (
    <div className='flex min-h-screen bg-gray-50'>
      {/* Sidebar a la izquierda */}
      <Sidebar />

      {/* Contenido principal a la derecha */}
      <main className='flex-1 p-6'>{children}</main>
    </div>
  );
}
