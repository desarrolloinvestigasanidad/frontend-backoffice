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

const editions = [
  {
    id: 1,
    name: "Edición Febrero 2025",
    startDate: "2025-02-01",
    endDate: "2025-02-28",
    status: "Activa",
    participants: 45,
    books: 3,
    chapters: 78,
  },
  {
    id: 2,
    name: "Edición Marzo 2025",
    startDate: "2025-03-01",
    endDate: "2025-03-31",
    status: "Próxima",
    participants: 0,
    books: 0,
    chapters: 0,
  },
  // Add more mock data as needed
];

export default function EdicionesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEdition, setSelectedEdition] = useState<
    (typeof editions)[0] | null
  >(null);

  const filteredEditions = editions.filter((edition) =>
    edition.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='space-y-4'>
      <h1 className='text-3xl font-bold'>Ediciones</h1>
      <div className='flex justify-between'>
        <Input
          placeholder='Buscar ediciones...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='max-w-sm'
        />
        <Button>Crear Nueva Edición</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Fecha de Inicio</TableHead>
            <TableHead>Fecha de Fin</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Participantes</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEditions.map((edition) => (
            <TableRow key={edition.id}>
              <TableCell>{edition.name}</TableCell>
              <TableCell>{edition.startDate}</TableCell>
              <TableCell>{edition.endDate}</TableCell>
              <TableCell>
                <Badge
                  className={
                    edition.status === "Activa"
                      ? "badge-default"
                      : "badge-secondary"
                  }>
                  {edition.status}
                </Badge>
              </TableCell>
              <TableCell>{edition.participants}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className='mr-2'
                      onClick={() => setSelectedEdition(edition)}>
                      Ver
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='max-w-4xl'>
                    <DialogHeader>
                      <DialogTitle>Detalles de la Edición</DialogTitle>
                      <DialogDescription>
                        Información detallada de la edición
                      </DialogDescription>
                    </DialogHeader>
                    {selectedEdition && (
                      <Tabs defaultValue='info'>
                        <TabsList>
                          <TabsTrigger value='info'>Información</TabsTrigger>
                          <TabsTrigger value='books'>Libros</TabsTrigger>
                          <TabsTrigger value='participants'>
                            Participantes
                          </TabsTrigger>
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
                                    <strong>Nombre:</strong>{" "}
                                    {selectedEdition.name}
                                  </p>
                                  <p>
                                    <strong>Fecha de Inicio:</strong>{" "}
                                    {selectedEdition.startDate}
                                  </p>
                                  <p>
                                    <strong>Fecha de Fin:</strong>{" "}
                                    {selectedEdition.endDate}
                                  </p>
                                </div>
                                <div>
                                  <p>
                                    <strong>Estado:</strong>{" "}
                                    {selectedEdition.status}
                                  </p>
                                  <p>
                                    <strong>Participantes:</strong>{" "}
                                    {selectedEdition.participants}
                                  </p>
                                  <p>
                                    <strong>Libros:</strong>{" "}
                                    {selectedEdition.books}
                                  </p>
                                  <p>
                                    <strong>Capítulos:</strong>{" "}
                                    {selectedEdition.chapters}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                        <TabsContent value='books'>
                          <Card>
                            <CardHeader>
                              <CardTitle>Libros de la Edición</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {/* Aquí iría una tabla o lista de libros */}
                              <p>Lista de libros de la edición</p>
                            </CardContent>
                          </Card>
                        </TabsContent>
                        <TabsContent value='participants'>
                          <Card>
                            <CardHeader>
                              <CardTitle>Participantes</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {/* Aquí iría una lista de participantes */}
                              <p>Lista de participantes de la edición</p>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    )}
                    <div className='flex justify-between mt-4'>
                      <Button>Editar</Button>
                      <Button>Generar Libros</Button>
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
