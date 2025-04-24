// components/breadcrumb.tsx
// Componente Breadcrumb con tipado y valor por defecto corregidos.
// Comentarios en español para mayor claridad.

import * as React from "react";
import { ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

// ────────────────────────────────────────────────────────────────────────────────
// Tipos
// ────────────────────────────────────────────────────────────────────────────────
export interface BreadcrumbProps {
  /**
   * Lista de elementos para el breadcrumb.
   * - label: texto a mostrar
   * - href : URL de destino
   * Si no se envía, tomará un array vacío por defecto.
   */
  items?: { label: string; href: string }[]; // ← prop ahora opcional
}

// ────────────────────────────────────────────────────────────────────────────────
// Componente principal
// ────────────────────────────────────────────────────────────────────────────────
export function Breadcrumb({ items = [] }: BreadcrumbProps) {
  // items = [] evita el "cannot read properties of undefined"
  if (items.length === 0) return null; // opcional: no renders si no hay items

  return (
    <nav className='flex items-center gap-1.5'>
      {items.map((item, index) => (
        <a
          key={index}
          href={item.href}
          className='hover:underline whitespace-nowrap'>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
Breadcrumb.displayName = "Breadcrumb";

// ────────────────────────────────────────────────────────────────────────────────
// Sub-componentes auxiliares (sin cambios funcionales)
// ────────────────────────────────────────────────────────────────────────────────
const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.OlHTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words sm:gap-2.5",
      className
    )}
    {...props}
  />
));
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
  <a
    ref={ref}
    className={cn("hover:text-foreground transition-colors", className)}
    {...props}
  />
));
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    aria-current='page'
    className={cn("font-medium text-foreground", className)}
    {...props}
  />
));
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    role='presentation'
    aria-hidden='true'
    className={cn("[&>svg]:size-3.5", className)}
    {...props}>
    {children ?? <ChevronRight className='h-4 w-4' />}
  </span>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    role='presentation'
    aria-hidden='true'
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}>
    <MoreHorizontal className='h-4 w-4' />
    <span className='sr-only'>Más</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

// ────────────────────────────────────────────────────────────────────────────────
// Exportaciones
// ────────────────────────────────────────────────────────────────────────────────
export {
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
