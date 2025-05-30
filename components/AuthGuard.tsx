"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    console.log(
      "AUTH_GUARD_EFFECT: path=",
      pathname,
      "token=",
      token,
      "user=",
      !!user,
      "loading=",
      loading
    );
    if (!loading && (!token || !user) && pathname !== "/login") {
      // No redirigir si ya estamos en /login
      console.log("AUTH_GUARD_REDIRECTING: A /login porque !token || !user");
      router.replace("/login");
    }
  }, [token, user, loading, router, pathname]); // Añade pathname a las dependencias

  if (loading) {
    // Muestra el spinner solo si está cargando, no si no hay token necesariamente
    console.log("AUTH_GUARD_LOADING_STATE");
    return (
      <div className='flex items-center justify-center min-h-screen bg-white text-gray-700'>
        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mr-4'></div>
        Verificando acceso…
      </div>
    );
  }

  if (!token || loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-white text-gray-700'>
        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mr-4'></div>
        Verificando acceso…
      </div>
    );
  }

  return <>{children}</>;
}
