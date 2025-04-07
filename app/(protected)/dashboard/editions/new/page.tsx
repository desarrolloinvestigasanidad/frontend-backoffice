"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewEditionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    year: "",
    cover: "",
    openDate: "",
    deadlineChapters: "",
    publishDate: "",
    normativa: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/editions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          subtitle: formData.subtitle,
          year: formData.year ? Number(formData.year) : null,
          cover: formData.cover,
          openDate: formData.openDate,
          deadlineChapters: formData.deadlineChapters,
          publishDate: formData.publishDate,
          normativa: formData.normativa,
          description: formData.description,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al crear edición");
      }
      router.push("/dashboard/editions");
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='space-y-4 max-w-lg mx-auto'>
      <h1 className='text-2xl font-bold'>Crear Nueva Edición</h1>
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
          <Label htmlFor='year'>Año</Label>
          <Input
            id='year'
            name='year'
            value={formData.year}
            onChange={handleChange}
            placeholder='2025'
            type='number'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='cover'>Portada (URL)</Label>
          <Input
            id='cover'
            name='cover'
            value={formData.cover}
            onChange={handleChange}
            placeholder='https://...'
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
          <Label htmlFor='normativa'>Normativa</Label>
          <textarea
            id='normativa'
            name='normativa'
            value={formData.normativa}
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
            value={formData.description}
            onChange={handleChange}
            className='w-full p-2 border rounded-md'
            rows={3}
          />
        </div>
        <div className='flex gap-2'>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? "Creando..." : "Crear Edición"}
          </Button>
          <Button variant='outline' type='button' onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </section>
  );
}
