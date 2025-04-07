"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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

  if (loading) {
    return <div>Cargando clientes...</div>;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>Clientes</h1>
        <Link href='/dashboard/clients/new'>
          <Button className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'>
            Nuevo Cliente
          </Button>
        </Link>
      </motion.div>

      {clients.length === 0 ? (
        <p>No hay clientes registrados.</p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white rounded-lg shadow overflow-hidden'>
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
                  <td className='border px-4 py-2'>{client.phone}</td>
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
        </div>
      )}
    </div>
  );
}
