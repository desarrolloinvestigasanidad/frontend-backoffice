// frontend-backoffice/app/layout.tsx
import type React from "react";
import { Sidebar } from "@/components/backoffice/Sidebar";
import "./globals.css";

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='es'>
      <body className='flex h-screen bg-gray-100'>
        <Sidebar />
        <div className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-100'>
          <div className='container mx-auto px-6 py-8'>{children}</div>
        </div>
      </body>
    </html>
  );
}
