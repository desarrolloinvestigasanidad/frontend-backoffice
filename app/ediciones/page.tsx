"use client";

import { useEffect, useState } from "react";
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

export default function EdicionesPage() {
  // Este flag evita que se renderice en el servidor y solo se monte en el cliente
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  interface Edition {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    status: string;
    participants: number;
    books: number;
    chapters: number;
  }

  const [editions, setEditions] = useState<Edition[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEdition, setSelectedEdition] = useState<Edition | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newEdition, setNewEdition] = useState({
    name: "",
    startDate: "",
    endDate: "",
    status: "Próxima",
  });

  // Cargar ediciones desde el backend
  useEffect(() => {
    fetch("http://localhost:5000/api/editions")
      .then((res) => res.json())
      .then((data) => setEditions(data))
      .catch((err) => console.error("Error al obtener ediciones:", err));
  }, []);

  const filteredEditions = editions.filter((edition) =>
    edition.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateEdition = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/editions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEdition),
      });
      if (!response.ok) {
        throw new Error("Error al crear la edición");
      }
      const createdEdition = await response.json();
      setEditions((prev) => [...prev, createdEdition]);
      setNewEdition({
        name: "",
        startDate: "",
        endDate: "",
        status: "Próxima",
      });
      setOpenCreateDialog(false);
    } catch (err) {
      console.error(err);
    }
  };

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
        <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpenCreateDialog(true)}>
              Crear Nueva Edición
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-4xl'>
            <DialogHeader>
              <DialogTitle>Crear Nueva Edición</DialogTitle>
              <DialogDescription>
                Ingresa los datos para la nueva edición.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateEdition} className='space-y-4'>
              <div className='grid grid-cols-1 gap-4'>
                <div>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700'>
                    Nombre
                  </label>
                  <Input
                    id='name'
                    placeholder='Nombre de la edición'
                    value={newEdition.name}
                    onChange={(e) =>
                      setNewEdition({ ...newEdition, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor='startDate'
                    className='block text-sm font-medium text-gray-700'>
                    Fecha de Inicio
                  </label>
                  <Input
                    id='startDate'
                    type='date'
                    value={newEdition.startDate}
                    onChange={(e) =>
                      setNewEdition({
                        ...newEdition,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor='endDate'
                    className='block text-sm font-medium text-gray-700'>
                    Fecha de Fin
                  </label>
                  <Input
                    id='endDate'
                    type='date'
                    value={newEdition.endDate}
                    onChange={(e) =>
                      setNewEdition({ ...newEdition, endDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor='status'
                    className='block text-sm font-medium text-gray-700'>
                    Estado
                  </label>
                  <Input
                    id='status'
                    placeholder='Estado'
                    value={newEdition.status}
                    onChange={(e) =>
                      setNewEdition({ ...newEdition, status: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className='flex justify-end space-x-2'>
                <Button
                  type='button'
                  variant='secondary'
                  onClick={() => setOpenCreateDialog(false)}>
                  Cancelar
                </Button>
                <Button type='submit'>Crear Edición</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
