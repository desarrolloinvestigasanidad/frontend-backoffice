"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  User,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  LogIn,
} from "lucide-react";
import { motion } from "framer-motion";

type Client = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country?: string;
  province?: string;
  autonomousCommunity?: string;
  professionalCategory?: string;
  address?: string;
  createdAt?: string;
};

type Payment = {
  id: string;
  amount: number;
  date: string;
};

type Publication = {
  id: string;
  title: string;
  type: string;
  date: string;
  status: string;
};

export default function ClientDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Client>>({});
  const [message, setMessage] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);

  // Cargar datos del cliente
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/clients/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setClient(data);
      } catch (error) {
        console.error("Error al cargar cliente:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchClient();
  }, [id]);

  // Cargar pagos y publicaciones una vez que se obtuvo el cliente
  useEffect(() => {
    const fetchAdditionalData = async () => {
      if (!id) return;
      try {
        const token = sessionStorage.getItem("token");
        // Obtener pagos
        const resPayments = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/clients/${id}/payments`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const paymentsData = await resPayments.json();

        const paymentsArray = Array.isArray(paymentsData)
          ? paymentsData
          : paymentsData.payments ?? [];
        setPayments(paymentsArray);
        // Obtener publicaciones
        const resPublications = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/clients/${id}/publications`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const publicationsData = await resPublications.json();

        const publicationsArray = Array.isArray(publicationsData)
          ? publicationsData
          : publicationsData.publications ?? [];
        setPublications(publicationsArray);
      } catch (error) {
        console.error("Error al cargar pagos o publicaciones:", error);
      }
    };
    if (client) fetchAdditionalData();
  }, [id, client]);

  const handleEdit = () => {
    if (client) {
      setEditData({
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone || "",
        country: client.country || "",
        autonomousCommunity: client.autonomousCommunity || "",
        province: client.province || "",
        professionalCategory: client.professionalCategory || "",
      });
    }
    setEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setMessage("");
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/clients/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editData),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al actualizar cliente");
      }
      const updated = await res.json();
      setClient(updated);
      setEditing(false);
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar este cliente?")) return;
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/clients/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al eliminar cliente");
      }
      router.push("/dashboard/clients");
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Función para que el admin se "impersonifique" al cliente
  const handleImpersonate = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/clients/${id}/impersonate`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al impersonar cliente");
      }
      const { impersonationToken } = await res.json();
      // Guarda el token de impersonación y redirige a la vista del cliente (por ejemplo, dashboard)
      sessionStorage.setItem("token", impersonationToken);
      router.push("/dashboard"); // Ajusta la ruta según tu estructura
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) {
    return <div>Cargando datos del cliente...</div>;
  }

  if (!client) {
    return <div>No se encontró el cliente.</div>;
  }

  return (
    <div className='relative overflow-hidden py-8'>
      <div className='container mx-auto px-4 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='mb-6 flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Detalle del Cliente</h1>
          <div className='flex gap-2'>
            <Button
              onClick={handleImpersonate}
              className='bg-green-500 hover:bg-green-600 flex items-center gap-1'>
              <LogIn className='h-4 w-4' /> Impersonar
            </Button>
            {!editing && (
              <Button
                onClick={handleEdit}
                className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'>
                <Edit className='mr-2 h-4 w-4' /> Editar
              </Button>
            )}
            <Button variant='destructive' onClick={handleDelete}>
              Eliminar
            </Button>
            <Button variant='outline' onClick={() => router.back()}>
              Volver
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-lg border border-white/50'>
          <div className='flex flex-col md:flex-row items-center md:items-start gap-8'>
            {/* Avatar */}
            <div className='flex flex-col items-center'>
              <div className='w-28 h-28 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg'>
                {client.firstName.charAt(0)}
                {client.lastName.charAt(0)}
              </div>
            </div>
            {/* Información */}
            <div className='flex-1 space-y-4'>
              {message && <p className='text-red-600'>{message}</p>}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <Label>Email</Label>
                  {editing ? (
                    <Input
                      name='email'
                      value={editData.email || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className='font-medium'>{client.email}</p>
                  )}
                </div>
                <div>
                  <Label>Teléfono</Label>
                  {editing ? (
                    <Input
                      name='phone'
                      value={editData.phone || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className='font-medium'>
                      {client.phone || "No especificado"}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Nombre</Label>
                  {editing ? (
                    <Input
                      name='firstName'
                      value={editData.firstName || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className='font-medium'>{client.firstName}</p>
                  )}
                </div>
                <div>
                  <Label>Apellidos</Label>
                  {editing ? (
                    <Input
                      name='lastName'
                      value={editData.lastName || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className='font-medium'>{client.lastName}</p>
                  )}
                </div>
                <div>
                  <Label>Categoría Profesional</Label>
                  {editing ? (
                    <Input
                      name='professionalCategory'
                      value={editData.professionalCategory || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className='font-medium'>
                      {client.professionalCategory || "No especificado"}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Dirección</Label>
                  {editing ? (
                    <Input
                      name='address'
                      value={editData.address || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className='font-medium'>
                      {client.address || "No especificado"}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Ubicación</Label>
                  {editing ? (
                    <div className='flex gap-2'>
                      <Input
                        name='country'
                        value={editData.country || ""}
                        onChange={handleInputChange}
                        placeholder='País'
                      />
                      <Input
                        name='autonomousCommunity'
                        value={editData.autonomousCommunity || ""}
                        onChange={handleInputChange}
                        placeholder='Comunidad'
                      />
                      <Input
                        name='province'
                        value={editData.province || ""}
                        onChange={handleInputChange}
                        placeholder='Provincia'
                      />
                    </div>
                  ) : (
                    <p className='font-medium'>
                      {[
                        client.province,
                        client.autonomousCommunity,
                        client.country,
                      ]
                        .filter(Boolean)
                        .join(", ") || "No especificado"}
                    </p>
                  )}
                </div>
              </div>
              {editing && (
                <div className='flex gap-3 mt-8'>
                  <Button
                    onClick={handleSave}
                    className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'>
                    <Save className='mr-2 h-4 w-4' /> Guardar Cambios
                  </Button>
                  <Button variant='outline' onClick={() => setEditing(false)}>
                    <X className='mr-2 h-4 w-4' /> Cancelar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Sección de Pagos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='mt-8 backdrop-blur-sm bg-white/80 p-6 rounded-xl shadow-lg border border-white/50'>
          <h2 className='text-xl font-semibold mb-4'>Pagos Realizados</h2>
          {payments?.length === 0 ? (
            <p>No se encontraron pagos.</p>
          ) : (
            <table className='min-w-full bg-white rounded-lg shadow overflow-hidden'>
              <thead className='bg-purple-100'>
                <tr>
                  <th className='px-4 py-2'>ID</th>
                  <th className='px-4 py-2'>Monto</th>
                  <th className='px-4 py-2'>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className='hover:bg-gray-50'>
                    <td className='border px-4 py-2'>{p.id}</td>
                    <td className='border px-4 py-2'>{p.amount}</td>
                    <td className='border px-4 py-2'>
                      {new Date(p.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>

        {/* Sección de Publicaciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className='mt-8 backdrop-blur-sm bg-white/80 p-6 rounded-xl shadow-lg border border-white/50'>
          <h2 className='text-xl font-semibold mb-4'>Publicaciones</h2>
          {publications.length === 0 ? (
            <p>No se encontraron publicaciones.</p>
          ) : (
            <table className='min-w-full bg-white rounded-lg shadow overflow-hidden'>
              <thead className='bg-purple-100'>
                <tr>
                  <th className='px-4 py-2'>ID</th>
                  <th className='px-4 py-2'>Título</th>
                  <th className='px-4 py-2'>Tipo</th>
                  <th className='px-4 py-2'>Fecha</th>
                  <th className='px-4 py-2'>Estado</th>
                </tr>
              </thead>
              <tbody>
                {publications.map((pub) => (
                  <tr key={pub.id} className='hover:bg-gray-50'>
                    <td className='border px-4 py-2'>{pub.id}</td>
                    <td className='border px-4 py-2'>{pub.title}</td>
                    <td className='border px-4 py-2'>{pub.type}</td>
                    <td className='border px-4 py-2'>
                      {new Date(pub.date).toLocaleDateString()}
                    </td>
                    <td className='border px-4 py-2'>{pub.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      </div>
    </div>
  );
}
