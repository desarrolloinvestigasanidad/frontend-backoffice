"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"; // Para seleccionar bloques
import {
  PlusCircle,
  Edit3, // Icono para editar
  Trash2,
  Loader2,
  AlertTriangle,
  ListChecks, // Icono para la sección de bloques
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion"; // Opcional, si ya lo usas para modales

// 1. Definición de los bloques de estudio disponibles
type BloqueEstudioDisponible = {
  id: string; // ej: "introduccion", "objetivos"
  nombre: string; // ej: "Introducción", "Objetivos"
  descripcionCorta?: string; // Opcional, para tooltips o ayudas
};

export const BLOQUES_ESTUDIO_POR_DEFECTO: ReadonlyArray<BloqueEstudioDisponible> =
  [
    { id: "introduccion", nombre: "Introducción" },
    { id: "objetivos", nombre: "Objetivos" },
    { id: "justificacion", nombre: "Justificación del Tema" },
    { id: "metodologia", nombre: "Metodología" },
    { id: "caso_clinico", nombre: "Caso Clínico" },
    { id: "resultados", nombre: "Resultados" },
    { id: "discusion_conclusion", nombre: "Discusión/Conclusión" },
    { id: "bibliografia", nombre: "Bibliografía" },
  ] as const;

// 2. Tipo de dato para un Tipo de Estudio
type TipoEstudio = {
  id: string; // UUID
  nombre: string;
  descripcion: string;
  bloques: string[]; // Array de IDs de los bloques seleccionados (ej: ["introduccion", "metodologia"])
};

// Estado inicial para el formulario de bloques
const initialBloquesFormState = BLOQUES_ESTUDIO_POR_DEFECTO.reduce(
  (acc, bloque) => {
    acc[bloque.id] = false;
    return acc;
  },
  {} as Record<string, boolean>
);

const CONFIG_KEY_TIPOS_ESTUDIO = "study_type_definitions"; // Clave para la BBDD
const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export function ConfiguracionTiposEstudio() {
  const [tiposEstudio, setTiposEstudio] = useState<TipoEstudio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showFormDialog, setShowFormDialog] = useState(false);
  const [editingTipoEstudio, setEditingTipoEstudio] =
    useState<TipoEstudio | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" });
  const [selectedBloquesForm, setSelectedBloquesForm] = useState<
    Record<string, boolean>
  >(initialBloquesFormState);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTiposEstudio = async () => {
      setIsLoading(true);
      setError(null);
      if (!BASE_API_URL) {
        setError("La URL base de la API no está configurada.");
        setIsLoading(false);
        toast.error("Error de configuración: URL de API no definida.");
        return;
      }
      try {
        const response = await fetch(
          `${BASE_API_URL}/config/${CONFIG_KEY_TIPOS_ESTUDIO}`
        );
        if (response.status === 404) {
          setTiposEstudio([]);
        } else if (response.ok) {
          const setting = await response.json();
          const parsedData = (JSON.parse(setting.value || "[]") as any[]).map(
            (item) => ({
              id: item.id || uuidv4(),
              nombre: item.nombre || "",
              descripcion: item.descripcion || "",
              bloques: Array.isArray(item.bloques) ? item.bloques : [], // Asegurar que sea un array
            })
          );
          setTiposEstudio(parsedData);
        } else {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Error al cargar los tipos de estudio."
          );
        }
      } catch (err: any) {
        console.error("Error fetching study types:", err);
        setError(err.message);
        toast.error(`Error al cargar tipos de estudio: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTiposEstudio();
  }, []);

  const tiposFiltrados = searchTerm
    ? tiposEstudio.filter(
        (tipo) =>
          tipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tipo.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : tiposEstudio;

  const persistTiposEstudio = async (updatedTipos: TipoEstudio[]) => {
    setIsSubmitting(true);
    // Ordenar alfabéticamente por nombre antes de guardar
    updatedTipos.sort((a, b) => a.nombre.localeCompare(b.nombre));
    try {
      const response = await fetch(
        `${BASE_API_URL}/config/${CONFIG_KEY_TIPOS_ESTUDIO}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: JSON.stringify(updatedTipos) }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar los cambios.");
      }
      const result = await response.json();
      const parsedData = (
        JSON.parse(result.setting.value || "[]") as any[]
      ).map((item) => ({
        id: item.id,
        nombre: item.nombre,
        descripcion: item.descripcion,
        bloques: item.bloques,
      }));
      setTiposEstudio(parsedData);
      return true;
    } catch (err: any) {
      console.error("Error persisting study types:", err);
      toast.error(`Error al guardar: ${err.message}`);
      setError(err.message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenFormDialog = (tipoEstudio: TipoEstudio | null = null) => {
    setEditingTipoEstudio(tipoEstudio);
    if (tipoEstudio) {
      setFormData({
        nombre: tipoEstudio.nombre,
        descripcion: tipoEstudio.descripcion,
      });
      // Reconstruir el estado de los checkboxes
      const bloquesParaForm = BLOQUES_ESTUDIO_POR_DEFECTO.reduce(
        (acc, bloqueDef) => {
          acc[bloqueDef.id] = tipoEstudio.bloques.includes(bloqueDef.id);
          return acc;
        },
        {} as Record<string, boolean>
      );
      setSelectedBloquesForm(bloquesParaForm);
    } else {
      setFormData({ nombre: "", descripcion: "" });
      setSelectedBloquesForm(initialBloquesFormState);
    }
    setShowFormDialog(true);
  };

  const handleGuardarTipoEstudio = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      toast.error("El nombre del tipo de estudio no puede estar vacío.");
      return;
    }

    const bloquesActivos = Object.entries(selectedBloquesForm)
      .filter(([_, isSelected]) => isSelected)
      .map(([bloqueId, _]) => bloqueId);

    if (bloquesActivos.length === 0) {
      toast.error("Seleccionar al menos un bloque para el tipo de estudio.");
      // Podrías decidir si permitir guardar sin bloques o no. Por ahora, se permite.
    }

    let updatedTipos: TipoEstudio[];
    const nombreExistente = tiposEstudio.some(
      (te) =>
        te.nombre.toLowerCase() === formData.nombre.trim().toLowerCase() &&
        te.id !== editingTipoEstudio?.id
    );

    if (nombreExistente) {
      toast.error(
        `El tipo de estudio con el nombre "${formData.nombre.trim()}" ya existe.`
      );
      return;
    }

    if (editingTipoEstudio) {
      // Editando existente
      updatedTipos = tiposEstudio.map((te) =>
        te.id === editingTipoEstudio.id
          ? { ...te, ...formData, bloques: bloquesActivos }
          : te
      );
    } else {
      // Creando nuevo
      const nuevoTipo: TipoEstudio = {
        id: uuidv4(),
        ...formData,
        bloques: bloquesActivos,
      };
      updatedTipos = [...tiposEstudio, nuevoTipo];
    }

    const success = await persistTiposEstudio(updatedTipos);
    if (success) {
      toast.success(
        `Tipo de estudio "${formData.nombre.trim()}" ${
          editingTipoEstudio ? "actualizado" : "añadido"
        } correctamente.`
      );
      setShowFormDialog(false);
    }
  };

  const handleEliminarTipoEstudio = async (id: string) => {
    const tipoAEliminar = tiposEstudio.find((te) => te.id === id);
    if (!tipoAEliminar) return;

    if (
      !window.confirm(
        `¿Estás seguro de que quieres eliminar el tipo de estudio "${tipoAEliminar.nombre}"?`
      )
    ) {
      return;
    }
    const updatedTipos = tiposEstudio.filter((te) => te.id !== id);
    const success = await persistTiposEstudio(updatedTipos);
    if (success) {
      toast.success(`Tipo de estudio "${tipoAEliminar.nombre}" eliminado.`);
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center p-10'>
        <Loader2 className='mr-2 h-8 w-8 animate-spin text-purple-600' />
        <span>Cargando tipos de estudio...</span>
      </div>
    );
  }

  if (error && !isSubmitting) {
    return (
      <div className='bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-center'>
        <AlertTriangle className='h-5 w-5 mr-2 shrink-0' />
        <span>Error al cargar: {error}</span>
      </div>
    );
  }

  return (
    <div className='space-y-6 p-1 max-w-4xl mx-auto'>
      {" "}
      {/* Aumentado max-w */}
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4 border-b pb-4 mb-6'>
        <h2 className='text-xl font-semibold text-gray-700'>
          Configuración de Tipos de Estudio
        </h2>
        <Button onClick={() => handleOpenFormDialog(null)} size='sm'>
          <PlusCircle className='mr-2 h-4 w-4' />
          Nuevo Tipo de Estudio
        </Button>
      </div>
      <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
        <DialogContent className='sm:max-w-lg max-h-[90vh] flex flex-col z-[110]'>
          <DialogHeader>
            <DialogTitle>
              {editingTipoEstudio ? "Editar" : "Añadir Nuevo"} Tipo de Estudio
            </DialogTitle>
            <DialogDescription>
              Define un nombre, descripción y los bloques que compondrán este
              tipo de estudio.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleGuardarTipoEstudio}
            className='flex-grow overflow-y-auto space-y-4 pr-2'>
            <div>
              <Label
                htmlFor='nombre-tipo-estudio'
                className='text-sm font-medium'>
                Nombre del Tipo de Estudio{" "}
                <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='nombre-tipo-estudio'
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                placeholder='Ej: Artículo Original, Caso Clínico Revisado'
                required
                className='mt-1'
              />
            </div>
            <div>
              <Label
                htmlFor='descripcion-tipo-estudio'
                className='text-sm font-medium'>
                Descripción (Opcional)
              </Label>
              <Textarea
                id='descripcion-tipo-estudio'
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                placeholder='Breve descripción del propósito o estructura de este tipo de estudio.'
                className='mt-1'
                rows={3}
              />
            </div>

            <div className='space-y-2 pt-2'>
              <Label className='text-sm font-medium flex items-center'>
                <ListChecks className='mr-2 h-5 w-5 text-purple-600' />
                Bloques del Estudio
              </Label>
              <p className='text-xs text-gray-500'>
                Selecciona los apartados que conformarán este tipo de estudio.
              </p>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 p-3 border rounded-md max-h-60 overflow-y-auto bg-gray-50/50'>
                {BLOQUES_ESTUDIO_POR_DEFECTO.map((bloque) => (
                  <div key={bloque.id} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`bloque-${bloque.id}`}
                      checked={selectedBloquesForm[bloque.id] || false}
                      onCheckedChange={(checked) => {
                        setSelectedBloquesForm((prev) => ({
                          ...prev,
                          [bloque.id]: Boolean(checked),
                        }));
                      }}
                    />
                    <Label
                      htmlFor={`bloque-${bloque.id}`}
                      className='text-sm font-normal cursor-pointer'>
                      {bloque.nombre}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </form>
          <DialogFooter className='mt-auto pt-4 border-t'>
            <DialogClose asChild>
              <Button variant='outline' type='button'>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type='submit'
              form='form-tipo-estudio'
              onClick={handleGuardarTipoEstudio}
              disabled={isSubmitting}>
              {" "}
              {/* Asociar con el ID del form si no está anidado directamente */}
              {isSubmitting && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              {editingTipoEstudio ? "Guardar Cambios" : "Crear Tipo de Estudio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className='mb-4'>
        <Input
          placeholder='Buscar por nombre o descripción...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='max-w-sm text-sm'
        />
      </div>
      <Card className='shadow-sm overflow-hidden border-gray-200'>
        <CardHeader className='bg-gray-50 px-4 py-3 border-b'>
          <CardTitle className='text-md font-medium text-gray-700'>
            Listado de Tipos de Estudio ({tiposFiltrados.length})
          </CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='px-4 py-2.5 text-xs w-[25%]'>
                  Nombre
                </TableHead>
                <TableHead className='px-4 py-2.5 text-xs w-[35%]'>
                  Descripción
                </TableHead>
                <TableHead className='px-4 py-2.5 text-xs'>
                  Bloques Asociados
                </TableHead>
                <TableHead className='text-right px-4 py-2.5 text-xs w-[120px]'>
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tiposFiltrados.length > 0 ? (
                tiposFiltrados.map((tipo) => (
                  <TableRow
                    key={tipo.id}
                    className='hover:bg-gray-50/50 dark:hover:bg-gray-800/50 text-sm'>
                    <TableCell className='font-medium px-4 py-2.5'>
                      {tipo.nombre}
                    </TableCell>
                    <TableCell className='px-4 py-2.5 text-xs text-gray-600'>
                      {tipo.descripcion || (
                        <span className='text-gray-400'>-</span>
                      )}
                    </TableCell>
                    <TableCell className='px-4 py-2.5'>
                      {tipo.bloques.length > 0 ? (
                        <div className='flex flex-wrap gap-1'>
                          {tipo.bloques.map((bloqueId) => {
                            const bloqueInfo = BLOQUES_ESTUDIO_POR_DEFECTO.find(
                              (b) => b.id === bloqueId
                            );
                            return (
                              <span
                                key={bloqueId}
                                className='text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full'>
                                {bloqueInfo?.nombre || bloqueId}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <span className='text-xs text-gray-400'>Ninguno</span>
                      )}
                    </TableCell>
                    <TableCell className='text-right px-4 py-2.5'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 hover:text-blue-600 hover:bg-blue-100'
                        title='Editar tipo de estudio'
                        onClick={() => handleOpenFormDialog(tipo)}>
                        <Edit3 className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-red-500 hover:bg-red-100 hover:text-red-600'
                        title='Eliminar tipo de estudio'
                        onClick={() => handleEliminarTipoEstudio(tipo.id)}
                        disabled={isSubmitting}>
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className='text-center h-24 text-sm text-gray-500'>
                    {searchTerm
                      ? "No se encontraron tipos de estudio."
                      : "No hay tipos de estudio definidos."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className='flex flex-col sm:flex-row justify-between items-center border-t p-4 gap-2'>
          <div className='text-xs text-muted-foreground'>
            Total de tipos de estudio: {tiposEstudio.length}.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
