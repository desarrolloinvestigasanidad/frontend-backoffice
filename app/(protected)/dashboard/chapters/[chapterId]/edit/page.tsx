"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Breadcrumb } from "@/components/breadcrumb";

export default function EditChapterPage() {
  const { chapterId } = useParams();
  const router = useRouter();

  // Estado para almacenar los datos del capítulo y campos del formulario
  const [chapter, setChapter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados para cada campo editable
  const [title, setTitle] = useState("");
  const [studyType, setStudyType] = useState("");
  const [methodology, setMethodology] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [objectives, setObjectives] = useState("");
  const [results, setResults] = useState("");
  const [discussion, setDiscussion] = useState("");
  const [bibliography, setBibliography] = useState("");
  const [status, setStatus] = useState("borrador"); // Valor por defecto

  // Cargar datos del capítulo desde la API y prellenar el formulario
  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/chapters/${chapterId}`,
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

        // Prellenar los campos del formulario con la información del capítulo
        setTitle(data.title);
        setStudyType(data.studyType);
        setMethodology(data.methodology);
        setIntroduction(data.introduction);
        setObjectives(data.objectives);
        setResults(data.results);
        setDiscussion(data.discussion);
        setBibliography(data.bibliography);
        setStatus(data.status || "borrador");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (chapterId) fetchChapter();
  }, [chapterId]);

  // Función para enviar el formulario y actualizar el capítulo en el backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token");
      const body = {
        title,
        studyType,
        methodology,
        introduction,
        objectives,
        results,
        discussion,
        bibliography,
        status,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/chapters/${chapterId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al actualizar el capítulo");
      }

      // Una vez actualizado, regresamos al listado de capítulos
      router.push("/dashboard/chapters");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        Cargando datos del capítulo...
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-[60vh] text-center'>
        <p className='text-red-600'>{error}</p>
      </div>
    );
  }

  return (
    <div className='relative overflow-hidden py-8'>
      {/* Fondo degradado para mantener la consistencia visual */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 to-white'></div>
      </div>

      <div className='container mx-auto px-4 relative z-10 space-y-8'>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex items-center justify-between'>
          <Breadcrumb>
            <span>Editar Capítulo</span>
          </Breadcrumb>
          <Button variant='ghost' onClick={() => router.back()}>
            Volver
          </Button>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-lg border border-white/50 max-w-3xl mx-auto space-y-6'>
          <h1 className='text-2xl font-bold text-center mb-4'>
            Editar Capítulo
          </h1>
          {error && <p className='text-red-600'>{error}</p>}

          <div className='space-y-4'>
            <div>
              <Label htmlFor='title'>Título del Capítulo</Label>
              <Input
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor='studyType'>Tipo de Estudio</Label>
              <Input
                id='studyType'
                value={studyType}
                onChange={(e) => setStudyType(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor='methodology'>Metodología</Label>
              <Textarea
                id='methodology'
                rows={4}
                value={methodology}
                onChange={(e) => setMethodology(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor='introduction'>Introducción</Label>
              <Textarea
                id='introduction'
                rows={4}
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor='objectives'>Objetivos</Label>
              <Textarea
                id='objectives'
                rows={4}
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor='results'>Resultados</Label>
              <Textarea
                id='results'
                rows={4}
                value={results}
                onChange={(e) => setResults(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor='discussion'>Discusión/Conclusión</Label>
              <Textarea
                id='discussion'
                rows={4}
                value={discussion}
                onChange={(e) => setDiscussion(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor='bibliography'>Bibliografía</Label>
              <Textarea
                id='bibliography'
                rows={4}
                value={bibliography}
                onChange={(e) => setBibliography(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor='status'>Estado</Label>
              <Select
                onValueChange={(val) => setStatus(val)}
                value={status}
                required>
                <SelectTrigger>
                  <SelectValue placeholder='Selecciona el estado' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='borrador'>Borrador</SelectItem>
                  <SelectItem value='pendiente'>Pendiente</SelectItem>
                  <SelectItem value='en revisión'>En Revisión</SelectItem>
                  <SelectItem value='aprobado'>Aprobado</SelectItem>
                  <SelectItem value='publicado'>Publicado</SelectItem>
                  <SelectItem value='rechazado'>Rechazado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='flex gap-4 justify-end'>
            <Button
              type='submit'
              className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'>
              Guardar Cambios
            </Button>
            <Button variant='outline' onClick={() => router.back()}>
              Cancelar
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
