"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, Search, Settings, User } from "lucide-react";
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  const router = useRouter();
  const [user] = useState({
    name: "Usuario Demo",
    email: "usuario@demo.com",
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className='flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6'>
      {/* Botón de sidebar para móvil y escritorio */}
      <SidebarTrigger className='h-10 w-10' />

      {/* Búsqueda (oculta en mobile) */}
      <div className='flex-1 md:flex max-w-md hidden'>
        <form className='flex-1'>
          <div className='relative'>
            <Search className='absolute left-3 top-2.5 h-5 w-5 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Buscar...'
              className='pl-9 bg-muted/50 text-base'
            />
          </div>
        </form>
      </div>

      {/* Acciones: notificaciones + menú de usuario */}
      <div className='ml-auto flex items-center gap-6'>
        {/* Notificaciones: ícono más grande */}
        <Button
          variant='ghost'
          size='icon'
          className='relative text-xl'
          aria-label='Notificaciones'>
          <Bell className='h-6 w-6' />
          <span className='absolute top-1 right-1 h-2 w-2 rounded-full bg-purple-600' />
        </Button>

        {/* Menú de usuario: ícono más grande, texto de menú más grande */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='relative h-10 w-10 rounded-full bg-muted text-xl'>
              <User className='h-6 w-6' />
              <span className='sr-only'>Perfil</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='text-base'>
            <DropdownMenuLabel className='flex flex-col'>
              <span className='font-bold'>{user.name}</span>
              <span className='text-xs text-muted-foreground'>
                {user.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className='mr-2 h-5 w-5' />
              Mi Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className='mr-2 h-5 w-5' />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='text-red-600 focus:text-red-600'
              onClick={handleLogout}>
              <LogOut className='mr-2 h-5 w-5' />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
