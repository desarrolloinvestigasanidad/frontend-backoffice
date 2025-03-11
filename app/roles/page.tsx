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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const roles = [
  {
    id: 1,
    name: "Administrador",
    permissions: [
      "crear_libro",
      "editar_libro",
      "eliminar_libro",
      "crear_usuario",
      "editar_usuario",
      "eliminar_usuario",
      "crear_capitulo",
      "editar_capitulo",
      "eliminar_capitulo",
      "gestionar_pagos",
      "gestionar_descuentos",
    ],
  },
  {
    id: 2,
    name: "Editor",
    permissions: [
      "crear_libro",
      "editar_libro",
      "crear_capitulo",
      "editar_capitulo",
    ],
  },
  {
    id: 3,
    name: "Autor",
    permissions: ["crear_capitulo", "editar_capitulo"],
  },
  // Add more mock data as needed
];

const allPermissions = [
  "crear_libro",
  "editar_libro",
  "eliminar_libro",
  "crear_usuario",
  "editar_usuario",
  "eliminar_usuario",
  "crear_capitulo",
  "editar_capitulo",
  "eliminar_capitulo",
  "gestionar_pagos",
  "gestionar_descuentos",
];

export default function RolesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<{
    id: number;
    name: string;
    permissions: string[];
  } | null>(null);

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='space-y-4'>
      <h1 className='text-3xl font-bold'>Roles y Permisos</h1>
      <div className='flex justify-between'>
        <Input
          placeholder='Buscar roles...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='max-w-sm'
        />
        <Button>Crear Nuevo Rol</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre del Rol</TableHead>
            <TableHead>Permisos</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRoles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>{role.name}</TableCell>
              <TableCell>
                {role.permissions.length} permisos asignados
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className='mr-2'
                      onClick={() => setSelectedRole(role)}>
                      Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='max-w-4xl'>
                    <DialogHeader>
                      <DialogTitle>Editar Rol</DialogTitle>
                      <DialogDescription>
                        Modifica los permisos para este rol
                      </DialogDescription>
                    </DialogHeader>
                    {selectedRole && (
                      <Card>
                        <CardHeader>
                          <CardTitle>{selectedRole.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className='grid grid-cols-2 gap-4'>
                            {allPermissions.map((permission) => (
                              <div
                                key={permission}
                                className='flex items-center space-x-2'>
                                <Checkbox
                                  id={permission}
                                  checked={selectedRole.permissions.includes(
                                    permission
                                  )}
                                />
                                <Label htmlFor={permission}>
                                  {permission.replace("_", " ")}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    <div className='flex justify-end mt-4'>
                      <Button>Guardar Cambios</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button>Eliminar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
