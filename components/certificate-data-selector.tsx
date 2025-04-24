"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Book, BookOpen, Users } from "lucide-react";

interface CertificateDataSelectorProps {
  onSelect: (data: any) => void;
  onClose: () => void;
}

export function CertificateDataSelector({
  onSelect,
  onClose,
}: CertificateDataSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("books");

  // Mock data - in a real app, this would come from an API
  const books = [
    {
      id: "book1",
      title:
        "XXV Lecciones en Educación y Promoción de la Salud Comunitaria y Hospitalaria",
      isbn: "978-84-19937-71-1",
      publicationDate: "2024-10-11",
      totalPages: "1833",
    },
    {
      id: "book2",
      title: "XXV Lecciones en Salud Pública y Sociedad e Investigación",
      isbn: "978-84-19937-65-0",
      publicationDate: "2024-10-11",
      totalPages: "2246",
    },
    {
      id: "book3",
      title: "XXV Lecciones en Investigación Básica y Clínica",
      isbn: "978-84-19937-66-7",
      publicationDate: "2024-10-11",
      totalPages: "2117",
    },
  ];

  const chapters = [
    {
      id: "chapter1",
      bookId: "book1",
      title:
        "DESARROLLO Y APLICACIÓN DE SISTEMAS DE CONTROL DE ACCESO Y SEGURIDAD EN ÁREAS SENSIBLES POR EL AUXILIAR ADMINISTRATIVO DE CENTROS HOSPITALARIOS",
      chapterNumber: "311",
      pages: "1579-1585",
    },
    {
      id: "chapter2",
      bookId: "book1",
      title:
        "GESTIÓN DE LA CORRESPONDENCIA Y COMUNICACIÓN INSTITUCIONAL ENTRE EL HOSPITAL Y PROVEEDORES POR EL AUXILIAR ADMINISTRATIVO DE CENTROS HOSPITALARIOS",
      chapterNumber: "312",
      pages: "1587-1592",
    },
  ];

  const users = [
    {
      id: "user1",
      name: "ANA MARIA HERMOSA CHAPARRO",
      dni: "03878752D",
    },
    {
      id: "user2",
      name: "CARLOS MORENO SÁNCHEZ",
      dni: "47448155Y",
    },
    {
      id: "user3",
      name: "ALMUDENA ANDÚJAR LÓPEZ",
      dni: "70583438A",
    },
  ];

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm)
  );

  const filteredChapters = chapters.filter(
    (chapter) =>
      chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chapter.chapterNumber.includes(searchTerm)
  );

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.dni.includes(searchTerm)
  );

  const handleSelectBook = (book: any) => {
    onSelect({
      bookTitle: book.title,
      isbn: book.isbn,
      publicationDate: book.publicationDate,
      totalPages: book.totalPages,
      bookId: book.id,
    });
  };

  const handleSelectChapter = (chapter: any) => {
    const book = books.find((b) => b.id === chapter.bookId);
    onSelect({
      chapterTitle: chapter.title,
      chapterNumber: chapter.chapterNumber,
      pages: chapter.pages,
      bookTitle: book?.title || "",
      isbn: book?.isbn || "",
      publicationDate: book?.publicationDate || "",
      totalPages: book?.totalPages || "",
    });
  };

  const handleSelectUser = (user: any) => {
    onSelect({
      authors: [user.name],
      userId: user.id,
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Buscar datos</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='flex items-center space-x-2'>
            <Search className='h-4 w-4 text-slate-500' />
            <Input
              placeholder='Buscar por título, ISBN, nombre...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='flex-1'
            />
          </div>

          <Tabs
            defaultValue='books'
            value={activeTab}
            onValueChange={setActiveTab}>
            <TabsList className='grid grid-cols-3'>
              <TabsTrigger value='books' className='flex items-center gap-2'>
                <BookOpen className='h-4 w-4' />
                Libros
              </TabsTrigger>
              <TabsTrigger value='chapters' className='flex items-center gap-2'>
                <Book className='h-4 w-4' />
                Capítulos
              </TabsTrigger>
              <TabsTrigger value='users' className='flex items-center gap-2'>
                <Users className='h-4 w-4' />
                Usuarios
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value='books'
              className='max-h-[400px] overflow-y-auto'>
              {filteredBooks.length > 0 ? (
                <div className='space-y-3'>
                  {filteredBooks.map((book) => (
                    <Card
                      key={book.id}
                      className='p-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer'>
                      <div onClick={() => handleSelectBook(book)}>
                        <h3 className='font-medium'>{book.title}</h3>
                        <div className='text-sm text-slate-500 dark:text-slate-400 mt-1'>
                          <p>ISBN: {book.isbn}</p>
                          <p>
                            Fecha:{" "}
                            {new Date(
                              book.publicationDate
                            ).toLocaleDateString()}
                          </p>
                          <p>Páginas: {book.totalPages}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className='text-center py-4 text-slate-500'>
                  No se encontraron resultados
                </p>
              )}
            </TabsContent>

            <TabsContent
              value='chapters'
              className='max-h-[400px] overflow-y-auto'>
              {filteredChapters.length > 0 ? (
                <div className='space-y-3'>
                  {filteredChapters.map((chapter) => (
                    <Card
                      key={chapter.id}
                      className='p-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer'>
                      <div onClick={() => handleSelectChapter(chapter)}>
                        <h3 className='font-medium'>
                          Capítulo {chapter.chapterNumber}
                        </h3>
                        <p className='text-sm mt-1'>{chapter.title}</p>
                        <p className='text-sm text-slate-500 dark:text-slate-400 mt-1'>
                          Páginas: {chapter.pages}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className='text-center py-4 text-slate-500'>
                  No se encontraron resultados
                </p>
              )}
            </TabsContent>

            <TabsContent
              value='users'
              className='max-h-[400px] overflow-y-auto'>
              {filteredUsers.length > 0 ? (
                <div className='space-y-3'>
                  {filteredUsers.map((user) => (
                    <Card
                      key={user.id}
                      className='p-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer'>
                      <div onClick={() => handleSelectUser(user)}>
                        <h3 className='font-medium'>{user.name}</h3>
                        <p className='text-sm text-slate-500 dark:text-slate-400 mt-1'>
                          DNI: {user.dni}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className='text-center py-4 text-slate-500'>
                  No se encontraron resultados
                </p>
              )}
            </TabsContent>
          </Tabs>

          <div className='flex justify-end'>
            <DialogClose asChild>
              <Button variant='outline' onClick={onClose}>
                Cerrar
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
