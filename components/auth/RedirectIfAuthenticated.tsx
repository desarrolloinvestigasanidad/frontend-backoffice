"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const RedirectIfAuthenticated = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [checking, setChecking] = useState(true); // Estado para controlar la visibilidad

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/dashboard");
    } else {
      setChecking(false); // Solo mostramos el contenido si NO hay token
    }
  }, []);

  if (checking) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <div className='animate-spin h-6 w-6 border-2 border-purple-600 border-t-transparent rounded-full' />
      </div>
    );
  }

  return <>{children}</>;
};
