"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BackgroundBlobs } from "@/components/background-blobs";
import { Breadcrumb } from "@/components/breadcrumb";
import {
  FileText,
  Plus,
  Search,
  FileEdit,
  LayoutGrid,
  List,
  Filter,
  BookText,
  AlertCircle,
  BookOpen,
  Tag,
  Clock,
} from "lucide-react";

// Ajusta este tipo según la información real que te devuelva el backend
type Chapter = {
  id: string;
  title: string;
  studyType: string;
  status: string;
  bookTitle?: string;
  bookId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [studyTypeFilter, setStudyTypeFilter] = useState<string>("all");
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});

  const handleMouseEnter = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: false }));
  };

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/chapters`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Error al cargar capítulos");
        }

        const data = await res.json();
        // Asegúrate de que 'data' sea un arreglo o extrae la propiedad necesaria
        const chaptersArray = Array.isArray(data) ? data : data.chapters ?? [];
        setChapters(chaptersArray);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, []);

  // Obtener los tipos de estudio únicos para el filtro
  const uniqueStudyTypes = Array.from(
    new Set(chapters.map((chapter) => chapter.studyType))
  ).filter(Boolean);

  // Obtener los estados únicos para el filtro
  const uniqueStatuses = Array.from(
    new Set(chapters.map((chapter) => chapter.status))
  ).filter(Boolean);

  // Filtrar capítulos por búsqueda y filtros
  const filteredChapters = chapters.filter((chapter) => {
    // Filtro por término de búsqueda
    const matchesSearch = chapter.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Filtro por estado
    const matchesStatus =
      statusFilter === "all" || chapter.status === statusFilter;

    // Filtro por tipo de estudio
    const matchesStudyType =
      studyTypeFilter === "all" || chapter.studyType === studyTypeFilter;

    return matchesSearch && matchesStatus && matchesStudyType;
  });

  // Función para obtener el color del badge según el estado
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "published":
      case "publicado":
      case "approved":
      case "aprobado":
        return "default";
      case "draft":
      case "borrador":
      case "pending":
      case "pendiente":
        return "secondary";
      case "review":
      case "revisión":
      case "en revisión":
        return "outline";
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

  return (
    <div className='relative overflow-hidden min-h-screen py-8'>
      <BackgroundBlobs />

      <div className='container mx-auto px-4 relative z-10 space-y-8'>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex items-center justify-between'>
          <Breadcrumb items={[{ label: "Gestión de Capítulos", href: "#" }]} />
          <Link href='/dashboard/chapters/new'>
            <Button
              className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'
              onMouseEnter={() => handleMouseEnter("newChapter")}
              onMouseLeave={() => handleMouseLeave("newChapter")}>
              <motion.span
                className='flex items-center'
                animate={{ x: hoverStates["newChapter"] ? 3 : 0 }}
                transition={{ duration: 0.2 }}>
                <Plus className='mr-2 h-4 w-4' />
                Crear Capítulo
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
            Gestión de Capítulos
          </h2>
          <p className='text-gray-600 text-sm md:text-base'>
            Administra todos tus capítulos desde un solo lugar
          </p>
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto'></div>
        </motion.div>

        {error && (
          <Alert className='bg-red-50 border-red-200 text-red-800 mb-6'>
            <AlertCircle className='h-4 w-4 text-red-600' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='flex flex-col md:flex-row justify-between items-center gap-4 mb-6'>
          <div className='relative w-full md:w-auto flex-1 max-w-md'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
            <input
              type='text'
              placeholder='Buscar capítulos...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 w-full'
            />
          </div>
          <div className='flex items-center gap-3'>
            <Badge variant='default' className='py-1.5'>
              {filteredChapters.length} capítulos encontrados
            </Badge>
            <div className='flex items-center border rounded-lg overflow-hidden'>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
                title='Vista de cuadrícula'>
                <LayoutGrid className='h-5 w-5' />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
                title='Vista de lista'>
                <List className='h-5 w-5' />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='flex flex-col md:flex-row gap-4 mb-6'>
          <div className='flex items-center gap-2'>
            <Filter className='h-4 w-4 text-purple-600' />
            <span className='text-sm font-medium text-gray-700'>
              Filtrar por estado:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 text-sm'>
              <option value='all'>Todos los estados</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className='flex items-center gap-2'>
            <BookText className='h-4 w-4 text-purple-600' />
            <span className='text-sm font-medium text-gray-700'>
              Filtrar por tipo de estudio:
            </span>
            <select
              value={studyTypeFilter}
              onChange={(e) => setStudyTypeFilter(e.target.value)}
              className='px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 text-sm'>
              <option value='all'>Todos los tipos</option>
              {uniqueStudyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {filteredChapters.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-lg border border-white/50 text-center'>
            <div className='flex flex-col items-center justify-center p-8'>
              <FileText className='w-16 h-16 text-purple-300 mb-4' />
              <h3 className='text-xl font-semibold text-gray-700 mb-2'>
                No se encontraron capítulos
              </h3>
              <p className='text-gray-500 mb-6'>
                {searchTerm
                  ? "No se encontraron capítulos que coincidan con tu búsqueda."
                  : statusFilter !== "all" || studyTypeFilter !== "all"
                  ? "No hay capítulos que coincidan con los filtros seleccionados."
                  : "No hay capítulos registrados."}
              </p>
              <Link href='/dashboard/chapters/new'>
                <Button className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300'>
                  <Plus className='mr-2 h-4 w-4' />
                  Crear Capítulo
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : viewMode === "grid" ? (
          // Vista de cuadrícula
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredChapters.map((chapter, index) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}>
                <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg overflow-hidden h-full hover:shadow-xl transition-shadow'>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-lg font-bold line-clamp-1'>
                      {chapter.title}
                    </CardTitle>
                    <div className='flex flex-wrap items-center gap-2 mt-1'>
                      <Badge variant={getStatusBadgeVariant(chapter.status)}>
                        {chapter.status}
                      </Badge>
                      <Badge
                        variant='outline'
                        className='bg-purple-50 text-purple-700'>
                        <Tag className='h-3 w-3 mr-1' />
                        {chapter.studyType || "Sin tipo"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className='pt-2'>
                    <div className='space-y-3'>
                      {chapter.bookTitle && (
                        <div className='flex items-center text-sm text-gray-600'>
                          <BookOpen className='h-4 w-4 mr-2 text-purple-600 flex-shrink-0' />
                          <span className='font-medium'>Libro:</span>
                          <span className='ml-2 truncate'>
                            {chapter.bookTitle}
                          </span>
                        </div>
                      )}
                      {chapter.createdAt && (
                        <div className='flex items-center text-sm text-gray-600'>
                          <Clock className='h-4 w-4 mr-2 text-purple-600 flex-shrink-0' />
                          <span className='font-medium'>Creado:</span>
                          <span className='ml-2'>
                            {new Date(chapter.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className='flex justify-end mt-4'>
                        <Link href={`/dashboard/chapters/${chapter.id}/edit`}>
                          <Button
                            variant='outline'
                            size='sm'
                            className='border-purple-200 text-purple-700 hover:bg-purple-50'
                            onMouseEnter={() =>
                              handleMouseEnter(`edit-${chapter.id}`)
                            }
                            onMouseLeave={() =>
                              handleMouseLeave(`edit-${chapter.id}`)
                            }>
                            <motion.span
                              className='flex items-center'
                              animate={{
                                x: hoverStates[`edit-${chapter.id}`] ? 2 : 0,
                              }}
                              transition={{ duration: 0.2 }}>
                              <FileEdit className='mr-1 h-4 w-4' /> Ver / Editar
                            </motion.span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          // Vista de lista
          <div className='overflow-hidden rounded-xl border border-white/50 backdrop-blur-sm bg-white/80 shadow-lg'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-purple-50 text-purple-900'>
                  <tr>
                    <th className='px-4 py-3 text-left'>#</th>
                    <th className='px-4 py-3 text-left'>Título</th>
                    <th className='px-4 py-3 text-left'>Tipo de Estudio</th>
                    <th className='px-4 py-3 text-left'>Estado</th>
                    <th className='px-4 py-3 text-left'>Libro</th>
                    <th className='px-4 py-3 text-center'>Acciones</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                  {filteredChapters.map((chapter, index) => (
                    <tr
                      key={chapter.id}
                      className='hover:bg-purple-50/50 transition-colors'>
                      <td className='px-4 py-3 text-sm text-gray-700'>
                        {index + 1}
                      </td>
                      <td className='px-4 py-3'>
                        <div className='font-medium text-gray-900 line-clamp-1'>
                          {chapter.title}
                        </div>
                        {chapter.createdAt && (
                          <div className='text-xs text-gray-500 flex items-center mt-1'>
                            <Clock className='h-3 w-3 mr-1' />
                            {new Date(chapter.createdAt).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className='px-4 py-3'>
                        <Badge
                          variant='outline'
                          className='bg-purple-50 text-purple-700'>
                          {chapter.studyType || "Sin tipo"}
                        </Badge>
                      </td>
                      <td className='px-4 py-3'>
                        <Badge variant={getStatusBadgeVariant(chapter.status)}>
                          {chapter.status}
                        </Badge>
                      </td>
                      <td className='px-4 py-3'>
                        {chapter.bookTitle ? (
                          <div className='flex items-center text-sm'>
                            <BookOpen className='h-4 w-4 mr-1 text-purple-600' />
                            <span className='truncate max-w-[150px]'>
                              {chapter.bookTitle}
                            </span>
                          </div>
                        ) : (
                          <span className='text-sm text-gray-500'>-</span>
                        )}
                      </td>
                      <td className='px-4 py-3 text-center'>
                        <Link href={`/dashboard/chapters/${chapter.id}/edit`}>
                          <Button
                            variant='outline'
                            size='sm'
                            className='border-purple-200 text-purple-700 hover:bg-purple-50'>
                            <FileEdit className='mr-1 h-4 w-4' /> Ver / Editar
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
