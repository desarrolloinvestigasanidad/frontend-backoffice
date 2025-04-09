"use client";

import { useState } from "react";
import Image from "next/image";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Upload, X } from "lucide-react";

// Datos de ejemplo
const imagenesEjemplo = [
  {
    id: 1,
    nombre: "Logo principal",
    categoria: "logos",
    url: "/abstract-geometric-logo.png",
  },
  {
    id: 2,
    nombre: "Banner home",
    categoria: "banners",
    url: "/celebratory-banner.png",
  },
  {
    id: 3,
    nombre: "Icono usuario",
    categoria: "iconos",
    url: "/generic-user-icon.png",
  },
  {
    id: 4,
    nombre: "Fondo login",
    categoria: "fondos",
    url: "/abstract-geometric-shapes.png",
  },
  {
    id: 5,
    nombre: "Imagen footer",
    categoria: "otros",
    url: "/website-footer-abstract.png",
  },
];

export function ImagenesPlantillas() {
  const [imagenes, setImagenes] = useState(imagenesEjemplo);
  const [categoriaActiva, setCategoriaActiva] = useState("todas");
  const [dialogOpen, setDialogOpen] = useState(false);

  const categorias = ["todas", "logos", "banners", "iconos", "fondos", "otros"];

  const imagenesFiltradas =
    categoriaActiva === "todas"
      ? imagenes
      : imagenes.filter((img) => img.categoria === categoriaActiva);

  const handleEliminarImagen = (id: number) => {
    setImagenes(imagenes.filter((img) => img.id !== id));
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Imágenes</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className='mr-2 h-4 w-4' />
              Añadir imagen
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Añadir nueva imagen</DialogTitle>
              <DialogDescription>
                Sube una nueva imagen para usar en la plataforma.
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
                <Label htmlFor='categoria' className='text-right'>
                  Categoría
                </Label>
                <select
                  id='categoria'
                  className='col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'>
                  {categorias
                    .filter((cat) => cat !== "todas")
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                </select>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label className='text-right'>Archivo</Label>
                <div className='col-span-3'>
                  <div className='flex items-center justify-center w-full'>
                    <label
                      htmlFor='dropzone-file'
                      className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 hover:bg-gray-100'>
                      <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                        <Upload className='w-8 h-8 mb-2 text-gray-500' />
                        <p className='mb-2 text-sm text-gray-500'>
                          <span className='font-semibold'>
                            Haz clic para subir
                          </span>{" "}
                          o arrastra y suelta
                        </p>
                        <p className='text-xs text-gray-500'>
                          SVG, PNG, JPG o GIF
                        </p>
                      </div>
                      <Input
                        id='dropzone-file'
                        type='file'
                        className='hidden'
                      />
                    </label>
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

      <Tabs
        defaultValue='todas'
        value={categoriaActiva}
        onValueChange={setCategoriaActiva}>
        <TabsList className='mb-4'>
          {categorias.map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={categoriaActiva}>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {imagenesFiltradas.map((imagen) => (
              <Card key={imagen.id} className='overflow-hidden'>
                <CardHeader className='p-4'>
                  <CardTitle className='text-lg flex justify-between items-center'>
                    <span>{imagen.nombre}</span>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 text-destructive'
                      onClick={() => handleEliminarImagen(imagen.id)}>
                      <X className='h-4 w-4' />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className='p-0 h-[200px] relative'>
                  <Image
                    src={imagen.url || "/placeholder.svg"}
                    alt={imagen.nombre}
                    fill
                    className='object-cover'
                  />
                </CardContent>
                <CardFooter className='p-4 bg-muted/50'>
                  <div className='text-xs text-muted-foreground'>
                    Categoría:{" "}
                    <span className='font-medium'>
                      {imagen.categoria.charAt(0).toUpperCase() +
                        imagen.categoria.slice(1)}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
