"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const books = [
  {
    id: 1,
    title: "Avances en Medicina 2025",
    edition: "Febrero 2025",
    authors: "Varios",
    status: "Publicado",
    isbn: "978-3-16-148410-0",
    type: "Edición",
    chapters: 15,
    pages: 320,
    publicationDate: "2025-02-28",
  },
  {
    id: 2,
    title: "Investigación en Enfermería",
    edition: "Marzo 2025",
    authors: "María García, Juan Pérez",
    status: "En revisión",
    isbn: "978-3-16-148411-7",
    type: "Propio",
    chapters: 8,
    pages: 180,
    publicationDate: null,
  },
  // Add more mock data as needed
];

export default function LibrosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState<(typeof books)[0] | null>(
    null
  );
  const [filterEdition, setFilterEdition] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const filteredBooks = books.filter(
    (book) =>
      (book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.authors.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterEdition === "all" || book.edition === filterEdition) &&
      (filterType === "all" || book.type === filterType)
  );

  return (
    <div className='space-y-4'>
      <h1 className='text-3xl font-bold'>Libros</h1>
      <div className='flex justify-between items-center'>
        <div className='flex space-x-2'>
          <Input
            placeholder='Buscar libros...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='max-w-sm'
          />
          <Select value={filterEdition} onValueChange={setFilterEdition}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Filtrar por edición' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Todas las ediciones</SelectItem>
              <SelectItem value='Febrero 2025'>Febrero 2025</SelectItem>
              <SelectItem value='Marzo 2025'>Marzo 2025</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Filtrar por tipo' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Todos los tipos</SelectItem>
              <SelectItem value='Edición'>Libro de Edición</SelectItem>
              <SelectItem value='Propio'>Libro Propio</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button>Crear Nuevo Libro</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Edición</TableHead>
            <TableHead>Autores</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBooks.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.edition}</TableCell>
              <TableCell>{book.authors}</TableCell>
              <TableCell>
                <Badge
                  className={
                    book.status === "Publicado"
                      ? "bg-green-500 text-white"
                      : "bg-yellow-500 text-white"
                  }>
                  {book.status}
                </Badge>
              </TableCell>
              <TableCell>{book.type}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className='mr-2'
                      onClick={() => setSelectedBook(book)}>
                      Ver
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='max-w-4xl'>
                    <DialogHeader>
                      <DialogTitle>Detalles del Libro</DialogTitle>
                      <DialogDescription>
                        Información detallada del libro
                      </DialogDescription>
                    </DialogHeader>
                    {selectedBook && (
                      <Tabs defaultValue='info'>
                        <TabsList>
                          <TabsTrigger value='info'>Información</TabsTrigger>
                          <TabsTrigger value='chapters'>Capítulos</TabsTrigger>
                          <TabsTrigger value='authors'>Autores</TabsTrigger>
                        </TabsList>
                        <TabsContent value='info'>
                          <Card>
                            <CardHeader>
                              <CardTitle>Información General</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className='grid grid-cols-2 gap-4'>
                                <div>
                                  <p>
                                    <strong>Título:</strong>{" "}
                                    {selectedBook.title}
                                  </p>
                                  <p>
                                    <strong>Edición:</strong>{" "}
                                    {selectedBook.edition}
                                  </p>
                                  <p>
                                    <strong>ISBN:</strong> {selectedBook.isbn}
                                  </p>
                                  <p>
                                    <strong>Tipo:</strong> {selectedBook.type}
                                  </p>
                                </div>
                                <div>
                                  <p>
                                    <strong>Estado:</strong>{" "}
                                    {selectedBook.status}
                                  </p>
                                  <p>
                                    <strong>Capítulos:</strong>{" "}
                                    {selectedBook.chapters}
                                  </p>
                                  <p>
                                    <strong>Páginas:</strong>{" "}
                                    {selectedBook.pages}
                                  </p>
                                  <p>
                                    <strong>Fecha de Publicación:</strong>{" "}
                                    {selectedBook.publicationDate ||
                                      "No publicado"}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                        <TabsContent value='chapters'>
                          <Card>
                            <CardHeader>
                              <CardTitle>Capítulos del Libro</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {/* Aquí iría una tabla o lista de capítulos */}
                              <p>Lista de capítulos del libro</p>
                            </CardContent>
                          </Card>
                        </TabsContent>
                        <TabsContent value='authors'>
                          <Card>
                            <CardHeader>
                              <CardTitle>Autores</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {/* Aquí iría una lista de autores */}
                              <p>Lista de autores del libro</p>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    )}
                    <div className='flex justify-between mt-4'>
                      <Button>Editar</Button>
                      <Button>Generar PDF</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button>Editar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
