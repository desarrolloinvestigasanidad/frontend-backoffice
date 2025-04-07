"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Breadcrumb from "@/components/backoffice/Breadcrumb";
import Link from "next/link";

export default function BookDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id: editionId, bookId } = params;
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log("Parámetros recibidos:", params);
    const fetchBook = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Error al cargar el libro");
        }
        const data = await res.json();
        console.log("Datos del libro:", data);
        setFormData(data);
      } catch (error: any) {
        console.error("Error en fetchBook:", error);
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (editionId && bookId) {
      fetchBook();
    } else {
      setMessage("Parámetros de edición o libro faltantes.");
      setLoading(false);
    }
  }, [editionId, bookId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al actualizar el libro");
      }
      setMessage("Libro actualizado correctamente.");
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar este libro?")) return;
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al eliminar el libro");
      }
      router.push(`/dashboard/editions/${editionId}/books`);
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) return <div>Cargando libro...</div>;

  return (
    <section className='max-w-5xl mx-auto p-6'>
      <Breadcrumb
        items={[
          { label: "Ediciones", href: "/dashboard/editions" },
          {
            label: "Detalle de Edición",
            href: `/dashboard/editions/${editionId}`,
          },
          { label: "Libros", href: `/dashboard/editions/${editionId}/books` },
          { label: formData.title || "Detalle del Libro" },
        ]}
      />
      <h1 className='text-2xl font-bold text-center mb-6'>Detalle del Libro</h1>

      <div className='flex flex-col md:flex-row gap-6'>
        {/* Columna izquierda: Portada */}
        <div className='md:w-1/2'>
          {formData.cover ? (
            <div className='relative w-full h-[calc(297mm/2)] rounded-md overflow-hidden shadow-md mb-6'>
              <Image
                src={formData.cover}
                alt='Portada del libro'
                fill
                className='object-cover'
              />
            </div>
          ) : (
            <div className='w-full h-64 bg-gray-200 flex items-center justify-center rounded-md'>
              <p className='text-gray-500'>Sin Portada</p>
            </div>
          )}
          {/* Campo para cambiar la URL de la Portada */}
          <div className='space-y-2'>
            <Label htmlFor='cover'>URL de la Portada</Label>
            <Input
              id='cover'
              name='cover'
              value={formData.cover || ""}
              onChange={handleChange}
              placeholder='https://ejemplo.com/portada.jpg'
            />
          </div>
        </div>

        {/* Columna derecha: Formulario de edición */}
        <div className='md:w-1/2 space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title'>Título</Label>
            <Input
              id='title'
              name='title'
              value={formData.title || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='subtitle'>Subtítulo</Label>
            <Input
              id='subtitle'
              name='subtitle'
              value={formData.subtitle || ""}
              onChange={handleChange}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='price'>Precio</Label>
            <Input
              id='price'
              name='price'
              type='number'
              value={formData.price || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='isbn'>ISBN (opcional)</Label>
            <Input
              id='isbn'
              name='isbn'
              value={formData.isbn || ""}
              onChange={handleChange}
              placeholder='Deja vacío si aún no se asigna'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='openDate'>Fecha de Apertura</Label>
            <Input
              id='openDate'
              name='openDate'
              type='date'
              value={formData.openDate ? formData.openDate.split("T")[0] : ""}
              onChange={handleChange}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='deadlineChapters'>
              Fecha Máxima de Envío de Capítulos
            </Label>
            <Input
              id='deadlineChapters'
              name='deadlineChapters'
              type='date'
              value={
                formData.deadlineChapters
                  ? formData.deadlineChapters.split("T")[0]
                  : ""
              }
              onChange={handleChange}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='publishDate'>Fecha de Publicación</Label>
            <Input
              id='publishDate'
              name='publishDate'
              type='date'
              value={
                formData.publishDate ? formData.publishDate.split("T")[0] : ""
              }
              onChange={handleChange}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='interests'>Intereses</Label>
            <Input
              id='interests'
              name='interests'
              value={formData.interests || ""}
              onChange={handleChange}
              placeholder='Describe los intereses o temas del libro'
            />
          </div>
        </div>
      </div>

      <div className='flex gap-2 mt-6'>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Guardando..." : "Guardar Cambios"}
        </Button>
        <Button variant='destructive' onClick={handleDelete}>
          Eliminar Libro
        </Button>
        <Button variant='outline' onClick={() => router.back()}>
          Volver
        </Button>
      </div>
      <div className='mt-4'>
        <Link
          href={`/dashboard/editions/${editionId}/books/${bookId}/chapters`}>
          <Button variant='outline' size='sm'>
            Ver Capítulos
          </Button>
        </Link>
      </div>
    </section>
  );
}
