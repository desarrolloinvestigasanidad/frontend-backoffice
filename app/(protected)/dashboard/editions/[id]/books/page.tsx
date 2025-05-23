"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Edit,
  BookPlus,
  AlertCircle,
  Tag,
  Layers,
  Search,
} from "lucide-react";

type Book = {
  id: string;
  title: string;
  category: string;
  price: number;
  cover?: string | null;
  bookType?: string; // Added bookType property
};

export default function BooksListPage() {
  const router = useRouter();
  const params = useParams();
  const { id: editionId } = params; // ID de la edición
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editionTitle, setEditionTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
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
        if (!res.ok) {
          throw new Error("Error al cargar detalles de la edición");
        }
        const data = await res.json();
        setEditionTitle(data.title || "Edición");
      } catch (err) {
        console.error("Error al cargar detalles de la edición:", err);
      }
    };

    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Error al cargar libros");
        }
        const data = await res.json();
        setBooks(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (editionId) {
      fetchEditionDetails();
      fetchBooks();
    }
  }, [editionId]);

  // Filtrar libros por búsqueda
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Breadcrumb
            items={[
              {
                label: "Volver a la Edición",
                href: `/dashboard/editions/${editionId}`,
              },
              {
                label: "Libros de la Edición",
                href: `/dashboard/editions/${editionId}/books`,
              },
            ]}
          />
          <Link href={`/dashboard/editions/${editionId}/books/new`}>
            <Button
              className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'
              onMouseEnter={() => handleMouseEnter("newBook")}
              onMouseLeave={() => handleMouseLeave("newBook")}>
              <motion.span
                className='flex items-center'
                animate={{ x: hoverStates["newBook"] ? 3 : 0 }}
                transition={{ duration: 0.2 }}>
                <BookPlus className='mr-2 h-4 w-4' />
                Añadir Nuevo Libro
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
            Libros de {editionTitle}
          </h2>
          <p className='text-gray-600 text-sm md:text-base'>
            Gestiona todos los libros asociados a esta edición
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
          <Badge variant='default' className='py-1.5'>
            {filteredBooks.length} libros encontrados
          </Badge>
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
                No hay libros registrados
              </h3>
              <p className='text-gray-500 mb-6'>
                {searchTerm
                  ? "No se encontraron libros que coincidan con tu búsqueda."
                  : "Comienza añadiendo tu primer libro a esta edición."}
              </p>
              <Link href={`/dashboard/editions/${editionId}/books/new`}>
                <Button className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300'>
                  <Plus className='mr-2 h-4 w-4' />
                  Añadir Libro
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}>
                <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg overflow-hidden h-full'>
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
                          {isNaN(Number(book.price))
                            ? "-"
                            : Number(book.price).toFixed(2)}
                          €
                        </Badge>
                      )}
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
                          <span className='font-medium'>Capítulos:</span>
                          <span className='ml-2'>-</span>
                        </div>
                        <div className='flex items-center text-sm text-gray-600'>
                          <span className='font-medium'>Precio:</span>
                          <span className='ml-2'>
                            {isNaN(Number(book.price))
                              ? "-"
                              : Number(book.price).toFixed(2)}
                            €
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className='flex justify-between pt-2'>
                    <Link
                      href={`/dashboard/editions/${editionId}/books/${book.id}`}>
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
                          <Edit className='mr-1 h-4 w-4' /> Editar
                        </motion.span>
                      </Button>
                    </Link>
                    <Link
                      href={`/dashboard/editions/${editionId}/books/${book.id}/chapters`}>
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
        )}
      </div>
    </div>
  );
}
