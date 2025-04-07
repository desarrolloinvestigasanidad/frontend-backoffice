"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Chapter = {
  id: string;
  title: string;
  studyType: string;
  status: string;
};

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/chapters`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Error al cargar capítulos");
        }
        const data = await res.json();
        // Asegúrate de que 'data' sea un arreglo o extrae la propiedad necesaria
        const chaptersArray = Array.isArray(data) ? data : data.chapters ?? [];
        setChapters(chaptersArray);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, []);

  if (loading) return <div>Cargando capítulos propios...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className='max-w-4xl mx-auto p-6 space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Capítulos Propios</h1>
        <Link href='/dashboard/chapters/new'>
          <Button>Crear Capítulo Propio</Button>
        </Link>
      </div>
      {chapters.length === 0 ? (
        <p>No hay capítulos propios registrados.</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className='border rounded-md p-4 shadow hover:shadow-lg transition'>
              <h2 className='font-bold text-lg'>{chapter.title}</h2>
              <p className='text-sm text-gray-600'>
                <strong>Tipo de Estudio:</strong> {chapter.studyType}
              </p>
              <p className='text-sm text-gray-800 mt-1'>
                <strong>Estado:</strong> {chapter.status}
              </p>
              <div className='mt-4'>
                <Link href={`/dashboard/chapters/${chapter.id}`}>
                  <Button variant='outline' size='sm'>
                    Ver / Editar
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
