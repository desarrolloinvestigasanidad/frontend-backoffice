"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
import { Breadcrumb } from "@/components/breadcrumb";
import {
  ChevronLeft,
  Plus,
  FileText,
  AlertCircle,
  BookText,
  Search,
  Layers,
  FileEdit,
  Filter,
} from "lucide-react";

type Chapter = {
  id: string;
  title: string;
  studyType: string;
  status: string;
};

export default function ChaptersListPage() {
  const router = useRouter();
  const params = useParams();
  const { id: editionId, bookId } = params;
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [editionTitle, setEditionTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
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
        if (!res.ok) throw new Error("Error al cargar detalles de la edición");
        const data = await res.json();
        setEditionTitle(data.title || "Edición");
      } catch (err) {
        console.error(err);
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
        if (!res.ok) throw new Error("Error al cargar detalles del libro");
        const data = await res.json();
        setBookTitle(data.title || "Libro");
      } catch (err) {
        console.error(err);
      }
    };

    const fetchChapters = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}/chapters`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Error al cargar capítulos");
        }
        const data = await res.json();
        setChapters(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (editionId && bookId) {
      fetchEditionDetails();
      fetchBookDetails();
      fetchChapters();
    }
  }, [editionId, bookId]);

  // Filtrado por búsqueda y estado
  const filteredChapters = chapters
    .filter((chapter) =>
      chapter.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((chapter) =>
      statusFilter === "all"
        ? true
        : chapter.status.toLowerCase() === statusFilter
    );

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "pendiente":
        return "outline";
      case "aprobado":
        return "secondary";
      case "rechazado":
        return "destructive";
      default:
        return "default";
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
          <Breadcrumb
            items={[
              {
                label: "Volver al Libro",
                href: `/dashboard/editions/${editionId}/books/${bookId}`,
              },
              { label: "Capítulos", href: "" },
            ]}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            Capítulos del Libro
          </h2>
          {bookTitle && (
            <p className='text-gray-600 text-sm md:text-base mb-2'>
              <span className='font-medium'>{bookTitle}</span> - Edición:{" "}
              <span className='font-medium'>{editionTitle}</span>
            </p>
          )}
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto'></div>
        </motion.div>

        {error && (
          <Alert className='bg-red-50 border-red-200 text-red-800 mb-6'>
            <AlertCircle className='h-4 w-4 text-red-600' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Controles: búsqueda + filtro de estado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='flex flex-col md:flex-row justify-between items-center gap-4 mb-6'>
          <div className='relative w-full md:w-auto flex-1 max-w-md'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4' />
            <input
              type='text'
              placeholder='Buscar capítulos...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 w-full'
            />
          </div>

          <div className='flex items-center gap-2'>
            <Filter className='h-4 w-4 text-purple-600' />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 text-sm'>
              <option value='all'>Todos los estados</option>
              <option value='pendiente'>Pendiente</option>
              <option value='aprobado'>Aprobado</option>
              <option value='rechazado'>Rechazado</option>
            </select>
          </div>

          <Badge variant='default' className='py-1.5'>
            {filteredChapters.length} capítulos encontrados
          </Badge>
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
                No hay capítulos registrados
              </h3>
              <p className='text-gray-500 mb-6'>
                {searchTerm
                  ? "No se encontraron capítulos que coincidan con tu búsqueda."
                  : "Comienza añadiendo tu primer capítulo a este libro."}
              </p>
              <Link
                href={`/dashboard/editions/${editionId}/books/${bookId}/chapters/new`}>
                <Button className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300'>
                  <Plus className='mr-2 h-4 w-4' />
                  Crear Capítulo
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {filteredChapters.map((chapter, index) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}>
                <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg overflow-hidden h-full hover:shadow-xl transition-shadow'>
                  <CardHeader className='pb-2'>
                    <div className='flex justify-between items-start'>
                      <CardTitle className='text-xl font-bold line-clamp-1'>
                        {chapter.title}
                      </CardTitle>
                      <Badge variant={getStatusBadgeVariant(chapter.status)}>
                        {chapter.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      <div className='flex items-center gap-2 mt-1'>
                        <Badge
                          variant='outline'
                          className='bg-purple-50 text-purple-700'>
                          <BookText className='h-3 w-3 mr-1' />
                          {chapter.studyType || "Sin tipo de estudio"}
                        </Badge>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='pt-2'>
                    <div className='flex items-center gap-4'>
                      <div className='flex-1 space-y-2'>
                        <div className='flex items-center text-sm text-gray-600'>
                          <Layers className='h-4 w-4 mr-2 text-purple-600' />
                          <span className='font-medium'>Tipo de Estudio:</span>
                          <span className='ml-2'>
                            {chapter.studyType || "No especificado"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className='flex justify-end pt-2'>
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
                          <FileEdit className='mr-1 h-4 w-4' /> Revisar / Editar
                        </motion.span>
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
