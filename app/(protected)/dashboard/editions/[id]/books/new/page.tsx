"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BackgroundBlobs } from "@/components/background-blobs";
import {
  CheckCircle,
  AlertCircle,
  ImageIcon,
  BookOpen,
  ArrowLeft,
  BookPlus,
} from "lucide-react";
import Link from "next/link";

type Edition = {
  id: string;
  title: string;
  openDate?: string;
  deadlineChapters?: string;
  publishDate?: string;
};

export default function NewBookPage() {
  const router = useRouter();
  const params = useParams();
  const { id: editionId } = params;
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    isbn: "",
    cover: "",
    interests: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [edition, setEdition] = useState<Edition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setEdition(data);
        }
      } catch (error) {
        console.error("Error fetching edition details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEditionDetails();
  }, [editionId]);

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
    setIsError(false);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        editionId,
        isbn: formData.isbn.trim() === "" ? null : formData.isbn,
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
      setTimeout(() => {
        router.push(`/dashboard/editions/${editionId}/books`);
      }, 1500);
    } catch (error: any) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setSaving(false);
    }
  };

  const generateISBN = () => {
    // This would be replaced with actual ISBN generation logic
    setMessage("Función para generar ISBN desde la bolsa de ISBNs disponibles");
    // For now, just set a placeholder
    setFormData((prev) => ({ ...prev, isbn: "ISBN-GENERADO-AUTOMÁTICAMENTE" }));
  };

  if (isLoading) {
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
          className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Link href={`/dashboard/editions/${editionId}/books`}>
              <Button
                variant='ghost'
                size='sm'
                className='text-purple-700 hover:text-purple-900 hover:bg-purple-50'
                onMouseEnter={() => handleMouseEnter("back")}
                onMouseLeave={() => handleMouseLeave("back")}>
                <motion.span
                  className='flex items-center'
                  animate={{ x: hoverStates["back"] ? -3 : 0 }}
                  transition={{ duration: 0.2 }}>
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Volver
                </motion.span>
              </Button>
            </Link>
            <span className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
              Nuevo Libro
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            Añadir Libro a {edition?.title}
          </h2>
          <p className='text-gray-600 text-sm md:text-base'>
            Completa la información para crear un nuevo libro en esta edición
          </p>
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto'></div>
        </motion.div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}>
            <Alert
              className={`mb-6 ${
                isError
                  ? "bg-red-50 text-red-800 border-red-200"
                  : "bg-green-50 text-green-800 border-green-200"
              }`}>
              {isError ? (
                <AlertCircle className='h-4 w-4 mr-2 text-red-600' />
              ) : (
                <CheckCircle className='h-4 w-4 mr-2 text-green-600' />
              )}
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg overflow-hidden'>
            <CardHeader className='pb-2 border-b border-gray-100'>
              <CardTitle className='text-xl font-bold text-purple-800'>
                Información del Libro
              </CardTitle>
            </CardHeader>
            <CardContent className='pt-6'>
              <form id='bookForm' onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='title'
                      className='font-medium text-gray-700'>
                      Título <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='title'
                      name='title'
                      value={formData.title}
                      onChange={handleChange}
                      className='border-gray-200 focus:ring-purple-500 focus:border-purple-500'
                      placeholder='Título del libro'
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='subtitle'
                      className='font-medium text-gray-700'>
                      Subtítulo
                    </Label>
                    <Input
                      id='subtitle'
                      name='subtitle'
                      value={formData.subtitle}
                      onChange={handleChange}
                      className='border-gray-200 focus:ring-purple-500 focus:border-purple-500'
                      placeholder='Subtítulo (opcional)'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='flex justify-between items-center'>
                    <Label htmlFor='isbn' className='font-medium text-gray-700'>
                      ISBN
                    </Label>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      className='text-xs border-purple-200 text-purple-700 hover:bg-purple-50'
                      onClick={generateISBN}>
                      Generar ISBN
                    </Button>
                  </div>
                  <Input
                    id='isbn'
                    name='isbn'
                    value={formData.isbn}
                    onChange={handleChange}
                    className='border-gray-200 focus:ring-purple-500 focus:border-purple-500'
                    placeholder='Se asignará automáticamente si se deja vacío'
                  />
                  <p className='text-xs text-gray-500 mt-1'>
                    El ISBN se puede asignar manualmente o generarse
                    automáticamente desde la bolsa de ISBNs disponibles.
                  </p>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='cover' className='font-medium text-gray-700'>
                    URL de la Portada
                  </Label>
                  <Input
                    id='cover'
                    name='cover'
                    value={formData.cover}
                    onChange={handleChange}
                    className='border-gray-200 focus:ring-purple-500 focus:border-purple-500'
                    placeholder='https://ejemplo.com/portada.jpg'
                  />

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-4'>
                    {formData.cover ? (
                      <div className='border rounded-md p-4 bg-gray-50'>
                        <p className='text-sm text-gray-500 mb-2 font-medium'>
                          Vista previa:
                        </p>
                        <div className='relative h-64 w-48 mx-auto border shadow-sm rounded-md overflow-hidden'>
                          <Image
                            src={formData.cover || "/placeholder.svg"}
                            alt='Vista previa de portada'
                            fill
                            className='object-cover'
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/abstract-book-cover.png";
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className='border rounded-md p-4 bg-gray-50 flex flex-col items-center justify-center h-64'>
                        <div className='bg-purple-100 p-4 rounded-full mb-3'>
                          <ImageIcon className='h-8 w-8 text-purple-500' />
                        </div>
                        <p className='text-sm text-gray-500 text-center'>
                          Ingresa una URL para ver la vista previa de la portada
                        </p>
                      </div>
                    )}

                    <div className='border rounded-md p-4 bg-gray-50'>
                      <p className='text-sm text-gray-500 mb-2 font-medium'>
                        Información de la edición:
                      </p>
                      <div className='space-y-3'>
                        <div className='flex items-center text-sm text-gray-600'>
                          <span className='font-medium w-40'>
                            Fecha de apertura:
                          </span>
                          <span>
                            {edition?.openDate
                              ? new Date(edition.openDate).toLocaleDateString()
                              : "No especificada"}
                          </span>
                        </div>
                        <div className='flex items-center text-sm text-gray-600'>
                          <span className='font-medium w-40'>
                            Fecha límite capítulos:
                          </span>
                          <span>
                            {edition?.deadlineChapters
                              ? new Date(
                                  edition.deadlineChapters
                                ).toLocaleDateString()
                              : "No especificada"}
                          </span>
                        </div>
                        <div className='flex items-center text-sm text-gray-600'>
                          <span className='font-medium w-40'>
                            Fecha de publicación:
                          </span>
                          <span>
                            {edition?.publishDate
                              ? new Date(
                                  edition.publishDate
                                ).toLocaleDateString()
                              : "No especificada"}
                          </span>
                        </div>
                        <p className='text-xs text-purple-600 italic mt-2'>
                          El libro heredará automáticamente las fechas de la
                          edición
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label
                    htmlFor='interests'
                    className='font-medium text-gray-700'>
                    Intereses/Temáticas
                  </Label>
                  <Input
                    id='interests'
                    name='interests'
                    value={formData.interests}
                    onChange={handleChange}
                    className='border-gray-200 focus:ring-purple-500 focus:border-purple-500'
                    placeholder='Separa las temáticas con comas (ej: Medicina, Investigación, Salud)'
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className='flex flex-col sm:flex-row justify-end gap-3 border-t p-6 bg-gray-50/50'>
              <Button
                variant='outline'
                type='button'
                onClick={() => router.back()}
                className='w-full sm:w-auto border-gray-300'
                onMouseEnter={() => handleMouseEnter("cancel")}
                onMouseLeave={() => handleMouseLeave("cancel")}>
                <motion.span
                  animate={{ x: hoverStates["cancel"] ? -2 : 0 }}
                  transition={{ duration: 0.2 }}>
                  Cancelar
                </motion.span>
              </Button>
              <Button
                type='submit'
                form='bookForm'
                disabled={saving}
                className='w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'
                onMouseEnter={() => handleMouseEnter("submit")}
                onMouseLeave={() => handleMouseLeave("submit")}>
                {saving ? (
                  <>
                    <span className='animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full inline-block'></span>
                    Guardando...
                  </>
                ) : (
                  <motion.span
                    className='flex items-center'
                    animate={{ x: hoverStates["submit"] ? 2 : 0 }}
                    transition={{ duration: 0.2 }}>
                    <BookPlus className='mr-2 h-4 w-4' /> Crear Libro
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
