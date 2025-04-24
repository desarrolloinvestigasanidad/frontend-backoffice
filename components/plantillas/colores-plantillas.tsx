"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  PlusCircle,
  Edit,
  Copy,
  CheckCircle,
  Search,
  Trash,
} from "lucide-react";
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
const coloresEjemplo = [
  {
    id: 1,
    nombre: "Primario",
    valor: "#0f766e",
    descripcion: "Color principal de la marca",
    usos: ["Botones principales", "Enlaces", "Cabecera"],
  },
  {
    id: 2,
    nombre: "Secundario",
    valor: "#7e22ce",
    descripcion: "Color secundario para acentos",
    usos: ["Botones secundarios", "Iconos", "Badges"],
  },
  {
    id: 3,
    nombre: "Fondo",
    valor: "#f8fafc",
    descripcion: "Color de fondo de la plataforma",
    usos: ["Fondo general", "Tarjetas"],
  },
  {
    id: 4,
    nombre: "Texto",
    valor: "#1e293b",
    descripcion: "Color principal para textos",
    usos: ["Textos generales", "Títulos"],
  },
  {
    id: 5,
    nombre: "Éxito",
    valor: "#16a34a",
    descripcion: "Color para mensajes de éxito",
    usos: ["Alertas de éxito", "Indicadores positivos"],
  },
  {
    id: 6,
    nombre: "Error",
    valor: "#dc2626",
    descripcion: "Color para mensajes de error",
    usos: ["Alertas de error", "Indicadores negativos"],
  },
  {
    id: 7,
    nombre: "Información",
    valor: "#2563eb",
    descripcion: "Color para mensajes informativos",
    usos: ["Alertas informativas", "Tooltips"],
  },
  {
    id: 8,
    nombre: "Advertencia",
    valor: "#f59e0b",
    descripcion: "Color para mensajes de advertencia",
    usos: ["Alertas de advertencia", "Avisos"],
  },
];

