"use client";

import type React from "react";

import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronLeft,
  UserPlus,
  Edit,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Calendar,
  AlertCircle,
  Trash2,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

// Tipo de dato para el usuario, según tu modelo
type UserType = {
  id: string; // DNI/NIE
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  country?: string;
  province?: string;
  verified?: boolean | number;
  roleId: string | number;
  createdAt?: string;
  updatedAt?: string;
  gender?: string;
  address?: string;
  autonomousCommunity?: string;
  professionalCategory?: string;
  interests?: string;
  lastAccessIp?: string | null;
  termsAccepted?: boolean | number;
  infoAccepted?: boolean | number;
  state?: string;
};

// Estado inicial del formulario para crear/editar un usuario staff
const initialFormData = {
  id: "",
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  // Campos obligatorios pero que se rellenan de forma predeterminada para staff
  phone: "N/A",
  address: "N/A",
  country: "N/A",
  province: "N/A",
  autonomousCommunity: "N/A",
  professionalCategory: "N/A",
  interests: "N/A",
  verified: 1, // 1 => true
  roleId: 1, // 1 => staff/admin
};

export default function UsersStaffPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // formData contiene los datos del formulario y userToEdit determina si se está editando
  const [formData, setFormData] = useState(initialFormData);
  const [userToEdit, setUserToEdit] = useState<UserType | null>(null);

  // Cargar usuarios (se filtran solo aquellos cuyo roleId != 2, es decir, no clientes)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        // data puede venir directamente o en data.users
        const usersArray = Array.isArray(data) ? data : data.users ?? [];
        const staffUsers = usersArray.filter(
          (u: UserType) => String(u.roleId) !== "2"
        );
        setUsers(staffUsers);
        setFilteredUsers(staffUsers);
      } catch (error) {
        console.error("Error al cargar usuarios staff:", error);
        setStatusMessage({
          text: "Error al cargar usuarios. Por favor, intenta de nuevo.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filtrar usuarios cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
      return;
    }

    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.id.toLowerCase().includes(lowercasedSearch) ||
        user.email.toLowerCase().includes(lowercasedSearch) ||
        user.firstName?.toLowerCase().includes(lowercasedSearch) ||
        user.lastName?.toLowerCase().includes(lowercasedSearch)
    );

    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  // Manejo de envío de formulario: si estamos en modo edición se hace PUT, sino POST.
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        // Forzamos que verified y roleId sean staff (1)
        verified: 1,
        roleId: 1,
      };

      // Si estamos editando y no se ha cambiado la contraseña, la eliminamos del payload
      if (userToEdit && !formData.password) {
        if ("password" in payload) {
          delete (payload as { password?: string }).password;
        }
      }

      let res: Response;
      if (userToEdit) {
        // Modo edición: actualizar usuario
        res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/users/${userToEdit.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        // Modo creación: crear nuevo usuario staff
        res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error en la operación");
      }

      await fetchUsersList();
      setStatusMessage({
        text: userToEdit
          ? "Usuario actualizado correctamente"
          : "Usuario creado correctamente",
        type: "success",
      });

      // Limpiar el formulario y salir del modo edición
      setFormData(initialFormData);
      setUserToEdit(null);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        text: err.message || "Ha ocurrido un error",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para recargar la lista de usuarios después de cambios
  const fetchUsersList = async () => {
    try {
      const token = localStorage.getItem("token");
      const updatedListRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedData = await updatedListRes.json();
      const updatedUsersArray = Array.isArray(updatedData)
        ? updatedData
        : updatedData.users ?? [];
      const staffUsers = updatedUsersArray.filter(
        (u: UserType) => String(u.roleId) !== "2"
      );
      setUsers(staffUsers);
      setFilteredUsers(staffUsers);
    } catch (error) {
      console.error("Error al actualizar lista de usuarios:", error);
      setStatusMessage({
        text: "Error al actualizar la lista de usuarios",
        type: "error",
      });
    }
  };

  // Manejo del cambio en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Al pulsar "Editar" se carga el usuario en el formulario
  const handleEdit = (user: UserType) => {
    setUserToEdit(user);
    setFormData({
      id: user.id,
      email: user.email,
      password: "", // Dejar vacío para no mostrar la contraseña original
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "N/A",
      address: user.address || "N/A",
      country: user.country || "N/A",
      province: user.province || "N/A",
      autonomousCommunity: user.autonomousCommunity || "N/A",
      professionalCategory: user.professionalCategory || "N/A",
      interests: user.interests || "N/A",
      verified: 1,
      roleId: 1,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancelar el modo edición
  const handleCancelEdit = () => {
    setUserToEdit(null);
    setFormData(initialFormData);
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
          <p className='text-lg font-medium'>
            Cargando usuarios administradores...
          </p>
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
              Gestión de Administradores
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            Usuarios Administradores
          </h2>
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto'></div>
        </motion.div>

        {/* Formulario para crear/editar usuario staff */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg'>
            <CardHeader>
              <CardTitle>
                {userToEdit
                  ? "Editar Usuario Administrador"
                  : "Crear Usuario Administrador"}
              </CardTitle>
              <CardDescription>
                {userToEdit
                  ? "Modifica los datos del usuario administrador seleccionado"
                  : "Completa el formulario para crear un nuevo usuario con permisos de administración"}
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
                  {/* Información básica */}
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='id' className='flex items-center'>
                        <User className='h-4 w-4 mr-2 text-purple-500' />
                        DNI/NIE
                      </Label>
                      <Input
                        id='id'
                        name='id'
                        value={formData.id}
                        onChange={handleChange}
                        required
                        disabled={!!userToEdit}
                        placeholder='Introduce el DNI/NIE'
                        className={userToEdit ? "bg-gray-100" : ""}
                      />
                      {userToEdit && (
                        <p className='text-xs text-muted-foreground'>
                          El DNI/NIE no se puede modificar
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='email' className='flex items-center'>
                        <Mail className='h-4 w-4 mr-2 text-purple-500' />
                        Correo Electrónico
                      </Label>
                      <Input
                        id='email'
                        name='email'
                        type='email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder='correo@ejemplo.com'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='password' className='flex items-center'>
                        <Shield className='h-4 w-4 mr-2 text-purple-500' />
                        Contraseña
                      </Label>
                      <div className='relative'>
                        <Input
                          id='password'
                          name='password'
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          required={!userToEdit}
                          placeholder={
                            userToEdit
                              ? "Dejar en blanco para no cambiar"
                              : "Contraseña segura"
                          }
                          className='pr-10'
                        />
                        <button
                          type='button'
                          className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
                          onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? (
                            <EyeOff className='h-4 w-4' />
                          ) : (
                            <Eye className='h-4 w-4' />
                          )}
                        </button>
                      </div>
                      {userToEdit && (
                        <p className='text-xs text-muted-foreground'>
                          Deja en blanco para mantener la contraseña actual
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Información personal */}
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='firstName' className='flex items-center'>
                        <User className='h-4 w-4 mr-2 text-purple-500' />
                        Nombre
                      </Label>
                      <Input
                        id='firstName'
                        name='firstName'
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        placeholder='Nombre'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='lastName' className='flex items-center'>
                        <User className='h-4 w-4 mr-2 text-purple-500' />
                        Apellidos
                      </Label>
                      <Input
                        id='lastName'
                        name='lastName'
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        placeholder='Apellidos'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='phone' className='flex items-center'>
                        <Phone className='h-4 w-4 mr-2 text-purple-500' />
                        Teléfono (automático)
                      </Label>
                      <Input
                        id='phone'
                        name='phone'
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder='Teléfono'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='country' className='flex items-center'>
                        <MapPin className='h-4 w-4 mr-2 text-purple-500' />
                        País (automático)
                      </Label>
                      <Input
                        id='country'
                        name='country'
                        value={formData.country}
                        onChange={handleChange}
                        placeholder='País'
                      />
                    </div>
                  </div>
                </div>

                <div className='flex items-center justify-end space-x-4 pt-4'>
                  {userToEdit && (
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
                    variant='default'
                    disabled={isSubmitting}
                    className='min-w-[150px]'>
                    {isSubmitting ? (
                      <>
                        <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
                        {userToEdit ? "Actualizando..." : "Creando..."}
                      </>
                    ) : (
                      <>{userToEdit ? "Actualizar Usuario" : "Crear Usuario"}</>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lista de usuarios staff */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}>
          <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg'>
            <CardHeader>
              <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div>
                  <CardTitle>Administradores Registrados</CardTitle>
                  <CardDescription>
                    Gestiona los usuarios con permisos de administración
                  </CardDescription>
                </div>

                <div className='flex items-center gap-2'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                    <Input
                      placeholder='Buscar administrador...'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className='pl-10 w-full md:w-[250px]'
                    />
                  </div>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='default'
                          size='icon'
                          onClick={() => fetchUsersList()}>
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
                      <th className='px-4 py-3 text-left'>Usuario</th>
                      <th className='px-4 py-3 text-left'>Contacto</th>
                      <th className='px-4 py-3 text-left'>Estado</th>
                      <th className='px-4 py-3 text-left'>Fecha de registro</th>
                      <th className='px-4 py-3 text-left'>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-100'>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className='px-4 py-8 text-center text-gray-500'>
                          {searchTerm ? (
                            <>
                              <Search className='h-8 w-8 mx-auto mb-2 text-gray-400' />
                              No se encontraron administradores que coincidan
                              con "{searchTerm}"
                            </>
                          ) : (
                            <>
                              <UserPlus className='h-8 w-8 mx-auto mb-2 text-gray-400' />
                              No hay usuarios administradores registrados
                            </>
                          )}
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className='hover:bg-purple-50/50 transition-colors'>
                          <td className='px-4 py-4'>
                            <div className='flex items-center gap-3'>
                              <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-sm font-bold'>
                                {(user.firstName?.[0] || "") +
                                  (user.lastName?.[0] || "")}
                              </div>
                              <div>
                                <p className='font-medium text-gray-900'>
                                  {user.firstName} {user.lastName}
                                </p>
                                <p className='text-xs text-gray-500'>
                                  {user.id}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className='px-4 py-4'>
                            <div className='space-y-1'>
                              <p className='text-sm flex items-center'>
                                <Mail className='h-3 w-3 mr-1 text-gray-400' />
                                {user.email}
                              </p>
                              <p className='text-sm flex items-center'>
                                <Phone className='h-3 w-3 mr-1 text-gray-400' />
                                {user.phone || "N/A"}
                              </p>
                            </div>
                          </td>
                          <td className='px-4 py-4'>
                            <Badge
                              variant={user.verified ? "default" : "secondary"}>
                              {user.verified ? (
                                <>
                                  <CheckCircle className='h-3 w-3 mr-1' />{" "}
                                  Verificado
                                </>
                              ) : (
                                <>
                                  <XCircle className='h-3 w-3 mr-1' /> Pendiente
                                </>
                              )}
                            </Badge>
                          </td>
                          <td className='px-4 py-4'>
                            <div className='flex items-center'>
                              <Calendar className='h-3 w-3 mr-1 text-gray-400' />
                              <span className='text-sm'>
                                {formatDate(user.createdAt)}
                              </span>
                            </div>
                          </td>
                          <td className='px-4 py-4'>
                            <div className='flex gap-2'>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => handleEdit(user)}
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
                                      Esta acción eliminará permanentemente al
                                      usuario administrador{" "}
                                      <strong>
                                        {user.firstName} {user.lastName}
                                      </strong>{" "}
                                      y no se puede deshacer.
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
