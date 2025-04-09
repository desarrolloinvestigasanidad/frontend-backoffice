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
const categoriasEjemplo = [
  { id: 1, nombre: "Médico", descripcion: "Profesionales de la medicina" },
  { id: 2, nombre: "Enfermero/a", descripcion: "Profesionales de enfermería" },
  { id: 3, nombre: "Fisioterapeuta", descripcion: "Profesionales de fisioterapia" },
  { id: 4, nombre: "Psicólogo/a", descripcion: "Profesionales de psicología" },
  { id: 5, nombre: "Farmacéutico/a", descripcion: "Profesionales de farmacia" },
  { id: 6, nombre: "Odontólogo/a", descripcion: "Profesionales de odontología" },
  { id: 7, nombre: "Nutricionista", descripcion: "Profesionales de nutrición" },
]

export function ConfiguracionCategorias() {
  const [categorias, setCategorias] = useState(categoriasEjemplo)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const categoriasFiltradas = searchTerm
    ? categorias.filter((cat) => cat.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    : categorias

  const handleEliminarCategoria = (id: number) => {
    setCategorias(categorias.filter((cat) => cat.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Categorías profesionales</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir categoría
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Añadir categoría profesional</DialogTitle>
              <DialogDescription>Añade una nueva categoría profesional al sistema.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre-categoria" className="text-right">
                  Nombre
                </Label>
                <Input id="nombre-categoria" placeholder="Ej: Médico" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="descripcion-categoria" className="text-right pt-2">
                  Descripción
                </Label>
                <Input id="descripcion-categoria" placeholder="Descripción de la categoría" className="col-span-3" />
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
          placeholder="Buscar categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de categorías profesionales</CardTitle>
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
              {categoriasFiltradas.map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell className="font-medium">{categoria.nombre}</TableCell>
                  <TableCell>{categoria.descripcion}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleEliminarCategoria(categoria.id)}
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
