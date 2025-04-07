"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Breadcrumb from "@/components/backoffice/Breadcrumb";

export default function EditionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEdition = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          throw new Error("Error al cargar la edición");
        }
        const data = await res.json();
        setFormData(data);
      } catch (error) {
        console.error("Error al cargar la edición:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEdition();
  }, [id]);

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
        `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${id}`,
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
        throw new Error(errorData.message || "Error al actualizar la edición");
      }
      setMessage("Edición actualizada correctamente.");
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar esta edición?")) return;
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al eliminar la edición");
      }
      router.push("/dashboard/editions");
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) return <div>Cargando edición...</div>;

  return (
    <section className='max-w-5xl mx-auto p-6'>
      <Breadcrumb
        items={[
          { label: "Ediciones", href: "/dashboard/editions" },
          { label: formData.title || "Detalle de la Edición" },
        ]}
      />
      <h1 className='text-2xl font-bold text-center mb-6'>
        Detalle de la Edición
      </h1>

      {/* Se muestra la portada a la izquierda */}
      <div className='flex flex-col md:flex-row gap-6'>
        <div className='md:w-1/2'>
          {formData.cover ? (
            <div className='relative w-full h-[calc(297mm/2)] rounded-md overflow-hidden shadow-md mb-6'>
              <Image
                src={formData.cover}
                alt='Portada de la edición'
                fill
                className='object-cover'
              />
            </div>
          ) : (
            <div className='w-full h-64 bg-gray-200 flex items-center justify-center rounded-md'>
              <p className='text-gray-500'>Sin Portada</p>
            </div>
          )}
          {/* Nuevo campo para cambiar la URL de la portada */}
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

        {/* Formulario de edición */}
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
            <Label htmlFor='year'>Año</Label>
            <Input
              id='year'
              name='year'
              type='number'
              value={formData.year || ""}
              onChange={handleChange}
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
            <Label htmlFor='normativa'>Normativa</Label>
            <textarea
              id='normativa'
              name='normativa'
              value={formData.normativa || ""}
              onChange={handleChange}
              className='w-full p-2 border rounded-md'
              rows={3}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='description'>Descripción</Label>
            <textarea
              id='description'
              name='description'
              value={formData.description || ""}
              onChange={handleChange}
              className='w-full p-2 border rounded-md'
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className='flex gap-2 mt-6'>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Guardando..." : "Guardar Cambios"}
        </Button>
        <Button variant='destructive' onClick={handleDelete}>
          Eliminar Edición
        </Button>
        <Button variant='outline' onClick={() => router.back()}>
          Volver
        </Button>
      </div>
    </section>
  );
}
