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

// Datos de ejemplo
const correosEjemplo = [
  {
    id: 1,
    nombre: "Bienvenida",
    asunto: "Bienvenido a la plataforma editorial",
    contenido:
      "Estimado/a {{nombre}},\n\nLe damos la bienvenida a nuestra plataforma editorial. Su cuenta ha sido creada correctamente.\n\nSaludos cordiales,\nEl equipo editorial",
  },
  {
    id: 2,
    nombre: "Confirmación de pago",
    asunto: "Confirmación de pago - {{referencia}}",
    contenido:
      "Estimado/a {{nombre}},\n\nSu pago con referencia {{referencia}} ha sido procesado correctamente por un importe de {{importe}}€.\n\nGracias por confiar en nosotros.\n\nSaludos cordiales,\nEl equipo editorial",
  },
  {
    id: 3,
    nombre: "Capítulo aprobado",
    asunto: "Su capítulo ha sido aprobado",
    contenido:
      'Estimado/a {{nombre}},\n\nNos complace informarle que su capítulo "{{titulo_capitulo}}" para el libro "{{titulo_libro}}" ha sido aprobado.\n\nSaludos cordiales,\nEl equipo editorial',
  },
];

export function CorreosPlantillas() {
  const [correos, setCorreos] = useState(correosEjemplo);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCorreo, setSelectedCorreo] = useState<
    (typeof correosEjemplo)[0] | null
  >(null);

  const correosFiltrados = searchTerm
    ? correos.filter(
        (correo) =>
          correo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          correo.asunto.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : correos;

  const handleEliminarCorreo = (id: number) => {
    setCorreos(correos.filter((correo) => correo.id !== id));
    if (selectedCorreo?.id === id) {
      setSelectedCorreo(null);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Textos de correos electrónicos</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className='mr-2 h-4 w-4' />
              Añadir plantilla
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[600px]'>
            <DialogHeader>
              <DialogTitle>Añadir nueva plantilla de correo</DialogTitle>
              <DialogDescription>
                Crea una nueva plantilla para los correos electrónicos de la
                plataforma.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='nombre' className='text-right'>
                  Nombre
                </Label>
                <Input
                  id='nombre'
                  placeholder='Ej: Bienvenida'
                  className='col-span-3'
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='asunto' className='text-right'>
                  Asunto
                </Label>
                <Input
                  id='asunto'
                  placeholder='Ej: Bienvenido a la plataforma'
                  className='col-span-3'
                />
              </div>
              <div className='grid grid-cols-4 items-start gap-4'>
                <Label htmlFor='contenido' className='text-right pt-2'>
                  Contenido
                </Label>
                <div className='col-span-3 space-y-2'>
                  <Textarea
                    id='contenido'
                    placeholder='Contenido del correo...'
                    className='min-h-[200px]'
                  />
                  <div className='text-sm text-muted-foreground'>
                    Puedes usar variables como {"{{"} nombre {"}}"}, {"{{"}{" "}
                    email {"}}"}, etc.
                  </div>
                </div>
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

      <div className='relative'>
        <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Buscar plantillas...'
          className='pl-10'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-1 space-y-4'>
          {correosFiltrados.map((correo) => (
            <Card
              key={correo.id}
              className={`cursor-pointer transition-colors ${
                selectedCorreo?.id === correo.id ? "border-primary" : ""
              }`}
              onClick={() => setSelectedCorreo(correo)}>
              <CardHeader className='p-4 pb-2'>
                <CardTitle className='text-lg flex justify-between items-center'>
                  <span>{correo.nombre}</span>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 text-destructive'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEliminarCorreo(correo.id);
                    }}>
                    <X className='h-4 w-4' />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className='p-4 pt-0'>
                <p className='text-sm text-muted-foreground truncate'>
                  {correo.asunto}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='lg:col-span-2'>
          {selectedCorreo ? (
            <Card>
              <CardHeader className='p-4 pb-2'>
                <CardTitle className='text-lg flex justify-between items-center'>
                  <span>Vista previa: {selectedCorreo.nombre}</span>
                  <Button variant='outline' size='sm'>
                    <Edit className='h-4 w-4 mr-2' />
                    Editar
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className='p-4 space-y-4'>
                <div>
                  <h3 className='text-sm font-medium'>Asunto:</h3>
                  <p className='text-sm'>{selectedCorreo.asunto}</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium'>Contenido:</h3>
                  <div className='mt-2 p-4 border rounded-md bg-muted/30'>
                    <pre className='text-sm whitespace-pre-wrap font-sans'>
                      {selectedCorreo.contenido}
                    </pre>
                  </div>
                </div>
                <div>
                  <h3 className='text-sm font-medium'>
                    Variables disponibles:
                  </h3>
                  <div className='mt-2 flex flex-wrap gap-2'>
                    <span className='px-2 py-1 bg-muted rounded-md text-xs'>
                      {"{{nombre}}"}
                    </span>
                    <span className='px-2 py-1 bg-muted rounded-md text-xs'>
                      {"{{email}}"}
                    </span>
                    <span className='px-2 py-1 bg-muted rounded-md text-xs'>
                      {"{{referencia}}"}
                    </span>
                    <span className='px-2 py-1 bg-muted rounded-md text-xs'>
                      {"{{importe}}"}
                    </span>
                    <span className='px-2 py-1 bg-muted rounded-md text-xs'>
                      {"{{titulo_libro}}"}
                    </span>
                    <span className='px-2 py-1 bg-muted rounded-md text-xs'>
                      {"{{titulo_capitulo}}"}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className='p-4 pt-0 flex justify-end'>
                <Button variant='default' size='sm'>
                  Enviar prueba
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className='flex items-center justify-center h-full min-h-[300px]'>
              <p className='text-muted-foreground'>
                Selecciona una plantilla para ver su contenido
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
