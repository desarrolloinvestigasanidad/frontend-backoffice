"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for customers
const customers = [
  {
    id: 1,
    name: "Juan Pérez",
    email: "juan@example.com",
    phone: "123-456-7890",
    status: "Activo",
    dni: "12345678A",
    profession: "Médico",
    community: "Madrid",
    registrationDate: "2023-01-15",
    lastLogin: "2023-06-01",
  },
  {
    id: 2,
    name: "María García",
    email: "maria@example.com",
    phone: "098-765-4321",
    status: "Inactivo",
    dni: "87654321B",
    profession: "Enfermera",
    community: "Cataluña",
    registrationDate: "2023-02-20",
    lastLogin: "2023-05-28",
  },
  // Add more mock data as needed
];

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<
    (typeof customers)[0] | null
  >(null);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.dni.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='space-y-4'>
      <h1 className='text-3xl font-bold'>Clientes</h1>
      <div className='flex justify-between'>
        <Input
          placeholder='Buscar clientes por nombre, email o DNI...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='max-w-sm'
        />
        <Button>Añadir Cliente</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>DNI</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCustomers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>{customer.dni}</TableCell>
              <TableCell>{customer.status}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className='mr-2'
                      onClick={() => setSelectedCustomer(customer)}>
                      Ver
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='max-w-4xl'>
                    <DialogHeader>
                      <DialogTitle>Detalles del Cliente</DialogTitle>
                      <DialogDescription>
                        Información detallada del cliente
                      </DialogDescription>
                    </DialogHeader>
                    {selectedCustomer && (
                      <Tabs defaultValue='info'>
                        <TabsList>
                          <TabsTrigger value='info'>Información</TabsTrigger>
                          <TabsTrigger value='payments'>Pagos</TabsTrigger>
                          <TabsTrigger value='publications'>
                            Publicaciones
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value='info'>
                          <Card>
                            <CardHeader>
                              <CardTitle>Información Personal</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className='grid grid-cols-2 gap-4'>
                                <div>
                                  <p>
                                    <strong>Nombre:</strong>{" "}
                                    {selectedCustomer.name}
                                  </p>
                                  <p>
                                    <strong>Email:</strong>{" "}
                                    {selectedCustomer.email}
                                  </p>
                                  <p>
                                    <strong>Teléfono:</strong>{" "}
                                    {selectedCustomer.phone}
                                  </p>
                                  <p>
                                    <strong>DNI:</strong> {selectedCustomer.dni}
                                  </p>
                                </div>
                                <div>
                                  <p>
                                    <strong>Profesión:</strong>{" "}
                                    {selectedCustomer.profession}
                                  </p>
                                  <p>
                                    <strong>Comunidad:</strong>{" "}
                                    {selectedCustomer.community}
                                  </p>
                                  <p>
                                    <strong>Fecha de Registro:</strong>{" "}
                                    {selectedCustomer.registrationDate}
                                  </p>
                                  <p>
                                    <strong>Último Acceso:</strong>{" "}
                                    {selectedCustomer.lastLogin}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                        <TabsContent value='payments'>
                          <Card>
                            <CardHeader>
                              <CardTitle>Historial de Pagos</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {/* Aquí iría una tabla o lista de pagos */}
                              <p>Historial de pagos del cliente</p>
                            </CardContent>
                          </Card>
                        </TabsContent>
                        <TabsContent value='publications'>
                          <Card>
                            <CardHeader>
                              <CardTitle>Publicaciones</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {/* Aquí iría una lista de publicaciones */}
                              <p>
                                Ediciones y libros en los que ha participado el
                                cliente
                              </p>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    )}
                    <div className='flex justify-between mt-4'>
                      <Button>Editar</Button>
                      <Button>Ver perfil web</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button>Editar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
