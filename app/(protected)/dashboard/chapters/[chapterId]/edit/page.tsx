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
import { ChevronLeft, CheckCircle } from "lucide-react";

// Componente para mostrar la barra de progreso del conteo de palabras
interface WordCountIndicatorProps {
  label: string;
  text: string;
  min: number;
  max: number;
}
function WordCountIndicator({
  label,
  text,
  min,
  max,
}: WordCountIndicatorProps) {
  const wordCount =
    text.trim() === "" ? 0 : text.trim().split(/\s+/).filter(Boolean).length;
  const progress = Math.min(100, Math.floor((wordCount / max) * 100));
  let statusMessage = "";
  if (wordCount < min) {
    statusMessage = `Faltan ${min - wordCount} palabra${
      min - wordCount !== 1 ? "s" : ""
    } (mínimo ${min})`;
  } else if (wordCount > max) {
    statusMessage = `Excede en ${wordCount - max} palabra${
      wordCount - max !== 1 ? "s" : ""
    } (máximo ${max})`;
  } else {
    statusMessage = "Dentro del rango recomendado";
  }

  return (
    <div className='mb-4'>
      <p className='text-sm font-semibold text-gray-700'>{label}</p>
      <div className='relative h-2 bg-gray-200 rounded'>
        <div
          style={{ width: `${progress}%` }}
          className={`h-2 rounded transition-all duration-300 ${
            wordCount >= min && wordCount <= max ? "bg-green-500" : "bg-red-500"
          }`}></div>
      </div>
      <p className='text-xs text-gray-600 mt-1'>
        {wordCount} palabra{wordCount !== 1 && "s"} - {statusMessage}
      </p>
    </div>
  );
}

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
        const token = localStorage.getItem("token");
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
      const token = localStorage.getItem("token");
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

  // Agrupamos los textos de las secciones para pasar al SpellCheckPanel
  const textsForSpellCheck = {
    Metodología: methodology,
    Introducción: introduction,
    Objetivos: objectives,
    Resultados: results,
    "Discusión/Conclusión": discussion,
    Bibliografía: bibliography,
  };

  return (
    <div className='relative overflow-hidden py-8'>
      {/* Fondo degradado para mantener la consistencia visual */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 to-white'></div>
      </div>

      <div className='container mx-auto px-4 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex items-center justify-between mb-8'>
          <Breadcrumb>
            <span>Editar Capítulo</span>
          </Breadcrumb>
          <Button variant='ghost' onClick={() => router.back()}>
            Volver
          </Button>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Columna izquierda: Formulario de edición */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='md:col-span-2 backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-lg border border-white/50 space-y-6'>
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

          {/* Columna derecha: Panel de revisión con indicadores y revisión ortográfica */}
          <div className='md:col-span-1 space-y-6'>
            <div className='p-6 bg-white/90 rounded-2xl shadow border border-gray-200'>
              <h2 className='text-lg font-bold text-gray-800 mb-4'>
                Resumen de Palabras
              </h2>
              <WordCountIndicator
                label='Metodología'
                text={methodology}
                min={30}
                max={100}
              />
              <WordCountIndicator
                label='Introducción'
                text={introduction}
                min={50}
                max={150}
              />
              <WordCountIndicator
                label='Objetivos'
                text={objectives}
                min={50}
                max={150}
              />
              <WordCountIndicator
                label='Resultados'
                text={results}
                min={50}
                max={250}
              />
              <WordCountIndicator
                label='Discusión/Conclusión'
                text={discussion}
                min={30}
                max={150}
              />
              <WordCountIndicator
                label='Bibliografía'
                text={bibliography}
                min={30}
                max={150}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
