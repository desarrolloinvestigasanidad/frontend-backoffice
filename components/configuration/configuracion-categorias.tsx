"use client";

import { useState, useEffect, FormEvent } from "react";
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
import {
  PlusCircle,
  X,
  Loader2,
  AlertTriangle,
  ChevronUp,
  Trash2, // Icono más específico para eliminar
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { Label } from "../ui/label"; // Asumo que la ruta es correcta (components/ui/label)

// 1. Tipo Categoria simplificado
type Categoria = {
  id: string;
  nombre: string;
  // descripcion: string; // Eliminada
};

const CONFIG_KEY_CATEGORIAS = "professional_categories_simple"; // Nueva clave para evitar conflictos si ya tenías datos con descripción
const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export function ConfiguracionCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [nombreNuevaCategoria, setNombreNuevaCategoria] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCategorias = async () => {
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
          `${BASE_API_URL}/config/${CONFIG_KEY_CATEGORIAS}` // Asegúrate que la ruta sea /config si config.js está en
        );
        if (response.status === 404) {
          setCategorias([]);
        } else if (response.ok) {
          const setting = await response.json();
          // Asegurarse que los datos parseados son del tipo correcto (sin descripción)
          const parsedCategorias = (
            JSON.parse(setting.value || "[]") as any[]
          ).map((cat) => ({
            id: cat.id,
            nombre: cat.nombre,
          }));
          setCategorias(parsedCategorias);
        } else {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Error al cargar las categorías del servidor."
          );
        }
      } catch (err: any) {
        console.error("Error fetching categories:", err);
        setError(err.message);
        toast.error(`Error al cargar categorías: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategorias();
  }, []);

  // Búsqueda simplificada (solo por nombre)
  const categoriasFiltradas = searchTerm
    ? categorias.filter((cat) =>
        cat.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : categorias;

  const persistCategorias = async (updatedCategorias: Categoria[]) => {
    setIsSubmitting(true);
    if (!BASE_API_URL) {
      toast.error(
        "Error de configuración: URL de API no definida para guardar."
      );
      setIsSubmitting(false);
      return false;
    }
    try {
      const response = await fetch(
        `${BASE_API_URL}/config/${CONFIG_KEY_CATEGORIAS}`, // Asegúrate que la ruta sea /config
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: JSON.stringify(updatedCategorias) }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al guardar cambios en el servidor."
        );
      }
      const result = await response.json();
      const parsedCategorias = (
        JSON.parse(result.setting.value || "[]") as any[]
      ).map((cat) => ({
        id: cat.id,
        nombre: cat.nombre,
      }));
      setCategorias(parsedCategorias);
      return true;
    } catch (err: any) {
      console.error("Error persisting categories:", err);
      toast.error(`Error al guardar: ${err.message}`);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAddForm = () => {
    setShowAddForm(!showAddForm);
    if (showAddForm) {
      setNombreNuevaCategoria("");
    }
  };

  const handleAñadirCategoria = async (e: FormEvent) => {
    e.preventDefault();
    if (!nombreNuevaCategoria.trim()) {
      toast.error("El nombre de la categoría no puede estar vacío.");
      return;
    }

    // Verificar si la categoría ya existe (sensible a mayúsculas/minúsculas)
    if (
      categorias.some(
        (cat) =>
          cat.nombre.toLowerCase() === nombreNuevaCategoria.trim().toLowerCase()
      )
    ) {
      toast.error(`La categoría "${nombreNuevaCategoria.trim()}" ya existe.`);
      return;
    }

    const nuevaCategoria: Categoria = {
      id: uuidv4(),
      nombre: nombreNuevaCategoria.trim(),
      // descripcion: "" // Eliminada
    };

    const updatedCategorias = [...categorias, nuevaCategoria];
    // Ordenar alfabéticamente después de añadir
    updatedCategorias.sort((a, b) => a.nombre.localeCompare(b.nombre));

    const success = await persistCategorias(updatedCategorias);

    if (success) {
      toast.success(
        `Categoría "${nuevaCategoria.nombre}" añadida correctamente.`
      );
      setNombreNuevaCategoria("");
      setShowAddForm(false);
    }
  };

  const handleEliminarCategoria = async (id: string) => {
    const categoriaAEliminar = categorias.find((cat) => cat.id === id);
    if (!categoriaAEliminar) return;

    if (
      !window.confirm(
        `¿Estás seguro de que quieres eliminar la categoría "${categoriaAEliminar.nombre}"?`
      )
    ) {
      return;
    }

    const updatedCategorias = categorias.filter((cat) => cat.id !== id);
    const success = await persistCategorias(updatedCategorias);

    if (success) {
      toast.success(`Categoría "${categoriaAEliminar.nombre}" eliminada.`);
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center p-10'>
        <Loader2 className='mr-2 h-8 w-8 animate-spin text-purple-600' />
        <span>Cargando categorías...</span>
      </div>
    );
  }

  if (error) {
    const errorMessage = !BASE_API_URL
      ? "Error de Configuración: La URL base de la API no está definida."
      : `Error al cargar la configuración: ${error}`;
    return (
      <div className='bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-center'>
        <AlertTriangle className='h-5 w-5 mr-2 shrink-0' />
        <span>{errorMessage}</span>
      </div>
    );
  }

  return (
    <div className='space-y-6 p-1 max-w-2xl mx-auto'>
      {" "}
      {/* Contenedor centrado y con ancho máximo */}
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4 border-b pb-4 mb-6'>
        <h2 className='text-xl font-semibold text-gray-700'>
          Gestionar Categorías
        </h2>
        <Button onClick={handleToggleAddForm} variant='outline' size='sm'>
          {showAddForm ? (
            <ChevronUp className='mr-2 h-4 w-4' />
          ) : (
            <PlusCircle className='mr-2 h-4 w-4' />
          )}
          {showAddForm ? "Cancelar" : "Nueva Categoría"}
        </Button>
      </div>
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className='overflow-hidden'>
            <Card className='mb-6 shadow-md border-gray-200'>
              <CardHeader className='bg-gray-50 py-3 px-4'>
                <CardTitle className='text-md font-medium text-gray-700'>
                  Añadir Nueva Categoría
                </CardTitle>
              </CardHeader>
              <CardContent className='pt-4 px-4 pb-5'>
                <form onSubmit={handleAñadirCategoria} className='space-y-4'>
                  <div>
                    <Label
                      htmlFor='nombre-categoria-form'
                      className='text-sm font-medium text-gray-700'>
                      Nombre de la Categoría
                    </Label>
                    <Input
                      id='nombre-categoria-form'
                      placeholder='Ej: Cardiología'
                      value={nombreNuevaCategoria}
                      onChange={(e) => setNombreNuevaCategoria(e.target.value)}
                      required
                      className='mt-1'
                    />
                  </div>
                  {/* Campo descripción eliminado */}
                  <div className='flex justify-end gap-3 pt-2'>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={handleToggleAddForm}>
                      Cerrar
                    </Button>
                    <Button type='submit' disabled={isSubmitting} size='sm'>
                      {isSubmitting && (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      )}
                      Guardar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <div className='mb-4'>
        <Input
          placeholder='Buscar categoría...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='max-w-sm text-sm'
        />
      </div>
      <Card className='shadow-sm overflow-hidden border-gray-200'>
        <CardHeader className='bg-gray-50 px-4 py-3 border-b'>
          <CardTitle className='text-md font-medium text-gray-700'>
            Listado de Categorías ({categorias.length})
          </CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='px-4 py-2.5 text-xs'>Nombre</TableHead>
                {/* Columna descripción eliminada */}
                <TableHead className='text-right px-4 py-2.5 text-xs w-[100px]'>
                  {" "}
                  {/* Ancho fijo para acciones */}
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoriasFiltradas.length > 0 ? (
                categoriasFiltradas.map((categoria) => (
                  <TableRow
                    key={categoria.id}
                    className='hover:bg-gray-50/50 dark:hover:bg-gray-800/50 text-sm'>
                    <TableCell className='font-medium px-4 py-2.5'>
                      {categoria.nombre}
                    </TableCell>
                    {/* Celda descripción eliminada */}
                    <TableCell className='text-right px-4 py-2.5'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-red-500 hover:bg-red-100 hover:text-red-600'
                        onClick={() => handleEliminarCategoria(categoria.id)}
                        disabled={isSubmitting}
                        title='Eliminar categoría'>
                        <Trash2 className='h-4 w-4' />
                        <span className='sr-only'>Eliminar</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={2} // Ajustado a 2 columnas
                    className='text-center h-24 text-sm text-gray-500'>
                    {isLoading
                      ? "Cargando..."
                      : searchTerm
                      ? "No se encontraron categorías."
                      : "No hay categorías. Añade una para empezar."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
