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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const users = [
  {
    id: 1,
    name: "Juan Pérez",
    email: "juan@example.com",
    role: "Editor",
    status: "Activo",
    lastLogin: "2025-02-15 10:30",
    createdAt: "2024-12-01",
  },
  {
    id: 2,
    name: "María García",
    email: "maria@example.com",
    role: "Autor",
    status: "Inactivo",
    lastLogin: "2025-01-20 15:45",
    createdAt: "2024-11-15",
  },
  // Add more mock data as needed
];

const roles = ["Administrador", "Editor", "Autor", "Revisor"];

export default function UsuariosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(
    null
  );

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='space-y-4'>
      <h1 className='text-3xl font-bold'>Usuarios</h1>
      <div className='flex justify-between'>
        <Input
          placeholder='Buscar usuarios...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='max-w-sm'
        />
        <Button>Añadir Usuario</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Último Acceso</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Badge
                  className={
                    user.status === "Activo" ? "bg-green-500" : "bg-gray-500"
                  }>
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>{user.lastLogin}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className='mr-2'
                      onClick={() => setSelectedUser(user)}>
                      Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='max-w-4xl'>
                    <DialogHeader>
                      <DialogTitle>Editar Usuario</DialogTitle>
                      <DialogDescription>
                        Modifica los detalles del usuario
                      </DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                      <Tabs defaultValue='info'>
                        <TabsList>
                          <TabsTrigger value='info'>Información</TabsTrigger>
                          <TabsTrigger value='security'>Seguridad</TabsTrigger>
                          <TabsTrigger value='activity'>Actividad</TabsTrigger>
                        </TabsList>
                        <TabsContent value='info'>
                          <Card>
                            <CardHeader>
                              <CardTitle>Información del Usuario</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className='space-y-4'>
                                <div className='grid grid-cols-2 gap-4'>
                                  <div>
                                    <Label htmlFor='name'>Nombre</Label>
                                    <Input
                                      id='name'
                                      value={selectedUser.name}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor='email'>Email</Label>
                                    <Input
                                      id='email'
                                      value={selectedUser.email}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor='role'>Rol</Label>
                                  <Select defaultValue={selectedUser.role}>
                                    <SelectTrigger id='role'>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {roles.map((role) => (
                                        <SelectItem key={role} value={role}>
                                          {role}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className='flex items-center space-x-2'>
                                  <Switch
                                    id='status'
                                    checked={selectedUser.status === "Activo"}
                                  />
                                  <Label htmlFor='status'>Usuario Activo</Label>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                        <TabsContent value='security'>
                          <Card>
                            <CardHeader>
                              <CardTitle>Seguridad</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <Button>Restablecer Contraseña</Button>
                            </CardContent>
                          </Card>
                        </TabsContent>
                        <TabsContent value='activity'>
                          <Card>
                            <CardHeader>
                              <CardTitle>Actividad del Usuario</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p>
                                <strong>Último Acceso:</strong>{" "}
                                {selectedUser.lastLogin}
                              </p>
                              <p>
                                <strong>Fecha de Creación:</strong>{" "}
                                {selectedUser.createdAt}
                              </p>
                              {/* Aquí se podría agregar un historial de actividades */}
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    )}
                    <div className='flex justify-end mt-4'>
                      <Button>Guardar Cambios</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button>
                  {user.status === "Activo" ? "Desactivar" : "Activar"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
