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
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Search, X, Edit } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Datos de ejemplo
const textosPlataformaEjemplo = [
  {
    id: 1,
    nombre: "Mensaje de bienvenida",
    tipo: "notificacion",
    contenido:
      "¡Bienvenido a la plataforma editorial! Estamos encantados de tenerte con nosotros.",
  },
  {
    id: 2,
    nombre: "Error de pago",
    tipo: "error",
    contenido:
      "Ha ocurrido un error al procesar tu pago. Por favor, inténtalo de nuevo o contacta con soporte.",
  },
  {
    id: 3,
    nombre: "Capítulo enviado",
    tipo: "confirmacion",
    contenido:
      "Tu capítulo ha sido enviado correctamente. Recibirás una notificación cuando sea revisado.",
  },
  {
    id: 4,
    nombre: "Libro publicado",
    tipo: "notificacion",
    contenido: "¡Enhorabuena! Tu libro ha sido publicado correctamente.",
  },
  {
    id: 5,
    nombre: "Recordatorio de pago",
    tipo: "recordatorio",
    contenido:
      "Recuerda que tienes un pago pendiente. Por favor, completa el proceso para continuar.",
  },
];

export function TextosPlataformaPlantillas() {
  const [textos, setTextos] = useState(textosPlataformaEjemplo);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTexto, setSelectedTexto] = useState<
    (typeof textosPlataformaEjemplo)[0] | null
  >(null);
  const [tipoActivo, setTipoActivo] = useState("todos");

  const tipos = [
    "todos",
    "notificacion",
    "error",
    "confirmacion",
    "recordatorio",
  ];

  const textosFiltrados = textos.filter((texto) => {
    const matchesSearch = searchTerm
      ? texto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesTipo =
      tipoActivo === "todos" ? true : texto.tipo === tipoActivo;

    return matchesSearch && matchesTipo;
  });

  const handleEliminarTexto = (id: number) => {
    setTextos(textos.filter((texto) => texto.id !== id));
    if (selectedTexto?.id === id) {
      setSelectedTexto(null);
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "notificacion":
        return "bg-blue-100 text-blue-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "confirmacion":
        return "bg-green-100 text-green-800";
      case "recordatorio":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>
          Textos y notificaciones de la plataforma
        </h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className='mr-2 h-4 w-4' />
              Añadir texto
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[600px]'>
            <DialogHeader>
              <DialogTitle>Añadir nuevo texto</DialogTitle>
              <DialogDescription>
                Crea un nuevo texto o notificación para la plataforma.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='nombre' className='text-right'>
                  Nombre
                </Label>
                <Input
                  id='nombre'
                  placeholder='Ej: Mensaje de bienvenida'
                  className='col-span-3'
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='tipo' className='text-right'>
                  Tipo
                </Label>
                <select
                  id='tipo'
                  className='col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'>
                  {tipos
                    .filter((tipo) => tipo !== "todos")
                    .map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                      </option>
                    ))}
                </select>
              </div>
              <div className='grid grid-cols-4 items-start gap-4'>
                <Label htmlFor='contenido' className='text-right pt-2'>
                  Contenido
                </Label>
                <Textarea
                  id='contenido'
                  placeholder='Contenido del texto...'
                  className='col-span-3 min-h-[100px]'
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

      <div className='flex flex-col md:flex-row gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Buscar textos...'
            className='pl-10'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs
          defaultValue='todos'
          value={tipoActivo}
          onValueChange={setTipoActivo}
          className='w-full md:w-auto'>
          <TabsList>
            {tipos.map((tipo) => (
              <TabsTrigger key={tipo} value={tipo}>
                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-1 space-y-4'>
          {textosFiltrados.map((texto) => (
            <Card
              key={texto.id}
              className={`cursor-pointer transition-colors ${
                selectedTexto?.id === texto.id ? "border-primary" : ""
              }`}
              onClick={() => setSelectedTexto(texto)}>
              <CardHeader className='p-4 pb-2'>
                <CardTitle className='text-lg flex justify-between items-center'>
                  <span>{texto.nombre}</span>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 text-destructive'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEliminarTexto(texto.id);
                    }}>
                    <X className='h-4 w-4' />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className='p-4 pt-0'>
                <div className='flex items-center'>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${getTipoColor(
                      texto.tipo
                    )}`}>
                    {texto.tipo}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='lg:col-span-2'>
          {selectedTexto ? (
            <Card>
              <CardHeader className='p-4 pb-2'>
                <CardTitle className='text-lg flex justify-between items-center'>
                  <span>{selectedTexto.nombre}</span>
                  <Button variant='outline' size='sm'>
                    <Edit className='h-4 w-4 mr-2' />
                    Editar
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className='p-4'>
                <div className='p-4 border rounded-md bg-muted/30'>
                  <p className='whitespace-pre-wrap'>
                    {selectedTexto.contenido}
                  </p>
                </div>
              </CardContent>
              <CardFooter className='p-4 pt-0 flex justify-between'>
                <div className='text-sm text-muted-foreground'>
                  Tipo:{" "}
                  <span
                    className={`font-medium px-2 py-0.5 rounded-full ${getTipoColor(
                      selectedTexto.tipo
                    )}`}>
                    {selectedTexto.tipo}
                  </span>
                </div>
                <Button variant='default' size='sm'>
                  Guardar cambios
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className='flex items-center justify-center h-full min-h-[300px]'>
              <p className='text-muted-foreground'>
                Selecciona un texto para ver su contenido
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
