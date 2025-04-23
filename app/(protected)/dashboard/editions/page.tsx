"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BackgroundBlobs } from "@/components/background-blobs";
import {
  BookOpen,
  Calendar,
  Clock,
  Plus,
  Eye,
  Edit,
  BookPlus,
  AlertCircle,
  CalendarRange,
} from "lucide-react";

type Edition = {
  id: string;
  title: string;
  subtitle?: string;
  year?: number;
  openDate?: string;
  deadlineChapters?: string;
  publishDate?: string;
  cover?: string;
};

export default function EdicionesPage() {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});

  const handleMouseEnter = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: false }));
  };

  useEffect(() => {
    const fetchEditions = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/editions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Error al cargar ediciones");
        }
        const data = await res.json();
        setEditions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEditions();
  }, []);

  // Función para calcular el estado de la edición basado en las fechas
  const getEditionStatus = (edition: Edition) => {
    if (!edition.openDate || !edition.publishDate) return "unknown";

    const now = new Date();
    const openDate = new Date(edition.openDate);
    const publishDate = new Date(edition.publishDate);

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
            <span className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
              Gestión de Ediciones
            </span>
          </div>
          <Link href='/dashboard/editions/new'>
            <Button
              className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'
              onMouseEnter={() => handleMouseEnter("newEdition")}
              onMouseLeave={() => handleMouseLeave("newEdition")}>
              <motion.span
                className='flex items-center'
                animate={{ x: hoverStates["newEdition"] ? 3 : 0 }}
                transition={{ duration: 0.2 }}>
                <Plus className='mr-2 h-4 w-4' />
                Crear Edición
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
            Ediciones Disponibles
          </h2>
          <p className='text-gray-600 text-sm md:text-base'>
            Gestiona todas las ediciones de la plataforma desde un solo lugar
          </p>
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto'></div>
        </motion.div>

        {error && (
          <Alert className='bg-red-50 border-red-200 text-red-800 mb-6'>
            <AlertCircle className='h-4 w-4 text-red-600' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {editions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-lg border border-white/50 text-center'>
            <div className='flex flex-col items-center justify-center p-8'>
              <BookOpen className='w-16 h-16 text-purple-300 mb-4' />
              <h3 className='text-xl font-semibold text-gray-700 mb-2'>
                No hay ediciones registradas
              </h3>
              <p className='text-gray-500 mb-6'>
                Comienza añadiendo tu primera edición a la plataforma
              </p>
              <Link href='/dashboard/editions/new'>
                <Button className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300'>
                  <Plus className='mr-2 h-4 w-4' />
                  Crear Edición
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {editions.map((edition, index) => {
              const status = getEditionStatus(edition);
              return (
                <motion.div
                  key={edition.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}>
                  <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg overflow-hidden h-full'>
                    <CardHeader className='pb-0'>
                      <div className='flex justify-between items-start'>
                        <div>
                          <CardTitle className='text-xl font-bold'>
                            {edition.title}
                          </CardTitle>
                          {edition.subtitle && (
                            <CardDescription className='mt-1'>
                              {edition.subtitle}
                            </CardDescription>
                          )}
                        </div>
                        <Badge variant={getStatusBadgeVariant(status) as any}>
                          {getStatusText(status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className='pt-4'>
                      <div className='flex flex-col md:flex-row gap-4'>
                        {/* Portada */}
                        <div className='relative w-full md:w-32 h-40 rounded-md overflow-hidden bg-gray-100 flex-shrink-0'>
                          {edition.cover ? (
                            <Image
                              src={edition.cover || "/placeholder.svg"}
                              alt={`Portada de ${edition.title}`}
                              fill
                              className='object-cover'
                            />
                          ) : (
                            <div className='w-full h-full flex items-center justify-center'>
                              <BookOpen className='h-12 w-12 text-gray-300' />
                              <span className='sr-only'>Sin portada</span>
                            </div>
                          )}
                        </div>

                        {/* Información */}
                        <div className='flex-1 space-y-3'>
                          <div className='flex items-center text-sm text-gray-600'>
                            <Calendar className='h-4 w-4 mr-2 text-purple-600' />
                            <span className='font-medium'>Año:</span>
                            <span className='ml-2'>
                              {edition.year || "No especificado"}
                            </span>
                          </div>

                          <div className='flex items-center text-sm text-gray-600'>
                            <CalendarRange className='h-4 w-4 mr-2 text-purple-600' />
                            <span className='font-medium'>Apertura:</span>
                            <span className='ml-2'>
                              {edition.openDate
                                ? new Date(
                                    edition.openDate
                                  ).toLocaleDateString()
                                : "No especificada"}
                            </span>
                          </div>

                          <div className='flex items-center text-sm text-gray-600'>
                            <Clock className='h-4 w-4 mr-2 text-purple-600' />
                            <span className='font-medium'>
                              Fecha límite capítulos:
                            </span>
                            <span className='ml-2'>
                              {edition.deadlineChapters
                                ? new Date(
                                    edition.deadlineChapters
                                  ).toLocaleDateString()
                                : "No especificada"}
                            </span>
                          </div>

                          <div className='flex items-center text-sm text-gray-600'>
                            <BookOpen className='h-4 w-4 mr-2 text-purple-600' />
                            <span className='font-medium'>Publicación:</span>
                            <span className='ml-2'>
                              {edition.publishDate
                                ? new Date(
                                    edition.publishDate
                                  ).toLocaleDateString()
                                : "No especificada"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className='flex flex-wrap gap-2 pt-2'>
                      <Link href={`/dashboard/editions/${edition.id}`}>
                        <Button
                          variant='outline'
                          size='sm'
                          className='border-purple-200 text-purple-700 hover:bg-purple-50'
                          onMouseEnter={() =>
                            handleMouseEnter(`edit-${edition.id}`)
                          }
                          onMouseLeave={() =>
                            handleMouseLeave(`edit-${edition.id}`)
                          }>
                          <motion.span
                            className='flex items-center'
                            animate={{
                              x: hoverStates[`edit-${edition.id}`] ? 2 : 0,
                            }}
                            transition={{ duration: 0.2 }}>
                            <Edit className='mr-1 h-4 w-4' /> Ver / Editar
                          </motion.span>
                        </Button>
                      </Link>
                      <Link href={`/dashboard/editions/${edition.id}/books`}>
                        <Button
                          variant='outline'
                          size='sm'
                          className='border-blue-200 text-blue-700 hover:bg-blue-50'
                          onMouseEnter={() =>
                            handleMouseEnter(`view-${edition.id}`)
                          }
                          onMouseLeave={() =>
                            handleMouseLeave(`view-${edition.id}`)
                          }>
                          <motion.span
                            className='flex items-center'
                            animate={{
                              x: hoverStates[`view-${edition.id}`] ? 2 : 0,
                            }}
                            transition={{ duration: 0.2 }}>
                            <Eye className='mr-1 h-4 w-4' /> Ver Libros
                          </motion.span>
                        </Button>
                      </Link>
                      <Link
                        href={`/dashboard/editions/${edition.id}/books/new`}>
                        <Button
                          variant='outline'
                          size='sm'
                          className='border-green-200 text-green-700 hover:bg-green-50'
                          onMouseEnter={() =>
                            handleMouseEnter(`add-${edition.id}`)
                          }
                          onMouseLeave={() =>
                            handleMouseLeave(`add-${edition.id}`)
                          }>
                          <motion.span
                            className='flex items-center'
                            animate={{
                              x: hoverStates[`add-${edition.id}`] ? 2 : 0,
                            }}
                            transition={{ duration: 0.2 }}>
                            <BookPlus className='mr-1 h-4 w-4' /> Añadir Libros
                          </motion.span>
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
