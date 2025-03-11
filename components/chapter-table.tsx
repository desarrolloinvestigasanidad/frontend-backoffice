import React from "react";
import { Button } from "@/components/ui/button";

export interface Chapter {
  id: number;
  title: string;
  bookTitle: string;
  status: "Aceptado" | "Pendiente" | "Rechazado";
  isAuthorPrincipal?: boolean;
  submissionDate: string;
}

interface ChapterTableProps {
  chapters: Chapter[];
  canEdit?: boolean; // ¿El usuario puede editar?
  canDelete?: boolean; // ¿Puede eliminar?
  canAddCoauthor?: boolean; // ¿Puede añadir coautor?
  onPreview: (id: number) => void;
  onEdit?: (id: number) => void; // Solo si canEdit = true
  onDelete?: (id: number) => void; // Solo si canDelete = true
  onAddCoauthor?: (id: number) => void; // Solo si canAddCoauthor = true
}

export function ChapterTable({
  chapters,
  canEdit,
  canDelete,
  canAddCoauthor,
  onPreview,
  onEdit,
  onDelete,
  onAddCoauthor,
}: ChapterTableProps) {
  if (chapters.length === 0) {
    return (
      <p className='text-sm text-gray-600'>
        No hay capítulos en esta categoría.
      </p>
    );
  }

  return (
    <table className='w-full border text-sm mb-4'>
      <thead>
        <tr className='bg-gray-50'>
          <th className='p-2 border'>Título del capítulo</th>
          <th className='p-2 border'>Libro/Edición</th>
          <th className='p-2 border'>Fecha de envío</th>
          <th className='p-2 border text-right'>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {chapters.map((ch) => (
          <tr key={ch.id}>
            <td className='p-2 border'>{ch.title}</td>
            <td className='p-2 border'>{ch.bookTitle}</td>
            <td className='p-2 border'>{ch.submissionDate}</td>
            <td className='p-2 border text-right'>
              {/* Previsualizar */}
              <Button
                variant='outline'
                size='sm'
                onClick={() => onPreview(ch.id)}>
                Previsualizar
              </Button>
              {/* Editar */}
              {canEdit && onEdit && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => onEdit(ch.id)}
                  className='ml-1'>
                  Modificar
                </Button>
              )}
              {/* Eliminar */}
              {canDelete && onDelete && (
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => onDelete(ch.id)}
                  className='ml-1'>
                  Eliminar
                </Button>
              )}
              {/* Agregar coautor */}
              {canAddCoauthor && onAddCoauthor && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => onAddCoauthor(ch.id)}
                  className='ml-1'>
                  Ver/Agregar coautor
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
