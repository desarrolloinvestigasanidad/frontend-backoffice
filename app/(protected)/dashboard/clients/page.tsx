"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/breadcrumb";
import { motion } from "framer-motion";

type Client = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users`, {
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

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        Cargando clientes...
      </div>
    );
  }

  return (
    <div className='relative overflow-hidden py-8'>
      {/* Fondo degradado y blobs */}
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
            <span>Clientes</span>
          </Breadcrumb>
          <Link href='/dashboard/clients/new'>
            <Button className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'>
              Nuevo Cliente
            </Button>
          </Link>
        </motion.div>

        {clients.length === 0 ? (
          <p className='text-center text-gray-600'>
            No hay clientes registrados.
          </p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='overflow-x-auto'>
            <table className='min-w-full bg-white/60 rounded-lg shadow overflow-hidden border'>
              <thead className='bg-purple-100'>
                <tr>
                  <th className='px-4 py-2'>ID</th>
                  <th className='px-4 py-2'>Nombre</th>
                  <th className='px-4 py-2'>Email</th>
                  <th className='px-4 py-2'>Teléfono</th>
                  <th className='px-4 py-2'>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className='hover:bg-gray-50'>
                    <td className='border px-4 py-2'>{client.id}</td>
                    <td className='border px-4 py-2'>
                      {client.firstName} {client.lastName}
                    </td>
                    <td className='border px-4 py-2'>{client.email}</td>
                    <td className='border px-4 py-2'>
                      {client.phone || "N/A"}
                    </td>
                    <td className='border px-4 py-2'>
                      <Link href={`/dashboard/clients/${client.id}`}>
                        <Button variant='outline' size='sm'>
                          Ver
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  );
}
