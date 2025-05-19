"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Breadcrumb } from "@/components/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { BackgroundBlobs } from "@/components/background-blobs";
import { motion } from "framer-motion";
import {
  Edit,
  Save,
  X,
  LogIn,
  ChevronLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  CreditCard,
  Calendar,
  BookOpen,
  FileText,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  Key,
  Bell,
} from "lucide-react";

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
  verified: number;
  infoAccepted?: number;
  deviceIp?: string;
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
  const [messageType, setMessageType] = useState<"error" | "success">("error");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [savingChanges, setSavingChanges] = useState(false);
  const [deletingClient, setDeletingClient] = useState(false);
  const [impersonating, setImpersonating] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [pwdMessage, setPwdMessage] = useState("");
  const [pwdType, setPwdType] = useState<"error" | "success">("success");
  const [isVerifying, setIsVerifying] = useState(false);

  // Cargar datos del cliente
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const token = localStorage.getItem("token");
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
        const token = localStorage.getItem("token");
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
        const token = localStorage.getItem("token");
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
        const token = localStorage.getItem("token");
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
    setSavingChanges(true);
    try {
      const token = localStorage.getItem("token");
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
      setMessageType("success");
      setMessage("Cliente actualizado correctamente");
      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      setMessageType("error");
      setMessage(error.message);
    } finally {
      setSavingChanges(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar este cliente?")) return;
    setDeletingClient(true);
    try {
      const token = localStorage.getItem("token");
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
      setDeletingClient(false);
    }
  };

  /* -------------------- IMPERSONAR ---------------------- */
  const handleImpersonate = async () => {
    setImpersonating(true);
    try {
      const adminToken = localStorage.getItem("token"); // token real del admin
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
      localStorage.setItem("adminToken", adminToken);

      // 2) Usamos el token de suplantación
      localStorage.setItem("token", impersonationToken);

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
      setImpersonating(false);
    }
  };
  // -------------------- CAMBIAR CONTRASEÑA --------------------
  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      setPwdType("error");
      setPwdMessage("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/clients/${id}/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newPassword }),
        }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Error al cambiar contraseña");
      setPwdType("success");
      setPwdMessage("Contraseña actualizada correctamente");
      setNewPassword("");
      setTimeout(() => setPwdMessage(""), 3000);
    } catch (err: any) {
      setPwdType("error");
      setPwdMessage(err.message);
    }
  };
  // Toggle verificación en detalle
  const handleToggleVerify = async () => {
    if (!client) return;
    try {
      setIsVerifying(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/clients/${client.id}/verify`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Error al cambiar verificación");
      const { client: updated } = await res.json();
      setClient(updated);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setIsVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className='relative overflow-hidden min-h-screen py-8'>
        <BackgroundBlobs />
        <div className='container mx-auto px-4 relative z-10'>
          <div className='flex items-center justify-center h-64'>
            <div className='relative'>
              <div className='h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin'></div>
              <div className='absolute inset-0 flex items-center justify-center'>
                <User className='h-6 w-6 text-purple-500' />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className='relative overflow-hidden min-h-screen py-8'>
        <BackgroundBlobs />
        <div className='container mx-auto px-4 relative z-10'>
          <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg max-w-md mx-auto'>
            <CardHeader>
              <CardTitle>Cliente no encontrado</CardTitle>
              <CardDescription>
                No se pudo encontrar la información del cliente solicitado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-center mb-4'>
                El cliente que estás buscando no existe o ha sido eliminado.
              </p>
              <Button
                onClick={() => router.push("/dashboard/clients")}
                className='w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'>
                <ChevronLeft className='mr-2 h-4 w-4' />
                Volver a la lista de clientes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className='relative overflow-hidden min-h-screen py-8'>
      <BackgroundBlobs />

      <div className='container mx-auto px-4 relative z-10 space-y-8'>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
          <Breadcrumb
            items={[
              { label: "Volver", href: "/dashboard/clients" },
              { label: "Detalle del Cliente", href: "#" },
            ]}
          />
          <div className='flex items-center'>
            <Button
              variant='ghost'
              className='flex items-center text-purple-700 hover:text-purple-900 hover:bg-purple-50 mr-2'
              onClick={() => router.push("/dashboard/clients")}>
              <ChevronLeft className='mr-1 h-4 w-4' />
              Volver
            </Button>
            <span className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
              Detalle del Cliente
            </span>
          </div>
          <div className='flex flex-wrap gap-2'>
            <Button
              onClick={handleImpersonate}
              disabled={impersonating}
              className='bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'>
              {impersonating ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <LogIn className='mr-2 h-4 w-4' />
              )}
              Impersonar
            </Button>
            {!editing ? (
              <Button
                onClick={handleEdit}
                className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'>
                <Edit className='mr-2 h-4 w-4' /> Editar
              </Button>
            ) : null}
            <Button
              variant='destructive'
              onClick={handleDelete}
              disabled={deletingClient}>
              {deletingClient ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <Trash2 className='mr-2 h-4 w-4' />
              )}
              Eliminar
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            {client.firstName} {client.lastName}
          </h2>
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto'></div>
        </motion.div>

        {message && (
          <Alert
            className={`${
              messageType === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}>
            {messageType === "success" ? (
              <CheckCircle className='h-4 w-4 text-green-600' />
            ) : (
              <AlertCircle className='h-4 w-4 text-red-600' />
            )}
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg'>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <div className='bg-purple-100 p-3 rounded-full'>
                  <User className='h-6 w-6 text-purple-700' />
                </div>
                <div>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>
                    Datos personales y de contacto del cliente
                  </CardDescription>
                </div>
                <div className='space-y-2'>
                  <div className='flex items-center gap-3'>
                    {client.verified && (
                      <Badge variant='default'>Verificado</Badge>
                    )}
                    <div className='flex items-center'>
                      <Label htmlFor='verify-switch' className='sr-only'>
                        Verificar
                      </Label>
                      <button
                        id='verify-switch'
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                          client.verified ? "bg-green-500" : "bg-gray-300"
                        }`}
                        onClick={handleToggleVerify}
                        disabled={isVerifying}>
                        <span
                          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                            client.verified ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                      <span className='ml-2 text-sm text-gray-700'>
                        {isVerifying
                          ? "Procesando..."
                          : client.verified
                          ? "Sí"
                          : "No"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col md:flex-row items-start gap-8'>
                {/* Avatar */}
                <div className='flex flex-col items-center'>
                  <div className='w-28 h-28 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg'>
                    {client.firstName?.[0] ?? ""}
                    {client.lastName?.[0] ?? ""}
                  </div>
                  <div className='mt-4 text-center'>
                    <Badge
                      variant='outline'
                      className='bg-purple-50 text-purple-700'>
                      ID: {client.id}
                    </Badge>
                    {client.createdAt && (
                      <p className='text-xs text-gray-500 mt-2 flex items-center justify-center'>
                        <Calendar className='h-3 w-3 mr-1' />
                        Cliente desde{" "}
                        {new Date(client.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Información */}
                <div className='flex-1 space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                      <Label className='flex items-center gap-2 text-gray-700'>
                        <Mail className='h-4 w-4 text-purple-600' />
                        Email
                      </Label>
                      {editing ? (
                        <Input
                          name='email'
                          value={editData.email || ""}
                          onChange={handleInputChange}
                          className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                        />
                      ) : (
                        <p className='font-medium text-gray-900 p-2'>
                          {client.email}
                        </p>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <Label className='flex items-center gap-2 text-gray-700'>
                        <Phone className='h-4 w-4 text-purple-600' />
                        Teléfono
                      </Label>
                      {editing ? (
                        <Input
                          name='phone'
                          value={editData.phone || ""}
                          onChange={handleInputChange}
                          className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                        />
                      ) : (
                        <p className='font-medium text-gray-900 p-2'>
                          {client.phone || "No especificado"}
                        </p>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <Label className='flex items-center gap-2 text-gray-700'>
                        <User className='h-4 w-4 text-purple-600' />
                        Nombre
                      </Label>
                      {editing ? (
                        <Input
                          name='firstName'
                          value={editData.firstName || ""}
                          onChange={handleInputChange}
                          className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                        />
                      ) : (
                        <p className='font-medium text-gray-900 p-2'>
                          {client.firstName}
                        </p>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <Label className='flex items-center gap-2 text-gray-700'>
                        <User className='h-4 w-4 text-purple-600' />
                        Apellidos
                      </Label>
                      {editing ? (
                        <Input
                          name='lastName'
                          value={editData.lastName || ""}
                          onChange={handleInputChange}
                          className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                        />
                      ) : (
                        <p className='font-medium text-gray-900 p-2'>
                          {client.lastName}
                        </p>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <Label className='flex items-center gap-2 text-gray-700'>
                        <Briefcase className='h-4 w-4 text-purple-600' />
                        Categoría Profesional
                      </Label>
                      {editing ? (
                        <Input
                          name='professionalCategory'
                          value={editData.professionalCategory || ""}
                          onChange={handleInputChange}
                          className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                        />
                      ) : (
                        <p className='font-medium text-gray-900 p-2'>
                          {client.professionalCategory || "No especificado"}
                        </p>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <Label className='flex items-center gap-2 text-gray-700'>
                        <MapPin className='h-4 w-4 text-purple-600' />
                        Ubicación
                      </Label>
                      {editing ? (
                        <div className='grid grid-cols-3 gap-2'>
                          <Input
                            name='country'
                            value={editData.country || ""}
                            onChange={handleInputChange}
                            placeholder='País'
                            className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                          />
                          <Input
                            name='autonomousCommunity'
                            value={editData.autonomousCommunity || ""}
                            onChange={handleInputChange}
                            placeholder='Comunidad'
                            className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                          />
                          <Input
                            name='province'
                            value={editData.province || ""}
                            onChange={handleInputChange}
                            placeholder='Provincia'
                            className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                          />
                        </div>
                      ) : (
                        <p className='font-medium text-gray-900 p-2'>
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
                    <div className='space-y-2'>
                      <Label className='flex items-center gap-2 text-gray-700'>
                        <Bell className='h-4 w-4 text-purple-600' />
                        Notificaciones
                      </Label>
                      <div className='flex items-center gap-4'>
                        <p className='font-medium text-gray-900'>
                          {Number(client.infoAccepted) === 1
                            ? "Aceptadas"
                            : "No aceptadas"}
                        </p>
                        <span className='text-sm text-gray-500'>
                          IP: {client.deviceIp || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {editing && (
                <div className='flex gap-3 mt-8 justify-end'>
                  <Button
                    onClick={handleSave}
                    disabled={savingChanges}
                    className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'>
                    {savingChanges ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />{" "}
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className='mr-2 h-4 w-4' /> Guardar Cambios
                      </>
                    )}
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => setEditing(false)}
                    className='border-gray-200 text-gray-700 hover:bg-gray-50'>
                    <X className='mr-2 h-4 w-4' /> Cancelar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        {/* Sección Cambiar Contraseña */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}>
          <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg'>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <div className='bg-red-100 p-3 rounded-full'>
                  <Key className='h-6 w-6 text-red-700' />
                </div>
                <div>
                  <CardTitle>Cambiar Contraseña</CardTitle>
                  <CardDescription>
                    Establecer nueva contraseña para el cliente
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label className='flex items-center gap-2 text-gray-700'>
                    <Key className='h-4 w-4 text-red-600' /> Nueva Contraseña
                  </Label>
                  <Input
                    type='password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder='Al menos 8 caracteres'
                    className='border-gray-200 focus:border-red-300 focus:ring-red-200'
                  />
                </div>
                {pwdMessage && (
                  <Alert
                    className={`${
                      pwdType === "success"
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}>
                    {pwdType === "success" ? (
                      <CheckCircle className='h-4 w-4 text-green-600' />
                    ) : (
                      <AlertCircle className='h-4 w-4 text-red-600' />
                    )}
                    <AlertDescription>{pwdMessage}</AlertDescription>
                  </Alert>
                )}
                <div className='flex justify-end'>
                  <Button
                    onClick={handleChangePassword}
                    className='bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white'>
                    Cambiar Contraseña
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Sección de Pagos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}>
          <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg'>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <div className='bg-green-100 p-3 rounded-full'>
                  <CreditCard className='h-6 w-6 text-green-700' />
                </div>
                <div>
                  <CardTitle>Pagos Realizados</CardTitle>
                  <CardDescription>
                    Historial de transacciones del cliente
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <div className='text-center py-8'>
                  <CreditCard className='h-12 w-12 text-gray-300 mx-auto mb-3' />
                  <p className='text-gray-500'>
                    No se encontraron pagos para este cliente.
                  </p>
                </div>
              ) : (
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead className='bg-green-50 text-green-900'>
                      <tr>
                        <th className='px-4 py-3 text-left'>ID</th>
                        <th className='px-4 py-3 text-left'>Monto</th>
                        <th className='px-4 py-3 text-left'>Fecha</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100'>
                      {payments.map((p) => (
                        <tr
                          key={p.id}
                          className='hover:bg-green-50/50 transition-colors'>
                          <td className='px-4 py-3'>
                            <Badge
                              variant='outline'
                              className='bg-green-50 text-green-700'>
                              {p.id}
                            </Badge>
                          </td>
                          <td className='px-4 py-3 font-medium'>{p.amount}€</td>
                          <td className='px-4 py-3 flex items-center'>
                            <Calendar className='h-3 w-3 mr-2 text-gray-400' />
                            {new Date(p.date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sección de Libros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}>
          <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg'>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <div className='bg-blue-100 p-3 rounded-full'>
                  <BookOpen className='h-6 w-6 text-blue-700' />
                </div>
                <div>
                  <CardTitle>Libros Propios</CardTitle>
                  <CardDescription>
                    Libros publicados por el cliente
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {books.length === 0 ? (
                <div className='text-center py-8'>
                  <BookOpen className='h-12 w-12 text-gray-300 mx-auto mb-3' />
                  <p className='text-gray-500'>
                    No se encontraron libros para este cliente.
                  </p>
                </div>
              ) : (
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead className='bg-blue-50 text-blue-900'>
                      <tr>
                        <th className='px-4 py-3 text-left'>ID</th>
                        <th className='px-4 py-3 text-left'>Título</th>
                        <th className='px-4 py-3 text-left'>Precio</th>
                        <th className='px-4 py-3 text-left'>Publicación</th>
                        <th className='px-4 py-3 text-left'>Estado</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100'>
                      {books.map((book) => (
                        <tr
                          key={book.id}
                          className='hover:bg-blue-50/50 transition-colors'>
                          <td className='px-4 py-3'>
                            <Badge
                              variant='outline'
                              className='bg-blue-50 text-blue-700'>
                              {book.id}
                            </Badge>
                          </td>
                          <td className='px-4 py-3 font-medium'>
                            {book.title}
                          </td>
                          <td className='px-4 py-3'>{book.price}€</td>
                          <td className='px-4 py-3 flex items-center'>
                            <Calendar className='h-3 w-3 mr-2 text-gray-400' />
                            {book.publishDate
                              ? new Date(book.publishDate).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className='px-4 py-3'>
                            <Badge
                              variant={
                                book.status === "published"
                                  ? "default"
                                  : book.status === "draft"
                                  ? "secondary"
                                  : "outline"
                              }>
                              {book.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sección de Capítulos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}>
          <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg'>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <div className='bg-yellow-100 p-3 rounded-full'>
                  <FileText className='h-6 w-6 text-yellow-700' />
                </div>
                <div>
                  <CardTitle>Capítulos en libros Personalizados</CardTitle>
                  <CardDescription>
                    Capítulos escritos por el cliente
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {chapters.length === 0 ? (
                <div className='text-center py-8'>
                  <FileText className='h-12 w-12 text-gray-300 mx-auto mb-3' />
                  <p className='text-gray-500'>
                    No se encontraron capítulos para este cliente.
                  </p>
                </div>
              ) : (
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead className='bg-yellow-50 text-yellow-900'>
                      <tr>
                        <th className='px-4 py-3 text-left'>ID</th>
                        <th className='px-4 py-3 text-left'>Título</th>
                        <th className='px-4 py-3 text-left'>Estado</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100'>
                      {chapters.map((chapter) => (
                        <tr
                          key={chapter.id}
                          className='hover:bg-yellow-50/50 transition-colors'>
                          <td className='px-4 py-3'>
                            <Badge
                              variant='outline'
                              className='bg-yellow-50 text-yellow-700'>
                              {chapter.id}
                            </Badge>
                          </td>
                          <td className='px-4 py-3 font-medium'>
                            {chapter.title}
                          </td>
                          <td className='px-4 py-3'>
                            <Badge
                              variant={
                                chapter.status === "published"
                                  ? "default"
                                  : chapter.status === "draft"
                                  ? "secondary"
                                  : "outline"
                              }>
                              {chapter.status || "N/A"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
