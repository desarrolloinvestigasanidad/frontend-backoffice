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
} from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 10;

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

  // Filtrar clientes por búsqueda
  const filteredClients = clients.filter(
    (client) =>
      client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.phone && client.phone.includes(searchTerm))
  );

  // Paginación
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);
  const currentClients = filteredClients.slice(
    (currentPage - 1) * clientsPerPage,
    currentPage * clientsPerPage
  );

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
      {/* Fondo con gradiente y "blobs" */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 to-white'></div>
        <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
        <div className='absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
      </div>

      <div className='container mx-auto px-4 relative z-10 space-y-8'>
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

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            Clientes Registrados
          </h2>
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto'></div>
        </motion.div>

        {/* Buscador */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='flex flex-col md:flex-row justify-between items-center gap-4 mb-6'>
          <div className='relative w-full md:w-auto flex-1 max-w-md'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
            <input
              type='text'
              placeholder='Buscar clientes...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 w-full'
            />
          </div>
          <Badge variant='default' className='py-1.5'>
            {filteredClients.length} clientes encontrados
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
                  Gestiona todos tus clientes desde aquí
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-purple-50 text-purple-900'>
                    <tr>
                      <th className='px-4 py-3 text-left'>Cliente</th>
                      <th className='px-4 py-3 text-left'>ID</th>
                      <th className='px-4 py-3 text-left'>Contacto</th>
                      <th className='px-4 py-3 text-center'>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-100'>
                    {currentClients.map((client) => (
                      <tr
                        key={client.id}
                        className='hover:bg-purple-50/50 transition-colors'>
                        <td className='px-4 py-4'>
                          <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-sm font-bold'>
                              {client.firstName.charAt(0)}
                              {client.lastName.charAt(0)}
                            </div>
                            <div>
                              <p className='font-medium text-gray-900'>
                                {client.firstName} {client.lastName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className='px-4 py-4'>
                          <Badge
                            variant='outline'
                            className='bg-purple-50 text-purple-700'>
                            {client.id}
                          </Badge>
                        </td>
                        <td className='px-4 py-4'>
                          <div className='space-y-1'>
                            <p className='text-sm flex items-center'>
                              <Mail className='h-3 w-3 mr-1 text-gray-400' />
                              {client.email}
                            </p>
                            {client.phone && (
                              <p className='text-sm flex items-center'>
                                <Phone className='h-3 w-3 mr-1 text-gray-400' />
                                {client.phone}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className='px-4 py-4 text-center'>
                          <Link href={`/dashboard/clients/${client.id}`}>
                            <Button
                              variant='outline'
                              size='sm'
                              className='border-purple-200 text-purple-700 hover:bg-purple-50'>
                              <Eye className='mr-2 h-4 w-4' />
                              Ver Detalles
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className='flex justify-between items-center mt-6'>
                  <p className='text-sm text-gray-500'>
                    Mostrando {(currentPage - 1) * clientsPerPage + 1} a{" "}
                    {Math.min(
                      currentPage * clientsPerPage,
                      filteredClients.length
                    )}{" "}
                    de {filteredClients.length} clientes
                  </p>
                  <div className='flex gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }>
                      <ChevronLeft className='h-4 w-4' />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size='sm'
                          onClick={() => setCurrentPage(page)}>
                          {page}
                        </Button>
                      )
                    )}
                    <Button
                      variant='outline'
                      size='sm'
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
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
