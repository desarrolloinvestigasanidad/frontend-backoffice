// app/(protected)/dashboard/layout.tsx
import Sidebar from "@/components/backoffice/Sidebar"; // Ajusta la ruta según dónde ubiques el Sidebar
import { ReactNode } from "react";

export const metadata = {
  title: "Panel de Administración",
  description: "Backoffice para gestionar la plataforma",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className='flex min-h-screen bg-gray-50'>
      {/* Sidebar a la izquierda */}
      <Sidebar />

      {/* Contenido principal a la derecha */}
      <main className='flex-1 p-6'>{children}</main>
    </div>
  );
}
