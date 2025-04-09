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
import { PlusCircle, X, Edit, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Datos de ejemplo
const certificadosEjemplo = [
  {
    id: 1,
    nombre: "Certificado de participación",
    comunidad: "Todas",
    plantilla: "/elegant-achievement-certificate.png",
    variables: ["nombre", "titulo_libro", "fecha", "horas", "firma_director"],
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
  },
  {
    id: 3,
    nombre: "Diploma de reconocimiento",
    comunidad: "Andalucía",
    plantilla: "/elegant-diploma.png",
    variables: ["nombre", "titulo_libro", "fecha", "firma_director"],
  },
];

// Datos de ejemplo para etiquetas
const etiquetasEjemplo = [
  { id: 1, nombre: "nombre", descripcion: "Nombre completo del autor" },
  { id: 2, nombre: "titulo_libro", descripcion: "Título del libro" },
  { id: 3, nombre: "titulo_capitulo", descripcion: "Título del capítulo" },
  { id: 4, nombre: "fecha", descripcion: "Fecha de emisión del certificado" },
  { id: 5, nombre: "horas", descripcion: "Horas de participación" },
  { id: 6, nombre: "isbn", descripcion: "ISBN del libro" },
  { id: 7, nombre: "firma_director", descripcion: "Firma del director" },
];

export function CertificadosPlantillas() {
  const [certificados, setCertificados] = useState(certificadosEjemplo);
  const [etiquetas, setEtiquetas] = useState(etiquetasEjemplo);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [etiquetaDialogOpen, setEtiquetaDialogOpen] = useState(false);
  const [selectedCertificado, setSelectedCertificado] = useState<
    (typeof certificadosEjemplo)[0] | null
  >(null);
  const [activeTab, setActiveTab] = useState("certificados");

  const handleEliminarCertificado = (id: number) => {
    setCertificados(certificados.filter((cert) => cert.id !== id));
    if (selectedCertificado?.id === id) {
      setSelectedCertificado(null);
    }
  };

  const handleEliminarEtiqueta = (id: number) => {
    setEtiquetas(etiquetas.filter((etq) => etq.id !== id));
  };

  return (
    <div className='space-y-6'>
      <Tabs
        defaultValue='certificados'
        value={activeTab}
        onValueChange={setActiveTab}>
        <div className='flex justify-between items-center'>
          <TabsList>
            <TabsTrigger value='certificados'>Certificados</TabsTrigger>
            <TabsTrigger value='etiquetas'>Etiquetas</TabsTrigger>
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
                          className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 hover:bg-gray-100'>
                          <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                            <PlusCircle className='w-8 h-8 mb-2 text-gray-500' />
                            <p className='mb-2 text-sm text-gray-500'>
                              <span className='font-semibold'>
                                Haz clic para subir
                              </span>{" "}
                              o arrastra y suelta
                            </p>
                            <p className='text-xs text-gray-500'>
                              PDF, PNG o JPG
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
                  <div className='grid grid-cols-4 items-start gap-4'>
                    <Label htmlFor='variables' className='text-right pt-2'>
                      Variables
                    </Label>
                    <div className='col-span-3 space-y-2'>
                      <div className='flex flex-wrap gap-2'>
                        {etiquetas.map((etiqueta) => (
                          <label
                            key={etiqueta.id}
                            className='flex items-center space-x-2'>
                            <input
                              type='checkbox'
                              className='rounded border-gray-300'
                            />
                            <span className='text-sm'>{etiqueta.nombre}</span>
                          </label>
                        ))}
                      </div>
                      <p className='text-xs text-muted-foreground'>
                        Selecciona las variables que se utilizarán en este
                        certificado.
                      </p>
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
              <DialogContent className='sm:max-w-[425px]'>
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
                </div>
                <DialogFooter>
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

        <TabsContent value='certificados' className='mt-6'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-1 space-y-4'>
              {certificados.map((certificado) => (
                <Card
                  key={certificado.id}
                  className={`cursor-pointer transition-colors ${
                    selectedCertificado?.id === certificado.id
                      ? "border-primary"
                      : ""
                  }`}
                  onClick={() => setSelectedCertificado(certificado)}>
                  <CardHeader className='p-4 pb-2'>
                    <CardTitle className='text-lg flex justify-between items-center'>
                      <span>{certificado.nombre}</span>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-destructive'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEliminarCertificado(certificado.id);
                        }}>
                        <X className='h-4 w-4' />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='p-4 pt-0'>
                    <div className='flex items-center'>
                      <span className='text-xs px-2 py-0.5 bg-muted rounded-full'>
                        {certificado.comunidad}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className='lg:col-span-2'>
              {selectedCertificado ? (
                <Card>
                  <CardHeader className='p-4 pb-2'>
                    <CardTitle className='text-lg flex justify-between items-center'>
                      <span>{selectedCertificado.nombre}</span>
                      <div className='flex gap-2'>
                        <Button variant='outline' size='sm'>
                          <Eye className='h-4 w-4 mr-2' />
                          Vista previa
                        </Button>
                        <Button variant='outline' size='sm'>
                          <Edit className='h-4 w-4 mr-2' />
                          Editar
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='p-4 space-y-4'>
                    <div className='relative h-[300px] w-full border rounded-md overflow-hidden'>
                      <Image
                        src={
                          selectedCertificado.plantilla || "/placeholder.svg"
                        }
                        alt={selectedCertificado.nombre}
                        fill
                        className='object-contain'
                      />
                    </div>
                    <div>
                      <h3 className='text-sm font-medium mb-2'>
                        Variables utilizadas:
                      </h3>
                      <div className='flex flex-wrap gap-2'>
                        {selectedCertificado.variables.map(
                          (variable, index) => (
                            <span
                              key={index}
                              className='px-2 py-1 bg-muted rounded-md text-xs'>
                              {variable}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className='p-4 pt-0 flex justify-between'>
                    <div className='text-sm text-muted-foreground'>
                      Comunidad:{" "}
                      <span className='font-medium'>
                        {selectedCertificado.comunidad}
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
                    Selecciona un certificado para ver su contenido
                  </p>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value='etiquetas' className='mt-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {etiquetas.map((etiqueta) => (
              <Card key={etiqueta.id}>
                <CardHeader className='p-4 pb-2'>
                  <CardTitle className='text-lg flex justify-between items-center'>
                    <span className='font-mono text-base'>{`{{${etiqueta.nombre}}}`}</span>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 text-destructive'
                      onClick={() => handleEliminarEtiqueta(etiqueta.id)}>
                      <X className='h-4 w-4' />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className='p-4 pt-2'>
                  <p className='text-sm text-muted-foreground'>
                    {etiqueta.descripcion}
                  </p>
                </CardContent>
                <CardFooter className='p-4 pt-0 flex justify-end'>
                  <Button variant='outline' size='sm'>
                    Editar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
