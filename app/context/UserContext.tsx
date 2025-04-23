"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

// Define la interfaz del usuario basada en el modelo
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  phone?: string;
  address?: string;
  country?: string;
  autonomousCommunity?: string;
  province?: string;
  professionalCategory?: string;
  interests?: string;
  verified?: boolean;
  lastAccessIp?: string;
  termsAccepted?: boolean;
  infoAccepted?: boolean;
  state?: string;
  roleId: number;
}

// Define el tipo del contexto
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Función para refrescar el perfil del usuario
  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Error al obtener el perfil");
      }
      const data: User = await res.json();
      setUser(data);
      // Guarda el userId para usarlo en otros componentes
      localStorage.setItem("userId", data.id);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para consumir el contexto
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
