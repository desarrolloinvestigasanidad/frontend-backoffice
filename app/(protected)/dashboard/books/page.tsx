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
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BackgroundBlobs } from "@/components/background-blobs";
import { Breadcrumb } from "@/components/breadcrumb";
import {
  BookOpen,
  Plus,
  Eye,
  Layers,
  AlertCircle,
  Tag,
  DollarSign,
  Search,
  BookPlus,
  FileEdit,
  LayoutGrid,
  List,
  Filter,
  BookText,
} from "lucide-react";

type Book = {
  id: string;
  title: string;
  category: string;
  price: number;
  cover?: string | null;
  bookType: string;
  editionId?: string;
  editionTitle?: string;
};

type Edition = {
  id: string;
  title: string;
};

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [editions, setEditions] = useState<Edition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [bookTypeFilter, setBookTypeFilter] = useState<
    "all" | "personal" | "edition"
  >("all");
  const [editionFilter, setEditionFilter] = useState<string>("all");
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});

  const handleMouseEnter = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: false }));
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/books`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Error al cargar libros");
        }
        const data = await res.json();
        // Ahora cargamos todos los libros, no solo los personalizados
        setBooks(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

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
          throw new Error("Error al cargar ediciones");
        }
        const data = await res.json();
        setEditions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al cargar ediciones:", err);
      }
    };

    fetchBooks();
    fetchEditions();
  }, []);

  // Filtrar libros por búsqueda, tipo y edición
  const filteredBooks = books.filter((book) => {
    // Filtro por término de búsqueda
    const matchesSearch = book.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Filtro por tipo de libro
    let matchesType = true;
    if (bookTypeFilter === "personal") {
      matchesType = book.bookType === "libro propio";
    } else if (bookTypeFilter === "edition") {
      matchesType = book.bookType !== "libro propio";
    }

    // Filtro por edición
    let matchesEdition = true;
    if (editionFilter !== "all") {
      matchesEdition = book.editionId === editionFilter;
    }

    return matchesSearch && matchesType && matchesEdition;
  });

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
          className='flex items-center justify-between gap-4'>
          {/* 1) Crear Libro Personalizado */}
          <Link href='/dashboard/books/new'>
            <Button
              onMouseEnter={() => handleMouseEnter("newPersonal")}
              onMouseLeave={() => handleMouseLeave("newPersonal")}
              className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'>
              <motion.span
                className='flex items-center'
                animate={{ x: hoverStates["newPersonal"] ? 3 : 0 }}
                transition={{ duration: 0.2 }}>
                <BookPlus className='mr-2 h-4 w-4' />
                Libro Personalizado
              </motion.span>
            </Button>
          </Link>

          {/* 2) Crear Libro de Edición */}
          <Link href='/dashboard/editions'>
            <Button
              onMouseEnter={() => handleMouseEnter("newEdition")}
              onMouseLeave={() => handleMouseLeave("newEdition")}
              className='bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'>
              <motion.span
                className='flex items-center'
                animate={{ x: hoverStates["newEdition"] ? 3 : 0 }}
                transition={{ duration: 0.2 }}>
                <Layers className='mr-2 h-4 w-4' />
                Libro de Edición
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
            Gestión de Libros
          </h2>
          <p className='text-gray-600 text-sm md:text-base'>
            Administra todos tus libros desde un solo lugar
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
              placeholder='Buscar libros...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 w-full'
            />
          </div>
          <div className='flex items-center gap-3'>
            <Badge variant='default' className='py-1.5'>
              {filteredBooks.length} libros encontrados
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
              Filtrar por tipo:
            </span>
            <select
              value={bookTypeFilter}
              onChange={(e) =>
                setBookTypeFilter(
                  e.target.value as "all" | "personal" | "edition"
                )
              }
              className='px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 text-sm'>
              <option value='all'>Todos los libros</option>
              <option value='personal'>Libros personalizados</option>
              <option value='edition'>Libros de edición</option>
            </select>
          </div>

          {bookTypeFilter === "edition" && (
            <div className='flex items-center gap-2'>
              <BookText className='h-4 w-4 text-purple-600' />
              <span className='text-sm font-medium text-gray-700'>
                Filtrar por edición:
              </span>
              <select
                value={editionFilter}
                onChange={(e) => setEditionFilter(e.target.value)}
                className='px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 text-sm'>
                <option value='all'>Todas las ediciones</option>
                {editions.map((edition) => (
                  <option key={edition.id} value={edition.id}>
                    {edition.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </motion.div>

        {filteredBooks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-lg border border-white/50 text-center'>
            <div className='flex flex-col items-center justify-center p-8'>
              <BookOpen className='w-16 h-16 text-purple-300 mb-4' />
              <h3 className='text-xl font-semibold text-gray-700 mb-2'>
                No se encontraron libros
              </h3>
              <p className='text-gray-500 mb-6'>
                {searchTerm
                  ? "No se encontraron libros que coincidan con tu búsqueda."
                  : bookTypeFilter === "personal"
                  ? "No hay libros personalizados registrados."
                  : bookTypeFilter === "edition"
                  ? editionFilter !== "all"
                    ? "No hay libros en esta edición."
                    : "No hay libros de edición registrados."
                  : "No hay libros registrados."}
              </p>
              <Link href='/dashboard/books/new'>
                <Button className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300'>
                  <Plus className='mr-2 h-4 w-4' />
                  Crear Libro Personalizado
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : viewMode === "grid" ? (
          // Vista de cuadrícula
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}>
                <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg overflow-hidden h-full hover:shadow-xl transition-shadow'>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-xl font-bold line-clamp-1'>
                      {book.title}
                    </CardTitle>
                    <div className='flex items-center gap-2'>
                      <Badge
                        variant='outline'
                        className='bg-purple-50 text-purple-700'>
                        <Tag className='h-3 w-3 mr-1' />
                        {book.category || "Sin categoría"}
                      </Badge>
                      {book.bookType !== "libro edición" && (
                        <Badge variant='default'>
                          <DollarSign className='h-3 w-3 mr-1' />
                          {isNaN(Number(book.price))
                            ? "-"
                            : Number(book.price).toFixed(2)}
                          €
                        </Badge>
                      )}
                      <Badge
                        variant={
                          book.bookType === "libro propio"
                            ? "default"
                            : "outline"
                        }>
                        {book.bookType === "libro propio"
                          ? "Personalizado"
                          : "Edición"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className='pt-2'>
                    <div className='flex items-center gap-4'>
                      <div className='relative w-24 h-32 rounded-md overflow-hidden bg-gray-100 flex-shrink-0'>
                        {book.cover ? (
                          <Image
                            src={book.cover || "/placeholder.svg"}
                            alt={`Portada de ${book.title}`}
                            fill
                            className='object-cover'
                          />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center'>
                            <BookOpen className='h-8 w-8 text-gray-300' />
                            <span className='sr-only'>Sin portada</span>
                          </div>
                        )}
                      </div>
                      <div className='flex-1 space-y-2'>
                        <div className='flex items-center text-sm text-gray-600'>
                          <Layers className='h-4 w-4 mr-2 text-purple-600' />
                          <span className='font-medium'>Tipo:</span>
                          <span className='ml-2'>
                            {book.bookType || "Libro propio"}
                          </span>
                        </div>
                        {book.editionTitle && (
                          <div className='flex items-center text-sm text-gray-600'>
                            <BookText className='h-4 w-4 mr-2 text-purple-600' />
                            <span className='font-medium'>Edición:</span>
                            <span className='ml-2'>{book.editionTitle}</span>
                          </div>
                        )}
                        {book.bookType !== "libro edición" && (
                          <div className='flex items-center text-sm text-gray-600'>
                            <DollarSign className='h-4 w-4 mr-2 text-purple-600' />
                            <span className='font-medium'>Precio:</span>
                            <span className='ml-2'>
                              {isNaN(Number(book.price))
                                ? "-"
                                : Number(book.price).toFixed(2)}
                              €
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className='flex justify-between pt-2'>
                    <Link href={`/dashboard/books/${book.id}`}>
                      <Button
                        variant='outline'
                        size='sm'
                        className='border-purple-200 text-purple-700 hover:bg-purple-50'
                        onMouseEnter={() => handleMouseEnter(`edit-${book.id}`)}
                        onMouseLeave={() =>
                          handleMouseLeave(`edit-${book.id}`)
                        }>
                        <motion.span
                          className='flex items-center'
                          animate={{
                            x: hoverStates[`edit-${book.id}`] ? 2 : 0,
                          }}
                          transition={{ duration: 0.2 }}>
                          <FileEdit className='mr-1 h-4 w-4' /> Ver / Editar
                        </motion.span>
                      </Button>
                    </Link>
                    <Link href={`/dashboard/books/${book.id}/chapters`}>
                      <Button
                        variant='outline'
                        size='sm'
                        className='border-blue-200 text-blue-700 hover:bg-blue-50'
                        onMouseEnter={() => handleMouseEnter(`view-${book.id}`)}
                        onMouseLeave={() =>
                          handleMouseLeave(`view-${book.id}`)
                        }>
                        <motion.span
                          className='flex items-center'
                          animate={{
                            x: hoverStates[`view-${book.id}`] ? 2 : 0,
                          }}
                          transition={{ duration: 0.2 }}>
                          <Eye className='mr-1 h-4 w-4' /> Ver Capítulos
                        </motion.span>
                      </Button>
                    </Link>
                  </CardFooter>
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
                    <th className='px-4 py-3 text-left'>Libro</th>
                    <th className='px-4 py-3 text-left'>Tipo</th>
                    <th className='px-4 py-3 text-left'>Edición</th>
                    <th className='px-4 py-3 text-left'>Precio</th>
                    <th className='px-4 py-3 text-center'>Acciones</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                  {filteredBooks.map((book) => (
                    <tr
                      key={book.id}
                      className='hover:bg-purple-50/50 transition-colors'>
                      <td className='px-4 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className='relative w-12 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0'>
                            {book.cover ? (
                              <Image
                                src={book.cover || "/placeholder.svg"}
                                alt={`Portada de ${book.title}`}
                                fill
                                className='object-cover'
                              />
                            ) : (
                              <div className='w-full h-full flex items-center justify-center'>
                                <BookOpen className='h-6 w-6 text-gray-300' />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className='font-medium text-gray-900'>
                              {book.title}
                            </p>
                            <Badge
                              variant='outline'
                              className='bg-purple-50 text-purple-700 mt-1'>
                              {book.category || "Sin categoría"}
                            </Badge>
                          </div>
                        </div>
                      </td>
                      <td className='px-4 py-4'>
                        <Badge
                          variant={
                            book.bookType === "libro propio"
                              ? "default"
                              : "outline"
                          }>
                          {book.bookType === "libro propio"
                            ? "Personalizado"
                            : "Edición"}
                        </Badge>
                      </td>
                      <td className='px-4 py-4'>
                        {book.editionTitle ? (
                          <span className='text-sm'>{book.editionTitle}</span>
                        ) : (
                          <span className='text-sm text-gray-500'>-</span>
                        )}
                      </td>
                      <td className='px-4 py-4'>
                        <Badge variant='default'>
                          {isNaN(Number(book.price))
                            ? "-"
                            : Number(book.price).toFixed(2)}
                          €
                        </Badge>
                      </td>
                      <td className='px-4 py-4 text-center'>
                        <div className='flex justify-center gap-2'>
                          <Link href={`/dashboard/books/${book.id}`}>
                            <Button
                              variant='outline'
                              size='sm'
                              className='border-purple-200 text-purple-700 hover:bg-purple-50'>
                              <FileEdit className='mr-1 h-4 w-4' /> Editar
                            </Button>
                          </Link>
                          <Link href={`/dashboard/books/${book.id}/chapters`}>
                            <Button
                              variant='outline'
                              size='sm'
                              className='border-blue-200 text-blue-700 hover:bg-blue-50'>
                              <Eye className='mr-1 h-4 w-4' /> Capítulos
                            </Button>
                          </Link>
                        </div>
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
