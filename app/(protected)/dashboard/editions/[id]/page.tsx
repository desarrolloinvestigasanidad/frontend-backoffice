"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
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
  BookOpen,
  ChevronLeft,
  Calendar,
  Clock,
  FileText,
  ImageIcon,
  Type,
  CalendarRange,
  Save,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  BookPlus,
  Eye,
} from "lucide-react";
import Link from "next/link";

export default function EditionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");
  const [deleting, setDeleting] = useState(false);
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});

  const handleMouseEnter = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: false }));
  };

  useEffect(() => {
    const fetchEdition = async () => {
      try {
        const token = localStorage.getItem("token");
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
      const token = localStorage.getItem("token");
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
      setMessageType("success");
      setMessage("Edición actualizada correctamente.");
      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      setMessageType("error");
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar esta edición?")) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
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
      setDeleting(false);
    }
  };

  // Función para calcular el estado de la edición basado en las fechas
  const getEditionStatus = () => {
    if (!formData.openDate || !formData.publishDate) return "unknown";

    const now = new Date();
    const openDate = new Date(formData.openDate);
    const publishDate = new Date(formData.publishDate);

    if (now < openDate) return "upcoming";
    if (now > publishDate) return "published";
    return "active";
  };

  // Función para obtener el color del badge según el estado
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "upcoming":
        return "yellow";
      case "active":
        return "green";
      case "published":
        return "purple";
      default:
        return "outline";
    }
  };

  // Función para obtener el texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Próxima";
      case "active":
        return "Activa";
      case "published":
        return "Publicada";
      default:
        return "Desconocido";
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
                <BookOpen className='h-6 w-6 text-purple-500' />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const status = getEditionStatus();

  return (
    <div className='relative overflow-hidden min-h-screen py-8'>
      <BackgroundBlobs />

      <div className='container mx-auto px-4 relative z-10 space-y-8'>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
          <Breadcrumb>
            <Button
              variant='ghost'
              className='flex items-center text-purple-700 hover:text-purple-900 hover:bg-purple-50 mr-2'
              onClick={() => router.push("/dashboard/editions")}>
              <ChevronLeft className='mr-1 h-4 w-4' />
              Volver a Ediciones
            </Button>
            <span className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
              Detalle de Edición
            </span>
          </Breadcrumb>
          <div className='flex flex-wrap gap-2'>
            <Link href={`/dashboard/editions/${id}/books`}>
              <Button
                variant='outline'
                className='border-blue-200 text-blue-700 hover:bg-blue-50'
                onMouseEnter={() => handleMouseEnter("view-books")}
                onMouseLeave={() => handleMouseLeave("view-books")}>
                <motion.span
                  className='flex items-center'
                  animate={{ x: hoverStates["view-books"] ? 2 : 0 }}
                  transition={{ duration: 0.2 }}>
                  <Eye className='mr-2 h-4 w-4' /> Ver Libros
                </motion.span>
              </Button>
            </Link>
            <Link href={`/dashboard/editions/${id}/books/new`}>
              <Button
                variant='outline'
                className='border-green-200 text-green-700 hover:bg-green-50'
                onMouseEnter={() => handleMouseEnter("add-books")}
                onMouseLeave={() => handleMouseLeave("add-books")}>
                <motion.span
                  className='flex items-center'
                  animate={{ x: hoverStates["add-books"] ? 2 : 0 }}
                  transition={{ duration: 0.2 }}>
                  <BookPlus className='mr-2 h-4 w-4' /> Añadir Libros
                </motion.span>
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            {formData.title || "Detalle de la Edición"}
          </h2>
          {formData.subtitle && (
            <p className='text-gray-600 text-sm md:text-base mb-2'>
              {formData.subtitle}
            </p>
          )}
          <div className='flex justify-center mb-4'>
            <Badge
              variant={getStatusBadgeVariant(status) as any}
              className='text-sm py-1 px-3'>
              {getStatusText(status)}
            </Badge>
          </div>
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
                    <CardTitle>Portada de la Edición</CardTitle>
                    <CardDescription>
                      Imagen de portada para esta edición
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
                    <BookOpen className='h-6 w-6 text-purple-700' />
                  </div>
                  <div>
                    <CardTitle>Información de la Edición</CardTitle>
                    <CardDescription>
                      Datos generales de esta edición
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
                  <div className='space-y-2'>
                    <Label
                      htmlFor='year'
                      className='flex items-center gap-2 text-gray-700'>
                      <Calendar className='h-4 w-4 text-purple-600' />
                      Año
                    </Label>
                    <Input
                      id='year'
                      name='year'
                      type='number'
                      value={formData.year || ""}
                      onChange={handleChange}
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
                    />
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
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='publishDate'
                      className='flex items-center gap-2 text-gray-700'>
                      <BookOpen className='h-4 w-4 text-purple-600' />
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
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label
                    htmlFor='normativa'
                    className='flex items-center gap-2 text-gray-700'>
                    <FileText className='h-4 w-4 text-purple-600' />
                    Normativa
                  </Label>
                  <Textarea
                    id='normativa'
                    name='normativa'
                    value={formData.normativa || ""}
                    onChange={handleChange}
                    className='border-gray-200 focus:border-purple-300 focus:ring-purple-200 min-h-[100px]'
                  />
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='description'
                    className='flex items-center gap-2 text-gray-700'>
                    <FileText className='h-4 w-4 text-purple-600' />
                    Descripción
                  </Label>
                  <Textarea
                    id='description'
                    name='description'
                    value={formData.description || ""}
                    onChange={handleChange}
                    className='border-gray-200 focus:border-purple-300 focus:ring-purple-200 min-h-[100px]'
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
                    onClick={() => router.push("/dashboard/editions")}
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
