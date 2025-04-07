"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Chapter = {
  id: string;
  title: string;
  studyType: string;
  status: string;
  // Agrega otros campos si tu backend los provee (por ejemplo, authorId)
};

export default function ChaptersListPage() {
  const params = useParams();
  const { editionId, bookId } = params;
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}/chapters`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Error al cargar capítulos");
        }
        const data = await res.json();
        setChapters(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (editionId && bookId) {
      fetchChapters();
    }
  }, [editionId, bookId]);

  if (loading) return <div>Cargando capítulos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className='max-w-4xl mx-auto p-6 space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Capítulos del Libro</h1>
        <Link
          href={`/dashboard/ediciones/${editionId}/books/${bookId}/chapters/create`}>
          <Button>Crear Capítulo</Button>
        </Link>
      </div>
      {chapters.length === 0 ? (
        <p>No hay capítulos registrados para este libro.</p>
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
                <Link
                  href={`/dashboard/ediciones/${editionId}/books/${bookId}/chapters/${chapter.id}`}>
                  <Button variant='outline' size='sm'>
                    Revisar / Editar
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
