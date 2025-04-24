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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlusCircle,
  Upload,
  X,
  Search,
  ImageIcon,
  Copy,
  Maximize,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Datos de ejemplo mejorados con más información
const imagenesEjemplo = [
  {
    id: 1,
    nombre: "Logo principal",
    categoria: "logos",
    url: "/abstract-geometric-logo.png",
    tamano: "240KB",
    dimensiones: "512x512",
    formato: "PNG",
    fechaSubida: "2023-06-15",
  },
  {
    id: 2,
    nombre: "Banner principal",
    categoria: "banners",
    url: "/celebratory-banner.png",
    tamano: "480KB",
    dimensiones: "1920x480",
    formato: "PNG",
    fechaSubida: "2023-07-22",
  },
  {
    id: 3,
    nombre: "Icono usuario",
    categoria: "iconos",
    url: "/generic-user-icon.png",
    tamano: "32KB",
    dimensiones: "128x128",
    formato: "PNG",
    fechaSubida: "2023-05-10",
  },
  {
    id: 4,
    nombre: "Fondo login",
    categoria: "fondos",
    url: "/abstract-geometric-shapes.png",
    tamano: "720KB",
    dimensiones: "1920x1080",
    formato: "PNG",
    fechaSubida: "2023-04-18",
  },
  {
    id: 5,
    nombre: "Patrón footer",
    categoria: "otros",
    url: "/website-footer-abstract.png",
    tamano: "350KB",
    dimensiones: "1920x320",
    formato: "PNG",
    fechaSubida: "2023-08-05",
  },
  {
    id: 6,
    nombre: "Banner celebración",
    categoria: "banners",
    url: "/abstract-celebration.png",
    tamano: "520KB",
    dimensiones: "1920x480",
    formato: "PNG",
    fechaSubida: "2023-09-12",
  },
];

