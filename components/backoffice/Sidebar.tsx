// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  BookOpen,
  FileText,
  DollarSign,
  Tag,
  Settings,
  Layers,
} from "lucide-react";

const navItems = [
  { label: "Clientes", href: "/dashboard/clients", icon: <Users size={18} /> },
  {
    label: "Ediciones",
    href: "/dashboard/editions",
    icon: <BookOpen size={18} />,
    children: [
      { label: "Listado de Ediciones", href: "/dashboard/editions" },
      {
        label: "Libros y Capítulos",
        href: "/dashboard/editions", // Al ingresar aquí, el usuario accederá a una edición y, dentro de ella, podrá gestionar libros y capítulos.
      },
    ],
  },
  {
    label: "Libros Propios",
    href: "/dashboard/books",
    icon: <FileText size={18} />,
  },
  {
    label: "Capítulos Propios",
    href: "/dashboard/chapters",
    icon: <Layers size={18} />,
  },
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
  { label: "Usuarios", href: "/dashboard/users", icon: <Users size={18} /> },
  { label: "Roles", href: "/dashboard/roles", icon: <Settings size={18} /> },
  {
    label: "Plantillas",
    href: "/dashboard/plantillas",
    icon: <FileText size={18} />,
  },
  {
    label: "Configuración",
    href: "/configuracion",
    icon: <Settings size={18} />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className='w-64 bg-white border-r border-gray-200 p-4'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-purple-700'>
          Investiga Sanidad <br />
          Backoffice
        </h1>
      </div>
      <nav>
        <ul className='space-y-2'>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center p-2 rounded-md transition-colors ${
                  pathname === item.href ||
                  (item.children &&
                    item.children.some((child) =>
                      pathname.startsWith(child.href)
                    ))
                    ? "bg-purple-100 font-semibold text-purple-700"
                    : "hover:bg-purple-50"
                }`}>
                <span className='mr-2'>{item.icon}</span>
                {item.label}
              </Link>
              {item.children && (
                <ul className='ml-6 mt-1 space-y-1'>
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className={`block p-1 rounded transition-colors ${
                          pathname.startsWith(child.href)
                            ? "bg-purple-50 font-semibold text-purple-700"
                            : "hover:bg-purple-50"
                        }`}>
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
