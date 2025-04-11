"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// Tipo de dato del pago (adaptado a lo que devuelve el endpoint)
type Payment = {
  id: string;
  userId: string; // Se usará para buscar al cliente
  amount: number | string;
  method: string;
  status: string;
  paymentDate: string;
  invoiced: number; // 0 o 1
};

// Tipo de dato del cliente (según tu array de users)
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

  // Fetch de pagos
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/payments`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        const paymentsArray = Array.isArray(data) ? data : data.payments ?? [];
        setPayments(paymentsArray);
      } catch (error) {
        console.error("Error al cargar los pagos:", error);
      }
    };

    fetchPayments();
  }, []);

  // Fetch de clientes
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const clientsArray = Array.isArray(data) ? data : data.clients ?? [];
        setClients(clientsArray);
      } catch (error) {
        console.error("Error al cargar los clientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) {
    return <div className='p-4'>Cargando pagos y clientes...</div>;
  }

  // Función para formatear la fecha en español (DD/MM/YYYY)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Función para formatear el monto con símbolo de €
  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === "number" ? amount : parseFloat(amount);
    return `${numAmount.toFixed(2)} €`;
  };

  // Conversión de estado al texto en español
  const getStatusDisplay = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "Completado";
      case "canceled":
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  // Función para obtener datos del cliente a partir del userId del pago
  // Función modificada para obtener datos del cliente
  const getClientData = (userId: string): Client | undefined => {
    const trimmedUserId = userId.trim().toLowerCase().replace(/\s/g, "");
    return clients.find((client) => {
      const trimmedClientId = client.id.trim().toLowerCase().replace(/\s/g, "");
      console.log(
        `Buscando cliente: ${trimmedClientId} vs pago: ${trimmedUserId}`
      );
      return trimmedClientId === trimmedUserId;
    });
  };

  return (
    <div className='container mx-auto px-4 py-6'>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='mb-4 flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Pagos de Clientes</h1>
        <Button variant='outline'>Nuevo Pago</Button>
      </motion.div>

      <div className='overflow-x-auto w-full'>
        <table className='min-w-full border border-gray-300 text-sm'>
          <thead className='bg-gray-100'>
            {/* Encabezado principal */}
            <tr>
              <th className='px-2 py-2 border-r border-gray-300'>Nombre</th>
              <th className='px-2 py-2 border-r border-gray-300'>DNI</th>
              <th className='px-2 py-2 border-r border-gray-300'>Correo</th>
              <th className='px-2 py-2 border-r border-gray-300'>Teléfono</th>

              <th className='px-2 py-2 border-r border-gray-300'>
                Fecha de pago
              </th>
              <th className='px-2 py-2 border-r border-gray-300'>Método</th>
              <th className='px-2 py-2 border-r border-gray-300'>Monto</th>
              <th className='px-2 py-2 border-r border-gray-300'>Facturado</th>
              <th className='px-2 py-2'>Estado</th>
            </tr>
            {/* Fila de filtros (inputs sin funcionalidad real) */}
            <tr>
              {[
                "Nombre",
                "DNI",
                "Correo",
                "Teléfono",
                "Fecha de pago",
                "Método",
                "Monto",
                "Facturado",
                "Estado",
              ].map((placeholder, idx) => (
                <th
                  key={idx}
                  className={
                    idx < 9 ? "px-2 py-1 border-r border-gray-300" : "px-2 py-1"
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
            {payments.map((payment) => {
              const clientData = getClientData(payment.userId);

              // Si no se encuentra el cliente, imprimir aviso en consola y retornar fila con placeholders
              if (!clientData) {
                console.warn(
                  `No se encontró cliente para el pago con userId ${payment.userId}`
                );
                return (
                  <tr key={payment.id}>
                    {/* Nombre */}
                    <td className='px-2 py-2 border-r border-gray-300'>
                      (Sin nombre)
                    </td>
                    {/* DNI */}
                    <td className='px-2 py-2 border-r border-gray-300'>
                      {payment.userId}
                    </td>
                    {/* Correo */}
                    <td className='px-2 py-2 border-r border-gray-300'>
                      (Sin correo)
                    </td>
                    {/* Teléfono */}
                    <td className='px-2 py-2 border-r border-gray-300'>
                      (Sin teléfono)
                    </td>

                    {/* Fecha de pago */}
                    <td className='px-2 py-2 border-r border-gray-300'>
                      {formatDate(payment.paymentDate)}
                    </td>
                    {/* Método */}
                    <td className='px-2 py-2 border-r border-gray-300'>
                      {payment.method}
                    </td>
                    {/* Monto */}
                    <td className='px-2 py-2 border-r border-gray-300'>
                      {formatCurrency(payment.amount)}
                    </td>
                    {/* Facturado */}
                    <td className='px-2 py-2 border-r border-gray-300'>
                      {payment.invoiced === 1 ? "Sí" : "No"}
                    </td>
                    {/* Estado */}
                    <td className='px-2 py-2'>
                      {getStatusDisplay(payment.status)}
                    </td>
                  </tr>
                );
              }

              // Determina color de fondo según el estado del pago
              let rowBgColor = "";
              if (payment.status.toLowerCase() === "completed") {
                rowBgColor = "bg-green-100";
              } else if (
                payment.status.toLowerCase() === "canceled" ||
                payment.status.toLowerCase() === "cancelled"
              ) {
                rowBgColor = "bg-red-100";
              }

              return (
                <tr key={payment.id} className={rowBgColor}>
                  {/* Nombre */}
                  <td className='px-2 py-2 border-r border-gray-300'>
                    {`${clientData.firstName} ${clientData.lastName}`}
                  </td>
                  {/* DNI */}
                  <td className='px-2 py-2 border-r border-gray-300'>
                    {clientData.id}
                  </td>
                  {/* Correo */}
                  <td className='px-2 py-2 border-r border-gray-300'>
                    {clientData.email}
                  </td>
                  {/* Teléfono */}
                  <td className='px-2 py-2 border-r border-gray-300'>
                    {clientData.phone}
                  </td>

                  {/* Fecha de pago */}
                  <td className='px-2 py-2 border-r border-gray-300'>
                    {formatDate(payment.paymentDate)}
                  </td>
                  {/* Método */}
                  <td className='px-2 py-2 border-r border-gray-300'>
                    {payment.method}
                  </td>
                  {/* Monto */}
                  <td className='px-2 py-2 border-r border-gray-300'>
                    {formatCurrency(payment.amount)}
                  </td>
                  {/* Facturado */}
                  <td className='px-2 py-2 border-r border-gray-300'>
                    {payment.invoiced === 1 ? "Sí" : "No"}
                  </td>
                  {/* Estado */}
                  <td className='px-2 py-2'>
                    {getStatusDisplay(payment.status)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