export function ImagenesPlantillas() {
  const [imagenes, setImagenes] = useState(imagenesEjemplo);
  const [categoriaActiva, setCategoriaActiva] = useState("todas");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewImageDialog, setPreviewImageDialog] = useState(false);
  const [previewImage, setPreviewImage] = useState<
    (typeof imagenesEjemplo)[0] | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);

  const categorias = ["todas", "logos", "banners", "iconos", "fondos", "otros"];

  const handleEliminarImagen = (id: number) => {
    setImagenes(imagenes.filter((img) => img.id !== id));
  };

  const abrirVistaPrevia = (imagen: (typeof imagenesEjemplo)[0]) => {
    setPreviewImage(imagen);
    setPreviewImageDialog(true);
  };

  // Filtrar por categoría y término de búsqueda
  const imagenesFiltradas = imagenes.filter((img) => {
    const matchesCategory =
      categoriaActiva === "todas" || img.categoria === categoriaActiva;
    const matchesSearch =
      searchTerm === "" ||
      img.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Simulación de carga de archivos
  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setDialogOpen(false);
    }, 1500);
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case "logos":
        return "bg-blue-100 text-blue-800";
      case "banners":
        return "bg-purple-100 text-purple-800";
      case "iconos":
        return "bg-green-100 text-green-800";
      case "fondos":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h2 className='text-2xl font-bold'>Biblioteca de imágenes</h2>
          <p className='text-muted-foreground mt-1'>
            Gestiona las imágenes utilizadas en la plataforma
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className='shrink-0'>
              <PlusCircle className='mr-2 h-4 w-4' />
              Añadir imagen
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[550px]'>
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
                <Input
                  id='nombre'
                  placeholder='Ej: Logo principal'
                  className='col-span-3'
                />
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
              <div className='grid grid-cols-4 items-start gap-4'>
                <Label className='text-right pt-2'>Archivo</Label>
                <div className='col-span-3'>
                  <div className='flex items-center justify-center w-full'>
                    <label
                      htmlFor='dropzone-file'
                      className='flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/70 transition-colors'>
                      <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                        <Upload className='w-8 h-8 mb-2 text-muted-foreground' />
                        <p className='mb-2 text-sm text-center'>
                          <span className='font-semibold'>
                            Haz clic para subir
                          </span>{" "}
                          o arrastra y suelta
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          SVG, PNG, JPG o GIF (Max. 5MB)
                        </p>
                      </div>
                      <Input
                        id='dropzone-file'
                        type='file'
                        accept='image/*'
                        className='hidden'
                      />
                    </label>
                  </div>
                  <p className='text-xs text-muted-foreground mt-2'>
                    Se recomienda usar imágenes optimizadas para mejorar el
                    rendimiento de la plataforma.
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant='outline' onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type='submit' onClick={handleUpload} disabled={uploading}>
                {uploading ? (
                  <>
                    <span className='animate-spin mr-2'>◌</span>
                    Subiendo...
                  </>
                ) : (
                  <>Guardar</>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de vista previa de imagen */}
        <Dialog open={previewImageDialog} onOpenChange={setPreviewImageDialog}>
          <DialogContent className='sm:max-w-[90%] max-h-[90vh] overflow-hidden flex flex-col'>
            <DialogHeader className='text-left'>
              <DialogTitle>{previewImage?.nombre}</DialogTitle>
              <DialogDescription>
                <div className='flex gap-2 flex-wrap mt-1'>
                  <Badge
                    variant='outline'
                    className={getCategoriaColor(
                      previewImage?.categoria || ""
                    )}>
                    {previewImage?.categoria}
                  </Badge>
                  <Badge variant='outline'>{previewImage?.dimensiones}</Badge>
                  <Badge variant='outline'>{previewImage?.formato}</Badge>
                  <Badge variant='outline'>{previewImage?.tamano}</Badge>
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className='relative h-[70vh] w-full flex items-center justify-center bg-muted/30 rounded-md overflow-hidden'>
              {previewImage && (
                <Image
                  src={previewImage.url || "/placeholder.svg"}
                  alt={previewImage.nombre}
                  fill
                  className='object-contain'
                />
              )}
            </div>
            <DialogFooter className='sm:justify-between'>
              <div className='hidden sm:flex items-center text-sm text-muted-foreground'>
                Subida el {previewImage?.fechaSubida}
              </div>
              <div className='flex gap-2'>
                <Button variant='outline' className='gap-2'>
                  <Download className='h-4 w-4' />
                  Descargar
                </Button>
                <Button variant='outline' className='gap-2'>
                  <Copy className='h-4 w-4' />
                  Copiar URL
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className='flex flex-col md:flex-row gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Buscar imágenes...'
            className='pl-10'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs
          defaultValue='todas'
          value={categoriaActiva}
          onValueChange={setCategoriaActiva}
          className='w-full md:w-auto'>
          <TabsList>
            {categorias.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {imagenesFiltradas.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <ImageIcon className='h-12 w-12 text-muted-foreground mb-4' />
          <h3 className='text-xl font-medium'>No se encontraron imágenes</h3>
          <p className='text-muted-foreground mt-1 mb-6'>
            No hay imágenes que coincidan con los criterios de búsqueda
          </p>
          <Button
            onClick={() => {
              setSearchTerm("");
              setCategoriaActiva("todas");
            }}>
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {imagenesFiltradas.map((imagen) => (
            <Card
              key={imagen.id}
              className='group overflow-hidden bg-background'>
              <div
                className='relative h-[180px] overflow-hidden cursor-pointer'
                onClick={() => abrirVistaPrevia(imagen)}>
                <Image
                  src={imagen.url || "/placeholder.svg"}
                  alt={imagen.nombre}
                  fill
                  className='object-cover transition-transform duration-300 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100'>
                  <Maximize className='h-8 w-8 text-white' />
                </div>
              </div>

              <CardHeader className='p-4 pb-2'>
                <div className='flex justify-between items-start'>
                  <CardTitle
                    className='text-base truncate mr-2'
                    title={imagen.nombre}>
                    {imagen.nombre}
                  </CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity'
                          onClick={() => handleEliminarImagen(imagen.id)}>
                          <X className='h-4 w-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Eliminar imagen</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>

              <CardContent className='p-4 pt-0'>
                <div className='flex items-center gap-2'>
                  <Badge
                    variant='outline'
                    className={getCategoriaColor(imagen.categoria)}>
                    {imagen.categoria}
                  </Badge>
                  <span className='text-xs text-muted-foreground'>
                    {imagen.dimensiones}
                  </span>
                </div>
              </CardContent>

              <CardFooter className='p-4 pt-0 flex justify-between items-center'>
                <div className='text-xs text-muted-foreground'>
                  {imagen.tamano}
                </div>
                <div className='flex gap-2'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                          <Copy className='h-4 w-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copiar URL</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8'
                          onClick={() => abrirVistaPrevia(imagen)}>
                          <Maximize className='h-4 w-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Vista previa</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
