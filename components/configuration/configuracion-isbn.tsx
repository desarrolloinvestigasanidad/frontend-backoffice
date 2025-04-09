"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, X, Edit, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Datos de ejemplo
const isbnsEjemplo = [
  { id: 1, isbn: "978-84-123456-0-1", estado: "Disponible", asignado: null },
  { id: 2, isbn: "978-84-123456-1-8", estado: "Asignado", asignado: "Avances en Cardiología 2023" },
  { id: 3, isbn: "978-84-123456-2-5", estado: "Disponible", asignado: null },
  { id: 4, isbn: "978-84-123456-3-2", estado: "Asignado", asignado: "Manual de Neurología Clínica" },
  { id: 5, isbn: "978-84-123456-4-9", estado: "Disponible", asignado: null },
  { id: 6, isbn: "978-84-123456-5-6", estado: "Disponible", asignado: null },
  { id: 7, isbn: "978-84-123456-6-3", estado: "Asignado", asignado: "Guía Práctica de Pediatría" },
  { id: 8, isbn: "978-84-123456-7-0", estado: "Disponible", asignado: null },
]

export function ConfiguracionISBN() {
  const [isbns, setIsbns] = useState(isbnsEjemplo)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const isbnsFiltrados = searchTerm
    ? isbns.filter(
        (isbn) =>
          isbn.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (isbn.asignado && isbn.asignado.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    : isbns

  const disponibles = isbns.filter((isbn) => isbn.estado === "Disponible").length
  const asignados = isbns.filter((isbn) => isbn.estado === "Asignado").length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de ISBN</h2>
        <div className="flex gap-2">
          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Importar ISBNs
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Importar ISBNs</DialogTitle>
                <DialogDescription>Importa ISBNs desde un archivo CSV o Excel.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="archivo-isbn" className="text-right">
                    Archivo
                  </Label>
                  <Input id="archivo-isbn" type="file" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="formato" className="text-right pt-2">
                    Formato
                  </Label>
                  <div className="col-span-3">
                    <select
                      id="formato"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="csv">CSV</option>
                      <option value="excel">Excel</option>
                    </select>
                    <p className="text-sm text-muted-foreground mt-2">
                      El archivo debe tener una columna con los ISBNs.
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={() => setImportDialogOpen(false)}>
                  Importar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir ISBN
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Añadir nuevo ISBN</DialogTitle>
                <DialogDescription>Añade un nuevo ISBN a la base de datos.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="isbn" className="text-right">
                    ISBN
                  </Label>
                  <Input id="isbn" placeholder="978-84-XXXXXX-X-X" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="notas" className="text-right pt-2">
                    Notas
                  </Label>
                  <Textarea id="notas" placeholder="Notas adicionales..." className="col-span-3" />
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
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total ISBNs</CardTitle>
            <CardDescription>Número total de ISBNs en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isbns.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>ISBNs disponibles</CardTitle>
            <CardDescription>ISBNs sin asignar a ningún libro</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{disponibles}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>ISBNs asignados</CardTitle>
            <CardDescription>ISBNs ya asignados a libros</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{asignados}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Buscar ISBN o libro..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ISBN</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Asignado a</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isbnsFiltrados.map((isbn) => (
                <TableRow key={isbn.id}>
                  <TableCell className="font-medium">{isbn.isbn}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        isbn.estado === "Disponible" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {isbn.estado}
                    </span>
                  </TableCell>
                  <TableCell>{isbn.asignado || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {isbnsFiltrados.length} de {isbns.length} ISBNs
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm">
              Siguiente
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
