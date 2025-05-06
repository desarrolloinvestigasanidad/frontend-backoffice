"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { BackgroundBlobs } from "@/components/background-blobs";
import { Breadcrumb } from "@/components/breadcrumb";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  FileText,
  ChevronLeft,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  Type,
  BookText,
  ListChecks,
  BarChart2,
  MessageSquare,
  BookMarked,
  FileEdit,
  Edit,
  BookOpen,
} from "lucide-react";

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
  let statusColor = "";

  if (wordCount < min) {
    statusMessage = `Faltan ${min - wordCount} palabra${
      min - wordCount !== 1 ? "s" : ""
    } (mínimo ${min})`;
    statusColor = "text-red-600";
  } else if (wordCount > max) {
    statusMessage = `Excede en ${wordCount - max} palabra${
      wordCount - max !== 1 ? "s" : ""
    } (máximo ${max})`;
    statusColor = "text-red-600";
  } else {
    statusMessage = "Dentro del rango recomendado";
    statusColor = "text-green-600";
  }

  return (
    <div className='mb-4'>
      <div className='flex justify-between items-center mb-1'>
        <p className='text-sm font-medium text-gray-700'>{label}</p>
        <p className={`text-xs font-medium ${statusColor}`}>
          {wordCount} palabra{wordCount !== 1 && "s"}
        </p>
      </div>
      <div className='relative h-2 bg-gray-200 rounded-full overflow-hidden'>
        <div
          style={{ width: `${progress}%` }}
          className={`h-2 rounded-full transition-all duration-300 ${
            wordCount >= min && wordCount <= max ? "bg-green-500" : "bg-red-500"
          }`}
        />
      </div>
      <p className={`text-xs ${statusColor} mt-1`}>{statusMessage}</p>
    </div>
  );
}

