"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  BookOpen,
  FileBadge,
  Home,
  Library,
  LogOut,
  Plus,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Sidebar de la aplicación.
 * - Botones más grandes
 * - Funcionalidad de colapsar/expandir mejorada
 * - Soporte para móvil
 */
export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // Menú principal
  const menuItems = [
    { title: "Dashboard", icon: Home, href: "/dashboard" },
    { title: "Mi Perfil", icon: User, href: "/profile" },
    { title: "Certificados", icon: FileBadge, href: "/certificates" },
    { title: "Mis Publicaciones", icon: BookOpen, href: "/publications" },
    { title: "Biblioteca", icon: Library, href: "/library" },
    { title: "Crear Libro", icon: Plus, href: "/create-book" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <Sidebar collapsible='icon' className='border-r border-border'>
      <SidebarHeader className='border-b border-border'>
        <div className='flex items-center justify-center px-4 py-4'>
          <Link href='/dashboard' className='flex items-center justify-center'>
            <Image
              src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/INVESTIGA%20SANIDAD%20SIN%20FONDO-BLQnlRYtFpCHZb4z2Xwzh7LiZbpq1R.png'
              alt='Investiga Sanidad'
              width={360}
              height={100}
              className='h-50 w-auto group-data-[collapsible=icon]:hidden'
            />
            {/* Logo pequeño para cuando está colapsado */}
            <div className='hidden group-data-[collapsible=icon]:block'>
              <Image
                src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/INVESTIGA%20SANIDAD%20SIN%20FONDO-BLQnlRYtFpCHZb4z2Xwzh7LiZbpq1R.png'
                alt='IS'
                width={40}
                height={40}
                className='h-8 w-auto'
              />
            </div>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent className='px-2 py-4'>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.title}
                size='lg'
                className={`h-14 text-base font-medium transition-colors
                  ${
                    pathname === item.href
                      ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                      : "hover:bg-purple-50 hover:text-purple-700"
                  }`}>
                <Link href={item.href} className='flex items-center gap-3'>
                  <item.icon
                    className={`h-6 w-6 ${
                      pathname === item.href ? "text-purple-600" : ""
                    }`}
                  />
                  <span className='group-data-[collapsible=icon]:hidden'>
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className='mt-auto border-t border-border p-4'>
        <Button
          variant='ghost'
          className='w-full justify-start text-base font-medium h-14 text-red-600 hover:text-red-700 hover:bg-red-50'
          onClick={handleLogout}>
          <LogOut className='mr-3 h-6 w-6' />
          <span className='group-data-[collapsible=icon]:hidden'>
            Cerrar sesión
          </span>
        </Button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
