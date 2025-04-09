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
const tiposAsociacionEjemplo = [
  { id: 1, nombre: "Colegio profesional", descripcion: "Colegio oficial de profesionales" },
  { id: 2, nombre: "Sociedad científica", descripcion: "Sociedad dedicada a la investigación científica" },
  { id: 3, nombre: "Asociación profesional", descripcion: "Asociación de profesionales del sector" },
  { id: 4, nombre: "Fundación", descripcion: "Entidad sin ánimo de lucro" },
  { id: 5, nombre: "Universidad", descripcion: "Institución de educación superior" },
  { id: 6, nombre: "Hospital", descripcion: "Centro sanitario" },
]

export function ConfiguracionTiposAsociacion() {
  const [tiposAsociacion, setTiposAsociacion] = useState(tiposAsociacionEjemplo)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const tiposFiltrados = searchTerm
    ? tiposAsociacion.filter((tipo) => tipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    : tiposAsociacion

  const handleEliminarTipo = (id: number) => {
    setTiposAsociacion(tiposAsociacion.filter((tipo) => tipo.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tipos de asociación</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir tipo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Añadir tipo de asociación</DialogTitle>
              <DialogDescription>Añade un nuevo tipo de asociación al sistema.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre-tipo" className="text-right">
                  Nombre
                </Label>
                <Input id="nombre-tipo" placeholder="Ej: Colegio profesional" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="descripcion-tipo" className="text-right pt-2">
                  Descripción
                </Label>
                <Input id="descripcion-tipo" placeholder="Descripción del tipo de asociación" className="col-span-3" />
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
          placeholder="Buscar tipo de asociación..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de tipos de asociación</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tiposFiltrados.map((tipo) => (
                <TableRow key={tipo.id}>
                  <TableCell className="font-medium">{tipo.nombre}</TableCell>
                  <TableCell>{tipo.descripcion}</TableCell>
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
