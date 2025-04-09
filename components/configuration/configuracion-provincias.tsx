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
const provinciasEjemplo = [
  { id: 1, nombre: "Madrid", comunidad: "Madrid", codigo: "MAD" },
  { id: 2, nombre: "Barcelona", comunidad: "Cataluña", codigo: "BCN" },
  { id: 3, nombre: "Valencia", comunidad: "Comunidad Valenciana", codigo: "VAL" },
  { id: 4, nombre: "Sevilla", comunidad: "Andalucía", codigo: "SEV" },
  { id: 5, nombre: "Zaragoza", comunidad: "Aragón", codigo: "ZAR" },
  { id: 6, nombre: "Málaga", comunidad: "Andalucía", codigo: "MAL" },
  { id: 7, nombre: "Murcia", comunidad: "Murcia", codigo: "MUR" },
  { id: 8, nombre: "Palma de Mallorca", comunidad: "Baleares", codigo: "PMI" },
  { id: 9, nombre: "Las Palmas", comunidad: "Canarias", codigo: "LPA" },
  { id: 10, nombre: "Bilbao", comunidad: "País Vasco", codigo: "BIO" },
]

// Lista de comunidades para el selector
const comunidadesLista = [
  "Andalucía",
  "Aragón",
  "Asturias",
  "Baleares",
  "Canarias",
  "Cantabria",
  "Castilla-La Mancha",
  "Castilla y León",
  "Cataluña",
  "Comunidad Valenciana",
  "Extremadura",
  "Galicia",
  "Madrid",
  "Murcia",
  "Navarra",
  "País Vasco",
  "La Rioja",
]

export function ConfiguracionProvincias() {
  const [provincias, setProvincias] = useState(provinciasEjemplo)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroComAutonoma, setFiltroComAutonoma] = useState("todas")

  const provinciasFiltradas = provincias.filter((prov) => {
    const matchesSearch = searchTerm ? prov.nombre.toLowerCase().includes(searchTerm.toLowerCase()) : true
    const matchesComunidad = filtroComAutonoma === "todas" ? true : prov.comunidad === filtroComAutonoma

    return matchesSearch && matchesComunidad
  })

  const handleEliminarProvincia = (id: number) => {
    setProvincias(provincias.filter((prov) => prov.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Provincias</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir provincia
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Añadir Provincia</DialogTitle>
              <DialogDescription>Añade una nueva provincia al sistema.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre-provincia" className="text-right">
                  Nombre
                </Label>
                <Input id="nombre-provincia" placeholder="Ej: Madrid" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="comunidad-provincia" className="text-right">
                  Comunidad
                </Label>
                <select
                  id="comunidad-provincia"
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {comunidadesLista.map((com) => (
                    <option key={com} value={com}>
                      {com}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="codigo-provincia" className="text-right">
                  Código
                </Label>
                <Input id="codigo-provincia" placeholder="Ej: MAD" className="col-span-3" />
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

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Input
          placeholder="Buscar provincia..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={filtroComAutonoma}
          onChange={(e) => setFiltroComAutonoma(e.target.value)}
          className="md:w-64 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="todas">Todas las comunidades</option>
          {comunidadesLista.map((com) => (
            <option key={com} value={com}>
              {com}
            </option>
          ))}
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Provincias</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Comunidad Autónoma</TableHead>
                <TableHead>Código</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {provinciasFiltradas.map((provincia) => (
                <TableRow key={provincia.id}>
                  <TableCell className="font-medium">{provincia.nombre}</TableCell>
                  <TableCell>{provincia.comunidad}</TableCell>
                  <TableCell>{provincia.codigo}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleEliminarProvincia(provincia.id)}
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
