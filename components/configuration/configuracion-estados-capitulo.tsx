"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, X, Edit } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Datos de ejemplo
const estadosCapituloEjemplo = [
  {
    id: 1,
    nombre: "Borrador",
    descripcion: "El capítulo está en fase de borrador y aún no se ha enviado",
    color: "#FFC107",
  },
  {
    id: 2,
    nombre: "Enviado",
    descripcion: "El capítulo ha sido enviado y está pendiente de revisión",
    color: "#2196F3",
  },
  {
    id: 3,
    nombre: "En revisión",
    descripcion: "El capítulo está siendo revisado por el equipo editorial",
    color: "#9C27B0",
  },
  {
    id: 4,
    nombre: "Aprobado",
    descripcion: "El capítulo ha sido aprobado y será incluido en el libro",
    color: "#4CAF50",
  },
  {
    id: 5,
    nombre: "Rechazado",
    descripcion: "El capítulo ha sido rechazado y necesita modificaciones",
    color: "#F44336",
  },
  {
    id: 6,
    nombre: "Publicado",
    descripcion: "El capítulo ha sido publicado en el libro",
    color: "#009688",
  },
]

export function ConfiguracionEstadosCapitulo() {
  const [estadosCapitulo, setEstadosCapitulo] = useState(estadosCapituloEjemplo)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const estadosFiltrados = searchTerm
    ? estadosCapitulo.filter((estado) => estado.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    : estadosCapitulo

  const handleEliminarEstado = (id: number) => {
    setEstadosCapitulo(estadosCapitulo.filter((estado) => estado.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Estados de capítulo</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir estado
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Añadir estado de capítulo</DialogTitle>
              <DialogDescription>Añade un nuevo estado para los capítulos.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre-estado" className="text-right">
                  Nombre
                </Label>
                <Input id="nombre-estado" placeholder="Ej: Borrador" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="descripcion-estado" className="text-right pt-2">
                  Descripción
                </Label>
                <Textarea id="descripcion-estado" placeholder="Descripción del estado" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color-estado" className="text-right">
                  Color
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Input id="color-estado" type="color" className="w-16 h-10 p-1" defaultValue="#4CAF50" />
                  <Input id="color-hex" placeholder="#4CAF50" className="flex-1" defaultValue="#4CAF50" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => setDialogOpen(false)}>
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Buscar estado..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de estados de capítulo</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Color</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {estadosFiltrados.map((estado) => (
                <TableRow key={estado.id}>
                  <TableCell>
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: estado.color }} />
                  </TableCell>
                  <TableCell className="font-medium">{estado.nombre}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{estado.descripcion}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleEliminarEstado(estado.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
