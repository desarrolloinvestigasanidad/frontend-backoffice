"use client";

import { logout } from "./auth";

/**
 * Igual que fetch() pero:
 *  • añade el token en la cabecera Authorization
 *  • si recibe 401 -> hace logout() y aborta
 */
export async function apiFetch(input: RequestInfo | URL, init?: RequestInit) {
  // --- 1. Añadir token automáticamente ---------------
  const token = localStorage.getItem("token");

  const res = await fetch(input, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });

  // --- 2. Interceptar 401 --------------------------------
  if (res.status === 401) {
    logout(); // borra token y manda a /login
    return Promise.reject(new Error("No autorizado"));
  }

  return res;
}
