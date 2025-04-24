"use client";

import { useEffect, useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Tipo de dato para el usuario, según tu modelo
type User = {
  id: string; // DNI/NIE
  email: string;
  password: string;
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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // formData contiene los datos del formulario y userToEdit determina si se está editando
  const [formData, setFormData] = useState(initialFormData);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [message, setMessage] = useState("");

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
          (u: User) => String(u.roleId) !== "2"
        );
        setUsers(staffUsers);
      } catch (error) {
        console.error("Error al cargar usuarios staff:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Manejo de envío de formulario: si estamos en modo edición se hace PUT, sino POST.
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        // Forzamos que verified y roleId sean staff (1)
        verified: 1,
        roleId: 1,
      };

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
      setMessage(
        userToEdit
          ? "Usuario actualizado correctamente"
          : "Usuario creado correctamente"
      );
      // Limpiar el formulario y salir del modo edición
      setFormData(initialFormData);
      setUserToEdit(null);
    } catch (err: any) {
      console.error(err);
      setMessage(err.message);
    }
  };

  // Función para recargar la lista de usuarios después de cambios
  const fetchUsersList = async () => {
    try {
      const token = localStorage.getItem("token");
      const updatedListRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedData = await updatedListRes.json();
      const updatedUsersArray = Array.isArray(updatedData)
        ? updatedData
        : updatedData.users ?? [];
      const staffUsers = updatedUsersArray.filter(
        (u: User) => String(u.roleId) !== "2"
      );
      setUsers(staffUsers);
    } catch (error) {
      console.error("Error al actualizar lista de usuarios:", error);
    }
  };

  // Manejo del cambio en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Al pulsar "Editar" se carga el usuario en el formulario
  const handleEdit = (user: User) => {
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
    setMessage("");
  };

  if (loading) {
    return <div className='p-4'>Cargando usuarios staff...</div>;
  }

  return (
    <div className='container mx-auto px-4 py-6 space-y-8'>
      {/* Formulario para crear/editar usuario staff */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='bg-white shadow p-6 rounded-lg'>
        <h2 className='text-xl font-semibold mb-4'>
          {userToEdit ? "Editar Usuario" : "Crear Usuario Staff"}
        </h2>
        {message && <p className='mb-4 text-green-600'>{message}</p>}
        <form
          onSubmit={handleSubmit}
          className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block font-medium'>DNI/NIE</label>
            <input
              type='text'
              name='id'
              value={formData.id}
              onChange={handleChange}
              required
              disabled={!!userToEdit} // no se puede cambiar el DNI en edición
              className='w-full border rounded p-2'
            />
          </div>
          <div>
            <label className='block font-medium'>Correo</label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              required
              className='w-full border rounded p-2'
            />
          </div>
          <div>
            <label className='block font-medium'>Contraseña</label>
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              required={!userToEdit} // para edición, se puede dejar vacío
              placeholder={userToEdit ? "Dejar en blanco para no cambiar" : ""}
              className='w-full border rounded p-2'
            />
          </div>
          <div>
            <label className='block font-medium'>Nombre</label>
            <input
              type='text'
              name='firstName'
              value={formData.firstName}
              onChange={handleChange}
              className='w-full border rounded p-2'
            />
          </div>
          <div>
            <label className='block font-medium'>Apellidos</label>
            <input
              type='text'
              name='lastName'
              value={formData.lastName}
              onChange={handleChange}
              className='w-full border rounded p-2'
            />
          </div>

          {/* Los campos por defecto para staff */}
          <div>
            <label className='block font-medium'>Teléfono (automático)</label>
            <input
              type='text'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              className='w-full border rounded p-2'
            />
          </div>
          <div>
            <label className='block font-medium'>País (automático)</label>
            <input
              type='text'
              name='country'
              value={formData.country}
              onChange={handleChange}
              className='w-full border rounded p-2'
            />
          </div>

          {/* Botón de envío y, en modo edición, botón cancelar */}
          <div className='md:col-span-2 flex items-center space-x-4 mt-4'>
            <Button type='submit' variant='default'>
              {userToEdit ? "Actualizar Usuario" : "Crear Usuario Staff"}
            </Button>
            {userToEdit && (
              <Button
                type='button'
                variant='destructive'
                onClick={handleCancelEdit}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </motion.div>

      {/* Tabla de usuarios staff */}
      <div className='overflow-x-auto w-full mb-8'>
        <table className='min-w-full bg-white border border-gray-300 text-sm shadow rounded-lg'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='px-4 py-2 border-r border-gray-300'>DNI/NIE</th>
              <th className='px-4 py-2 border-r border-gray-300'>Nombre</th>
              <th className='px-4 py-2 border-r border-gray-300'>Apellidos</th>
              <th className='px-4 py-2 border-r border-gray-300'>Correo</th>
              <th className='px-4 py-2 border-r border-gray-300'>
                Correo validado
              </th>
              <th className='px-4 py-2 border-r border-gray-300'>Rol</th>
              <th className='px-4 py-2'>Acciones</th>
            </tr>
            {/* Fila de filtros (sin funcionalidad en este ejemplo) */}
            <tr>
              {[
                "DNI/NIE",
                "Nombre",
                "Apellidos",
                "Correo",
                "Correo validado",
                "Rol",
                "Acciones",
              ].map((placeholder, idx) => (
                <th
                  key={idx}
                  className={
                    idx < 6 ? "px-4 py-1 border-r border-gray-300" : "px-4 py-1"
                  }>
                  <input
                    type='text'
                    placeholder={`Buscar ${placeholder.toLowerCase()}`}
                    className='w-full border rounded p-1'
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className='text-center py-4'>
                  No hay usuarios staff.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className='hover:bg-gray-50'>
                  <td className='border-r border-gray-300 px-4 py-2'>
                    {user.id}
                  </td>
                  <td className='border-r border-gray-300 px-4 py-2'>
                    {user.firstName}
                  </td>
                  <td className='border-r border-gray-300 px-4 py-2'>
                    {user.lastName}
                  </td>
                  <td className='border-r border-gray-300 px-4 py-2'>
                    {user.email}
                  </td>
                  <td className='border-r border-gray-300 px-4 py-2'>
                    {user.verified ? "Sí" : "No"}
                  </td>
                  <td className='border-r border-gray-300 px-4 py-2'>
                    {user.roleId === 1 ? "Administración" : user.roleId}
                  </td>
                  <td className='px-4 py-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleEdit(user)}>
                      Editar
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
