"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BackgroundBlobs } from "@/components/background-blobs";
import {
  BookOpen,
  Plus,
  Eye,
  Edit,
  LayoutGrid,
  List,
  AlertCircle,
  Search,
  Calendar,
  CalendarRange,
  Clock,
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "upcoming" | "active" | "published"
  >("all");
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});

  const handleMouseEnter = (id: string) =>
    setHoverStates((prev) => ({ ...prev, [id]: true }));
  const handleMouseLeave = (id: string) =>
    setHoverStates((prev) => ({ ...prev, [id]: false }));

  useEffect(() => {
    const fetchEditions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/editions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Error al cargar ediciones");
        }
        const data = await res.json();
        setEditions(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEditions();
  }, []);

  const getEditionStatus = (ed: Edition) => {
    if (!ed.openDate || !ed.publishDate) return "unknown";
    const now = new Date();
    const open = new Date(ed.openDate);
    const pub = new Date(ed.publishDate);
    if (now < open) return "upcoming";
    if (now > pub) return "published";
    return "active";
  };
  const getBadgeVariant = (status: string) => {
    if (status === "upcoming") return "yellow";
    if (status === "active") return "green";
    if (status === "published") return "purple";
    return "outline";
  };
  const getStatusText = (status: string) => {
    if (status === "upcoming") return "Próxima";
    if (status === "active") return "Activa";
    if (status === "published") return "Publicada";
    return "Desconocido";
  };

  // Filtrado por búsqueda y estado
  const filtered = editions.filter((ed) => {
    const term = searchTerm.toLowerCase();
    const titleMatch = ed.title.toLowerCase().includes(term);
    const subMatch = ed.subtitle?.toLowerCase().includes(term);
    const status = getEditionStatus(ed);
    const statusMatch = statusFilter === "all" || status === statusFilter;
    return (titleMatch || subMatch) && statusMatch;
  });

  if (loading) {
    return (
      <div className='relative overflow-hidden min-h-screen py-8'>
        <BackgroundBlobs />
        <div className='container mx-auto px-4 relative z-10'>
          <div className='flex items-center justify-center h-64'>
            <div className='relative'>
              <div className='h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin' />
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex items-center justify-between'>
          <span className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
            Gestión de Ediciones
          </span>
          <div className='flex items-center gap-2'>
            <Link href='/dashboard/editions/new'>
              <Button
                onMouseEnter={() => handleMouseEnter("newEdition")}
                onMouseLeave={() => handleMouseLeave("newEdition")}
                className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'>
                <motion.span
                  animate={{
                    x: hoverStates["newEdition"] ? 3 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className='flex items-center'>
                  <Plus className='mr-2 h-4 w-4' /> Crear Edición
                </motion.span>
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            Ediciones Disponibles
          </h2>
          <p className='text-gray-600 text-sm md:text-base'>
            Administra todas las ediciones desde un único sitio
          </p>
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto' />
        </motion.div>

        {error && (
          <Alert className='bg-red-50 border-red-200 text-red-800 mb-6'>
            <AlertCircle className='h-4 w-4 text-red-600' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='flex flex-col md:flex-row items-center justify-between gap-4 mb-6'>
          <div className='relative flex-1 max-w-md'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
            <input
              type='text'
              placeholder='Buscar título/subtítulo...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 w-full'
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className='px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 text-sm'>
            <option value='all'>Todas las ediciones</option>
            <option value='upcoming'>Próximas</option>
            <option value='active'>Activas</option>
            <option value='published'>Publicadas</option>
          </select>
          <div className='flex items-center gap-2'>
            <Badge variant='default' className='py-1.5'>
              {filtered.length} ediciones
            </Badge>
            <Button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${
                viewMode === "grid"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}>
              <LayoutGrid className='h-5 w-5' />
            </Button>
            <Button
              onClick={() => setViewMode("list")}
              className={`p-2 ${
                viewMode === "list"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}>
              <List className='h-5 w-5' />
            </Button>
          </div>
        </motion.div>

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-lg border border-white/50 text-center'>
            <BookOpen className='w-16 h-16 text-purple-300 mb-4' />
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>
              No se encontraron ediciones
            </h3>
            <p className='text-gray-500 mb-6'>
              Ajusta tu búsqueda o crea una nueva edición.
            </p>
            <Link href='/dashboard/editions/new'>
              <Button className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'>
                <Plus className='mr-2 h-4 w-4' /> Crear Edición
              </Button>
            </Link>
          </motion.div>
        ) : viewMode === "grid" ? (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {filtered.map((ed, idx) => {
              const status = getEditionStatus(ed);
              return (
                <motion.div
                  key={ed.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}>
                  <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg h-full'>
                    <CardHeader className='pb-0'>
                      <div className='flex justify-between items-start'>
                        <div>
                          <CardTitle className='text-xl font-bold'>
                            {ed.title}
                          </CardTitle>
                          {ed.subtitle && (
                            <CardDescription className='mt-1'>
                              {ed.subtitle}
                            </CardDescription>
                          )}
                        </div>
                        <Badge variant={getBadgeVariant(status) as any}>
                          {getStatusText(status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className='pt-4'>
                      <div className='flex flex-col md:flex-row gap-4'>
                        <div className='relative w-full md:w-32 h-40 rounded-md overflow-hidden bg-gray-100'>
                          {ed.cover ? (
                            <Image
                              src={ed.cover}
                              alt={`Portada ${ed.title}`}
                              fill
                              className='object-cover'
                            />
                          ) : (
                            <div className='w-full h-full flex items-center justify-center'>
                              <BookOpen className='h-12 w-12 text-gray-300' />
                            </div>
                          )}
                        </div>
                        <div className='flex-1 space-y-3'>
                          <div className='flex items-center text-sm text-gray-600'>
                            <Calendar className='h-4 w-4 mr-2 text-purple-600' />
                            <span className='font-medium'>Año:</span>
                            <span className='ml-2'>
                              {ed.year ?? "No especificado"}
                            </span>
                          </div>
                          <div className='flex items-center text-sm text-gray-600'>
                            <CalendarRange className='h-4 w-4 mr-2 text-purple-600' />
                            <span className='font-medium'>Apertura:</span>
                            <span className='ml-2'>
                              {ed.openDate
                                ? new Date(ed.openDate).toLocaleDateString()
                                : "No especificada"}
                            </span>
                          </div>
                          <div className='flex items-center text-sm text-gray-600'>
                            <Clock className='h-4 w-4 mr-2 text-purple-600' />
                            <span className='font-medium'>Límite cap:</span>
                            <span className='ml-2'>
                              {ed.deadlineChapters
                                ? new Date(
                                    ed.deadlineChapters
                                  ).toLocaleDateString()
                                : "No especificada"}
                            </span>
                          </div>
                          <div className='flex items-center text-sm text-gray-600'>
                            <BookOpen className='h-4 w-4 mr-2 text-purple-600' />
                            <span className='font-medium'>Publicación:</span>
                            <span className='ml-2'>
                              {ed.publishDate
                                ? new Date(ed.publishDate).toLocaleDateString()
                                : "No especificada"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className='flex flex-wrap gap-2 pt-2'>
                      <Link href={`/dashboard/editions/${ed.id}`}>
                        <Button
                          variant='outline'
                          size='sm'
                          onMouseEnter={() => handleMouseEnter(`edit-${ed.id}`)}
                          onMouseLeave={() =>
                            handleMouseLeave(`edit-${ed.id}`)
                          }>
                          <motion.span
                            animate={{
                              x: hoverStates[`edit-${ed.id}`] ? 2 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                            className='flex items-center'>
                            <Edit className='mr-1 h-4 w-4' /> Ver/Editar
                          </motion.span>
                        </Button>
                      </Link>
                      <Link href={`/dashboard/editions/${ed.id}/books`}>
                        <Button
                          variant='outline'
                          size='sm'
                          onMouseEnter={() => handleMouseEnter(`view-${ed.id}`)}
                          onMouseLeave={() =>
                            handleMouseLeave(`view-${ed.id}`)
                          }>
                          <motion.span
                            animate={{
                              x: hoverStates[`view-${ed.id}`] ? 2 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                            className='flex items-center'>
                            <Eye className='mr-1 h-4 w-4' /> Ver Libros
                          </motion.span>
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className='overflow-hidden rounded-xl border border-white/50 backdrop-blur-sm bg-white/80 shadow-lg'>
            <table className='w-full'>
              <thead className='bg-purple-50 text-purple-900'>
                <tr>
                  <th className='px-4 py-3 text-left'>Título</th>
                  <th className='px-4 py-3 text-left'>Apertura</th>
                  <th className='px-4 py-3 text-left'>Límite cap.</th>
                  <th className='px-4 py-3 text-left'>Publicación</th>
                  <th className='px-4 py-3 text-center'>Acciones</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {filtered.map((ed) => {
                  const dateOpen = ed.openDate
                    ? new Date(ed.openDate).toLocaleDateString()
                    : "-";
                  const dateLimit = ed.deadlineChapters
                    ? new Date(ed.deadlineChapters).toLocaleDateString()
                    : "-";
                  const datePub = ed.publishDate
                    ? new Date(ed.publishDate).toLocaleDateString()
                    : "-";
                  return (
                    <tr
                      key={ed.id}
                      className='hover:bg-purple-50/50 transition-colors'>
                      <td className='px-4 py-4'>
                        <p className='font-medium text-gray-900'>{ed.title}</p>
                        {ed.subtitle && (
                          <p className='text-sm text-gray-500'>{ed.subtitle}</p>
                        )}
                      </td>
                      <td className='px-4 py-4 text-sm'>{dateOpen}</td>
                      <td className='px-4 py-4 text-sm'>{dateLimit}</td>
                      <td className='px-4 py-4 text-sm'>{datePub}</td>
                      <td className='px-4 py-4 text-center'>
                        <div className='flex justify-center gap-2'>
                          <Link href={`/dashboard/editions/${ed.id}`}>
                            <Button variant='outline' size='sm'>
                              <Edit className='mr-1 h-4 w-4' /> Editar
                            </Button>
                          </Link>
                          <Link href={`/dashboard/editions/${ed.id}/books`}>
                            <Button variant='outline' size='sm'>
                              <Eye className='mr-1 h-4 w-4' /> Libros
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
