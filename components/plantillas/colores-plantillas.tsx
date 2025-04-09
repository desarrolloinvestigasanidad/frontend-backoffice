"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, X } from "lucide-react";

// Datos de ejemplo
const coloresEjemplo = [
  {
    id: 1,
    nombre: "Primario",
    valor: "#0f766e",
    descripcion: "Color principal de la marca",
  },
  {
    id: 2,
    nombre: "Secundario",
    valor: "#7e22ce",
    descripcion: "Color secundario para acentos",
  },
  {
    id: 3,
    nombre: "Fondo",
    valor: "#f8fafc",
    descripcion: "Color de fondo de la plataforma",
  },
  {
    id: 4,
    nombre: "Texto",
    valor: "#1e293b",
    descripcion: "Color principal para textos",
  },
  {
    id: 5,
    nombre: "Éxito",
    valor: "#16a34a",
    descripcion: "Color para mensajes de éxito",
  },
  {
    id: 6,
    nombre: "Error",
    valor: "#dc2626",
    descripcion: "Color para mensajes de error",
  },
];

export function ColoresPlantillas() {
  const [colores, setColores] = useState(coloresEjemplo);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEliminarColor = (id: number) => {
    setColores(colores.filter((color) => color.id !== id));
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Colores de la plataforma</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className='mr-2 h-4 w-4' />
              Añadir color
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Añadir nuevo color</DialogTitle>
              <DialogDescription>
                Define un nuevo color para usar en la plataforma.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='nombre' className='text-right'>
                  Nombre
                </Label>
                <Input id='nombre' className='col-span-3' />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='color' className='text-right'>
                  Color
                </Label>
                <div className='col-span-3 flex gap-2'>
                  <Input id='color' type='color' className='w-16 h-10 p-1' />
                  <Input
                    id='colorHex'
                    placeholder='#000000'
                    className='flex-1'
                  />
                </div>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='descripcion' className='text-right'>
                  Descripción
                </Label>
                <Input id='descripcion' className='col-span-3' />
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

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {colores.map((color) => (
          <Card key={color.id}>
            <CardHeader className='p-4 pb-0'>
              <CardTitle className='text-lg flex justify-between items-center'>
                <span>{color.nombre}</span>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 text-destructive'
                  onClick={() => handleEliminarColor(color.id)}>
                  <X className='h-4 w-4' />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className='p-4'>
              <div className='flex items-center gap-4'>
                <div
                  className='w-16 h-16 rounded-md border'
                  style={{ backgroundColor: color.valor }}
                />
                <div>
                  <div className='font-mono text-sm'>{color.valor}</div>
                  <div className='text-sm text-muted-foreground mt-1'>
                    {color.descripcion}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className='p-4 pt-0 flex justify-end'>
              <Button variant='outline' size='sm'>
                Editar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
