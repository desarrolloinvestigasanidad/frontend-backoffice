"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";

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
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});

  const handleMouseEnter = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: false }));
  };

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
      const token = localStorage.getItem("token");
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
              onClick={() => router.push("/dashboard/editions")}>
              <ChevronLeft className='mr-1 h-4 w-4' />
              Volver
            </Button>
            <span className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
              Nueva Edición
            </span>
          </Breadcrumb>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            Crear Nueva Edición
          </h2>
          <p className='text-gray-600 text-sm md:text-base'>
            Completa el formulario para añadir una nueva edición a la plataforma
          </p>
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto'></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='max-w-3xl mx-auto'>
          <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg'>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <div className='bg-purple-100 p-3 rounded-full'>
                  <BookOpen className='h-6 w-6 text-purple-700' />
                </div>
                <div>
                  <CardTitle>Información de la Edición</CardTitle>
                  <CardDescription>
                    Introduce los datos para la nueva edición
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {message && (
                <Alert className='bg-red-50 border-red-200 text-red-800 mb-6'>
                  <AlertCircle className='h-4 w-4 text-red-600' />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className='space-y-6'>
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
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                      placeholder='Ej: Avances en Medicina 2025'
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
                      value={formData.subtitle}
                      onChange={handleChange}
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                      placeholder='Ej: Investigación y Práctica Clínica'
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
                      value={formData.year}
                      onChange={handleChange}
                      placeholder='2025'
                      type='number'
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='cover'
                      className='flex items-center gap-2 text-gray-700'>
                      <ImageIcon className='h-4 w-4 text-purple-600' />
                      Portada (URL)
                    </Label>
                    <Input
                      id='cover'
                      name='cover'
                      value={formData.cover}
                      onChange={handleChange}
                      placeholder='https://...'
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
                      value={formData.openDate}
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
                      value={formData.deadlineChapters}
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
                      value={formData.publishDate}
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
                    value={formData.normativa}
                    onChange={handleChange}
                    className='border-gray-200 focus:border-purple-300 focus:ring-purple-200 min-h-[100px]'
                    placeholder='Introduce la normativa para esta edición...'
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
                    value={formData.description}
                    onChange={handleChange}
                    className='border-gray-200 focus:border-purple-300 focus:ring-purple-200 min-h-[100px]'
                    placeholder='Describe brevemente esta edición...'
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className='flex justify-between'>
              <Button
                variant='outline'
                type='button'
                onClick={() => router.back()}
                className='border-gray-200 text-gray-700 hover:bg-gray-50'
                disabled={isLoading}
                onMouseEnter={() => handleMouseEnter("cancel")}
                onMouseLeave={() => handleMouseLeave("cancel")}>
                <motion.span
                  className='flex items-center'
                  animate={{ x: hoverStates["cancel"] ? -2 : 0 }}
                  transition={{ duration: 0.2 }}>
                  <X className='mr-2 h-4 w-4' /> Cancelar
                </motion.span>
              </Button>
              <Button
                type='submit'
                onClick={handleSubmit}
                className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'
                disabled={isLoading}
                onMouseEnter={() => handleMouseEnter("save")}
                onMouseLeave={() => handleMouseLeave("save")}>
                {isLoading ? (
                  <span className='flex items-center'>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Creando...
                  </span>
                ) : (
                  <motion.span
                    className='flex items-center'
                    animate={{ x: hoverStates["save"] ? 2 : 0 }}
                    transition={{ duration: 0.2 }}>
                    <Save className='mr-2 h-4 w-4' /> Crear Edición
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
