"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/breadcrumb";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  UserPlus,
  Eye,
  ChevronLeft,
  ChevronRight,
  Users,
  Mail,
  Phone,
  LogIn,
  Loader2,
} from "lucide-react";

type Client = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  verified: number;
  createdAt: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // único filtro
  const [currentPage, setCurrentPage] = useState(1);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const clientsPerPage = 10;

  // Para ordenación
  const [sortColumn, setSortColumn] = useState<
    "name" | "email" | "createdAt" | "verified" | null
  >(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/clients`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setClients(data?.users ?? []);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  // 1) Filtrado único por nombre completo O por email
  const filtered = clients.filter((c) => {
    const term = searchTerm.toLowerCase();
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    return fullName.includes(term) || c.email.toLowerCase().includes(term);
  });

  // 2) Ordenación sobre el array filtrado
  const sorted = [...filtered].sort((a, b) => {
    if (!sortColumn) return 0;
    let aVal: string | number = "";
    let bVal: string | number = "";

    switch (sortColumn) {
      case "name":
        aVal = `${a.firstName} ${a.lastName}`.toLowerCase();
        bVal = `${b.firstName} ${b.lastName}`.toLowerCase();
        break;
      case "email":
        aVal = a.email.toLowerCase();
        bVal = b.email.toLowerCase();
        break;
      case "createdAt":
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
        break;
      case "verified":
        aVal = a.verified;
        bVal = b.verified;
        break;
    }
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // 3) Paginación
  const totalPages = Math.ceil(sorted.length / clientsPerPage);
  const current = sorted.slice(
    (currentPage - 1) * clientsPerPage,
    currentPage * clientsPerPage
  );

  const handleSort = (col: "name" | "email" | "createdAt" | "verified") => {
    if (sortColumn === col) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(col);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const handleImpersonate = async (id: string) => {
    try {
      const adminToken = localStorage.getItem("token")!;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/impersonate/${id}`,
        { method: "POST", headers: { Authorization: `Bearer ${adminToken}` } }
      );
      if (!res.ok) throw new Error("No autorizado");
      const { impersonationToken } = await res.json();
      localStorage.setItem("adminToken", adminToken);
      localStorage.setItem("token", impersonationToken);
      const base =
        process.env.NEXT_PUBLIC_PLATFORM_URL ||
        "https://main.dh6wi9rwkxpif.amplifyapp.com";
      window.location.href = `${base}/impersonate?token=${encodeURIComponent(
        impersonationToken
      )}`;
    } catch (err: any) {
      alert(err.message || "Error al impersonar cliente");
    }
  };
  // Toggle verificación en la lista
  const handleToggleVerifyList = async (clientId: string) => {
    try {
      setVerifyingId(clientId);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/clients/${clientId}/verify`,
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
      // Actualiza solo ese cliente en el array
      setClients((prev) =>
        prev.map((c) =>
          c.id === clientId ? { ...c, verified: updated.verified } : c
        )
      );
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setVerifyingId(null);
    }
  };
  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='relative'>
          <div className='h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin'></div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <Users className='h-6 w-6 text-purple-500' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='relative overflow-hidden py-8'>
      {/* Fondo */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 to-white' />
        <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob' />
        <div className='absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000' />
      </div>

      <div className='container mx-auto px-4 relative z-10 space-y-8'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex items-center justify-between'>
          <Breadcrumb items={[{ label: "Gestión de Clientes", href: "#" }]} />
          <Link href='/dashboard/clients/new'>
            <Button className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'>
              <UserPlus className='mr-2 h-4 w-4' />
              Nuevo Cliente
            </Button>
          </Link>
        </motion.div>

        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            Clientes Registrados
          </h2>
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto' />
        </motion.div>

        {/* Único buscador */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='flex flex-col md:flex-row justify-between items-center gap-4 mb-6'>
          <div className='relative w-full md:w-auto flex-1 max-w-md'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
            <input
              type='text'
              placeholder='Buscar por nombre o correo...'
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className='pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 w-full'
            />
          </div>
          <Badge variant='default' className='py-1.5'>
            {filtered.length} resultados
          </Badge>
        </motion.div>

        {clients.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-lg border border-white/50 text-center'>
            <div className='flex flex-col items-center justify-center p-8'>
              <Users className='w-16 h-16 text-purple-300 mb-4' />
              <h3 className='text-xl font-semibold text-gray-700 mb-2'>
                No hay clientes registrados
              </h3>
              <p className='text-gray-500 mb-6'>
                Comienza añadiendo tu primer cliente a la plataforma
              </p>
              <Link href='/dashboard/clients/new'>
                <Button className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300'>
                  <UserPlus className='mr-2 h-4 w-4' />
                  Añadir Cliente
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg'>
            <CardHeader>
              <div className='flex justify-between items-center'>
                <CardTitle>Lista de Clientes</CardTitle>
                <CardDescription>
                  Gestiona tus clientes desde aquí
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-purple-50 text-purple-900'>
                    <tr>
                      <th
                        className='px-4 py-3 text-left cursor-pointer select-none'
                        onClick={() => handleSort("name")}>
                        Cliente{" "}
                        {sortColumn === "name"
                          ? sortDirection === "asc"
                            ? "▲"
                            : "▼"
                          : ""}
                      </th>
                      <th
                        className='px-4 py-3 text-left cursor-pointer select-none'
                        onClick={() => handleSort("email")}>
                        Correo{" "}
                        {sortColumn === "email"
                          ? sortDirection === "asc"
                            ? "▲"
                            : "▼"
                          : ""}
                      </th>
                      <th
                        className='px-4 py-3 text-left cursor-pointer select-none'
                        onClick={() => handleSort("createdAt")}>
                        Registro{" "}
                        {sortColumn === "createdAt"
                          ? sortDirection === "asc"
                            ? "▲"
                            : "▼"
                          : ""}
                      </th>
                      <th
                        className='px-4 py-3 text-left cursor-pointer select-none'
                        onClick={() => handleSort("verified")}>
                        Verificado{" "}
                        {sortColumn === "verified"
                          ? sortDirection === "asc"
                            ? "▲"
                            : "▼"
                          : ""}
                      </th>
                      <th className='px-4 py-3 text-center'>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-100'>
                    {current.map((c) => {
                      const date = new Date(c.createdAt);
                      const isVer = Number(c.verified) === 1;
                      return (
                        <tr
                          key={c.id}
                          className='hover:bg-purple-50/50 transition-colors'>
                          <td className='px-4 py-4'>
                            <div className='flex items-center gap-3'>
                              <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-sm font-bold'>
                                {c.firstName.charAt(0)}
                                {c.lastName.charAt(0)}
                              </div>
                              <div>
                                <p className='font-medium text-gray-900'>
                                  {c.firstName} {c.lastName}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className='px-4 py-4'>
                            <p className='text-sm flex items-center'>
                              <Mail className='h-3 w-3 mr-1 text-gray-400' />
                              {c.email}
                            </p>
                          </td>
                          <td className='px-4 py-4'>
                            <div className='flex flex-col text-sm'>
                              <span>{date.toLocaleDateString()}</span>
                              <span className='text-gray-500'>
                                {date.toLocaleTimeString()}
                              </span>
                            </div>
                          </td>
                          <td className='px-4 py-4 flex items-center justify-center'>
                            <Badge
                              variant={isVer ? "default" : "outline"}
                              className={
                                !isVer ? "bg-orange-50 text-orange-700" : ""
                              }>
                              {isVer ? "Sí" : "No"}
                            </Badge>
                            <label className='flex items-center cursor-pointer'>
                              <input
                                type='checkbox'
                                className='hidden'
                                checked={isVer}
                                disabled={verifyingId === c.id}
                                onChange={() => handleToggleVerifyList(c.id)}
                              />
                              <span
                                className={`relative inline-block w-10 h-6 transition-colors duration-200 ease-in-out rounded-full ${
                                  verifyingId === c.id
                                    ? "bg-gray-300"
                                    : isVer
                                    ? "bg-green-500"
                                    : "bg-gray-400"
                                }`}>
                                <span
                                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
                                    isVer ? "translate-x-4" : ""
                                  }`}
                                />
                              </span>
                            </label>
                          </td>
                          <td className='px-4 py-4 text-center'>
                            <div className='flex justify-center items-center gap-2'>
                              <Link href={`/dashboard/clients/${c.id}`}>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  className='border-purple-200 text-purple-700 hover:bg-purple-50'>
                                  <Eye className='h-4 w-4' />
                                </Button>
                              </Link>
                              <Button
                                onClick={() => handleImpersonate(c.id)}
                                variant='ghost'
                                size='icon'
                                className='text-green-600 hover:bg-green-50'>
                                <LogIn className='h-4 w-4' />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className='flex justify-between items-center mt-6'>
                  <p className='text-sm text-gray-500'>
                    Mostrando {(currentPage - 1) * clientsPerPage + 1} a{" "}
                    {Math.min(currentPage * clientsPerPage, sorted.length)} de{" "}
                    {sorted.length} clientes
                  </p>
                  <div className='flex gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
                      <ChevronLeft className='h-4 w-4' />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <Button
                          key={p}
                          variant={currentPage === p ? "default" : "outline"}
                          size='sm'
                          onClick={() => setCurrentPage(p)}>
                          {p}
                        </Button>
                      )
                    )}
                    <Button
                      variant='outline'
                      size='sm'
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }>
                      <ChevronRight className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