export default function EditChapterPage() {
  const { chapterId } = useParams();
  const router = useRouter();

  // Estado para datos y formulario
  const [chapter, setChapter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");

  // Campos editables
  const [title, setTitle] = useState("");
  const [studyType, setStudyType] = useState("");
  const [methodology, setMethodology] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [objectives, setObjectives] = useState("");
  const [results, setResults] = useState("");
  const [discussion, setDiscussion] = useState("");
  const [bibliography, setBibliography] = useState("");
  const [status, setStatus] = useState("borrador");
  const [bookTitle, setBookTitle] = useState("");
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});

  const handleMouseEnter = (id: string) =>
    setHoverStates((prev) => ({ ...prev, [id]: true }));
  const handleMouseLeave = (id: string) =>
    setHoverStates((prev) => ({ ...prev, [id]: false }));

  // Carga inicial
  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/chapters/${chapterId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Error al cargar el capítulo");
        }
        const data = await res.json();
        setChapter(data);
        setTitle(data.title || "");
        setStudyType(data.studyType || "");
        setMethodology(data.methodology || "");
        setIntroduction(data.introduction || "");
        setObjectives(data.objectives || "");
        setResults(data.results || "");
        setDiscussion(data.discussion || "");
        setBibliography(data.bibliography || "");
        setStatus(data.status || "borrador");
        setBookTitle(data.bookTitle || "");
      } catch (err: any) {
        setError(err.message);
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };
    if (chapterId) fetchChapter();
  }, [chapterId]);

  // Guardar cambios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
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
        const errData = await res.json();
        throw new Error(errData.message || "Error al actualizar el capítulo");
      }
      setMessageType("success");
      setMessage("Capítulo actualizado correctamente");
      setTimeout(() => router.push("/dashboard/chapters"), 1500);
    } catch (err: any) {
      setMessageType("error");
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='relative overflow-hidden min-h-screen py-8'>
        <BackgroundBlobs />
        <div className='container mx-auto px-4 relative z-10'>
          <div className='flex items-center justify-center h-64'>
            <div className='relative'>
              <div className='h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin' />
              <div className='absolute inset-0 flex items-center justify-center'>
                <FileText className='h-6 w-6 text-purple-500' />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='relative overflow-hidden min-h-screen py-8'>
      <BackgroundBlobs />
      <div className='container mx-auto px-4 relative z-10 space-y-8'>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex items-center justify-between'>
          <Breadcrumb
            items={[
              { label: "Capítulos", href: "/dashboard/chapters" },
              { label: "Editar Capítulo", href: "#" },
            ]}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            {title || "Editar Capítulo"}
          </h2>
          {bookTitle && (
            <p className='text-gray-600 text-sm md:text-base mb-2'>
              Libro: <span className='font-medium'>{bookTitle}</span>
            </p>
          )}
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto' />
        </motion.div>

        {message && (
          <Alert
            className={`${
              messageType === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            } mb-6`}>
            {messageType === "success" ? (
              <CheckCircle className='h-4 w-4 text-green-600' />
            ) : (
              <AlertCircle className='h-4 w-4 text-red-600' />
            )}
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Formulario */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='md:col-span-2 backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-lg border border-white/50 space-y-6'>
            <Card className='border-0 shadow-none bg-transparent'>
              <CardHeader className='px-0 pt-0'>
                <div className='flex items-center gap-3'>
                  <div className='bg-purple-100 p-3 rounded-full'>
                    <FileEdit className='h-6 w-6 text-purple-700' />
                  </div>
                  <div>
                    <CardTitle>Información del Capítulo</CardTitle>
                    <CardDescription>
                      Edita los detalles de este capítulo
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='px-0 space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='title'
                      className='flex items-center gap-2 text-gray-700'>
                      <Type className='h-4 w-4 text-purple-600' />
                      Título
                    </Label>
                    <Input
                      id='title'
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='studyType'
                      className='flex items-center gap-2 text-gray-700'>
                      <BookText className='h-4 w-4 text-purple-600' />
                      Tipo de Estudio
                    </Label>
                    <Input
                      id='studyType'
                      value={studyType}
                      onChange={(e) => setStudyType(e.target.value)}
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                      required
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label
                    htmlFor='methodology'
                    className='flex items-center gap-2 text-gray-700'>
                    <BookText className='h-4 w-4 text-purple-600' />
                    Metodología
                  </Label>
                  <Textarea
                    id='methodology'
                    value={methodology}
                    onChange={(e) => setMethodology(e.target.value)}
                    rows={4}
                    className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='introduction'
                    className='flex items-center gap-2 text-gray-700'>
                    <BookOpen className='h-4 w-4 text-purple-600' />
                    Introducción
                  </Label>
                  <Textarea
                    id='introduction'
                    value={introduction}
                    onChange={(e) => setIntroduction(e.target.value)}
                    rows={4}
                    className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='objectives'
                    className='flex items-center gap-2 text-gray-700'>
                    <ListChecks className='h-4 w-4 text-purple-600' />
                    Objetivos
                  </Label>
                  <Textarea
                    id='objectives'
                    value={objectives}
                    onChange={(e) => setObjectives(e.target.value)}
                    rows={4}
                    className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='results'
                    className='flex items-center gap-2 text-gray-700'>
                    <BarChart2 className='h-4 w-4 text-purple-600' />
                    Resultados
                  </Label>
                  <Textarea
                    id='results'
                    value={results}
                    onChange={(e) => setResults(e.target.value)}
                    rows={4}
                    className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='discussion'
                    className='flex items-center gap-2 text-gray-700'>
                    <MessageSquare className='h-4 w-4 text-purple-600' />
                    Discusión/Conclusión
                  </Label>
                  <Textarea
                    id='discussion'
                    value={discussion}
                    onChange={(e) => setDiscussion(e.target.value)}
                    rows={4}
                    className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='bibliography'
                    className='flex items-center gap-2 text-gray-700'>
                    <BookMarked className='h-4 w-4 text-purple-600' />
                    Bibliografía
                  </Label>
                  <Textarea
                    id='bibliography'
                    value={bibliography}
                    onChange={(e) => setBibliography(e.target.value)}
                    rows={4}
                    className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                    required
                  />
                </div>
              </CardContent>

              {/* Estado movido al final, encima de botones */}
              <CardContent className='px-0'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='status'
                    className='flex items-center gap-2 text-gray-700'>
                    <Edit className='h-4 w-4 text-purple-600' />
                    Estado
                  </Label>
                  <Select
                    onValueChange={(val) => setStatus(val)}
                    value={status}
                    required>
                    <SelectTrigger className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'>
                      <SelectValue placeholder='Selecciona el estado' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='pendiente'>Pendiente</SelectItem>
                      <SelectItem value='aprobado'>Aprobado</SelectItem>
                      <SelectItem value='publicado'>Publicado</SelectItem>
                      <SelectItem value='rechazado'>Rechazado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>

              <CardFooter className='px-0 pt-4 flex justify-between'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => router.push("/dashboard/chapters")}
                  className='border-gray-200 text-gray-700 hover:bg-gray-50'
                  disabled={saving}>
                  <ChevronLeft className='mr-2 h-4 w-4' /> Cancelar
                </Button>
                <Button
                  type='submit'
                  disabled={saving}
                  className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'
                  onMouseEnter={() => handleMouseEnter("save")}
                  onMouseLeave={() => handleMouseLeave("save")}>
                  {saving ? (
                    <span className='flex items-center'>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />{" "}
                      Guardando...
                    </span>
                  ) : (
                    <motion.span
                      className='flex items-center'
                      animate={{ x: hoverStates["save"] ? 2 : 0 }}
                      transition={{ duration: 0.2 }}>
                      <Save className='mr-2 h-4 w-4' /> Guardar Cambios
                    </motion.span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.form>

          {/* Panel derecho */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className='md:col-span-1 space-y-6'>
            <Card className='backdrop-blur-sm bg-white/90 border-white/50 shadow-lg'>
              <CardHeader>
                <CardTitle className='text-lg'>Resumen de Palabras</CardTitle>
                <CardDescription>
                  Conteo de palabras por sección
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
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
              </CardContent>
            </Card>

            <Card className='backdrop-blur-sm bg-white/90 border-white/50 shadow-lg'>
              <CardHeader>
                <CardTitle className='text-lg'>Estado Actual</CardTitle>
                <CardDescription>
                  Información sobre el estado del capítulo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex flex-col gap-3'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm font-medium text-gray-700'>
                      Estado:
                    </span>
                    <Badge
                      variant={
                        status === "publicado" || status === "aprobado"
                          ? "default"
                          : status === "borrador"
                          ? "secondary"
                          : status === "en revisión" || status === "pendiente"
                          ? "default"
                          : status === "rechazado"
                          ? "destructive"
                          : "outline"
                      }>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm font-medium text-gray-700'>
                      Tipo de estudio:
                    </span>
                    <Badge
                      variant='outline'
                      className='bg-purple-50 text-purple-700'>
                      {studyType || "No especificado"}
                    </Badge>
                  </div>
                  {chapter.createdAt && (
                    <div className='flex justify-between items-center'>
                      <span className='text-sm font-medium text-gray-700'>
                        Creado:
                      </span>
                      <span className='text-sm text-gray-600'>
                        {new Date(chapter.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {chapter.updatedAt && (
                    <div className='flex justify-between items-center'>
                      <span className='text-sm font-medium text-gray-700'>
                        Última actualización:
                      </span>
                      <span className='text-sm text-gray-600'>
                        {new Date(chapter.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
