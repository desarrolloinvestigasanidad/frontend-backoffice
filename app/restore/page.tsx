// frontend-editorial/app/restore/page.tsx   (dominio back-office)
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RestoreAdminSession() {
  const router = useRouter();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      localStorage.setItem("token", adminToken); // volvemos a ser admin
      localStorage.removeItem("adminToken");
    }
    router.replace("/dashboard/clients"); // pantalla inicial de admin
  }, [router]);

  return <p>Restaurando sesión de administrador…</p>;
}
