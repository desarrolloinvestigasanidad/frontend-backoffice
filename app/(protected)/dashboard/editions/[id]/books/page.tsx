"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type Book = {
  id: string;
  title: string;
  category: string;
  price: number;
  cover?: string | null;
};

export default function BooksListPage() {
  const router = useRouter();
  const params = useParams();
  const { id: editionId } = params; // ID de la edición
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books`,
          { headers: { Authorization: `Bearer ${token}` } }
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

    if (editionId) fetchBooks();
  }, [editionId]);

  if (loading) return <div>Cargando libros...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className='max-w-4xl mx-auto p-6 space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Libros de la Edición</h1>
        <Link href={`/dashboard/editions/${editionId}/books/new`}>
          <Button>Subir Nuevo Libro</Button>
        </Link>
      </div>
      {books.length === 0 ? (
        <p>No hay libros registrados para esta edición.</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {books.map((book) => (
            <div
              key={book.id}
              className='border rounded-md p-4 shadow hover:shadow-lg transition'>
              <div className='flex items-center gap-4'>
                {book.cover ? (
                  <div className='relative w-24 h-32 rounded-md overflow-hidden'>
                    <Image
                      src={book.cover}
                      alt='Portada del libro'
                      fill
                      className='object-cover'
                    />
                  </div>
                ) : (
                  <div className='w-24 h-32 bg-gray-200 flex items-center justify-center rounded-md'>
                    <p className='text-xs text-gray-500'>Sin Portada</p>
                  </div>
                )}
                <div className='flex-1'>
                  <h2 className='font-bold text-lg'>{book.title}</h2>
                  <p className='text-sm text-gray-600'>{book.category}</p>
                  <p className='text-sm text-gray-800 mt-1'>
                    <strong>Precio:</strong>
                    {isNaN(Number(book.price))
                      ? "-"
                      : Number(book.price).toFixed(2)}
                    €
                  </p>
                </div>
              </div>
              <div className='mt-4'>
                <Link
                  href={`/dashboard/editions/${editionId}/books/${book.id}`}>
                  <Button variant='outline' size='sm'>
                    Ver / Editar
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
