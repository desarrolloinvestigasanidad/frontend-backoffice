"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { BackgroundBlobs } from "@/components/background-blobs";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  ChevronLeft,
  Calendar,
  Clock,
  ImageIcon,
  Type,
  CalendarRange,
  Save,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  Layers,
  DollarSign,
  BookText,
  Hash,
  Tag,
} from "lucide-react";

export default function BookDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id: editionId, bookId } = params;
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");
  const [deleting, setDeleting] = useState(false);
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

    const fetchBook = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Error al cargar el libro");
        }
        const data = await res.json();
        setFormData(data);
      } catch (error: any) {
        console.error("Error en fetchBook:", error);
        setMessage(error.message);
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    if (editionId && bookId) {
      fetchEditionDetails();
      fetchBook();
    } else {
      setMessage("Parámetros de edición o libro faltantes.");
      setMessageType("error");
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
      const token = localStorage.getItem("token");

      // Create a copy of the form data for submission
      const submitData = { ...formData };

      // If it's an edition book, ensure price is set to 0
      if (formData.bookType === "libro edición") {
        submitData.price = 0;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(submitData),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al actualizar el libro");
      }
      setMessageType("success");
      setMessage("Libro actualizado correctamente.");
      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      setMessageType("error");
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar este libro?")) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
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
      setDeleting(false);
    }
  };

  // Check if the book is an edition book
  const isEditionBook = formData.bookType === "libro edición";

  if (loading) {
    return (
      <div className='relative overflow-hidden min-h-screen py-8'>
        <BackgroundBlobs />
        <div className='container mx-auto px-4 relative z-10'>
          <div className='flex items-center justify-center h-64'>
            <div className='relative'>
              <div className='h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin'></div>
              <div className='absolute inset-0 flex items-center justify-center'>
                <BookOpen className='h-6 w-6 text-purple-500' />
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
          className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              className='flex items-center text-purple-700 hover:text-purple-900 hover:bg-purple-50'
              onClick={() =>
                router.push(`/dashboard/editions/${editionId}/books`)
              }>
              <ChevronLeft className='mr-1 h-4 w-4' />
              Volver a Libros
            </Button>
            <span className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
              Detalle del Libro
            </span>

            {/* Book type badge */}
            <Badge
              className={`ml-2 ${
                isEditionBook
                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
              }`}>
              <Tag className='h-3 w-3 mr-1' />
              {isEditionBook ? "Libro de Edición" : "Libro Propio"}
            </Badge>
          </div>
          <Link
            href={`/dashboard/editions/${editionId}/books/${bookId}/chapters`}>
            <Button
              variant='outline'
              className='border-blue-200 text-blue-700 hover:bg-blue-50'
              onMouseEnter={() => handleMouseEnter("view-chapters")}
              onMouseLeave={() => handleMouseLeave("view-chapters")}>
              <motion.span
                className='flex items-center'
                animate={{ x: hoverStates["view-chapters"] ? 2 : 0 }}
                transition={{ duration: 0.2 }}>
                <Layers className='mr-2 h-4 w-4' /> Ver Capítulos
              </motion.span>
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            {formData.title || "Detalle del Libro"}
          </h2>
          {editionTitle && (
            <p className='text-gray-600 text-sm md:text-base mb-2'>
              Edición: <span className='font-medium'>{editionTitle}</span>
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

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Portada */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg overflow-hidden h-full'>
              <CardHeader>
                <div className='flex items-center gap-3'>
                  <div className='bg-purple-100 p-3 rounded-full'>
                    <ImageIcon className='h-6 w-6 text-purple-700' />
                  </div>
                  <div>
                    <CardTitle>Portada del Libro</CardTitle>
                    <CardDescription>
                      Imagen de portada para este libro
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='flex flex-col items-center'>
                <div className='relative w-full h-[400px] rounded-md overflow-hidden bg-gray-100 mb-6'>
                  {formData.cover ? (
                    <Image
                      src={formData.cover || "/placeholder.svg"}
                      alt={`Portada de ${formData.title}`}
                      fill
                      className='object-cover'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <BookOpen className='h-16 w-16 text-gray-300' />
                      <span className='sr-only'>Sin portada</span>
                    </div>
                  )}
                </div>
                <div className='w-full space-y-2'>
                  <Label
                    htmlFor='cover'
                    className='flex items-center gap-2 text-gray-700'>
                    <ImageIcon className='h-4 w-4 text-purple-600' />
                    URL de la Portada
                  </Label>
                  <Input
                    id='cover'
                    name='cover'
                    value={formData.cover || ""}
                    onChange={handleChange}
                    placeholder='https://ejemplo.com/portada.jpg'
                    className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Información */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}>
            <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg h-full'>
              <CardHeader>
                <div className='flex items-center gap-3'>
                  <div className='bg-purple-100 p-3 rounded-full'>
                    <BookText className='h-6 w-6 text-purple-700' />
                  </div>
                  <div>
                    <CardTitle>Información del Libro</CardTitle>
                    <CardDescription>
                      Datos generales de este libro
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
                      value={formData.title || ""}
                      onChange={handleChange}
                      required
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='subtitle'
                      className='flex items-center gap-2 text-gray-700'>
                      <Type className='h-4 w-4 text-purple-600' />
                      Subtítulo
                    </Label>
                    <Input
                      id='subtitle'
                      name='subtitle'
                      value={formData.subtitle || ""}
                      onChange={handleChange}
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                    />
                  </div>

                  {/* Only show price for non-edition books */}
                  {!isEditionBook && (
                    <div className='space-y-2'>
                      <Label
                        htmlFor='price'
                        className='flex items-center gap-2 text-gray-700'>
                        <DollarSign className='h-4 w-4 text-purple-600' />
                        Precio
                      </Label>
                      <Input
                        id='price'
                        name='price'
                        type='number'
                        value={formData.price || ""}
                        onChange={handleChange}
                        required
                        className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                      />
                    </div>
                  )}

                  <div className='space-y-2'>
                    <Label
                      htmlFor='isbn'
                      className='flex items-center gap-2 text-gray-700'>
                      <Hash className='h-4 w-4 text-purple-600' />
                      ISBN {isEditionBook ? "" : "(opcional)"}
                    </Label>
                    <Input
                      id='isbn'
                      name='isbn'
                      value={formData.isbn || ""}
                      onChange={handleChange}
                      placeholder='Deja vacío si aún no se asigna'
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='openDate'
                      className='flex items-center gap-2 text-gray-700'>
                      <CalendarRange className='h-4 w-4 text-purple-600' />
                      Fecha de Apertura
                    </Label>
                    <Input
                      id='openDate'
                      name='openDate'
                      type='date'
                      value={
                        formData.openDate ? formData.openDate.split("T")[0] : ""
                      }
                      onChange={handleChange}
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                      disabled={isEditionBook}
                    />
                    {isEditionBook && (
                      <p className='text-xs text-purple-600 italic'>
                        Heredada de la edición
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='deadlineChapters'
                      className='flex items-center gap-2 text-gray-700'>
                      <Clock className='h-4 w-4 text-purple-600' />
                      Fecha Máxima de Envío
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
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                      disabled={isEditionBook}
                    />
                    {isEditionBook && (
                      <p className='text-xs text-purple-600 italic'>
                        Heredada de la edición
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='publishDate'
                      className='flex items-center gap-2 text-gray-700'>
                      <Calendar className='h-4 w-4 text-purple-600' />
                      Fecha de Publicación
                    </Label>
                    <Input
                      id='publishDate'
                      name='publishDate'
                      type='date'
                      value={
                        formData.publishDate
                          ? formData.publishDate.split("T")[0]
                          : ""
                      }
                      onChange={handleChange}
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                      disabled={isEditionBook}
                    />
                    {isEditionBook && (
                      <p className='text-xs text-purple-600 italic'>
                        Heredada de la edición
                      </p>
                    )}
                  </div>
                </div>

                {isEditionBook && (
                  <Alert className='bg-purple-50 border-purple-200 text-purple-800'>
                    <InfoIcon className='h-4 w-4 text-purple-600' />
                    <AlertDescription>
                      Este es un libro de edición. Las fechas se heredan
                      automáticamente de la edición y no tiene precio.
                    </AlertDescription>
                  </Alert>
                )}
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
                      router.push(`/dashboard/editions/${editionId}/books`)
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
    </div>
  );
}

// Missing InfoIcon component
function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'>
      <circle cx='12' cy='12' r='10' />
      <line x1='12' y1='16' x2='12' y2='12' />
      <line x1='12' y1='8' x2='12.01' y2='8' />
    </svg>
  );
}
