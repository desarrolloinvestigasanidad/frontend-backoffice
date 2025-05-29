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
  Trash2,
  Loader2,
  AlertTriangle,
  ChevronUp,
  FileText,
  // Edit, // Puedes añadirlo si implementas la edición
  // X as XIcon, // Alternativa a Trash2
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// 1. Tipo de dato para un ISBN en la BBDD
type ISBNEntry = {
  id: string; // UUID único para cada entrada de ISBN
  valor: string; // El número ISBN en sí
  notas?: string; // Notas adicionales opcionales
  // El estado "Disponible" o "Asignado" y a qué libro se asigna,
  // idealmente se manejaría en otra entidad o se determinaría en tiempo de ejecución.
  // Por ahora, esta lista es solo el inventario de ISBNs que posees.
};

const CONFIG_KEY_ISBN_LIST = "isbn_inventory_list"; // Clave única para almacenar la lista de ISBNs
const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export function ConfiguracionISBN() {
  const [isbns, setIsbns] = useState<ISBNEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [valorNuevoISBN, setValorNuevoISBN] = useState("");
  const [notasNuevoISBN, setNotasNuevoISBN] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  // Estado para el diálogo de importación (UI solamente por ahora)
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  useEffect(() => {
    const fetchIsbns = async () => {
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
          `${BASE_API_URL}/config/${CONFIG_KEY_ISBN_LIST}`
        );
        if (response.status === 404) {
          setIsbns([]); // No existe la configuración, lista vacía
        } else if (response.ok) {
          const setting = await response.json();
          // Asegurar que los datos parseados son del tipo correcto
          const parsedIsbns = (JSON.parse(setting.value || "[]") as any[]).map(
            (item) => ({
              id: item.id || uuidv4(), // Asegurar ID si falta por alguna razón
              valor: item.valor,
              notas: item.notas || "", // Asegurar que notas exista
            })
          );
          setIsbns(parsedIsbns);
        } else {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Error al cargar los ISBNs del servidor."
          );
        }
      } catch (err: any) {
        console.error("Error fetching ISBNs:", err);
        setError(err.message);
        toast.error(`Error al cargar ISBNs: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIsbns();
  }, []);

  const isbnsFiltrados = searchTerm
    ? isbns.filter(
        (item) =>
          item.valor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.notas &&
            item.notas.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : isbns;

  const persistIsbns = async (updatedIsbns: ISBNEntry[]) => {
    setIsSubmitting(true);
    if (!BASE_API_URL) {
      toast.error(
        "Error de configuración: URL de API no definida para guardar."
      );
      setIsSubmitting(false);
      return false;
    }
    try {
      // Ordenar antes de guardar para mantener un orden consistente
      updatedIsbns.sort((a, b) => a.valor.localeCompare(b.valor));

      const response = await fetch(
        `${BASE_API_URL}/config/${CONFIG_KEY_ISBN_LIST}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: JSON.stringify(updatedIsbns) }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al guardar cambios en el servidor."
        );
      }
      const result = await response.json();
      const parsedIsbns = (
        JSON.parse(result.setting.value || "[]") as any[]
      ).map((item) => ({
        id: item.id,
        valor: item.valor,
        notas: item.notas,
      }));
      setIsbns(parsedIsbns);
      return true;
    } catch (err: any) {
      console.error("Error persisting ISBNs:", err);
      toast.error(`Error al guardar: ${err.message}`);
      setError(err.message); // Podrías mostrar este error también en la UI si es persistente
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAddForm = () => {
    setShowAddForm(!showAddForm);
    if (showAddForm) {
      // Limpiar formulario al cerrar
      setValorNuevoISBN("");
      setNotasNuevoISBN("");
    }
  };

  const handleAñadirISBN = async (e: FormEvent) => {
    e.preventDefault();
    const trimedValor = valorNuevoISBN.trim();
    if (!trimedValor) {
      toast.error("El número ISBN no puede estar vacío.");
      return;
    }

    // Validación básica de duplicados (sensible a mayúsculas/minúsculas para el ISBN)
    if (isbns.some((isbn) => isbn.valor === trimedValor)) {
      toast.error(`El ISBN "${trimedValor}" ya existe en la lista.`);
      return;
    }
    // Podrías añadir una validación más estricta del formato ISBN aquí si es necesario.

    const nuevoISBN: ISBNEntry = {
      id: uuidv4(),
      valor: trimedValor,
      notas: notasNuevoISBN.trim(),
    };

    const updatedIsbns = [...isbns, nuevoISBN];
    const success = await persistIsbns(updatedIsbns);

    if (success) {
      toast.success(`ISBN "${nuevoISBN.valor}" añadido correctamente.`);
      setValorNuevoISBN("");
      setNotasNuevoISBN("");
      setShowAddForm(false); // Ocultar formulario tras éxito
    }
  };

  const handleEliminarISBN = async (id: string) => {
    const isbnAEliminar = isbns.find((isbn) => isbn.id === id);
    if (!isbnAEliminar) return;

    // Idealmente, aquí verificarías si el ISBN está asignado a un libro antes de permitir la eliminación.
    // Por ahora, una simple confirmación.
    if (
      !window.confirm(
        `¿Estás seguro de que quieres eliminar el ISBN "${isbnAEliminar.valor}"? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    const updatedIsbns = isbns.filter((isbn) => isbn.id !== id);
    const success = await persistIsbns(updatedIsbns);

    if (success) {
      toast.success(`ISBN "${isbnAEliminar.valor}" eliminado.`);
    }
  };

  // Contadores:
  // "Total" es fácil. "Disponibles" y "Asignados" requerirían lógica adicional
  // o datos de otra fuente para saber qué ISBNs están realmente en uso.
  // Por ahora, simplificamos:
  const totalIsbnsRegistrados = isbns.length;
  // const isbnsDisponibles = isbns.filter(isbn => !isbn.asignadoA).length; // Ejemplo si tuvieras 'asignadoA'
  // const isbnsAsignados = totalIsbnsRegistrados - isbnsDisponibles;

  if (isLoading) {
    return (
      <div className='flex justify-center items-center p-10'>
        <Loader2 className='mr-2 h-8 w-8 animate-spin text-purple-600' />
        <span>Cargando configuración de ISBNs...</span>
      </div>
    );
  }

  if (error && !isSubmitting) {
    // No mostrar error de fetch si estamos intentando enviar
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
    <div className='space-y-6 p-1 max-w-3xl mx-auto'>
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4 border-b pb-4 mb-6'>
        <h2 className='text-xl font-semibold text-gray-700'>
          Gestión de Inventario ISBN
        </h2>
        <div className='flex gap-2 flex-wrap'>
          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant='outline' size='sm'>
                <FileText className='mr-2 h-4 w-4' />
                Importar ISBNs
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle>Importar Lote de ISBNs</DialogTitle>
                <DialogDescription>
                  Sube un archivo (CSV o TXT) con un ISBN por línea. Esta
                  funcionalidad aún no está implementada.
                </DialogDescription>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='archivo-isbn-import' className='text-right'>
                    Archivo
                  </Label>
                  <Input
                    id='archivo-isbn-import'
                    type='file'
                    className='col-span-3'
                    disabled // Deshabilitado hasta implementar
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type='button'
                  onClick={() => {
                    setImportDialogOpen(false);
                    toast.info("La importación masiva aún no está disponible.");
                  }}
                  disabled // Deshabilitado hasta implementar
                >
                  Procesar Importación
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button onClick={handleToggleAddForm} variant='default' size='sm'>
            {showAddForm ? (
              <ChevronUp className='mr-2 h-4 w-4' />
            ) : (
              <PlusCircle className='mr-2 h-4 w-4' />
            )}
            {showAddForm ? "Cancelar Nuevo" : "Añadir ISBN"}
          </Button>
        </div>
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
                  Añadir Nuevo ISBN al Inventario
                </CardTitle>
              </CardHeader>
              <CardContent className='pt-4 px-4 pb-5'>
                <form onSubmit={handleAñadirISBN} className='space-y-4'>
                  <div>
                    <Label
                      htmlFor='valor-isbn-form'
                      className='text-sm font-medium text-gray-700'>
                      Número ISBN <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='valor-isbn-form'
                      placeholder='Ej: 978-3-16-148410-0'
                      value={valorNuevoISBN}
                      onChange={(e) => setValorNuevoISBN(e.target.value)}
                      required
                      className='mt-1'
                      aria-describedby='isbn-format-hint'
                    />
                    <p
                      id='isbn-format-hint'
                      className='text-xs text-gray-500 mt-1'>
                      Introduce el ISBN completo.
                    </p>
                  </div>
                  <div>
                    <Label
                      htmlFor='notas-isbn-form'
                      className='text-sm font-medium text-gray-700'>
                      Notas Adicionales (Opcional)
                    </Label>
                    <Textarea
                      id='notas-isbn-form'
                      placeholder='Ej: Lote adquirido en Enero 2024, reservado para monografías...'
                      value={notasNuevoISBN}
                      onChange={(e) => setNotasNuevoISBN(e.target.value)}
                      className='mt-1'
                      rows={2}
                    />
                  </div>
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
                      Guardar ISBN
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contadores (simplificados) */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6'>
        <Card className='shadow-sm'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-lg'>Total en Inventario</CardTitle>
            <CardDescription className='text-xs'>
              ISBNs registrados en el sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>{totalIsbnsRegistrados}</div>
          </CardContent>
        </Card>
        {/* Podrías añadir más tarjetas si tuvieras forma de calcular "Disponibles" y "Asignados" */}
      </div>

      <div className='mb-4'>
        <Label htmlFor='search-isbn' className='sr-only'>
          Buscar ISBN
        </Label>
        <Input
          id='search-isbn'
          placeholder='Buscar por número ISBN o notas...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='max-w-md text-sm'
        />
      </div>

      <Card className='shadow-sm overflow-hidden border-gray-200'>
        <CardHeader className='bg-gray-50 px-4 py-3 border-b'>
          <CardTitle className='text-md font-medium text-gray-700'>
            Listado de ISBNs en Inventario ({isbnsFiltrados.length})
          </CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='px-4 py-2.5 text-xs w-[35%]'>
                  Número ISBN
                </TableHead>
                <TableHead className='px-4 py-2.5 text-xs'>Notas</TableHead>
                <TableHead className='text-right px-4 py-2.5 text-xs w-[100px]'>
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isbnsFiltrados.length > 0 ? (
                isbnsFiltrados.map((item) => (
                  <TableRow
                    key={item.id}
                    className='hover:bg-gray-50/50 dark:hover:bg-gray-800/50 text-sm'>
                    <TableCell className='font-mono px-4 py-2.5 text-xs sm:text-sm'>
                      {item.valor}
                    </TableCell>
                    <TableCell className='px-4 py-2.5 text-gray-600 text-xs sm:text-sm'>
                      {item.notas || <span className='text-gray-400'>-</span>}
                    </TableCell>
                    <TableCell className='text-right px-4 py-2.5'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-red-500 hover:bg-red-100 hover:text-red-600'
                        onClick={() => handleEliminarISBN(item.id)}
                        disabled={isSubmitting}
                        title={`Eliminar ISBN ${item.valor}`}>
                        <Trash2 className='h-4 w-4' />
                        <span className='sr-only'>Eliminar ISBN</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3} // Ajustado al número de columnas
                    className='text-center h-24 text-sm text-gray-500'>
                    {isLoading // Ya manejado arriba, pero por si acaso
                      ? "Cargando..."
                      : searchTerm
                      ? "No se encontraron ISBNs que coincidan con la búsqueda."
                      : "No hay ISBNs registrados en el inventario. Añade uno para empezar."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className='flex flex-col sm:flex-row justify-between items-center border-t p-4 gap-2'>
          <div className='text-xs text-muted-foreground'>
            Mostrando {isbnsFiltrados.length} de {isbns.length} ISBNs en
            inventario.
          </div>
          {/* Aquí podrías añadir paginación si la lista se vuelve muy larga */}
        </CardFooter>
      </Card>
    </div>
  );
}
