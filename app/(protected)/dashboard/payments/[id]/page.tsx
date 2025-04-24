"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BackgroundBlobs } from "@/components/background-blobs";
import { Breadcrumb } from "@/components/breadcrumb";
import {
  DollarSign,
  ChevronLeft,
  CreditCard,
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Building,
  AlertCircle,
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
  description?: string;
  reference?: string;
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

export default function PaymentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/payments/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Error al cargar el pago");
        }
        const data = await res.json();
        setPayment(data);

        // Fetch del cliente asociado al pago
        if (data.userId) {
          const clientRes = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/users/${data.userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (clientRes.ok) {
            const clientData = await clientRes.json();
            setClient(clientData);
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPayment();
  }, [id]);

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

  // Función para obtener el color del badge según el estado
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "default";
      case "canceled":
      case "cancelled":
        return "destructive";
      case "pending":
        return "secondary";
      case "processing":
        return "default";
      case "refunded":
        return "outline";
      default:
        return "outline";
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
                <DollarSign className='h-6 w-6 text-purple-500' />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className='relative overflow-hidden min-h-screen py-8'>
        <BackgroundBlobs />
        <div className='container mx-auto px-4 relative z-10'>
          <Alert className='bg-red-50 border-red-200 text-red-800 mb-6 max-w-md mx-auto'>
            <AlertCircle className='h-4 w-4 text-red-600' />
            <AlertDescription>
              {error ||
                "No se pudo encontrar la información del pago solicitado"}
            </AlertDescription>
          </Alert>
          <div className='flex justify-center mt-4'>
            <Button
              onClick={() => router.push("/dashboard/payments")}
              className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'>
              <ChevronLeft className='mr-2 h-4 w-4' />
              Volver a la lista de pagos
            </Button>
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
          <Breadcrumb>
            <Button
              variant='ghost'
              className='flex items-center text-purple-700 hover:text-purple-900 hover:bg-purple-50 mr-2'
              onClick={() => router.push("/dashboard/payments")}>
              <ChevronLeft className='mr-1 h-4 w-4' />
              Volver a Pagos
            </Button>
            <span className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
              Detalle del Pago
            </span>
          </Breadcrumb>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            Detalle del Pago
          </h2>
          <div className='flex justify-center items-center gap-3 mb-4'>
            <Badge
              variant={getStatusBadgeVariant(payment.status)}
              className='text-sm py-1 px-3'>
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
            <Badge
              variant='outline'
              className='bg-purple-50 text-purple-700 text-sm py-1 px-3'>
              <CreditCard className='h-3 w-3 mr-1' />
              {payment.method}
            </Badge>
          </div>
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto'></div>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Información del pago */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg h-full'>
              <CardHeader>
                <div className='flex items-center gap-3'>
                  <div className='bg-purple-100 p-3 rounded-full'>
                    <DollarSign className='h-6 w-6 text-purple-700' />
                  </div>
                  <div>
                    <CardTitle>Información del Pago</CardTitle>
                    <CardDescription>
                      Detalles de la transacción
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='flex justify-between items-center p-4 bg-purple-50 rounded-lg'>
                  <span className='text-lg font-medium text-purple-800'>
                    Monto Total
                  </span>
                  <span className='text-2xl font-bold text-purple-900'>
                    {formatCurrency(payment.amount)}
                  </span>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <p className='text-sm font-medium text-gray-500'>
                      ID del Pago
                    </p>
                    <p className='font-medium text-gray-900'>{payment.id}</p>
                  </div>

                  <div className='space-y-2'>
                    <p className='text-sm font-medium text-gray-500'>
                      Método de Pago
                    </p>
                    <Badge
                      variant='outline'
                      className='bg-purple-50 text-purple-700'>
                      <CreditCard className='h-4 w-4 mr-1' />
                      {payment.method}
                    </Badge>
                  </div>

                  <div className='space-y-2'>
                    <p className='text-sm font-medium text-gray-500'>
                      Fecha de Pago
                    </p>
                    <div className='flex items-center'>
                      <Calendar className='h-4 w-4 mr-2 text-purple-600' />
                      <span>{formatDate(payment.paymentDate)}</span>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <p className='text-sm font-medium text-gray-500'>Estado</p>
                    <Badge variant={getStatusBadgeVariant(payment.status)}>
                      {payment.status.toLowerCase() === "completed" ? (
                        <CheckCircle className='h-4 w-4 mr-1' />
                      ) : payment.status.toLowerCase() === "canceled" ||
                        payment.status.toLowerCase() === "cancelled" ? (
                        <XCircle className='h-4 w-4 mr-1' />
                      ) : (
                        <Clock className='h-4 w-4 mr-1' />
                      )}
                      {getStatusDisplay(payment.status)}
                    </Badge>
                  </div>

                  <div className='space-y-2'>
                    <p className='text-sm font-medium text-gray-500'>
                      Facturado
                    </p>
                    <Badge
                      variant={
                        payment.invoiced === 1 ? "default" : "secondary"
                      }>
                      {payment.invoiced === 1 ? "Facturado" : "No facturado"}
                    </Badge>
                  </div>

                  {payment.reference && (
                    <div className='space-y-2'>
                      <p className='text-sm font-medium text-gray-500'>
                        Referencia
                      </p>
                      <p className='font-medium text-gray-900'>
                        {payment.reference}
                      </p>
                    </div>
                  )}
                </div>

                {payment.description && (
                  <div className='space-y-2'>
                    <p className='text-sm font-medium text-gray-500'>
                      Descripción
                    </p>
                    <p className='text-gray-700 bg-gray-50 p-3 rounded-md'>
                      {payment.description}
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className='flex justify-end gap-4'>
                {payment.invoiced === 1 && (
                  <Button
                    variant='outline'
                    className='border-green-200 text-green-700 hover:bg-green-50'>
                    <Download className='mr-2 h-4 w-4' /> Descargar Factura
                  </Button>
                )}
                <Button
                  variant='outline'
                  className='border-purple-200 text-purple-700 hover:bg-purple-50'
                  onClick={() => router.push(`/dashboard/payments/${id}/edit`)}>
                  <FileText className='mr-2 h-4 w-4' /> Editar Pago
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Información del cliente */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}>
            <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg h-full'>
              <CardHeader>
                <div className='flex items-center gap-3'>
                  <div className='bg-purple-100 p-3 rounded-full'>
                    <User className='h-6 w-6 text-purple-700' />
                  </div>
                  <div>
                    <CardTitle>Información del Cliente</CardTitle>
                    <CardDescription>
                      Datos del cliente asociado al pago
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-6'>
                {client ? (
                  <>
                    <div className='flex items-center gap-4'>
                      <div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-xl font-bold'>
                        {client.firstName.charAt(0)}
                        {client.lastName.charAt(0)}
                      </div>
                      <div>
                        <h3 className='text-xl font-bold text-gray-900'>
                          {client.firstName} {client.lastName}
                        </h3>
                        <p className='text-sm text-gray-500'>ID: {client.id}</p>
                      </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='space-y-2'>
                        <p className='text-sm font-medium text-gray-500'>
                          Email
                        </p>
                        <div className='flex items-center'>
                          <Mail className='h-4 w-4 mr-2 text-purple-600' />
                          <span className='text-gray-900'>{client.email}</span>
                        </div>
                      </div>

                      {client.phone && (
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-gray-500'>
                            Teléfono
                          </p>
                          <div className='flex items-center'>
                            <Phone className='h-4 w-4 mr-2 text-purple-600' />
                            <span className='text-gray-900'>
                              {client.phone}
                            </span>
                          </div>
                        </div>
                      )}

                      {client.professionalCategory && (
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-gray-500'>
                            Categoría Profesional
                          </p>
                          <div className='flex items-center'>
                            <Building className='h-4 w-4 mr-2 text-purple-600' />
                            <span className='text-gray-900'>
                              {client.professionalCategory}
                            </span>
                          </div>
                        </div>
                      )}

                      {client.country && (
                        <div className='space-y-2'>
                          <p className='text-sm font-medium text-gray-500'>
                            País
                          </p>
                          <div className='flex items-center'>
                            <MapPin className='h-4 w-4 mr-2 text-purple-600' />
                            <span className='text-gray-900'>
                              {client.country}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {(client.address ||
                      client.province ||
                      client.autonomousCommunity) && (
                      <div className='space-y-2'>
                        <p className='text-sm font-medium text-gray-500'>
                          Dirección
                        </p>
                        <div className='flex items-start'>
                          <MapPin className='h-4 w-4 mr-2 text-purple-600 mt-1' />
                          <span className='text-gray-900'>
                            {[
                              client.address,
                              client.province,
                              client.autonomousCommunity,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className='text-center py-8'>
                    <User className='h-16 w-16 text-gray-300 mx-auto mb-4' />
                    <h3 className='text-lg font-medium text-gray-700 mb-2'>
                      Cliente no encontrado
                    </h3>
                    <p className='text-gray-500 mb-4'>
                      No se pudo encontrar la información del cliente asociado a
                      este pago.
                    </p>
                    <p className='text-sm text-gray-600'>
                      ID de usuario: {payment.userId}
                    </p>
                  </div>
                )}
              </CardContent>
              {client && (
                <CardFooter>
                  <Button
                    variant='outline'
                    className='w-full border-purple-200 text-purple-700 hover:bg-purple-50'
                    onClick={() =>
                      router.push(`/dashboard/clients/${client.id}`)
                    }>
                    <User className='mr-2 h-4 w-4' /> Ver Perfil Completo
                  </Button>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
