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
import { Checkbox } from "@/components/ui/checkbox";
import {
  PlusCircle,
  X,
  Edit,
  Eye,
  Copy,
  CheckCircle,
  Award,
  Search,
  Tag,
  Download,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Datos de ejemplo mejorados
const certificadosEjemplo = [
  {
    id: 1,
    nombre: "Certificado de participación",
    comunidad: "Todas",
    plantilla: "/gold-bordered-certificate.png",
    variables: ["nombre", "titulo_libro", "fecha", "horas", "firma_director"],
    ultimaActualizacion: "2023-09-15",
    usos: 156,
  },
  {
    id: 2,
    nombre: "Certificado de autoría",
    comunidad: "Madrid",
    plantilla: "/elegant-authorship-certificate.png",
    variables: [
      "nombre",
      "titulo_capitulo",
      "titulo_libro",
      "fecha",
      "isbn",
      "firma_director",
    ],
    ultimaActualizacion: "2023-08-22",
    usos: 87,
  },
  {
    id: 3,
    nombre: "Diploma de reconocimiento",
    comunidad: "Andalucía",
    plantilla: "/elegant-diploma.png",
    variables: ["nombre", "titulo_libro", "fecha", "firma_director"],
    ultimaActualizacion: "2023-07-05",
    usos: 42,
  },
  {
    id: 4,
    nombre: "Certificado de mérito académico",
    comunidad: "Cataluña",
    plantilla: "/elegant-achievement-certificate.png",
    variables: ["nombre", "titulo_libro", "fecha", "horas", "firma_director"],
    ultimaActualizacion: "2023-10-01",
    usos: 23,
  },
];

// Datos de ejemplo para etiquetas
const etiquetasEjemplo = [
  {
    id: 1,
    nombre: "nombre",
    descripcion: "Nombre completo del autor",
    uso: "Todos los certificados",
  },
  {
    id: 2,
    nombre: "titulo_libro",
    descripcion: "Título del libro",
    uso: "Certificados de participación y autoría",
  },
  {
    id: 3,
    nombre: "titulo_capitulo",
    descripcion: "Título del capítulo",
    uso: "Certificados de autoría",
  },
  {
    id: 4,
    nombre: "fecha",
    descripcion: "Fecha de emisión del certificado",
    uso: "Todos los certificados",
  },
  {
    id: 5,
    nombre: "horas",
    descripcion: "Horas de participación",
    uso: "Certificados de participación y mérito",
  },
  {
    id: 6,
    nombre: "isbn",
    descripcion: "ISBN del libro",
    uso: "Certificados de autoría",
  },
  {
    id: 7,
    nombre: "firma_director",
    descripcion: "Firma del director",
    uso: "Todos los certificados",
  },
];

export function CertificadosPlantillas() {
  const [certificados, setCertificados] = useState(certificadosEjemplo);
  const [etiquetas, setEtiquetas] = useState(etiquetasEjemplo);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [etiquetaDialogOpen, setEtiquetaDialogOpen] = useState(false);
  const [selectedCertificado, setSelectedCertificado] = useState<
    (typeof certificadosEjemplo)[0] | null
  >(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("certificados");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiado, setCopiado] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: number;
    type: string;
  } | null>(null);

  const certificadosFiltrados = searchTerm
    ? certificados.filter(
        (cert) =>
          cert.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.comunidad.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : certificados;

  const etiquetasFiltradas = searchTerm
    ? etiquetas.filter(
        (etq) =>
          etq.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          etq.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : etiquetas;

  const handleEliminarCertificado = (id: number) => {
    setCertificados(certificados.filter((cert) => cert.id !== id));
    if (selectedCertificado?.id === id) {
      setSelectedCertificado(null);
    }
  };

  const handleEliminarEtiqueta = (id: number) => {
    setEtiquetas(etiquetas.filter((etq) => etq.id !== id));
  };

  const confirmDelete = (id: number, type: string) => {
    setItemToDelete({ id, type });
    setDeleteDialogOpen(true);
  };

  const handleFinalDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.type === "certificado") {
        handleEliminarCertificado(itemToDelete.id);
      } else {
        handleEliminarEtiqueta(itemToDelete.id);
      }
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(`{{${text}}}`);
    setCopiado(text);
    setTimeout(() => setCopiado(null), 2000);
  };

  const handlePreviewCertificado = (cert: (typeof certificadosEjemplo)[0]) => {
    setSelectedCertificado(cert);
    setPreviewOpen(true);
  };

  return (
    <div className='space-y-6'>
      <Tabs
        defaultValue='certificados'
        value={activeTab}
        onValueChange={setActiveTab}>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <div>
            <h2 className='text-2xl font-bold'>
              {activeTab === "certificados"
                ? "Certificados"
                : "Etiquetas de certificados"}
            </h2>
            <p className='text-muted-foreground mt-1'>
              {activeTab === "certificados"
                ? "Gestiona las plantillas de certificados disponibles en la plataforma"
                : "Administra las etiquetas utilizadas en los certificados"}
            </p>
          </div>

          <div className='flex items-center gap-4'>
            <TabsList className='grid grid-cols-2'>
              <TabsTrigger
                value='certificados'
                className='flex items-center gap-2'>
                <Award className='h-4 w-4' />
                <span>Certificados</span>
              </TabsTrigger>
              <TabsTrigger
                value='etiquetas'
                className='flex items-center gap-2'>
                <Tag className='h-4 w-4' />
                <span>Etiquetas</span>
              </TabsTrigger>
            </TabsList>

            {activeTab === "certificados" ? (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className='mr-2 h-4 w-4' />
                    Añadir certificado
                  </Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[600px]'>
                  <DialogHeader>
                    <DialogTitle>Añadir nuevo certificado</DialogTitle>
                    <DialogDescription>
                      Crea una nueva plantilla de certificado.
                    </DialogDescription>
                  </DialogHeader>
                  <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='nombre' className='text-right'>
                        Nombre
                      </Label>
                      <Input
                        id='nombre'
                        placeholder='Ej: Certificado de participación'
                        className='col-span-3'
                      />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='comunidad' className='text-right'>
                        Comunidad
                      </Label>
                      <select
                        id='comunidad'
                        className='col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'>
                        <option value='Todas'>Todas</option>
                        <option value='Madrid'>Madrid</option>
                        <option value='Andalucía'>Andalucía</option>
                        <option value='Cataluña'>Cataluña</option>
                        <option value='Valencia'>Valencia</option>
                      </select>
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label className='text-right'>Plantilla</Label>
                      <div className='col-span-3'>
                        <div className='flex items-center justify-center w-full'>
                          <label
                            htmlFor='dropzone-file'
                            className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/70 transition-colors'>
                            <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                              <PlusCircle className='w-8 h-8 mb-2 text-muted-foreground' />
                              <p className='mb-2 text-sm text-center'>
                                <span className='font-semibold'>
                                  Haz clic para subir
                                </span>{" "}
                                o arrastra y suelta
                              </p>
                              <p className='text-xs text-muted-foreground'>
                                PDF, PNG o JPG
                              </p>
                            </div>
                            <Input
                              id='dropzone-file'
                              type='file'
                              accept='image/*,.pdf'
                              className='hidden'
                            />
                          </label>
                        </div>
                        <p className='text-xs text-muted-foreground mt-2'>
                          Sube una imagen o PDF de la plantilla de certificado.
                          Recomendamos una resolución mínima de 2480x3508 px
                          (A4).
                        </p>
                      </div>
                    </div>
                    <div className='grid grid-cols-4 items-start gap-4'>
                      <Label htmlFor='variables' className='text-right pt-2'>
                        Variables
                      </Label>
                      <div className='col-span-3 space-y-3'>
                        <div className='grid grid-cols-2 gap-3'>
                          {etiquetas.map((etiqueta) => (
                            <div
                              key={etiqueta.id}
                              className='flex items-start space-x-2'>
                              <Checkbox id={`check-${etiqueta.id}`} />
                              <div className='grid gap-1.5 leading-none'>
                                <label
                                  htmlFor={`check-${etiqueta.id}`}
                                  className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                                  {`{{${etiqueta.nombre}}}`}
                                </label>
                                <p className='text-xs text-muted-foreground'>
                                  {etiqueta.descripcion}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className='text-xs text-muted-foreground'>
                          Selecciona las variables que se utilizarán en este
                          certificado.
                        </p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className='gap-2'>
                    <Button
                      variant='outline'
                      onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type='submit' onClick={() => setDialogOpen(false)}>
                      Guardar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <Dialog
                open={etiquetaDialogOpen}
                onOpenChange={setEtiquetaDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className='mr-2 h-4 w-4' />
                    Añadir etiqueta
                  </Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[500px]'>
                  <DialogHeader>
                    <DialogTitle>Añadir nueva etiqueta</DialogTitle>
                    <DialogDescription>
                      Crea una nueva etiqueta para usar en los certificados.
                    </DialogDescription>
                  </DialogHeader>
                  <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='nombre-etiqueta' className='text-right'>
                        Nombre
                      </Label>
                      <Input
                        id='nombre-etiqueta'
                        placeholder='Ej: nombre_autor'
                        className='col-span-3'
                      />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label
                        htmlFor='descripcion-etiqueta'
                        className='text-right'>
                        Descripción
                      </Label>
                      <Input
                        id='descripcion-etiqueta'
                        placeholder='Ej: Nombre completo del autor'
                        className='col-span-3'
                      />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='uso-etiqueta' className='text-right'>
                        Uso recomendado
                      </Label>
                      <Input
                        id='uso-etiqueta'
                        placeholder='Ej: Todos los certificados'
                        className='col-span-3'
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant='outline'
                      onClick={() => setEtiquetaDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button
                      type='submit'
                      onClick={() => setEtiquetaDialogOpen(false)}>
                      Guardar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Diálogo de vista previa del certificado */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className='sm:max-w-[90%] max-h-[90vh] overflow-auto'>
            <DialogHeader>
              <DialogTitle className='flex justify-between items-center'>
                <span>Vista previa: {selectedCertificado?.nombre}</span>
                <Badge variant='outline'>
                  {selectedCertificado?.comunidad}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Esta es una vista previa de cómo se verá el certificado con los
                datos reales.
              </DialogDescription>
            </DialogHeader>
            <div className='flex justify-center p-4 bg-muted/30 rounded-md'>
              <div className='relative w-full max-w-[800px] aspect-[1/1.414] shadow-lg'>
                {selectedCertificado && (
                  <Image
                    src={selectedCertificado.plantilla || "/placeholder.svg"}
                    alt={selectedCertificado.nombre}
                    fill
                    className='object-contain'
                  />
                )}
              </div>
            </div>
            <div className='grid gap-4 py-2'>
              <div>
                <h3 className='text-sm font-medium mb-2'>
                  Variables disponibles:
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {selectedCertificado?.variables.map((variable, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleCopy(variable)}
                            className={`px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1 ${
                              copiado === variable
                                ? "bg-green-100 text-green-800"
                                : "bg-muted hover:bg-muted/70"
                            }`}>
                            {`{{${variable}}}`}
                            {copiado === variable ? (
                              <CheckCircle className='h-3 w-3' />
                            ) : (
                              <Copy className='h-3 w-3' />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {copiado === variable
                              ? "¡Copiado!"
                              : "Copiar al portapapeles"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter className='sm:justify-between'>
              <div className='hidden sm:block text-sm text-muted-foreground'>
                Última actualización: {selectedCertificado?.ultimaActualizacion}
              </div>
              <div className='flex gap-2'>
                <Button variant='outline'>
                  <Download className='mr-2 h-4 w-4' />
                  Descargar plantilla
                </Button>
                <Button onClick={() => setPreviewOpen(false)}>Cerrar</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de confirmación de eliminación */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer.{" "}
                {itemToDelete?.type === "certificado"
                  ? "El certificado será eliminado permanentemente."
                  : "La etiqueta será eliminada permanentemente y podría afectar a los certificados que la utilizan."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleFinalDelete}
                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'>
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className='relative mt-5'>
          <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder={
              activeTab === "certificados"
                ? "Buscar certificados..."
                : "Buscar etiquetas..."
            }
            className='pl-10'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <TabsContent value='certificados' className='mt-6'>
          {certificadosFiltrados.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <Award className='h-12 w-12 text-muted-foreground mb-4' />
              <h3 className='text-xl font-medium'>
                No se encontraron certificados
              </h3>
              <p className='text-muted-foreground mt-1 mb-6'>
                No hay certificados que coincidan con los criterios de búsqueda
              </p>
              <Button onClick={() => setSearchTerm("")}>Limpiar filtros</Button>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {certificadosFiltrados.map((certificado) => (
                <Card key={certificado.id} className='group'>
                  <div
                    className='relative h-[180px] overflow-hidden cursor-pointer border-b rounded-t-lg'
                    onClick={() => handlePreviewCertificado(certificado)}>
                    <Image
                      src={certificado.plantilla || "/placeholder.svg"}
                      alt={certificado.nombre}
                      fill
                      className='object-contain transition-transform duration-300 group-hover:scale-105'
                    />
                    <div className='absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100'>
                      <Eye className='h-8 w-8 text-white' />
                    </div>
                    <Badge className='absolute top-2 right-2 bg-white/90 text-black'>
                      {certificado.comunidad}
                    </Badge>
                  </div>

                  <CardHeader className='p-4 pb-2'>
                    <CardTitle className='text-base flex justify-between items-center'>
                      <span>{certificado.nombre}</span>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity'
                        onClick={() =>
                          confirmDelete(certificado.id, "certificado")
                        }>
                        <X className='h-4 w-4' />
                      </Button>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className='p-4 pt-0'>
                    <div className='flex flex-wrap gap-1 mt-2'>
                      {certificado.variables
                        .slice(0, 3)
                        .map((variable, index) => (
                          <span
                            key={index}
                            className='px-2 py-0.5 bg-muted rounded-md text-xs font-mono'>
                            {`{{${variable}}}`}
                          </span>
                        ))}
                      {certificado.variables.length > 3 && (
                        <span className='px-2 py-0.5 bg-muted rounded-md text-xs'>
                          +{certificado.variables.length - 3}
                        </span>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className='p-4 pt-0 flex justify-between items-center'>
                    <div className='text-xs text-muted-foreground'>
                      {certificado.usos}{" "}
                      {certificado.usos === 1 ? "uso" : "usos"}
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='h-8'
                        onClick={() => handlePreviewCertificado(certificado)}>
                        <Eye className='h-4 w-4 mr-2' />
                        Vista previa
                      </Button>
                      <Button variant='outline' size='sm' className='h-8'>
                        <Edit className='h-4 w-4 mr-2' />
                        Editar
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value='etiquetas' className='mt-6'>
          {etiquetasFiltradas.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <Tag className='h-12 w-12 text-muted-foreground mb-4' />
              <h3 className='text-xl font-medium'>
                No se encontraron etiquetas
              </h3>
              <p className='text-muted-foreground mt-1 mb-6'>
                No hay etiquetas que coincidan con los criterios de búsqueda
              </p>
              <Button onClick={() => setSearchTerm("")}>Limpiar filtros</Button>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {etiquetasFiltradas.map((etiqueta) => (
                <Card key={etiqueta.id} className='group'>
                  <CardHeader className='p-4 pb-2'>
                    <CardTitle className='text-base flex justify-between items-center'>
                      <div className='flex items-center gap-2'>
                        <Tag className='h-4 w-4 text-muted-foreground' />
                        <span className='font-mono'>{`{{${etiqueta.nombre}}}`}</span>
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity'
                        onClick={() => confirmDelete(etiqueta.id, "etiqueta")}>
                        <X className='h-4 w-4' />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='p-4 pt-2'>
                    <p className='text-sm text-muted-foreground'>
                      {etiqueta.descripcion}
                    </p>
                    {etiqueta.uso && (
                      <div className='mt-3 pt-3 border-t'>
                        <p className='text-xs text-muted-foreground'>
                          <span className='font-medium'>Uso:</span>{" "}
                          {etiqueta.uso}
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className='p-4 pt-0 flex justify-between'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='p-0 h-8 w-8'
                            onClick={() => handleCopy(etiqueta.nombre)}>
                            {copiado === etiqueta.nombre ? (
                              <CheckCircle className='h-4 w-4 text-green-500' />
                            ) : (
                              <Copy className='h-4 w-4' />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {copiado === etiqueta.nombre
                              ? "¡Copiado!"
                              : "Copiar etiqueta"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button variant='outline' size='sm'>
                      <Edit className='h-4 w-4 mr-2' />
                      Editar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
