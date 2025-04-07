"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type Edition = {
  id: string;
  title: string;
  subtitle?: string;
  year?: number;
  openDate?: string;
  deadlineChapters?: string;
  publishDate?: string;
  cover?: string;
};

export default function EdicionesPage() {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEditions = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/editions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Error al cargar ediciones");
        }
        const data = await res.json();
        setEditions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEditions();
  }, []);

  if (loading) return <div>Cargando ediciones...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Ediciones</h1>
        <Link href='/dashboard/editions/new'>
          <Button>Crear Edición</Button>
        </Link>
      </div>
      {editions.length === 0 ? (
        <p>No hay ediciones registradas.</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {editions.map((ed) => (
            <div
              key={ed.id}
              className='border rounded-md p-4 shadow hover:shadow-lg transition'>
              <div className='flex items-center gap-4'>
                {ed.cover ? (
                  <div className='relative w-24 h-32 rounded-md overflow-hidden'>
                    <Image
                      src={ed.cover}
                      alt='Portada de la edición'
                      fill
                      className='object-cover'
                    />
                  </div>
                ) : (
                  <div className='w-24 h-32 bg-gray-200 flex items-center justify-center rounded-md'>
                    <p className='text-xs text-gray-500'>Sin Portada</p>
                  </div>
                )}
                <div>
                  <h2 className='font-bold text-xl'>{ed.title}</h2>
                  {ed.subtitle && (
                    <p className='text-sm text-gray-600'>{ed.subtitle}</p>
                  )}
                  <p className='mt-2 text-sm'>
                    <strong>Año:</strong> {ed.year || "-"}
                  </p>
                  <p className='mt-1 text-sm'>
                    <strong>Fechas:</strong>{" "}
                    {ed.openDate
                      ? new Date(ed.openDate).toLocaleDateString()
                      : "-"}{" "}
                    /{" "}
                    {ed.publishDate
                      ? new Date(ed.publishDate).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className='mt-4 flex flex-wrap gap-2'>
                <Link href={`/dashboard/editions/${ed.id}`}>
                  <Button variant='outline' size='sm'>
                    Ver / Editar
                  </Button>
                </Link>
                <Link href={`/dashboard/editions/${ed.id}/books`}>
                  <Button variant='outline' size='sm'>
                    Ver Libros
                  </Button>
                </Link>
                <Link href={`/dashboard/editions/${ed.id}/books/new`}>
                  <Button variant='outline' size='sm'>
                    Añadir Libros
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
