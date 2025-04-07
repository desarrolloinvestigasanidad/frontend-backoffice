"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewBookPage() {
  const router = useRouter();
  const params = useParams();
  const { id: editionId } = params;
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    price: "",
    isbn: "",
    cover: "",
    openDate: "",
    deadlineChapters: "",
    publishDate: "",
    interests: "",
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const token = sessionStorage.getItem("token");
      const payload = {
        ...formData,
        editionId,
        isbn: formData.isbn.trim() === "" ? null : formData.isbn,
        price: Number(formData.price),
        bookType: "libro edición",
        status: "desarrollo",
        active: true,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al crear el libro");
      }
      setMessage("Libro creado con éxito.");
      router.push(`/dashboard/editions/${editionId}/books`);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className='max-w-lg mx-auto p-6 space-y-4'>
      <h1 className='text-2xl font-bold'>Subir Nuevo Libro</h1>
      {message && <p className='text-red-600'>{message}</p>}
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='title'>Título</Label>
          <Input
            id='title'
            name='title'
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='subtitle'>Subtítulo</Label>
          <Input
            id='subtitle'
            name='subtitle'
            value={formData.subtitle}
            onChange={handleChange}
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='price'>Precio</Label>
          <Input
            id='price'
            name='price'
            type='number'
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='isbn'>ISBN (opcional)</Label>
          <Input
            id='isbn'
            name='isbn'
            value={formData.isbn}
            onChange={handleChange}
            placeholder='Deja vacío si aún no se asigna'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='cover'>URL de la Portada</Label>
          <Input
            id='cover'
            name='cover'
            value={formData.cover}
            onChange={handleChange}
            placeholder='https://ejemplo.com/portada.jpg'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='openDate'>Fecha de Apertura</Label>
          <Input
            id='openDate'
            name='openDate'
            type='date'
            value={formData.openDate}
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
            value={formData.deadlineChapters}
            onChange={handleChange}
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='publishDate'>Fecha de Publicación</Label>
          <Input
            id='publishDate'
            name='publishDate'
            type='date'
            value={formData.publishDate}
            onChange={handleChange}
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='interests'>Intereses</Label>
          <Input
            id='interests'
            name='interests'
            value={formData.interests}
            onChange={handleChange}
            placeholder='Describe los intereses o temas del libro'
          />
        </div>
        <div className='flex gap-2'>
          <Button type='submit' disabled={saving}>
            {saving ? "Guardando..." : "Subir Libro"}
          </Button>
          <Button variant='outline' type='button' onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </section>
  );
}
