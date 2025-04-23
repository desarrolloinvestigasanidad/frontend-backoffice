"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Ajusta este tipo según la información real que te devuelva el backend
type Chapter = {
  id: string; // Código o identificador principal
  title: string; // Título
  studyType: string; // Tipo de estudio (ej: “caso clínico”)
  status: string; // Estado (ej: “borrador”, “pendiente”, etc.)
  // Otros campos si los necesitas, e.j.:
  // authorName?: string;
  // createdAt?: string;
  // bookTitle?: string;
  // etc.
};

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/chapters`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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

  if (loading) return <div>Cargando capítulos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className='max-w-5xl mx-auto p-6 space-y-4'>
      <h1 className='text-2xl font-bold'>Capítulos</h1>

      {chapters.length === 0 ? (
        <p>No hay capítulos registrados.</p>
      ) : (
        <div className='overflow-x-auto border rounded-md shadow-sm'>
          <table className='min-w-full text-left border-collapse'>
            <thead className='bg-gray-50 border-b'>
              <tr>
                <th className='px-4 py-2 font-semibold text-gray-600'>#</th>
                <th className='px-4 py-2 font-semibold text-gray-600'>
                  Código
                </th>
                <th className='px-4 py-2 font-semibold text-gray-600'>
                  Título
                </th>
                <th className='px-4 py-2 font-semibold text-gray-600'>
                  Tipo de Estudio
                </th>
                <th className='px-4 py-2 font-semibold text-gray-600'>
                  Estado
                </th>
                {/* Si tienes más campos, agrégalos aquí */}
                <th className='px-4 py-2 font-semibold text-gray-600'>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className='divide-y'>
              {chapters.map((chapter, index) => (
                <tr key={chapter.id} className='hover:bg-gray-50'>
                  <td className='px-4 py-2 text-sm text-gray-700'>
                    {index + 1}
                  </td>
                  <td className='px-4 py-2 text-sm text-gray-700'>
                    {chapter.id}
                  </td>
                  <td className='px-4 py-2 text-sm text-gray-700'>
                    {chapter.title}
                  </td>
                  <td className='px-4 py-2 text-sm text-gray-700'>
                    {chapter.studyType}
                  </td>
                  <td className='px-4 py-2 text-sm text-gray-700'>
                    {chapter.status}
                  </td>
                  <td className='px-4 py-2 text-sm'>
                    <Link href={`/dashboard/chapters/${chapter.id}/edit`}>
                      <Button variant='outline' size='sm'>
                        Ver / Editar
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
