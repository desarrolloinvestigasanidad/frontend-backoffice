"use client";

import { useRouter } from "next/navigation";

export function logout(router?: ReturnType<typeof useRouter>) {
  // 1. Vaciar cualquier rastro de la sesión
  localStorage.removeItem("token");
  localStorage.removeItem("userId");

  // 2. (opcional) vacía también el user del contexto si lo tienes a mano
  // Si usas el contexto aquí, pasa `setUser(null)`.

  // 3. Redirección centralizada
  if (router) {
    router.replace("/login");
  } else {
    // Si no viene un router, hazlo “duro”:
    window.location.href = "/login";
  }
}
