"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Breadcrumb } from "@/components/breadcrumb";
import { Edit, Save, X, LogIn } from "lucide-react";
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

type Book = {
  id: string;
  title: string;
  price: number;
  publishDate?: string;
  bookType: string;
  status: string;
  active: boolean;
};

type Chapter = {
  id: string;
  title: string;
  status?: string;
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
  const [books, setBooks] = useState<Book[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  // Cargar datos del cliente
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/clients/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setClient(data);
      } catch (err) {
        console.error("Error al cargar cliente:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchClient();
  }, [id]);

  // Cargar pagos
  useEffect(() => {
    const fetchPayments = async () => {
      if (!id) return;
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/payments/?userId=${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const paymentsData = await res.json();
        const paymentsArray = Array.isArray(paymentsData)
          ? paymentsData
          : paymentsData.payments ?? [];
        setPayments(paymentsArray);
      } catch (error) {
        console.error("Error al cargar pagos:", error);
      }
    };
    if (client) fetchPayments();
  }, [id, client]);

  // Cargar libros
  useEffect(() => {
    const fetchBooks = async () => {
      if (!id) return;
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/books?userId=${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setBooks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al cargar libros:", error);
      }
    };
    fetchBooks();
  }, [id]);

  // Cargar capítulos
  useEffect(() => {
    const fetchChapters = async () => {
      if (!id) return;
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/chapters?userId=${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setChapters(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al cargar capítulos:", error);
      }
    };
    fetchChapters();
  }, [id]);

  // Funciones de edición, guardado, eliminación e impersonación
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

  /* -------------------- IMPERSONAR ---------------------- */
  const handleImpersonate = async () => {
    try {
      const adminToken = sessionStorage.getItem("token"); // token real del admin
      if (!adminToken) throw new Error("Sesión de administrador no encontrada");

      // Llamamos al nuevo endpoint protegido de impersonación
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/impersonate/${id}`,
        {
          method: "POST", // ← POST
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al impersonar cliente");
      }

      const { impersonationToken } = await res.json();

      // 1) Guardamos el token de admin para poder volver atrás
      sessionStorage.setItem("adminToken", adminToken);

      // 2) Usamos el token de suplantación
      sessionStorage.setItem("token", impersonationToken);

      // 3) Redirigimos al dominio público de la plataforma
      const base =
        process.env.NEXT_PUBLIC_PLATFORM_URL ||
        "https://main.dh6wi9rwkxpif.amplifyapp.com";
      const url = `${base}/impersonate?token=${encodeURIComponent(
        impersonationToken
      )}`;
      window.location.href = url; // ← incluye el token como query param // cambio de host
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        Cargando datos del cliente...
      </div>
    );
  }

  if (!client) {
    return <div className='text-center'>No se encontró el cliente.</div>;
  }

  return (
    <div className='relative overflow-hidden py-8'>
      {/* Fondo degradado */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 to-white'></div>
      </div>

      <div className='container mx-auto px-4 relative z-10 space-y-8'>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex items-center justify-between'>
          <Breadcrumb>
            <span>Detalle del Cliente</span>
          </Breadcrumb>
          <div className='flex gap-2'>
            <Button
              onClick={handleImpersonate}
              className='bg-green-500 hover:bg-green-600 flex items-center gap-1'>
              <LogIn className='h-4 w-4' /> Impersonar
            </Button>
            {!editing && (
              <Button
                onClick={handleEdit}
                className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 flex items-center gap-1'>
                <Edit className='h-4 w-4' /> Editar
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
          <div className='flex flex-col md:flex-row items-center gap-8'>
            {/* Avatar */}
            <div className='flex flex-col items-center'>
              <div className='w-28 h-28 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg'>
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
                    className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 flex items-center gap-1'>
                    <Save className='h-4 w-4' /> Guardar Cambios
                  </Button>
                  <Button variant='outline' onClick={() => setEditing(false)}>
                    <X className='h-4 w-4' /> Cancelar
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
          {payments.length === 0 ? (
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

        {/* Sección de Libros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='mt-8 backdrop-blur-sm bg-white/80 p-6 rounded-xl shadow-lg border border-white/50'>
          <h2 className='text-xl font-semibold mb-4'>Libros Propios</h2>
          {books.length === 0 ? (
            <p>No se encontraron libros.</p>
          ) : (
            <table className='min-w-full bg-white rounded-lg shadow overflow-hidden'>
              <thead className='bg-purple-100'>
                <tr>
                  <th className='px-4 py-2'>ID</th>
                  <th className='px-4 py-2'>Título</th>
                  <th className='px-4 py-2'>Precio</th>
                  <th className='px-4 py-2'>Publicación</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} className='hover:bg-gray-50'>
                    <td className='border px-4 py-2'>{book.id}</td>
                    <td className='border px-4 py-2'>{book.title}</td>
                    <td className='border px-4 py-2'>{book.price}</td>
                    <td className='border px-4 py-2'>
                      {book.publishDate
                        ? new Date(book.publishDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>

        {/* Sección de Capítulos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className='mt-8 backdrop-blur-sm bg-white/80 p-6 rounded-xl shadow-lg border border-white/50'>
          <h2 className='text-xl font-semibold mb-4'>Capítulos Propios</h2>
          {chapters.length === 0 ? (
            <p>No se encontraron capítulos.</p>
          ) : (
            <table className='min-w-full bg-white rounded-lg shadow overflow-hidden'>
              <thead className='bg-purple-100'>
                <tr>
                  <th className='px-4 py-2'>ID</th>
                  <th className='px-4 py-2'>Título</th>
                  <th className='px-4 py-2'>Estado</th>
                </tr>
              </thead>
              <tbody>
                {chapters.map((chapter) => (
                  <tr key={chapter.id} className='hover:bg-gray-50'>
                    <td className='border px-4 py-2'>{chapter.id}</td>
                    <td className='border px-4 py-2'>{chapter.title}</td>
                    <td className='border px-4 py-2'>
                      {chapter.status || "N/A"}
                    </td>
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