export function ColoresPlantillas() {
  const [colores, setColores] = useState(coloresEjemplo);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [colorActual, setColorActual] = useState<
    (typeof coloresEjemplo)[0] | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiado, setCopiado] = useState<number | null>(null);
  const [colorValue, setColorValue] = useState("#000000");
  const [colorHexValue, setColorHexValue] = useState("#000000");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [colorToDelete, setColorToDelete] = useState<number | null>(null);

  const inputColorRef = useRef<HTMLInputElement>(null);

  const coloresFiltrados = searchTerm
    ? colores.filter(
        (color) =>
          color.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          color.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : colores;

  const handleEliminarColor = (id: number) => {
    setColores(colores.filter((color) => color.id !== id));
  };

  const handleCopiarColor = (valor: string, id: number) => {
    navigator.clipboard.writeText(valor);
    setCopiado(id);
    setTimeout(() => setCopiado(null), 2000);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setColorValue(value);
    setColorHexValue(value);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setColorHexValue(value);
    if (/^#([0-9A-F]{3}){1,2}$/i.test(value)) {
      setColorValue(value);
    }
  };

  const openEditDialog = (color: (typeof coloresEjemplo)[0]) => {
    setColorActual(color);
    setColorValue(color.valor);
    setColorHexValue(color.valor);
    setEditDialogOpen(true);
  };

  const confirmDelete = (id: number) => {
    setColorToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleFinalDelete = () => {
    if (colorToDelete !== null) {
      handleEliminarColor(colorToDelete);
      setDeleteDialogOpen(false);
      setColorToDelete(null);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h2 className='text-2xl font-bold'>Paleta de colores</h2>
          <p className='text-muted-foreground mt-1'>
            Gestiona los colores utilizados en la plataforma
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className='shrink-0'>
              <PlusCircle className='mr-2 h-4 w-4' />
              Añadir color
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[500px]'>
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
                <Input
                  id='nombre'
                  placeholder='Ej: Primario'
                  className='col-span-3'
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='color' className='text-right'>
                  Color
                </Label>
                <div className='col-span-3 flex gap-2'>
                  <div className='relative'>
                    <Input
                      ref={inputColorRef}
                      id='color'
                      type='color'
                      className='w-16 h-10 p-1 cursor-pointer'
                      value={colorValue}
                      onChange={handleColorChange}
                    />
                    <div
                      className='absolute inset-0 opacity-0'
                      onClick={() => inputColorRef.current?.click()}
                    />
                  </div>
                  <Input
                    id='colorHex'
                    placeholder='#000000'
                    className='flex-1'
                    value={colorHexValue}
                    onChange={handleHexChange}
                  />
                </div>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='descripcion' className='text-right'>
                  Descripción
                </Label>
                <Input
                  id='descripcion'
                  placeholder='Ej: Color principal de la marca'
                  className='col-span-3'
                />
              </div>
              <div className='grid grid-cols-4 items-start gap-4'>
                <Label htmlFor='usos' className='text-right pt-2'>
                  Usos
                </Label>
                <div className='col-span-3'>
                  <Input
                    id='usos'
                    placeholder='Ej: Botones, Enlaces, Iconos'
                    className='col-span-3'
                  />
                  <p className='text-xs text-muted-foreground mt-1'>
                    Introduce los usos separados por comas.
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant='outline' onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type='submit' onClick={() => setDialogOpen(false)}>
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de edición */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className='sm:max-w-[500px]'>
            <DialogHeader>
              <DialogTitle>Editar color</DialogTitle>
              <DialogDescription>
                Modifica las propiedades del color seleccionado.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='edit-nombre' className='text-right'>
                  Nombre
                </Label>
                <Input
                  id='edit-nombre'
                  defaultValue={colorActual?.nombre}
                  className='col-span-3'
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='edit-color' className='text-right'>
                  Color
                </Label>
                <div className='col-span-3 flex gap-2'>
                  <Input
                    id='edit-color'
                    type='color'
                    className='w-16 h-10 p-1'
                    value={colorValue}
                    onChange={handleColorChange}
                  />
                  <Input
                    id='edit-colorHex'
                    placeholder='#000000'
                    className='flex-1'
                    value={colorHexValue}
                    onChange={handleHexChange}
                  />
                </div>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='edit-descripcion' className='text-right'>
                  Descripción
                </Label>
                <Input
                  id='edit-descripcion'
                  defaultValue={colorActual?.descripcion}
                  className='col-span-3'
                />
              </div>
              <div className='grid grid-cols-4 items-start gap-4'>
                <Label htmlFor='edit-usos' className='text-right pt-2'>
                  Usos
                </Label>
                <div className='col-span-3'>
                  <Input
                    id='edit-usos'
                    defaultValue={colorActual?.usos.join(", ")}
                    className='col-span-3'
                  />
                  <p className='text-xs text-muted-foreground mt-1'>
                    Introduce los usos separados por comas.
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type='submit' onClick={() => setEditDialogOpen(false)}>
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de confirmación de eliminación */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. El color será eliminado
                permanentemente de la paleta de colores.
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
      </div>

      <div className='relative'>
        <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Buscar colores...'
          className='pl-10'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {coloresFiltrados.map((color) => (
          <Card key={color.id} className='overflow-hidden'>
            <div className='h-2' style={{ backgroundColor: color.valor }} />
            <CardHeader className='p-4 pb-2'>
              <CardTitle className='text-lg flex justify-between items-center'>
                <span>{color.nombre}</span>
                <div className='flex'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8'
                          onClick={() => openEditDialog(color)}>
                          <Edit className='h-4 w-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Editar color</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 text-destructive'
                          onClick={() => confirmDelete(color.id)}>
                          <Trash className='h-4 w-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Eliminar color</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className='p-4'>
              <div className='flex items-center gap-4'>
                <div
                  className='w-16 h-16 rounded-md border'
                  style={{ backgroundColor: color.valor }}
                />
                <div>
                  <div
                    className='font-mono text-sm flex items-center gap-2 cursor-pointer'
                    onClick={() => handleCopiarColor(color.valor, color.id)}>
                    {color.valor}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className='text-muted-foreground hover:text-foreground transition-colors'>
                            {copiado === color.id ? (
                              <CheckCircle className='h-4 w-4 text-green-500' />
                            ) : (
                              <Copy className='h-4 w-4' />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {copiado === color.id
                              ? "¡Copiado!"
                              : "Copiar código de color"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className='text-sm text-muted-foreground mt-1'>
                    {color.descripcion}
                  </div>
                </div>
              </div>
              {color.usos && color.usos.length > 0 && (
                <div className='mt-3 border-t pt-3'>
                  <p className='text-xs font-medium mb-1'>Usos recomendados:</p>
                  <div className='flex flex-wrap gap-1'>
                    {color.usos.map((uso, idx) => (
                      <span
                        key={idx}
                        className='text-xs px-2 py-0.5 bg-muted rounded-full'>
                        {uso}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
