"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, X, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Datos de ejemplo
const tiposLibroEjemplo = [
  {
    id: 1,
    nombre: "Libro de edición",
    descripcion: "Libro compuesto por capítulos de diferentes autores",
    caracteristicas:
      "Múltiples autores, revisión editorial, certificados por capítulo",
  },
  {
    id: 2,
    nombre: "Libro personalziado",
    descripcion: "Libro creado por un único autor o grupo de autores",
    caracteristicas:
      "Autor único o grupo definido, diseño personalizado, ISBN propio",
  },
];

export function ConfiguracionTiposLibro() {
  const [tiposLibro, setTiposLibro] = useState(tiposLibroEjemplo);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEliminarTipo = (id: number) => {
    setTiposLibro(tiposLibro.filter((tipo) => tipo.id !== id));
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Tipos de libro</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className='mr-2 h-4 w-4' />
              Añadir tipo
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Añadir tipo de libro</DialogTitle>
              <DialogDescription>
                Añade un nuevo tipo de libro al sistema.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='nombre-tipo' className='text-right'>
                  Nombre
                </Label>
                <Input
                  id='nombre-tipo'
                  placeholder='Ej: Libro de edición'
                  className='col-span-3'
                />
              </div>
              <div className='grid grid-cols-4 items-start gap-4'>
                <Label htmlFor='descripcion-tipo' className='text-right pt-2'>
                  Descripción
                </Label>
                <Textarea
                  id='descripcion-tipo'
                  placeholder='Descripción del tipo de libro'
                  className='col-span-3'
                />
              </div>
              <div className='grid grid-cols-4 items-start gap-4'>
                <Label
                  htmlFor='caracteristicas-tipo'
                  className='text-right pt-2'>
                  Características
                </Label>
                <Textarea
                  id='caracteristicas-tipo'
                  placeholder='Características principales del tipo de libro'
                  className='col-span-3'
                />
              </div>
            </div>
            <DialogFooter>
              <Button type='submit' onClick={() => setDialogOpen(false)}>
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de tipos de libro</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Características</TableHead>
                <TableHead className='text-right'>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tiposLibro.map((tipo) => (
                <TableRow key={tipo.id}>
                  <TableCell className='font-medium'>{tipo.nombre}</TableCell>
                  <TableCell>{tipo.descripcion}</TableCell>
                  <TableCell>{tipo.caracteristicas}</TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
                      <Button variant='ghost' size='icon' className='h-8 w-8'>
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-destructive'
                        onClick={() => handleEliminarTipo(tipo.id)}>
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className='mt-8 p-4 border rounded-md bg-muted/30'>
        <h3 className='text-lg font-medium mb-2'>Nota sobre tipos de libro</h3>
        <p className='text-sm text-muted-foreground'>
          Según las especificaciones del sistema, solo habrá dos tipos de libro:
          Libro de edición y Libro personalizado. No habrá libro individual.
        </p>
      </div>
    </div>
  );
}
