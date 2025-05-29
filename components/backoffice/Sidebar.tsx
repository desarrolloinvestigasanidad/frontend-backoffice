"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Users,
  BookOpen,
  FileText,
  DollarSign,
  Tag,
  Settings,
  Layers,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Agrupar elementos relacionados
const navGroups = [
  {
    title: "Principal",
    items: [
      {
        label: "Panel de Control",
        href: "/dashboard",
        icon: <LayoutDashboard size={18} />,
      },
    ],
  },
  {
    title: "Gestión de Contenido",
    items: [
      {
        label: "Clientes",
        href: "/dashboard/clients",
        icon: <Users size={18} />,
      },
      {
        label: "Ediciones",
        href: "/dashboard/editions",
        icon: <BookOpen size={18} />,
      },
      {
        label: "Libros",
        href: "/dashboard/books",
        icon: <FileText size={18} />,
      },
      {
        label: "Capítulos",
        href: "/dashboard/chapters",
        icon: <Layers size={18} />,
      },
    ],
  },
  {
    title: "Finanzas",
    items: [
      {
        label: "Pagos",
        href: "/dashboard/payments",
        icon: <DollarSign size={18} />,
      },
      {
        label: "Descuentos",
        href: "/dashboard/discounts",
        icon: <Tag size={18} />,
      },
    ],
  },
  {
    title: "Administración",
    items: [
      {
        label: "Usuarios",
        href: "/dashboard/users",
        icon: <Users size={18} />,
      },
      {
        label: "Roles",
        href: "/dashboard/roles",
        icon: <Settings size={18} />,
      },
      // {
      //   label: "Plantillas",
      //   href: "/dashboard/templates",
      //   icon: <FileText size={18} />,
      // },
      // {
      //   label: "Certificados",
      //   href: "/dashboard/certificates",
      //   icon: <FileText size={18} />,
      // },
      {
        label: "Configuración",
        href: "/dashboard/configuration",
        icon: <Settings size={18} />,
      },
    ],
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Inicializar todos los grupos como expandidos
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    navGroups.forEach((group) => {
      initialExpanded[group.title] = true;
    });
    setExpandedGroups(initialExpanded);
  }, []);

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupTitle]: !prev[groupTitle],
    }));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Determinar si un elemento está activo
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <>
      <div className='flex items-center justify-between mb-8 px-4'>
        <h1 className='text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
          Investiga Sanidad
        </h1>
        {isMobile && (
          <button onClick={toggleMobileMenu} className='md:hidden'>
            <X size={24} className='text-gray-700' />
          </button>
        )}
      </div>

      <nav className='space-y-1 px-3'>
        {navGroups.map((group) => (
          <div key={group.title} className='mb-4'>
            <button
              onClick={() => toggleGroup(group.title)}
              className='flex items-center justify-between w-full text-sm font-medium text-gray-500 hover:text-gray-700 mb-2 px-2 py-1 rounded-md transition-colors'>
              <span>{group.title}</span>
              {expandedGroups[group.title] ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {expandedGroups[group.title] && (
              <ul className='space-y-1 pl-2'>
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200 group",
                          active
                            ? "bg-gray-200 text-gray-900 font-medium shadow-sm"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        )}
                        onClick={() => isMobile && setIsMobileMenuOpen(false)}>
                        <span
                          className={cn(
                            "mr-3 transition-colors duration-200",
                            active
                              ? "text-gray-900"
                              : "text-gray-500 group-hover:text-gray-700"
                          )}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                        {active && (
                          <span className='ml-auto w-1.5 h-1.5 rounded-full bg-gray-700'></span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </nav>

      <div className='mt-auto px-4 py-4 border-t border-gray-200'>
        <Link
          href='/login'
          className='flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors'>
          <LogOut size={18} className='mr-3 text-gray-500' />
          <span>Cerrar Sesión</span>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Botón de menú móvil */}
      {isMobile && (
        <button
          onClick={toggleMobileMenu}
          className='fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-md shadow-md'>
          <Menu size={24} className='text-gray-700' />
        </button>
      )}

      {/* Sidebar para móvil */}
      {isMobile ? (
        <div
          className={cn(
            "fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}>
          <div
            className='absolute inset-0 bg-gray-600 opacity-75'
            onClick={toggleMobileMenu}></div>
          <div className='relative flex flex-col w-64 h-full bg-white shadow-xl overflow-y-auto'>
            {sidebarContent}
          </div>
        </div>
      ) : (
        // Sidebar para escritorio
        <div className='w-64 bg-white border-r border-gray-200 h-screen flex flex-col overflow-y-auto shadow-sm'>
          {sidebarContent}
        </div>
      )}
    </>
  );
};

export default Sidebar;
