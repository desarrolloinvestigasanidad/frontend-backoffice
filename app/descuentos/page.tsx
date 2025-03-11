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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const discounts = [
  {
    id: 1,
    code: "VERANO2025",
    amount: 20,
    type: "Porcentaje",
    validUntil: "2025-08-31",
    status: "Activo",
    applicableToEditions: true,
    applicableToOwnBooks: false,
  },
  {
    id: 2,
    code: "BIENVENIDA",
    amount: 15,
    type: "Fijo",
    validUntil: "2025-12-31",
    status: "Inactivo",
    applicableToEditions: true,
    applicableToOwnBooks: true,
  },
  // Add more mock data as needed
];

export default function DescuentosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState<
    (typeof discounts)[0] | null
  >(null);

  const filteredDiscounts = discounts.filter((discount) =>
    discount.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='space-y-4'>
      <h1 className='text-3xl font-bold'>Descuentos</h1>
      <div className='flex justify-between'>
        <Input
          placeholder='Buscar descuentos...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='max-w-sm'
        />
        <Button>Crear Nuevo Descuento</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Válido Hasta</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Aplicable a</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDiscounts.map((discount) => (
            <TableRow key={discount.id}>
              <TableCell>{discount.code}</TableCell>
              <TableCell>
                {discount.amount}
                {discount.type === "Porcentaje" ? "%" : "€"}
              </TableCell>
              <TableCell>{discount.type}</TableCell>
              <TableCell>{discount.validUntil}</TableCell>
              <TableCell>
                <Badge
                  className={
                    discount.status === "Activo"
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }>
                  {discount.status}
                </Badge>
              </TableCell>
              <TableCell>
                {discount.applicableToEditions && "Ediciones"}
                {discount.applicableToEditions &&
                  discount.applicableToOwnBooks &&
                  ", "}
                {discount.applicableToOwnBooks && "Libros Propios"}
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className='mr-2'
                      onClick={() => setSelectedDiscount(discount)}>
                      Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='max-w-md'>
                    <DialogHeader>
                      <DialogTitle>Editar Descuento</DialogTitle>
                      <DialogDescription>
                        Modifica los detalles del descuento
                      </DialogDescription>
                    </DialogHeader>
                    {selectedDiscount && (
                      <Card>
                        <CardHeader>
                          <CardTitle>{selectedDiscount.code}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className='space-y-4'>
                            <div className='grid grid-cols-2 gap-4'>
                              <div>
                                <Label htmlFor='amount'>Cantidad</Label>
                                <Input
                                  id='amount'
                                  value={selectedDiscount.amount}
                                />
                              </div>
                              <div>
                                <Label htmlFor='type'>Tipo</Label>
                                <Select defaultValue={selectedDiscount.type}>
                                  <SelectTrigger id='type'>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value='Porcentaje'>
                                      Porcentaje
                                    </SelectItem>
                                    <SelectItem value='Fijo'>Fijo</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor='validUntil'>Válido Hasta</Label>
                              <Input
                                id='validUntil'
                                type='date'
                                value={selectedDiscount.validUntil}
                              />
                            </div>
                            <div className='flex items-center space-x-2'>
                              <Switch
                                id='status'
                                checked={selectedDiscount.status === "Activo"}
                              />
                              <Label htmlFor='status'>Activo</Label>
                            </div>
                            <div>
                              <Label>Aplicable a</Label>
                              <div className='flex space-x-4 mt-2'>
                                <div className='flex items-center space-x-2'>
                                  <Switch
                                    id='editions'
                                    checked={
                                      selectedDiscount.applicableToEditions
                                    }
                                  />
                                  <Label htmlFor='editions'>Ediciones</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                  <Switch
                                    id='ownBooks'
                                    checked={
                                      selectedDiscount.applicableToOwnBooks
                                    }
                                  />
                                  <Label htmlFor='ownBooks'>
                                    Libros Propios
                                  </Label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    <div className='flex justify-end mt-4'>
                      <Button>Guardar Cambios</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button>
                  {discount.status === "Activo" ? "Desactivar" : "Activar"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
