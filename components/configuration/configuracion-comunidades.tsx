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
const comunidadesEjemplo = [
  { id: 1, nombre: "Andalucía", codigo: "AND" },
  { id: 2, nombre: "Aragón", codigo: "ARA" },
  { id: 3, nombre: "Asturias", codigo: "AST" },
  { id: 4, nombre: "Baleares", codigo: "BAL" },
  { id: 5, nombre: "Canarias", codigo: "CAN" },
  { id: 6, nombre: "Cantabria", codigo: "CNT" },
  { id: 7, nombre: "Castilla-La Mancha", codigo: "CLM" },
  { id: 8, nombre: "Castilla y León", codigo: "CYL" },
  { id: 9, nombre: "Cataluña", codigo: "CAT" },
  { id: 10, nombre: "Comunidad Valenciana", codigo: "VAL" },
  { id: 11, nombre: "Extremadura", codigo: "EXT" },
  { id: 12, nombre: "Galicia", codigo: "GAL" },
  { id: 13, nombre: "Madrid", codigo: "MAD" },
  { id: 14, nombre: "Murcia", codigo: "MUR" },
  { id: 15, nombre: "Navarra", codigo: "NAV" },
  { id: 16, nombre: "País Vasco", codigo: "PVA" },
  { id: 17, nombre: "La Rioja", codigo: "RIO" },
]

export function ConfiguracionComunidades() {
  const [comunidades, setComunidades] = useState(comunidadesEjemplo)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const comunidadesFiltradas = searchTerm
    ? comunidades.filter((com) => com.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    : comunidades

  const handleEliminarComunidad = (id: number) => {
    setComunidades(comunidades.filter((com) => com.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Comunidades Autónomas</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir comunidad
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Añadir Comunidad Autónoma</DialogTitle>
              <DialogDescription>Añade una nueva Comunidad Autónoma al sistema.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre-comunidad" className="text-right">
                  Nombre
                </Label>
                <Input id="nombre-comunidad" placeholder="Ej: Andalucía" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="codigo-comunidad" className="text-right">
                  Código
                </Label>
                <Input id="codigo-comunidad" placeholder="Ej: AND" className="col-span-3" />
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
          placeholder="Buscar comunidad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Comunidades Autónomas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Código</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comunidadesFiltradas.map((comunidad) => (
                <TableRow key={comunidad.id}>
                  <TableCell className="font-medium">{comunidad.nombre}</TableCell>
                  <TableCell>{comunidad.codigo}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleEliminarComunidad(comunidad.id)}
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
