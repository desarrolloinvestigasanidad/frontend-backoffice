"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  FileText,
  ChevronLeft,
  Save,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  BookText,
  Type,
  BookOpen,
  ListChecks,
  BarChart2,
  MessageSquare,
  BookMarked,
  FileEdit,
} from "lucide-react";

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
};

export default function ChapterDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id: editionId, bookId, chapterId } = params;

  const [chapter, setChapter] = useState<ChapterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");
  const [deleting, setDeleting] = useState(false);
  const [bookTitle, setBookTitle] = useState("");
  const [editionTitle, setEditionTitle] = useState("");
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});

  const handleMouseEnter = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: false }));
  };

  useEffect(() => {
    const fetchEditionDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          throw new Error("Error al cargar detalles de la edición");
        }
        const data = await res.json();
        setEditionTitle(data.title || "Edición");
      } catch (err) {
        console.error("Error al cargar detalles de la edición:", err);
      }
    };

    const fetchBookDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          throw new Error("Error al cargar detalles del libro");
        }
        const data = await res.json();
        setBookTitle(data.title || "Libro");
      } catch (err) {
        console.error("Error al cargar detalles del libro:", err);
      }
    };

    const fetchChapter = async () => {
      try {
        const token = localStorage.getItem("token");
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
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    if (editionId && bookId && chapterId) {
      fetchEditionDetails();
      fetchBookDetails();
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
      const token = localStorage.getItem("token");
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
      setMessageType("success");
      setMessage("Capítulo actualizado correctamente.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setMessageType("error");
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar este capítulo?")) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
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
      router.push(`/dashboard/editions/${editionId}/books/${bookId}/chapters`);
    } catch (err: any) {
      alert(err.message);
      setDeleting(false);
    }
  };

  // Función para obtener el color del badge según el estado
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "published":
      case "publicado":
        return "default";
      case "draft":
      case "borrador":
        return "secondary";
      case "review":
      case "revisión":
        return "default";
      case "rejected":
      case "rechazado":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className='relative overflow-hidden min-h-screen py-8'>
        <BackgroundBlobs />
        <div className='container mx-auto px-4 relative z-10'>
          <div className='flex items-center justify-center h-64'>
            <div className='relative'>
              <div className='h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin'></div>
              <div className='absolute inset-0 flex items-center justify-center'>
                <FileText className='h-6 w-6 text-purple-500' />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className='relative overflow-hidden min-h-screen py-8'>
        <BackgroundBlobs />
        <div className='container mx-auto px-4 relative z-10'>
          <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg max-w-md mx-auto'>
            <CardHeader>
              <CardTitle>Capítulo no encontrado</CardTitle>
              <CardDescription>
                No se pudo encontrar la información del capítulo solicitado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-center mb-4'>
                El capítulo que estás buscando no existe o ha sido eliminado.
              </p>
              <Button
                onClick={() =>
                  router.push(
                    `/dashboard/editions/${editionId}/books/${bookId}/chapters`
                  )
                }
                className='w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'>
                <ChevronLeft className='mr-2 h-4 w-4' />
                Volver a la lista de capítulos
              </Button>
            </CardContent>
          </Card>
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
          <Breadcrumb>
            <Button
              variant='ghost'
              className='flex items-center text-purple-700 hover:text-purple-900 hover:bg-purple-50 mr-2'
              onClick={() =>
                router.push(
                  `/dashboard/editions/${editionId}/books/${bookId}/chapters`
                )
              }>
              <ChevronLeft className='mr-1 h-4 w-4' />
              Volver a Capítulos
            </Button>
            <span className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
              Detalle del Capítulo
            </span>
          </Breadcrumb>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            {chapter.title || "Detalle del Capítulo"}
          </h2>
          <div className='flex justify-center items-center gap-3 mb-4'>
            <Badge
              variant={getStatusBadgeVariant(chapter.status)}
              className='text-sm py-1 px-3'>
              {chapter.status}
            </Badge>
            <Badge
              variant='outline'
              className='bg-purple-50 text-purple-700 text-sm py-1 px-3'>
              <BookText className='h-3 w-3 mr-1' />
              {chapter.studyType || "Sin tipo de estudio"}
            </Badge>
          </div>
          {bookTitle && (
            <p className='text-gray-600 text-sm md:text-base mb-2'>
              <span className='font-medium'>{bookTitle}</span> - Edición:{" "}
              <span className='font-medium'>{editionTitle}</span>
            </p>
          )}
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto'></div>
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg'>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <div className='bg-purple-100 p-3 rounded-full'>
                  <FileEdit className='h-6 w-6 text-purple-700' />
                </div>
                <div>
                  <CardTitle>Información del Capítulo</CardTitle>
                  <CardDescription>
                    Revisa y edita los detalles de este capítulo
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-6'>
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
                    name='title'
                    value={chapter.title}
                    onChange={handleChange}
                    className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
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
                    name='studyType'
                    value={chapter.studyType}
                    onChange={handleChange}
                    className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                  />
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='status'
                    className='flex items-center gap-2 text-gray-700'>
                    <BookOpen className='h-4 w-4 text-purple-600' />
                    Estado
                  </Label>
                  <Input
                    id='status'
                    name='status'
                    value={chapter.status}
                    onChange={handleChange}
                    className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                  />
                </div>
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
                  name='introduction'
                  value={chapter.introduction}
                  onChange={handleChange}
                  rows={5}
                  className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
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
                  name='objectives'
                  value={chapter.objectives}
                  onChange={handleChange}
                  rows={5}
                  className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
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
                  name='results'
                  value={chapter.results}
                  onChange={handleChange}
                  rows={5}
                  className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                />
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='discussion'
                  className='flex items-center gap-2 text-gray-700'>
                  <MessageSquare className='h-4 w-4 text-purple-600' />
                  Discusión
                </Label>
                <Textarea
                  id='discussion'
                  name='discussion'
                  value={chapter.discussion}
                  onChange={handleChange}
                  rows={5}
                  className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
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
                  name='bibliography'
                  value={chapter.bibliography}
                  onChange={handleChange}
                  rows={5}
                  className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                />
              </div>
            </CardContent>
            <CardFooter className='flex justify-between'>
              <div className='flex gap-2'>
                <Button
                  variant='destructive'
                  onClick={handleDelete}
                  disabled={deleting}
                  onMouseEnter={() => handleMouseEnter("delete")}
                  onMouseLeave={() => handleMouseLeave("delete")}>
                  {deleting ? (
                    <span className='flex items-center'>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />{" "}
                      Eliminando...
                    </span>
                  ) : (
                    <motion.span
                      className='flex items-center'
                      animate={{ x: hoverStates["delete"] ? -2 : 0 }}
                      transition={{ duration: 0.2 }}>
                      <Trash2 className='mr-2 h-4 w-4' /> Eliminar
                    </motion.span>
                  )}
                </Button>
                <Button
                  variant='outline'
                  type='button'
                  onClick={() =>
                    router.push(
                      `/dashboard/editions/${editionId}/books/${bookId}/chapters`
                    )
                  }
                  className='border-gray-200 text-gray-700 hover:bg-gray-50'
                  disabled={saving || deleting}>
                  <ChevronLeft className='mr-2 h-4 w-4' /> Volver
                </Button>
              </div>
              <Button
                onClick={handleSave}
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
        </motion.div>
      </div>
    </div>
  );
}
