"use client";

import type React from "react";

import { useState, useEffect, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Users,
  ChevronLeft,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Shield,
  FileText,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackgroundBlobs } from "@/components/background-blobs";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Role = {
  id: number;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Estado para el formulario de creación/edición
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Este estado nos indicará si estamos editando un rol existente.
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Al montar el componente se carga la lista de roles
  useEffect(() => {
    fetchRoles();
  }, []);

  // Filtrar roles cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRoles(roles);
      return;
    }

    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = roles.filter(
      (role) =>
        role.name.toLowerCase().includes(lowercasedSearch) ||
        (role.description?.toLowerCase() || "").includes(lowercasedSearch)
    );

    setFilteredRoles(filtered);
  }, [searchTerm, roles]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Error al cargar los roles");
      }

      const data = await res.json();
      const rolesArray = Array.isArray(data) ? data : [];
      setRoles(rolesArray);
      setFilteredRoles(rolesArray);
    } catch (err) {
      console.error("Error al cargar roles:", err);
      setStatusMessage({
        text: "Error al cargar los roles. Por favor, intenta de nuevo.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calcula el siguiente id para rol basado en la lista actual (modo creación)
  const getNextRoleId = () => {
    if (roles.length === 0) return 1;
    const maxId = Math.max(...roles.map((r) => r.id));
    return maxId + 1;
  };

  // Manejo de cambios en los inputs del formulario
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Envía el formulario para crear un nuevo rol o actualizar uno existente
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setIsSubmitting(true);

    if (!formData.name.trim()) {
      setStatusMessage({
        text: "El campo 'Nombre' es obligatorio.",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let res;

      if (editingRole) {
        // Actualización: se usa PUT al endpoint /roles/:id
        res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/roles/${editingRole.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: formData.name.trim(),
              description: formData.description.trim() || null,
            }),
          }
        );
      } else {
        // Creación: usamos POST
        res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/roles`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            description: formData.description.trim() || null,
          }),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error en la operación");
      }

      // Rol creado o actualizado exitosamente
      setStatusMessage({
        text: editingRole
          ? "Rol actualizado correctamente"
          : "Rol creado correctamente",
        type: "success",
      });

      // Actualizar la lista de roles
      await fetchRoles();

      // Limpiar el formulario y salir del modo edición
      setFormData({ name: "", description: "" });
      setEditingRole(null);
    } catch (error: any) {
      console.error("Error:", error);
      setStatusMessage({
        text: error.message || "Ha ocurrido un error",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modo edición: cargar el rol seleccionado en el formulario
  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancelar edición y reiniciar el formulario
  const handleCancelEdit = () => {
    setEditingRole(null);
    setFormData({ name: "", description: "" });
    setStatusMessage(null);
  };

  // Formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className='relative min-h-screen flex items-center justify-center'>
        <BackgroundBlobs />
        <div className='relative z-10 text-center space-y-4'>
          <RefreshCw className='animate-spin h-10 w-10 mx-auto text-purple-600' />
          <p className='text-lg font-medium'>Cargando roles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='relative min-h-screen py-8'>
      <BackgroundBlobs />

      <div className='container mx-auto px-4 relative z-10 space-y-8'>
        {/* Cabecera */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              className='flex items-center text-purple-700 hover:text-purple-900 hover:bg-purple-50'
              onClick={() => window.history.back()}>
              <ChevronLeft className='mr-1 h-4 w-4' />
              Volver
            </Button>
            <span className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
              Gestión de Roles
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            Roles y Permisos
          </h2>
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto'></div>
        </motion.div>

        {/* Formulario para crear/editar rol */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg'>
            <CardHeader>
              <CardTitle>{editingRole ? "Editar Rol" : "Nuevo Rol"}</CardTitle>
              <CardDescription>
                {editingRole
                  ? "Modifica los datos del rol seleccionado"
                  : "Completa el formulario para crear un nuevo rol en el sistema"}
              </CardDescription>

              {statusMessage && (
                <div
                  className={`mt-2 p-3 rounded-md ${
                    statusMessage.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : statusMessage.type === "error"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}>
                  {statusMessage.type === "success" && (
                    <CheckCircle className='inline-block mr-2 h-4 w-4' />
                  )}
                  {statusMessage.type === "error" && (
                    <AlertCircle className='inline-block mr-2 h-4 w-4' />
                  )}
                  {statusMessage.type === "info" && (
                    <AlertCircle className='inline-block mr-2 h-4 w-4' />
                  )}
                  {statusMessage.text}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* Campo ID (cálculo automático) */}
                  <div className='space-y-2'>
                    <Label htmlFor='id' className='flex items-center'>
                      <Shield className='h-4 w-4 mr-2 text-purple-500' />
                      ID del Rol
                    </Label>
                    <Input
                      id='id'
                      value={editingRole ? editingRole.id : getNextRoleId()}
                      disabled
                      className='bg-gray-100'
                    />
                    <p className='text-xs text-muted-foreground'>
                      El ID se genera automáticamente
                    </p>
                  </div>

                  {/* Nombre */}
                  <div className='space-y-2'>
                    <Label htmlFor='name' className='flex items-center'>
                      <Users className='h-4 w-4 mr-2 text-purple-500' />
                      Nombre*
                    </Label>
                    <Input
                      id='name'
                      name='name'
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder='Nombre del rol'
                    />
                  </div>

                  {/* Descripción */}
                  <div className='md:col-span-2 space-y-2'>
                    <Label htmlFor='description' className='flex items-center'>
                      <FileText className='h-4 w-4 mr-2 text-purple-500' />
                      Descripción
                    </Label>
                    <textarea
                      id='description'
                      name='description'
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder='Descripción detallada del rol y sus permisos'
                      className='w-full min-h-[100px] px-3 py-2 border rounded-md border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    />
                  </div>
                </div>

                <div className='flex items-center justify-end space-x-4 pt-4'>
                  {editingRole && (
                    <Button
                      type='button'
                      variant='outline'
                      onClick={handleCancelEdit}
                      className='border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700'>
                      Cancelar
                    </Button>
                  )}
                  <Button
                    type='submit'
                    className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white'
                    disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
                        {editingRole ? "Actualizando..." : "Creando..."}
                      </>
                    ) : (
                      <>{editingRole ? "Actualizar Rol" : "Crear Rol"}</>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lista de roles */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}>
          <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg'>
            <CardHeader>
              <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div>
                  <CardTitle>Roles Registrados</CardTitle>
                  <CardDescription>
                    Gestiona los roles y permisos del sistema
                  </CardDescription>
                </div>

                <div className='flex items-center gap-2'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                    <Input
                      placeholder='Buscar rol...'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className='pl-10 w-full md:w-[250px]'
                    />
                  </div>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white'
                          size='icon'
                          onClick={() => fetchRoles()}>
                          <RefreshCw className='h-4 w-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Actualizar lista</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-purple-50 text-purple-900'>
                    <tr>
                      <th className='px-4 py-3 text-left'>ID</th>
                      <th className='px-4 py-3 text-left'>Nombre</th>
                      <th className='px-4 py-3 text-left'>Descripción</th>
                      <th className='px-4 py-3 text-left'>Fecha de creación</th>
                      <th className='px-4 py-3 text-left'>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-100'>
                    {filteredRoles.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className='px-4 py-8 text-center text-gray-500'>
                          {searchTerm ? (
                            <>
                              <Search className='h-8 w-8 mx-auto mb-2 text-gray-400' />
                              No se encontraron roles que coincidan con "
                              {searchTerm}"
                            </>
                          ) : (
                            <>
                              <Shield className='h-8 w-8 mx-auto mb-2 text-gray-400' />
                              No hay roles registrados
                            </>
                          )}
                        </td>
                      </tr>
                    ) : (
                      filteredRoles.map((role) => (
                        <tr
                          key={role.id}
                          className='hover:bg-purple-50/50 transition-colors'>
                          <td className='px-4 py-4'>
                            <div className='flex items-center'>
                              <span className='font-medium'>{role.id}</span>
                            </div>
                          </td>
                          <td className='px-4 py-4'>
                            <div className='flex items-center gap-2'>
                              <div className='w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-sm font-bold'>
                                {role.name.charAt(0).toUpperCase()}
                              </div>
                              <span className='font-medium'>{role.name}</span>
                            </div>
                          </td>
                          <td className='px-4 py-4'>
                            <span className='text-sm'>
                              {role.description || "Sin descripción"}
                            </span>
                          </td>
                          <td className='px-4 py-4'>
                            <div className='flex items-center'>
                              <Calendar className='h-3 w-3 mr-1 text-gray-400' />
                              <span className='text-sm'>
                                {formatDate(role.createdAt)}
                              </span>
                            </div>
                          </td>
                          <td className='px-4 py-4'>
                            <div className='flex gap-2'>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => handleEdit(role)}
                                className='h-8 px-2'>
                                <Edit className='h-3 w-3 mr-1' /> Editar
                              </Button>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant='outline'
                                    size='sm'
                                    className='h-8 px-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700'>
                                    <Trash2 className='h-3 w-3 mr-1' /> Eliminar
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      ¿Estás seguro?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción eliminará permanentemente el
                                      rol <strong>{role.name}</strong> y no se
                                      puede deshacer. Los usuarios con este rol
                                      podrían perder sus permisos.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction className='bg-red-600 hover:bg-red-700'>
                                      Eliminar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
