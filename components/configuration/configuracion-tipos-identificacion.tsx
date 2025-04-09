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

// Datos de ejemplo
const tiposIdentificacionEjemplo = [
  { id: 1, nombre: "DNI", descripcion: "Documento Nacional de Identidad", formato: "^[0-9]{8}[A-Z]$" },
  { id: 2, nombre: "NIE", descripcion: "Número de Identidad de Extranjero", formato: "^[XYZ][0-9]{7}[A-Z]$" },
  { id: 3, nombre: "Pasaporte", descripcion: "Documento de viaje internacional", formato: "^[A-Z0-9]{9}$" },
  { id: 4, nombre: "CIF", descripcion: "Código de Identificación Fiscal", formato: "^[A-Z][0-9]{7}[A-Z0-9]$" },
]

export function ConfiguracionTiposIdentificacion() {
  const [tiposIdentificacion, setTiposIdentificacion] = useState(tiposIdentificacionEjemplo)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const tiposFiltrados = searchTerm
    ? tiposIdentificacion.filter((tipo) => tipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    : tiposIdentificacion

  const handleEliminarTipo = (id: number) => {
    setTiposIdentificacion(tiposIdentificacion.filter((tipo) => tipo.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tipos de identificación</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir tipo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Añadir tipo de identificación</DialogTitle>
              <DialogDescription>Añade un nuevo tipo de documento de identificación al sistema.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre-tipo" className="text-right">
                  Nombre
                </Label>
                <Input id="nombre-tipo" placeholder="Ej: DNI" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="descripcion-tipo" className="text-right pt-2">
                  Descripción
                </Label>
                <Input
                  id="descripcion-tipo"
                  placeholder="Descripción del tipo de identificación"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="formato-tipo" className="text-right">
                  Formato (regex)
                </Label>
                <Input id="formato-tipo" placeholder="Ej: ^[0-9]{8}[A-Z]$" className="col-span-3" />
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
          placeholder="Buscar tipo de identificación..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de tipos de identificación</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Formato</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tiposFiltrados.map((tipo) => (
                <TableRow key={tipo.id}>
                  <TableCell className="font-medium">{tipo.nombre}</TableCell>
                  <TableCell>{tipo.descripcion}</TableCell>
                  <TableCell>
                    <code className="bg-muted px-1 py-0.5 rounded text-sm">{tipo.formato}</code>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleEliminarTipo(tipo.id)}
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
