"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; // Ajusta la ruta si tu botón está en otra ubicación

type Role = {
  id: number;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado para el formulario de creación/edición
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  // Este estado nos indicará si estamos editando un rol existente.
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Al montar el componente se carga la lista de roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/roles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const rolesArray = Array.isArray(data) ? data : [];
        setRoles(rolesArray);
      } catch (err) {
        console.error("Error al cargar roles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Calcula el siguiente id para rol basado en la lista actual (modo creación)
  const getNextRoleId = () => {
    if (roles.length === 0) return 1;
    const maxId = Math.max(...roles.map((r) => r.id));
    return maxId + 1;
  };

  // Manejo de cambios en los inputs del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Envía el formulario para crear un nuevo rol o actualizar uno existente
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!formData.name.trim()) {
      setMessage("El campo 'Nombre' es obligatorio.");
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
        // Creación: usamos POST; aunque el id se gestiona en backend de forma auto incremental,
        // mostramos el siguiente id calculado en el formulario
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
      setMessage(
        editingRole
          ? "Rol actualizado correctamente"
          : "Rol creado correctamente"
      );

      // Actualizar la lista de roles
      const updatedListRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/roles`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedData = await updatedListRes.json();
      const updatedRolesArray = Array.isArray(updatedData) ? updatedData : [];
      setRoles(updatedRolesArray);

      // Limpiar el formulario y salir del modo edición
      setFormData({ name: "", description: "" });
      setEditingRole(null);
    } catch (error: any) {
      console.error("Error:", error);
      setMessage(error.message);
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
    setMessage("");
  };

  if (loading) {
    return <div className='p-4'>Cargando roles...</div>;
  }

  return (
    <div className='container mx-auto px-4 py-8 space-y-8'>
      {/* Encabezado */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Roles y Permisos</h1>
        <Button variant='outline'>Acción Adicional</Button>
      </motion.div>

      {/* Formulario para crear/editar rol */}
      <div className='bg-white p-4 shadow rounded-lg'>
        <h2 className='text-xl font-semibold mb-4'>
          {editingRole ? "Editar Rol" : "Nuevo Rol"}
        </h2>
        {message && <p className='text-green-600 mb-4'>{message}</p>}
        <form
          onSubmit={handleSubmit}
          className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Campo ID (cálculo automático) */}
          <div>
            <label className='block font-medium'>ID del Rol</label>
            <input
              type='text'
              value={editingRole ? editingRole.id : getNextRoleId()}
              disabled
              className='w-full border rounded p-2 bg-gray-100'
            />
          </div>
          {/* Nombre */}
          <div>
            <label className='block font-medium'>Nombre*</label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              required
              className='w-full border rounded p-2'
            />
          </div>
          {/* Descripción */}
          <div className='md:col-span-2'>
            <label className='block font-medium'>Descripción</label>
            <input
              type='text'
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              className='w-full border rounded p-2'
            />
          </div>
          {/* Botones */}
          <div className='md:col-span-2 flex items-center space-x-4 mt-4'>
            <Button type='submit' variant='default'>
              {editingRole ? "Actualizar Rol" : "Crear Rol"}
            </Button>
            {editingRole && (
              <Button
                type='button'
                variant='destructive'
                onClick={handleCancelEdit}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Tabla de roles */}
      <div className='overflow-x-auto w-full'>
        <table className='min-w-full bg-white border border-gray-300 text-sm shadow rounded-lg'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='px-4 py-2 border-r border-gray-300'>Rol</th>
              <th className='px-4 py-2 border-r border-gray-300'>
                Descripción
              </th>
              <th className='px-4 py-2'>Acciones</th>
            </tr>
            {/* Fila de filtros (ejemplo sin funcionalidad) */}
            <tr>
              {["Rol", "Descripción", "Acciones"].map((placeholder, idx) => (
                <th
                  key={idx}
                  className={
                    idx < 2 ? "px-4 py-1 border-r border-gray-300" : "px-4 py-1"
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
            {roles.length === 0 ? (
              <tr>
                <td colSpan={3} className='text-center py-4'>
                  No se encontraron roles.
                </td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr key={role.id} className='hover:bg-gray-50'>
                  <td className='border-r border-gray-300 px-4 py-2'>
                    {role.name}
                  </td>
                  <td className='border-r border-gray-300 px-4 py-2'>
                    {role.description || "Sin descripción"}
                  </td>
                  <td className='px-4 py-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleEdit(role)}>
                      Editar
                    </Button>
                    {/* Aquí podrías agregar otros botones, por ejemplo, para ver o eliminar */}
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
