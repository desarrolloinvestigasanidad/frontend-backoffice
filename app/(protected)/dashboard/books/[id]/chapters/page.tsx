"use client";

// BookChaptersPage.tsx – página de capítulos con botón «Generar libro»

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BackgroundBlobs } from "@/components/background-blobs";
import { Breadcrumb } from "@/components/breadcrumb";
import { BookCoverModal } from "@/components/book-cover-modal";

import {
  BookOpen,
  Plus,
  FileText,
  AlertCircle,
  Search,
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  BookText,
  FileEdit,
  Filter,
  LayoutGrid,
  List,
  SortAsc,
  SortDesc,
  Calendar,
  User,
  Clock,
  Book,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/*  Types                                                                 */
/* ---------------------------------------------------------------------- */

type Chapter = {
  id: string;
  title: string;
  studyType: string;
  methodology: string;
  status: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
};

type BookT = {
  id: string;
  title: string;
  subtitle?: string;
  bookType: string;
  cover?: string;
  price: number;
  status: string;
};

/* ---------------------------------------------------------------------- */
/*  Page component                                                         */
/* ---------------------------------------------------------------------- */

export default function BookChaptersPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;

  const [book, setBook] = useState<BookT | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});
  const [generating, setGenerating] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [selectedCover, setSelectedCover] = useState<string>("");

  /* -------------------------------------------------------------------- */
  /*  Hover helpers                                                       */
  /* -------------------------------------------------------------------- */
  const handleMouseEnter = (id: string) =>
    setHoverStates((prev) => ({ ...prev, [id]: true }));
  const handleMouseLeave = (id: string) =>
    setHoverStates((prev) => ({ ...prev, [id]: false }));

  /* -------------------------------------------------------------------- */
  /*  Data fetchers                                                       */
  /* -------------------------------------------------------------------- */
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/books/${bookId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Error al cargar detalles del libro");
        setBook(await res.json());
      } catch (err: any) {
        setError(err.message);
      }
    };

    const fetchChapters = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/books/${bookId}/chapters`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Error al cargar capítulos");
        const data = await res.json();
        setChapters(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
    fetchChapters();
  }, [bookId]);

  /* -------------------------------------------------------------------- */
  /*  Generate book handler                                               */
  /* -------------------------------------------------------------------- */
  const handleGenerateBook = async () => {
    // Mostrar modal de selección de portada en lugar de generar directamente
    setShowCoverModal(true);
  };

  // Nueva función para continuar con la generación después de seleccionar portada
  const handleContinueGeneration = async (coverUrl: string) => {
    setShowCoverModal(false);
    setSelectedCover(coverUrl);
    setGenerating(true);

    try {
      const token = localStorage.getItem("token");

      // Incluir la URL de la portada en la petición
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/books/${bookId}/generate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ coverUrl }),
        }
      );

      if (!res.ok) throw new Error("No se pudo generar el libro");
      const { url } = await res.json();
      const fullUrl = url.startsWith("http")
        ? url
        : `${process.env.NEXT_PUBLIC_BACKOFFICE_URL!}${url}`;
      window.open(fullUrl, "_blank");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setGenerating(false);
    }
  };

  /* -------------------------------------------------------------------- */
  /*  Helpers                                                             */
  /* -------------------------------------------------------------------- */
  const filteredChapters = chapters
    .filter((c) => {
      const matchesSearch = c.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );

  const getStatusBadgeVariant = (
    status: string
  ): "outline" | "default" | "secondary" | "destructive" => {
    const map = {
      pendiente: "default",
      aprobado: "secondary",
      rechazado: "destructive",
    } as const;
    return map[status as keyof typeof map] ?? "default";
  };

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(iso));
  const allApproved =
    chapters.length > 0 &&
    chapters.every((c) => c.status.toLowerCase() === "aprobado");
  /* -------------------------------------------------------------------- */
  /*  Loading state                                                       */
  /* -------------------------------------------------------------------- */
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
  // Determina si todos los capítulos están aprobados

  /* -------------------------------------------------------------------- */
  /*  Render                                                              */
  /* -------------------------------------------------------------------- */
  return (
    <div className='relative overflow-hidden min-h-screen py-8'>
      <BackgroundBlobs />

      <div className='container mx-auto px-4 relative z-10 space-y-8'>
        {/* ---------------------------------------------------------------- *
         * Header + actions                                                 *
         * ---------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
          <div>
            <Button
              variant='ghost'
              size='sm'
              className='mb-2'
              onClick={() => router.back()}>
              <ArrowLeft className='mr-2 h-4 w-4' /> Volver
            </Button>

            <Breadcrumb
              items={[
                { href: "/dashboard", label: "Dashboard" },
                { href: "/dashboard/books", label: "Libros" },
                {
                  href: `/dashboard/books/${bookId}`,
                  label: book?.title ?? "Detalles del libro",
                },
                { href: "#", label: "Capítulos" },
              ]}
            />
          </div>

          <div className='flex flex-wrap gap-3'>
            {/* Crear capítulo */}
            <Link href={`/dashboard/books/${bookId}/chapters/new`}>
              <Button
                className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'
                onMouseEnter={() => handleMouseEnter("newChapter")}
                onMouseLeave={() => handleMouseLeave("newChapter")}>
                <motion.span
                  className='flex items-center'
                  animate={{ x: hoverStates["newChapter"] ? 3 : 0 }}
                  transition={{ duration: 0.2 }}>
                  <Plus className='mr-2 h-4 w-4' /> Crear Capítulo
                </motion.span>
              </Button>
            </Link>

            {/* Generar libro */}
            <div className='relative'>
              <Button
                disabled={generating || !allApproved}
                className='bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900'
                onMouseEnter={() => handleMouseEnter("generateBook")}
                onMouseLeave={() => handleMouseLeave("generateBook")}
                onClick={handleGenerateBook}>
                <motion.span
                  className='flex items-center'
                  animate={{ x: hoverStates["generateBook"] ? 3 : 0 }}
                  transition={{ duration: 0.2 }}>
                  <Book className='mr-2 h-4 w-4' />{" "}
                  {generating ? "Generando…" : "Generar Libro"}
                </motion.span>
              </Button>
              {!allApproved && (
                <p className='text-xs text-red-500 mb-1'>
                  Debes aprobar todos los capítulos <br />
                  antes de generar el libro.
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* ---------------------------------------------------------------- *
         * Book info                                                        *
         * ---------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            Capítulos de {book?.title ?? "Libro"}
          </h2>

          {book?.subtitle && (
            <p className='text-gray-600 text-sm md:text-base mb-2'>
              {book.subtitle}
            </p>
          )}

          <div className='flex items-center justify-center gap-3 mb-4'>
            <Badge
              variant={
                book?.bookType === "libro propio" ? "default" : "outline"
              }>
              {book?.bookType === "libro propio"
                ? "Libro Personalizado"
                : "Libro de Edición"}
            </Badge>
            <Badge
              variant={book?.status === "publicado" ? "secondary" : "default"}>
              {book?.status ?? "En desarrollo"}
            </Badge>
          </div>

          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto' />
        </motion.div>

        {/* ---------------------------------------------------------------- *
         * Errores                                                          *
         * ---------------------------------------------------------------- */}
        {error && (
          <Alert className='bg-red-50 border-red-200 text-red-800 mb-6'>
            <AlertCircle className='h-4 w-4 text-red-600' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* ---------------------------------------------------------------- *
         * Search + view toggles                                            *
         * ---------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='flex flex-col md:flex-row justify-between items-center gap-4 mb-6'>
          <div className='relative w-full md:w-auto flex-1 max-w-md'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4' />
            <input
              type='text'
              placeholder='Buscar capítulos…'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 w-full'
            />
          </div>

          <div className='flex items-center gap-3'>
            <Badge variant='default' className='py-1.5'>
              {filteredChapters.length} capítulos encontrados
            </Badge>

            {/* Vista grid/list */}
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

        {/* ---------------------------------------------------------------- *
         * Filtros                                                          *
         * ---------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='flex flex-col md:flex-row gap-4 mb-6'>
          {/* Filtro de estado */}
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
              <option value='pendiente'>Pendiente</option>

              <option value='aprobado'>Aprobado</option>
              <option value='rechazado'>Rechazado</option>
            </select>
          </div>

          {/* Orden A–Z / Z–A */}
          <div className='flex items-center gap-2'>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className='flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm'>
              {sortOrder === "asc" ? (
                <>
                  <SortAsc className='h-4 w-4 text-purple-600' />
                  <span>A-Z</span>
                </>
              ) : (
                <>
                  <SortDesc className='h-4 w-4 text-purple-600' />
                  <span>Z-A</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* ---------------------------------------------------------------- *
         * Contenido principal                                              *
         * ---------------------------------------------------------------- */}
        {filteredChapters.length === 0 ? (
          /* ----------------------------- 0 chapters --------------------- */
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
                  : statusFilter !== "all"
                  ? `No hay capítulos con estado "${statusFilter}".`
                  : "Este libro aún no tiene capítulos."}
              </p>

              <Link href={`/dashboard/books/${bookId}/chapters/new`}>
                <Button className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300'>
                  <Plus className='mr-2 h-4 w-4' /> Crear Primer Capítulo
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : viewMode === "grid" ? (
          /* ---------------------------- GRID view ----------------------- */
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredChapters.map((chapter, idx) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + idx * 0.05 }}>
                <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg overflow-hidden h-full hover:shadow-xl transition-shadow'>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-xl font-bold line-clamp-1'>
                      {chapter.title}
                    </CardTitle>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <Badge variant={getStatusBadgeVariant(chapter.status)}>
                        {chapter.status ?? "Borrador"}
                      </Badge>
                      <Badge
                        variant='outline'
                        className='bg-purple-50 text-purple-700'>
                        {chapter.studyType ?? "Estudio"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className='pt-2'>
                    <div className='space-y-3'>
                      <div className='flex items-center text-sm text-gray-600'>
                        <BookText className='h-4 w-4 mr-2 text-purple-600' />
                        <span className='font-medium'>Metodología:</span>
                        <span className='ml-2 line-clamp-1'>
                          {chapter.methodology ?? "No especificada"}
                        </span>
                      </div>
                      <div className='flex items-center text-sm text-gray-600'>
                        <Calendar className='h-4 w-4 mr-2 text-purple-600' />
                        <span className='font-medium'>Creado:</span>
                        <span className='ml-2'>
                          {formatDate(chapter.createdAt)}
                        </span>
                      </div>
                      <div className='flex items-center text-sm text-gray-600'>
                        <Clock className='h-4 w-4 mr-2 text-purple-600' />
                        <span className='font-medium'>Actualizado:</span>
                        <span className='ml-2'>
                          {formatDate(chapter.updatedAt)}
                        </span>
                      </div>
                      <div className='flex items-center text-sm text-gray-600'>
                        <User className='h-4 w-4 mr-2 text-purple-600' />
                        <span className='font-medium'>ID Autor:</span>
                        <span className='ml-2 line-clamp-1'>
                          {chapter.authorId ?? "No asignado"}
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className='flex justify-between pt-2'>
                    <Link
                      href={`/dashboard/books/${bookId}/chapters/${chapter.id}`}>
                      <Button
                        variant='outline'
                        size='sm'
                        className='border-purple-200 text-purple-700 hover:bg-purple-50'
                        onMouseEnter={() =>
                          handleMouseEnter(`view-${chapter.id}`)
                        }
                        onMouseLeave={() =>
                          handleMouseLeave(`view-${chapter.id}`)
                        }>
                        <motion.span
                          className='flex items-center'
                          animate={{
                            x: hoverStates[`view-${chapter.id}`] ? 2 : 0,
                          }}
                          transition={{ duration: 0.2 }}>
                          <Eye className='mr-1 h-4 w-4' /> Ver Detalles
                        </motion.span>
                      </Button>
                    </Link>

                    <Link
                      href={`/dashboard/books/${bookId}/chapters/${chapter.id}/edit`}>
                      <Button
                        variant='outline'
                        size='sm'
                        className='border-blue-200 text-blue-700 hover:bg-blue-50'
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
                          <FileEdit className='mr-1 h-4 w-4' /> Editar
                        </motion.span>
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          /* ----------------------------- LIST view ---------------------- */
          <div className='overflow-hidden rounded-xl border border-white/50 backdrop-blur-sm bg-white/80 shadow-lg'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-purple-50 text-purple-900'>
                  <tr>
                    <th className='px-4 py-3 text-left'>Título</th>
                    <th className='px-4 py-3 text-left'>Tipo de Estudio</th>
                    <th className='px-4 py-3 text-left'>Estado</th>
                    <th className='px-4 py-3 text-left'>Actualizado</th>
                    <th className='px-4 py-3 text-center'>Acciones</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                  {filteredChapters.map((chapter) => (
                    <tr
                      key={chapter.id}
                      className='hover:bg-purple-50/50 transition-colors'>
                      <td className='px-4 py-4'>
                        <p className='font-medium text-gray-900'>
                          {chapter.title}
                        </p>
                        <p className='text-xs text-gray-500'>
                          ID: {chapter.id}
                        </p>
                      </td>
                      <td className='px-4 py-4'>
                        <Badge
                          variant='outline'
                          className='bg-purple-50 text-purple-700'>
                          {chapter.studyType ?? "No especificado"}
                        </Badge>
                      </td>
                      <td className='px-4 py-4'>
                        <Badge variant={getStatusBadgeVariant(chapter.status)}>
                          {chapter.status ?? "Borrador"}
                        </Badge>
                      </td>
                      <td className='px-4 py-4'>
                        <p className='text-sm'>
                          {formatDate(chapter.updatedAt)}
                        </p>
                      </td>
                      <td className='px-4 py-4 text-center'>
                        <div className='flex justify-center gap-2'>
                          <Link
                            href={`/dashboard/books/${bookId}/chapters/${chapter.id}`}>
                            <Button
                              variant='outline'
                              size='sm'
                              className='border-purple-200 text-purple-700 hover:bg-purple-50'>
                              <Eye className='mr-1 h-4 w-4' /> Ver
                            </Button>
                          </Link>
                          <Link
                            href={`/dashboard/books/${bookId}/chapters/${chapter.id}/edit`}>
                            <Button
                              variant='outline'
                              size='sm'
                              className='border-blue-200 text-blue-700 hover:bg-blue-50'>
                              <Edit className='mr-1 h-4 w-4' /> Editar
                            </Button>
                          </Link>
                          <Button
                            variant='outline'
                            size='sm'
                            className='border-red-200 text-red-700 hover:bg-red-50'
                            onClick={() =>
                              alert(`Eliminar capítulo: ${chapter.id}`)
                            }>
                            <Trash2 className='mr-1 h-4 w-4' /> Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Modal de selección de portada */}
        <BookCoverModal
          isOpen={showCoverModal}
          onClose={() => setShowCoverModal(false)}
          onConfirm={handleContinueGeneration}
          bookTitle={book?.title}
          currentCover={book?.cover}
        />
      </div>
    </div>
  );
}
