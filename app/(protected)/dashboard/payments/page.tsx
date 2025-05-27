"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BackgroundBlobs } from "@/components/background-blobs";
import { Breadcrumb } from "@/components/breadcrumb";
import {
  DollarSign,
  Plus,
  Search,
  Filter,
  AlertCircle,
  CreditCard,
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
  LayoutGrid,
  List,
  Download,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

// Tipo de dato del pago
type Payment = {
  id: string;
  userId: string;
  amount: number | string;
  method: string;
  status: string;
  paymentDate: string;
  invoiced: number; // 0 o 1
  editionId?: string; // ← NUEVO: pago de edición
  bookId?: string;
};

// Tipo de dato del cliente
type Client = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  address: string;
  country: string;
  autonomousCommunity: string;
  province: string;
  professionalCategory: string;
  interests: string;
  verified: boolean;
  state: string;
  roleId: string;
  createdAt: string;
  updatedAt: string;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [invoicedFilter, setInvoicedFilter] = useState<string>("all");
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const handleMouseEnter = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: false }));
  };

  // Fetch de pagos
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/payments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Error al cargar pagos");
        }
        const data = await res.json();
        const paymentsArray = Array.isArray(data) ? data : data.payments ?? [];
        setPayments(paymentsArray);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchPayments();
  }, []);

  // Fetch de clientes
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Error al cargar clientes");
        }
        const data = await res.json();
        const clientsArray = Array.isArray(data) ? data : data.clients ?? [];
        console.log(clientsArray);
        setClients(clientsArray);
      } catch (err: any) {
        console.error("Error al cargar los clientes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Función para formatear la fecha en español (DD/MM/YYYY)
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      return "Fecha inválida";
    }
  };

  // Función para formatear el monto con símbolo de €
  const formatCurrency = (amount: number | string) => {
    try {
      const numAmount =
        typeof amount === "number" ? amount : Number.parseFloat(amount);
      return `${numAmount.toFixed(2)} €`;
    } catch (e) {
      return "0.00 €";
    }
  };

  // Conversión de estado al texto en español
  const getStatusDisplay = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "Completado";
      case "canceled":
      case "cancelled":
        return "Cancelado";
      case "pending":
        return "Pendiente";
      case "processing":
        return "Procesando";
      case "refunded":
        return "Reembolsado";
      default:
        return status;
    }
  };

  // Función para obtener datos del cliente a partir del userId del pago
  const getClientData = (userId: string): Client | undefined => {
    const trimmedUserId = userId.trim().toLowerCase().replace(/\s/g, "");
    return clients.find((client) => {
      const trimmedClientId = client.id.trim().toLowerCase().replace(/\s/g, "");
      return trimmedClientId === trimmedUserId;
    });
  };

  // Función para obtener el color del badge según el estado
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "default"; // Map "green" to "default"
      case "canceled":
      case "cancelled":
        return "destructive";
      case "pending":
        return "secondary"; // Map "yellow" to "secondary"
      case "processing":
        return "default"; // Map "blue" to "default"
      case "refunded":
        return "secondary"; // Map "purple" to "secondary"
      default:
        return "outline";
    }
  };

  // Obtener los métodos de pago únicos para el filtro
  const uniqueMethods = Array.from(
    new Set(payments.map((payment) => payment.method))
  ).filter(Boolean);

  // Obtener los estados únicos para el filtro
  const uniqueStatuses = Array.from(
    new Set(payments.map((payment) => payment.status))
  ).filter(Boolean);

  // Filtrar pagos por búsqueda y filtros
  const filteredPayments = payments.filter((payment) => {
    const client = getClientData(payment.userId);

    // Búsqueda por término
    const searchFields = [
      client?.firstName,
      client?.lastName,
      client?.email,
      client?.phone,
      client?.id,
      payment.method,
      getStatusDisplay(payment.status),
      formatCurrency(payment.amount),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      searchTerm === "" || searchFields.includes(searchTerm.toLowerCase());

    // Filtro por estado
    const matchesStatus =
      statusFilter === "all" ||
      payment.status.toLowerCase() === statusFilter.toLowerCase();

    // Filtro por método
    const matchesMethod =
      methodFilter === "all" ||
      payment.method.toLowerCase() === methodFilter.toLowerCase();

    // Filtro por facturado
    const matchesInvoiced =
      invoicedFilter === "all" ||
      (invoicedFilter === "yes" && payment.invoiced === 1) ||
      (invoicedFilter === "no" && payment.invoiced === 0);

    return matchesSearch && matchesStatus && matchesMethod && matchesInvoiced;
  });
  useEffect(() => {
    setPayments((prev) =>
      [...prev].sort((a, b) => {
        const ta = new Date(a.paymentDate).getTime();
        const tb = new Date(b.paymentDate).getTime();
        return sortOrder === "desc" ? tb - ta : ta - tb;
      })
    );
  }, [sortOrder]);

  if (loading) {
    return (
      <div className='relative overflow-hidden min-h-screen py-8'>
        <BackgroundBlobs />
        <div className='container mx-auto px-4 relative z-10'>
          <div className='flex items-center justify-center h-64'>
            <div className='relative'>
              <div className='h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin'></div>
              <div className='absolute inset-0 flex items-center justify-center'>
                <DollarSign className='h-6 w-6 text-purple-500' />
              </div>
            </div>
          </div>
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
          className='flex items-center justify-between'>
          <Breadcrumb items={[{ label: "Gestión de Pagos", href: "#" }]} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            Gestión de Pagos
          </h2>
          <p className='text-gray-600 text-sm md:text-base'>
            Administra todos los pagos de clientes desde un solo lugar
          </p>
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto'></div>
        </motion.div>

        {error && (
          <Alert className='bg-red-50 border-red-200 text-red-800 mb-6'>
            <AlertCircle className='h-4 w-4 text-red-600' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='flex flex-col md:flex-row justify-between items-center gap-4 mb-6'>
          <div className='relative w-full md:w-auto flex-1 max-w-md'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
            <input
              type='text'
              placeholder='Buscar pagos...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 w-full'
            />
          </div>
          <div className='flex items-center gap-3'>
            <Badge variant='default' className='py-1.5'>
              {filteredPayments.length} pagos encontrados
            </Badge>
            <div className='flex items-center border rounded-lg overflow-hidden'>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
                title='Vista de cuadrícula'>
                <LayoutGrid className='h-5 w-5' />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
                title='Vista de lista'>
                <List className='h-5 w-5' />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='flex flex-col md:flex-row gap-4 mb-6'>
          <div className='flex items-center gap-2'>
            <Filter className='h-4 w-4 text-purple-600' />
            <span className='text-sm font-medium text-gray-700'>
              Filtrar por estado:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 text-sm'>
              <option value='all'>Todos los estados</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status.toLowerCase()}>
                  {getStatusDisplay(status)}
                </option>
              ))}
            </select>
          </div>

          <div className='flex items-center gap-2'>
            <CreditCard className='h-4 w-4 text-purple-600' />
            <span className='text-sm font-medium text-gray-700'>
              Filtrar por método:
            </span>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className='px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 text-sm'>
              <option value='all'>Todos los métodos</option>
              {uniqueMethods.map((method) => (
                <option key={method} value={method.toLowerCase()}>
                  {method}
                </option>
              ))}
            </select>
          </div>
          <div className='flex items-center gap-2'>
            <Clock className='h-4 w-4 text-purple-600' />
            <span className='text-sm font-medium text-gray-700'>Ordenar:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "desc" | "asc")}
              className='px-2 py-1 rounded-lg border border-gray-200 text-sm'>
              <option value='desc'>Más recientes</option>
              <option value='asc'>Más antiguos</option>
            </select>
          </div>
          <div className='flex items-center gap-2'>
            <FileText className='h-4 w-4 text-purple-600' />
            <span className='text-sm font-medium text-gray-700'>
              Facturado:
            </span>
            <select
              value={invoicedFilter}
              onChange={(e) => setInvoicedFilter(e.target.value)}
              className='px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 text-sm'>
              <option value='all'>Todos</option>
              <option value='yes'>Facturado</option>
              <option value='no'>No facturado</option>
            </select>
          </div>
        </motion.div>

        {filteredPayments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-lg border border-white/50 text-center'>
            <div className='flex flex-col items-center justify-center p-8'>
              <DollarSign className='w-16 h-16 text-purple-300 mb-4' />
              <h3 className='text-xl font-semibold text-gray-700 mb-2'>
                No se encontraron pagos
              </h3>
              <p className='text-gray-500 mb-6'>
                {searchTerm
                  ? "No se encontraron pagos que coincidan con tu búsqueda."
                  : statusFilter !== "all" ||
                    methodFilter !== "all" ||
                    invoicedFilter !== "all"
                  ? "No hay pagos que coincidan con los filtros seleccionados."
                  : "No hay pagos registrados."}
              </p>
              <Link href='/dashboard/payments/new'>
                <Button className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300'>
                  <Plus className='mr-2 h-4 w-4' />
                  Registrar Pago
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : viewMode === "grid" ? (
          // Vista de cuadrícula
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredPayments.map((payment, index) => {
              const client = getClientData(payment.userId);

              return (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}>
                  <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg overflow-hidden h-full hover:shadow-xl transition-shadow'>
                    <CardHeader className='pb-2'>
                      <div className='flex justify-between items-start'>
                        <div>
                          <CardTitle className='text-lg font-bold'>
                            {client
                              ? `${client.firstName} ${client.lastName}`
                              : "Cliente desconocido"}
                          </CardTitle>
                          <p className='text-sm text-gray-500'>
                            {client ? client.id : payment.userId}
                          </p>
                        </div>
                        <Badge variant={getStatusBadgeVariant(payment.status)}>
                          {getStatusDisplay(payment.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className='pt-2'>
                      <div className='space-y-3'>
                        <div className='flex justify-between items-center'>
                          <div className='flex items-center text-sm text-gray-600'>
                            <DollarSign className='h-4 w-4 mr-2 text-purple-600 flex-shrink-0' />
                            <span className='font-medium'>Monto:</span>
                          </div>
                          <span className='text-lg font-bold text-gray-900'>
                            {formatCurrency(payment.amount)}
                          </span>
                        </div>

                        <div className='flex items-center text-sm text-gray-600'>
                          <CreditCard className='h-4 w-4 mr-2 text-purple-600 flex-shrink-0' />
                          <span className='font-medium'>Método:</span>
                          <span className='ml-2'>{payment.method}</span>
                        </div>

                        <div className='flex items-center text-sm text-gray-600'>
                          <Calendar className='h-4 w-4 mr-2 text-purple-600 flex-shrink-0' />
                          <span className='font-medium'>Fecha:</span>
                          <span className='ml-2'>
                            {formatDate(payment.paymentDate)}
                          </span>
                        </div>

                        <div className='flex items-center text-sm text-gray-600'>
                          <FileText className='h-4 w-4 mr-2 text-purple-600 flex-shrink-0' />
                          <span className='font-medium'>Facturado:</span>
                          <span className='ml-2'>
                            {payment.invoiced === 1 ? "Sí" : "No"}
                          </span>
                        </div>
                        <div className='flex items-center text-sm text-gray-600'>
                          <FileText className='h-4 w-4 mr-2 text-purple-600 flex-shrink-0' />
                          <span className='font-medium'>Tipo:</span>
                          <Badge variant='outline' className='ml-2'>
                            {payment.editionId
                              ? "Edición"
                              : "Libro Personalizado"}
                          </Badge>
                        </div>
                        {client && (
                          <>
                            <div className='flex items-center text-sm text-gray-600'>
                              <Mail className='h-4 w-4 mr-2 text-purple-600 flex-shrink-0' />
                              <span className='font-medium'>Email:</span>
                              <span className='ml-2 truncate'>
                                {client.email}
                              </span>
                            </div>

                            {client.phone && (
                              <div className='flex items-center text-sm text-gray-600'>
                                <Phone className='h-4 w-4 mr-2 text-purple-600 flex-shrink-0' />
                                <span className='font-medium'>Teléfono:</span>
                                <span className='ml-2'>{client.phone}</span>
                              </div>
                            )}
                          </>
                        )}

                        <div className='flex justify-end mt-4 gap-2'>
                          {payment.invoiced === 1 && (
                            <Button
                              variant='outline'
                              size='sm'
                              className='border-green-200 text-green-700 hover:bg-green-50'
                              onMouseEnter={() =>
                                handleMouseEnter(`invoice-${payment.id}`)
                              }
                              onMouseLeave={() =>
                                handleMouseLeave(`invoice-${payment.id}`)
                              }>
                              <motion.span
                                className='flex items-center'
                                animate={{
                                  x: hoverStates[`invoice-${payment.id}`]
                                    ? 2
                                    : 0,
                                }}
                                transition={{ duration: 0.2 }}>
                                <Download className='mr-1 h-4 w-4' /> Factura
                              </motion.span>
                            </Button>
                          )}

                          <Link href={`/dashboard/payments/${payment.id}`}>
                            <Button
                              variant='outline'
                              size='sm'
                              className='border-purple-200 text-purple-700 hover:bg-purple-50'
                              onMouseEnter={() =>
                                handleMouseEnter(`view-${payment.id}`)
                              }
                              onMouseLeave={() =>
                                handleMouseLeave(`view-${payment.id}`)
                              }>
                              <motion.span
                                className='flex items-center'
                                animate={{
                                  x: hoverStates[`view-${payment.id}`] ? 2 : 0,
                                }}
                                transition={{ duration: 0.2 }}>
                                <DollarSign className='mr-1 h-4 w-4' /> Detalles
                              </motion.span>
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          // Vista de lista
          <div className='overflow-hidden rounded-xl border border-white/50 backdrop-blur-sm bg-white/80 shadow-lg'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-purple-50 text-purple-900'>
                  <tr>
                    <th className='px-4 py-3 text-left'>Cliente</th>
                    <th className='px-4 py-3 text-left'>Monto</th>
                    <th className='px-4 py-3 text-left'>Método</th>
                    <th className='px-4 py-3 text-left'>Fecha</th>
                    <th className='px-4 py-3 text-left'>Estado</th>
                    <th className='px-4 py-3 text-left'>Facturado</th>
                    <th className='px-4 py-3 text-left'>Tipo</th>
                    <th className='px-4 py-3 text-center'>Acciones</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                  {filteredPayments.map((payment) => {
                    const client = getClientData(payment.userId);

                    return (
                      <tr
                        key={payment.id}
                        className='hover:bg-purple-50/50 transition-colors'>
                        <td className='px-4 py-4'>
                          <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-sm font-bold'>
                              {client ? (
                                `${client.firstName.charAt(
                                  0
                                )}${client.lastName.charAt(0)}`
                              ) : (
                                <User className='h-5 w-5' />
                              )}
                            </div>
                            <div>
                              <p className='font-medium text-gray-900'>
                                {client
                                  ? `${client.firstName} ${client.lastName}`
                                  : "Cliente desconocido"}
                              </p>
                              <p className='text-xs text-gray-500'>
                                {client ? client.id : payment.userId}
                              </p>
                              {client && (
                                <p className='text-xs text-gray-500 flex items-center mt-1'>
                                  <Mail className='h-3 w-3 mr-1' />
                                  {client.email}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className='px-4 py-4 font-medium text-gray-900'>
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className='px-4 py-4'>
                          <Badge
                            variant='outline'
                            className='bg-purple-50 text-purple-700'>
                            <CreditCard className='h-3 w-3 mr-1' />
                            {payment.method}
                          </Badge>
                        </td>
                        <td className='px-4 py-4'>
                          <div className='flex items-center text-sm text-gray-600'>
                            <Calendar className='h-4 w-4 mr-1 text-purple-600' />
                            {formatDate(payment.paymentDate)}
                          </div>
                        </td>
                        <td className='px-4 py-4'>
                          <Badge
                            variant={getStatusBadgeVariant(payment.status)}>
                            {payment.status.toLowerCase() === "completed" ? (
                              <CheckCircle className='h-3 w-3 mr-1' />
                            ) : payment.status.toLowerCase() === "canceled" ||
                              payment.status.toLowerCase() === "cancelled" ? (
                              <XCircle className='h-3 w-3 mr-1' />
                            ) : (
                              <Clock className='h-3 w-3 mr-1' />
                            )}
                            {getStatusDisplay(payment.status)}
                          </Badge>
                        </td>
                        <td className='px-4 py-4'>
                          <Badge
                            variant={
                              payment.invoiced === 1 ? "default" : "secondary"
                            }>
                            {payment.invoiced === 1
                              ? "Facturado"
                              : "No facturado"}
                          </Badge>
                        </td>
                        <td className='px-4 py-4'>
                          <Badge
                            variant='outline'
                            className='bg-purple-50 text-purple-700'>
                            {payment.editionId
                              ? "Edición"
                              : "Libro Personalizado"}
                          </Badge>
                        </td>

                        <td className='px-4 py-4 text-center'>
                          <div className='flex justify-center gap-2'>
                            {payment.invoiced === 1 && (
                              <Button
                                variant='outline'
                                size='sm'
                                className='border-green-200 text-green-700 hover:bg-green-50'>
                                <Download className='mr-1 h-4 w-4' /> Factura
                              </Button>
                            )}
                            <Link href={`/dashboard/payments/${payment.id}`}>
                              <Button
                                variant='outline'
                                size='sm'
                                className='border-purple-200 text-purple-700 hover:bg-purple-50'>
                                <DollarSign className='mr-1 h-4 w-4' /> Detalles
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
