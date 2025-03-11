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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const payments = [
  {
    id: 1,
    customer: "Juan Pérez",
    amount: 150,
    date: "2025-02-15",
    status: "Completado",
    edition: "Febrero 2025",
    method: "Tarjeta de crédito",
    invoiceNumber: "INV-2025-001",
  },
  {
    id: 2,
    customer: "María García",
    amount: 200,
    date: "2025-03-01",
    status: "Pendiente",
    edition: "Marzo 2025",
    method: "Transferencia bancaria",
    invoiceNumber: "INV-2025-002",
  },
  // Add more mock data as needed
];

export default function PagosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEdition, setSelectedEdition] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<
    (typeof payments)[0] | null
  >(null);

  const filteredPayments = payments.filter(
    (payment) =>
      (payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.invoiceNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      (selectedEdition === "" || payment.edition === selectedEdition)
  );

  return (
    <div className='space-y-4'>
      <h1 className='text-3xl font-bold'>Pagos</h1>
      <div className='flex justify-between items-center'>
        <div className='flex space-x-2'>
          <Input
            placeholder='Buscar pagos por cliente, estado o número de factura...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='max-w-sm'
          />
          <Select value={selectedEdition} onValueChange={setSelectedEdition}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Seleccionar edición' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='todas'>Todas las ediciones</SelectItem>
              <SelectItem value='Febrero 2025'>Febrero 2025</SelectItem>
              <SelectItem value='Marzo 2025'>Marzo 2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button>Registrar Nuevo Pago</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Edición</TableHead>
            <TableHead>Nº Factura</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPayments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.customer}</TableCell>
              <TableCell>€{payment.amount}</TableCell>
              <TableCell>{payment.date}</TableCell>
              <TableCell>
                <Badge
                  className={
                    payment.status === "Completado"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }>
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell>{payment.edition}</TableCell>
              <TableCell>{payment.invoiceNumber}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className='mr-2'
                      onClick={() => setSelectedPayment(payment)}>
                      Ver detalles
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='max-w-4xl'>
                    <DialogHeader>
                      <DialogTitle>Detalles del Pago</DialogTitle>
                      <DialogDescription>
                        Información detallada del pago
                      </DialogDescription>
                    </DialogHeader>
                    {selectedPayment && (
                      <Tabs defaultValue='info'>
                        <TabsList>
                          <TabsTrigger value='info'>Información</TabsTrigger>
                          <TabsTrigger value='invoice'>Factura</TabsTrigger>
                        </TabsList>
                        <TabsContent value='info'>
                          <Card>
                            <CardHeader>
                              <CardTitle>Información del Pago</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className='grid grid-cols-2 gap-4'>
                                <div>
                                  <p>
                                    <strong>Cliente:</strong>{" "}
                                    {selectedPayment.customer}
                                  </p>
                                  <p>
                                    <strong>Monto:</strong> €
                                    {selectedPayment.amount}
                                  </p>
                                  <p>
                                    <strong>Fecha:</strong>{" "}
                                    {selectedPayment.date}
                                  </p>
                                  <p>
                                    <strong>Estado:</strong>{" "}
                                    {selectedPayment.status}
                                  </p>
                                </div>
                                <div>
                                  <p>
                                    <strong>Edición:</strong>{" "}
                                    {selectedPayment.edition}
                                  </p>
                                  <p>
                                    <strong>Método de Pago:</strong>{" "}
                                    {selectedPayment.method}
                                  </p>
                                  <p>
                                    <strong>Nº Factura:</strong>{" "}
                                    {selectedPayment.invoiceNumber}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                        <TabsContent value='invoice'>
                          <Card>
                            <CardHeader>
                              <CardTitle>Factura</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {/* Aquí iría el contenido de la factura */}
                              <p>
                                Contenido de la factura{" "}
                                {selectedPayment.invoiceNumber}
                              </p>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    )}
                    <div className='flex justify-between mt-4'>
                      <Button>Editar</Button>
                      <Button>Descargar Factura</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button>Actualizar estado</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
