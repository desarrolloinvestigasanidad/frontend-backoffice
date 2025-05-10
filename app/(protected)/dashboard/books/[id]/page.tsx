"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  Info,
  Book,
} from "lucide-react";

export default function BookDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id: bookId } = params;
  const editionId = params.editionId as string | undefined;

  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");
  const [deleting, setDeleting] = useState(false);
  const [editionTitle, setEditionTitle] = useState("");
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});

  // Modificar los estados para manejar el tipo de archivo
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "pdf" | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [generating, setGenerating] = useState(false);
  const handleMouseEnter = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: false }));
  };

  useEffect(() => {
    const fetchEditionDetails = async () => {
      if (!editionId) return;

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

        // Determine the API endpoint based on whether we have an editionId
        const apiUrl = editionId
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}`
          : `${process.env.NEXT_PUBLIC_BASE_URL}/books/${bookId}`;

        const res = await fetch(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

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

    if (bookId) {
      if (editionId) {
        fetchEditionDetails();
      }
      fetchBook();
    } else {
      setMessage("Parámetros de libro faltantes.");
      setMessageType("error");
      setLoading(false);
    }
  }, [editionId, bookId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // Reemplazar la función handleFileChange para detectar el tipo de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image or PDF
    if (file.type.match("image.*")) {
      setFileType("image");
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setCoverFile(file);
    } else if (file.type === "application/pdf") {
      setFileType("pdf");
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setCoverFile(file);
    } else {
      setMessage("Solo se permiten imágenes o archivos PDF");
      setMessageType("error");
      setFileType(null);
      setCoverPreview(null);
      setCoverFile(null);
    }
  };

  const handleUploadCover = async () => {
    if (!coverFile) return;

    setUploadingCover(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("cover", coverFile);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/books/${bookId}/cover`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al subir la portada");
      }

      const { coverUrl } = await res.json();
      setFormData((prev: any) => ({ ...prev, cover: coverUrl }));
      setCoverFile(null);
      setCoverPreview(null);

      setMessageType("success");
      setMessage("Portada subida correctamente");
      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      setMessageType("error");
      setMessage(error.message);
    } finally {
      setUploadingCover(false);
    }
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

      // Determine the API endpoint based on whether we have an editionId
      const apiUrl = editionId
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/books/${bookId}`;

      const res = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

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

      // Determine the API endpoint based on whether we have an editionId
      const apiUrl = editionId
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/books/${bookId}`;

      const res = await fetch(apiUrl, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al eliminar el libro");
      }

      // Redirect based on whether we have an editionId
      if (editionId) {
        router.push(`/dashboard/editions/${editionId}/books`);
      } else {
        router.push(`/dashboard/books`);
      }
    } catch (error: any) {
      alert(error.message);
      setDeleting(false);
    }
  };
  // Define allApproved based on your application's logic
  const allApproved = formData.chapters?.every(
    (chapter: any) => chapter.status === "aprobado"
  );

  const handleGenerateBook = async () => {
    setGenerating(true);
    const token = localStorage.getItem("token");

    try {
      const genRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/books/${bookId}/generate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!genRes.ok) {
        const err = await genRes.json();
        throw new Error(err.message || "Error al generar el libro");
      }
      const { url } = await genRes.json();

      // ✂️ ABRIR DIRECTO, ya es https://bucket.s3.region.amazonaws.com/…
      window.open(url, "_blank");

      // 💡 Actualiza el estado local para que aparezca el botón de “Descargar PDF”
      toast.success("Libro generado correctamente", {
        position: "top-right",
      });

      toast.success("Libro generado correctamente");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setGenerating(false);
    }
  };
  // Check if the book is an edition book
  const isEditionBook = formData.bookType === "libro edición";

  const isPdfUrl = (url: string | undefined): boolean => {
    if (!url) return false;

    // Intentar extraer el nombre del archivo antes de los parámetros de consulta
    const urlWithoutParams = url.split("?")[0];

    // Verificar si contiene .pdf en la parte del path (no solo al final)
    return urlWithoutParams.toLowerCase().includes(".pdf");
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
              onClick={() => {
                if (editionId) {
                  router.push(`/dashboard/editions/${editionId}/books`);
                } else {
                  router.push(`/dashboard/books`);
                }
              }}>
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
            href={
              editionId
                ? `/dashboard/editions/${editionId}/books/${bookId}/chapters`
                : `/dashboard/books/${bookId}/chapters`
            }>
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
                {/* Reemplazar el bloque de visualización de la portada en CardContent */}
                <div className='relative w-full h-[400px] rounded-md overflow-hidden bg-gray-100 mb-6'>
                  {coverPreview && fileType === "image" ? (
                    <Image
                      src={coverPreview || "/placeholder.svg"}
                      alt={`Vista previa de portada para ${formData.title}`}
                      fill
                      className='object-cover'
                    />
                  ) : coverPreview && fileType === "pdf" ? (
                    <div className='w-full h-full flex flex-col items-center justify-center'>
                      <object
                        data={coverPreview}
                        type='application/pdf'
                        width='100%'
                        height='100%'
                        className='w-full h-full'>
                        <div className='flex flex-col items-center justify-center h-full'>
                          <BookOpen className='h-16 w-16 text-purple-600 mb-2' />
                          <p className='text-purple-700 font-medium'>
                            Vista previa de PDF
                          </p>
                          <p className='text-sm text-gray-500'>
                            {coverFile?.name}
                          </p>
                        </div>
                      </object>
                    </div>
                  ) : formData.cover ? (
                    isPdfUrl(formData.cover) ? (
                      <div className='w-full h-full flex flex-col items-center justify-center'>
                        <iframe
                          src={formData.cover}
                          width='100%'
                          height='100%'
                          className='w-full h-full'
                          title='PDF Preview'>
                          <p>Tu navegador no puede mostrar PDFs embebidos.</p>
                        </iframe>
                      </div>
                    ) : (
                      <Image
                        src={formData.cover || "/placeholder.svg"}
                        alt={`Portada de ${formData.title}`}
                        fill
                        className='object-cover'
                      />
                    )
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <BookOpen className='h-16 w-16 text-gray-300' />
                      <span className='sr-only'>Sin portada</span>
                    </div>
                  )}
                </div>

                <div className='w-full space-y-4'>
                  <div className='space-y-2'>
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

                  <div className='space-y-2'>
                    <Label
                      htmlFor='coverFile'
                      className='flex items-center gap-2 text-gray-700'>
                      <ImageIcon className='h-4 w-4 text-purple-600' />
                      Subir Portada (Imagen o PDF)
                    </Label>
                    <div className='flex gap-2'>
                      <input
                        ref={fileInputRef}
                        type='file'
                        id='coverFile'
                        accept='image/*,application/pdf'
                        onChange={handleFileChange}
                        className='hidden'
                      />
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => fileInputRef.current?.click()}
                        className='flex-1 border-gray-200 focus:border-purple-300 focus:ring-purple-200'>
                        {coverFile ? coverFile.name : "Seleccionar archivo"}
                      </Button>
                      <Button
                        type='button'
                        disabled={!coverFile || uploadingCover}
                        onClick={handleUploadCover}
                        className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'>
                        {uploadingCover ? (
                          <span className='flex items-center'>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />{" "}
                            Subiendo...
                          </span>
                        ) : (
                          <span className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' /> Subir
                          </span>
                        )}
                      </Button>
                    </div>
                    {/* Reemplazar el mensaje debajo del botón de subida */}
                    {coverFile && (
                      <p className='text-xs text-purple-600 italic'>
                        {fileType === "pdf"
                          ? "Archivo PDF seleccionado: "
                          : "Imagen seleccionada: "}
                        {coverFile.name}
                      </p>
                    )}
                  </div>
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
                {/* Estado del libro */}
                <div className='space-y-2'>
                  <Label
                    htmlFor='status'
                    className='flex items-center gap-2 text-gray-700'>
                    <Tag className='h-4 w-4 text-purple-600' />
                    Estado
                  </Label>
                  <select
                    id='status'
                    name='status'
                    value={formData.status || "borrador"}
                    onChange={handleChange}
                    className='w-full border-gray-200 focus:border-purple-300 focus:ring-purple-200 rounded-md p-2'>
                    <option value='borrador'>Borrador</option>
                    <option value='pendiente'>Pendiente</option>
                    <option value='rechazado'>Rechazado</option>
                    <option value='aprobado'>Aprobado</option>
                  </select>
                </div>

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
                      disabled={isEditionBook}
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                    />
                    {isEditionBook && (
                      <p className='text-xs text-purple-600 italic'>
                        No aplicable para libros de edición
                      </p>
                    )}
                  </div>
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
                      disabled={!!(isEditionBook && editionId)}
                    />
                    {isEditionBook && editionId && (
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
                      disabled={!!(isEditionBook && editionId)}
                    />
                    {isEditionBook && editionId && (
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
                      disabled={!!(isEditionBook && editionId)}
                    />
                    {isEditionBook && editionId && (
                      <p className='text-xs text-purple-600 italic'>
                        Heredada de la edición
                      </p>
                    )}
                  </div>
                </div>

                {isEditionBook && editionId && (
                  <Alert className='bg-purple-50 border-purple-200 text-purple-800'>
                    <Info className='h-4 w-4 text-purple-600' />
                    <AlertDescription>
                      Este es un libro de edición. Las fechas se heredan
                      automáticamente y no tiene precio.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>

              <CardFooter className='flex flex-wrap justify-between gap-2'>
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
                    onClick={() => {
                      if (editionId) {
                        router.push(`/dashboard/editions/${editionId}/books`);
                      } else {
                        router.push(`/dashboard/books`);
                      }
                    }}
                    className='border-gray-200 text-gray-700 hover:bg-gray-50'
                    disabled={saving || deleting}>
                    <ChevronLeft className='mr-2 h-4 w-4' /> Volver
                  </Button>
                </div>
                <div className='flex gap-2'>
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

                  <Button
                    onClick={handleGenerateBook}
                    disabled={!allApproved || generating}
                    className='bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900'
                    onMouseEnter={() => handleMouseEnter("generateBook")}
                    onMouseLeave={() => handleMouseLeave("generateBook")}>
                    {generating ? (
                      <span className='flex items-center'>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />{" "}
                        Generando...
                      </span>
                    ) : (
                      <motion.span
                        className='flex items-center'
                        animate={{ x: hoverStates["generateBook"] ? 2 : 0 }}
                        transition={{ duration: 0.2 }}>
                        <Book className='mr-2 h-4 w-4' /> Generar Libro
                      </motion.span>
                    )}
                  </Button>
                </div>
              </CardFooter>

              {!allApproved && (
                <p className='text-xs text-red-500 mt-2'>
                  Debes aprobar todos los capítulos antes de generar.
                </p>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
