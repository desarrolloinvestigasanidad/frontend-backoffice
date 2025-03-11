"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";

const chapters = [
  {
    id: 1,
    title: "Nuevos tratamientos en oncología",
    book: "Avances en Medicina 2025",
    author: "Dr. Juan Pérez",
    status: "En revisión",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    submissionDate: "2024-12-15",
    reviewDate: null,
  },
  {
    id: 2,
    title: "Cuidados paliativos avanzados",
    book: "Investigación en Enfermería",
    author: "Dra. María García",
    status: "Aprobado",
    content:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
    submissionDate: "2024-11-30",
    reviewDate: "2024-12-20",
  },
  // Add more mock data as needed
];

export default function CapitulosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChapter, setSelectedChapter] = useState<
    (typeof chapters)[0] | null
  >(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredChapters = chapters.filter(
    (chapter) =>
      (chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chapter.author.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "all" || chapter.status === filterStatus)
  );

  return (
    <div className='space-y-4'>
      <h1 className='text-3xl font-bold'>Capítulos</h1>
      <div className='flex justify-between items-center'>
        <div className='flex space-x-2'>
          <Input
            placeholder='Buscar capítulos...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='max-w-sm'
          />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Filtrar por estado' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Todos los estados</SelectItem>
              <SelectItem value='En revisión'>En revisión</SelectItem>
              <SelectItem value='Aprobado'>Aprobado</SelectItem>
              <SelectItem value='Rechazado'>Rechazado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button>Revisar Capítulos Pendientes</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Libro</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha de Envío</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredChapters.map((chapter) => (
            <TableRow key={chapter.id}>
              <TableCell>{chapter.title}</TableCell>
              <TableCell>{chapter.book}</TableCell>
              <TableCell>{chapter.author}</TableCell>
              <TableCell>
                <Badge
                  className={
                    chapter.status === "Aprobado"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }>
                  {chapter.status}
                </Badge>
              </TableCell>
              <TableCell>{chapter.submissionDate}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className='mr-2'
                      onClick={() => setSelectedChapter(chapter)}>
                      Revisar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='max-w-4xl'>
                    <DialogHeader>
                      <DialogTitle>Revisión del Capítulo</DialogTitle>
                      <DialogDescription>
                        Revisa y aprueba o rechaza el capítulo
                      </DialogDescription>
                    </DialogHeader>
                    {selectedChapter && (
                      <Tabs defaultValue='content'>
                        <TabsList>
                          <TabsTrigger value='content'>Contenido</TabsTrigger>
                          <TabsTrigger value='info'>Información</TabsTrigger>
                        </TabsList>
                        <TabsContent value='content'>
                          <Card>
                            <CardHeader>
                              <CardTitle>{selectedChapter.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <Textarea
                                value={selectedChapter.content}
                                readOnly
                                className='min-h-[300px] resize-y'
                              />
                            </CardContent>
                          </Card>
                        </TabsContent>
                        <TabsContent value='info'>
                          <Card>
                            <CardHeader>
                              <CardTitle>Información del Capítulo</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className='grid grid-cols-2 gap-4'>
                                <div>
                                  <p>
                                    <strong>Autor:</strong>{" "}
                                    {selectedChapter.author}
                                  </p>
                                  <p>
                                    <strong>Libro:</strong>{" "}
                                    {selectedChapter.book}
                                  </p>
                                  <p>
                                    <strong>Estado:</strong>{" "}
                                    {selectedChapter.status}
                                  </p>
                                </div>
                                <div>
                                  <p>
                                    <strong>Fecha de Envío:</strong>{" "}
                                    {selectedChapter.submissionDate}
                                  </p>
                                  <p>
                                    <strong>Fecha de Revisión:</strong>{" "}
                                    {selectedChapter.reviewDate ||
                                      "No revisado"}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    )}
                    <div className='flex justify-between mt-4'>
                      <Button className='bg-red-500 text-white'>
                        Rechazar
                      </Button>
                      <Button>Solicitar Cambios</Button>
                      <Button>Aprobar</Button>
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
