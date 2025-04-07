"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Breadcrumb from "@/components/backoffice/Breadcrumb";

type ChapterDetail = {
  id: string;
  title: string;
  studyType: string;
  introduction: string;
  objectives: string;
  results: string;
  discussion: string;
  bibliography: string;
  status: string;
  // Agrega otros campos según tu backend (authorId, etc.)
};

export default function ChapterDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { editionId, bookId, chapterId } = params;

  const [chapter, setChapter] = useState<ChapterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}/chapters/${chapterId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Error al cargar el capítulo");
        }
        const data = await res.json();
        setChapter(data);
      } catch (err: any) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (editionId && bookId && chapterId) {
      fetchChapter();
    }
  }, [editionId, bookId, chapterId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!chapter) return;
    const { name, value } = e.target;
    setChapter({ ...chapter, [name]: value });
  };

  const handleSave = async () => {
    if (!chapter) return;
    setSaving(true);
    setMessage("");
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}/chapters/${chapterId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(chapter),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al actualizar el capítulo");
      }
      setMessage("Capítulo actualizado correctamente.");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar este capítulo?")) return;
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}/chapters/${chapterId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al eliminar el capítulo");
      }
      router.push(`/dashboard/ediciones/${editionId}/books/${bookId}/chapters`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div>Cargando capítulo...</div>;
  if (!chapter) return <div>No se encontró el capítulo.</div>;

  return (
    <section className='max-w-3xl mx-auto p-6 space-y-4'>
      <Breadcrumb
        items={[
          { label: "Ediciones", href: "/dashboard/editions" },
          {
            label: "Detalle de Edición",
            href: `/dashboard/editions/${editionId}`,
          },
          { label: "Libros", href: `/dashboard/editions/${editionId}/books` },
          {
            label: "Detalle del Libro",
            href: `/dashboard/editions/${editionId}/books/${bookId}`,
          },
          { label: chapter.title || "Capítulo" },
        ]}
      />
      <h1 className='text-2xl font-bold'>Revisión de Capítulo</h1>
      {message && <p className='text-red-600'>{message}</p>}

      <div className='space-y-2'>
        <Label htmlFor='title'>Título</Label>
        <Input
          id='title'
          name='title'
          value={chapter.title}
          onChange={handleChange}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='studyType'>Tipo de Estudio</Label>
        <Input
          id='studyType'
          name='studyType'
          value={chapter.studyType}
          onChange={handleChange}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='introduction'>Introducción</Label>
        <Textarea
          id='introduction'
          name='introduction'
          value={chapter.introduction}
          onChange={handleChange}
          rows={5}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='objectives'>Objetivos</Label>
        <Textarea
          id='objectives'
          name='objectives'
          value={chapter.objectives}
          onChange={handleChange}
          rows={5}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='results'>Resultados</Label>
        <Textarea
          id='results'
          name='results'
          value={chapter.results}
          onChange={handleChange}
          rows={5}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='discussion'>Discusión</Label>
        <Textarea
          id='discussion'
          name='discussion'
          value={chapter.discussion}
          onChange={handleChange}
          rows={5}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='bibliography'>Bibliografía</Label>
        <Textarea
          id='bibliography'
          name='bibliography'
          value={chapter.bibliography}
          onChange={handleChange}
          rows={5}
        />
      </div>

      {/* Estado (aprobado, rechazado, pendiente, etc.) */}
      <div className='space-y-2'>
        <Label htmlFor='status'>Estado</Label>
        <Input
          id='status'
          name='status'
          value={chapter.status}
          onChange={handleChange}
        />
      </div>

      <div className='flex gap-2 mt-4'>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Guardando..." : "Guardar Cambios"}
        </Button>
        <Button variant='destructive' onClick={handleDelete}>
          Eliminar Capítulo
        </Button>
        <Button variant='outline' onClick={() => router.back()}>
          Volver
        </Button>
      </div>
    </section>
  );
}
