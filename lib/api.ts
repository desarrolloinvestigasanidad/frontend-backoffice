"use client";

import { logout } from "./auth";

/**
 * Igual que fetch() pero:
 *  • añade el token en la cabecera Authorization solo si existe
 *  • intercepta 401 -> hace logout() y lanza excepción
 */
export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
) {
  // 1. Construir headers base
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    // respetar cualquier header pasado en init
    ...(init.headers as Record<string, string>),
  };

  // 2. Añadir token si lo hay
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // 3. Llamada a fetch con headers completos
  const res = await fetch(input, {
    ...init,
    headers,
  });

  // 4. Si recibimos 401, limpiar y redirigir
  if (res.status === 401) {
    // borra credenciales
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    // redirige a login
    logout();
    // abortar flujo lanzando error
    throw new Error("No autorizado");
  }

  return res;
}
