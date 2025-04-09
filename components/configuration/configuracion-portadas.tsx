"use client"

import { Textarea } from "@/components/ui/textarea"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Upload, X, Edit } from "lucide-react"

// Datos de ejemplo
const portadasEjemplo = [
  {
    id: 1,
    nombre: "Portada médica 1",
    categoria: "medicina",
    url: "/portada-medica-1.jpg",
    descripcion: "Portada para libros de medicina general",
  },
  {
    id: 2,
    nombre: "Portada cardiología",
    categoria: "cardiologia",
    url: "/portada-cardiologia.jpg",
    descripcion: "Portada especializada para libros de cardiología",
  },
  {
    id: 3,
    nombre: "Portada pediatría",
    categoria: "pediatria",
    url: "/portada-pediatria.jpg",
    descripcion: "Portada para libros de pediatría",
  },
  {
    id: 4,
    nombre: "Portada neurología",
    categoria: "neurologia",
    url: "/portada-neurologia.jpg",
    descripcion: "Portada para libros de neurología",
  },
  {
    id: 5,
    nombre: "Portada general",
    categoria: "general",
    url: "/portada-general.jpg",
    descripcion: "Portada genérica para cualquier especialidad",
  },
]

export function ConfiguracionPortadas() {
  const [portadas, setPortadas] = useState(portadasEjemplo)
  const [categoriaActiva, setCategoriaActiva] = useState("todas")
  const [dialogOpen, setDialogOpen] = useState(false)

  const categorias = ["todas", "medicina", "cardiologia", "pediatria", "neurologia", "general"]

  const portadasFiltradas =
    categoriaActiva === "todas" ? portadas : portadas.filter((port) => port.categoria === categoriaActiva)

  const handleEliminarPortada = (id: number) => {
    setPortadas(portadas.filter((port) => port.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Portadas</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir portada
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Añadir nueva portada</DialogTitle>
              <DialogDescription>Sube una nueva portada para usar en los libros.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre" className="text-right">
                  Nombre
                </Label>
                <Input id="nombre" placeholder="Ej: Portada medicina" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="categoria" className="text-right">
                  Categoría
                </Label>
                <select
                  id="categoria"
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {categorias
                    .filter((cat) => cat !== "todas")
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="descripcion" className="text-right pt-2">
                  Descripción
                </Label>
                <Textarea id="descripcion" placeholder="Descripción de la portada..." className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Archivo</Label>
                <div className="col-span-3">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                        </p>
                        <p className="text-xs text-gray-500">JPG, PNG o PDF</p>
                      </div>
                      <Input id="dropzone-file" type="file" className="hidden" />
                    </label>
                  </div>
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

      <Tabs defaultValue="todas" value={categoriaActiva} onValueChange={setCategoriaActiva}>
        <TabsList className="mb-4">
          {categorias.map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={categoriaActiva}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portadasFiltradas.map((portada) => (
              <Card key={portada.id} className="overflow-hidden">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span>{portada.nombre}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleEliminarPortada(portada.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-[250px] relative">
                  <Image
                    src={portada.url || "/placeholder.svg?height=250&width=400&query=book cover"}
                    alt={portada.nombre}
                    fill
                    className="object-cover"
                  />
                </CardContent>
                <CardFooter className="p-4 bg-muted/50 flex justify-between">
                  <div className="text-xs text-muted-foreground">
                    Categoría:{" "}
                    <span className="font-medium">
                      {portada.categoria.charAt(0).toUpperCase() + portada.categoria.slice(1)}
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-4 border rounded-md bg-muted/30">
        <h3 className="text-lg font-medium mb-2">Nota sobre las portadas</h3>
        <p className="text-sm text-muted-foreground">
          Las portadas se utilizan principalmente para "Crea Tu Propio Libro" cuando los autores no tienen diseño de
          portada. El sistema asignará automáticamente una portada de la categoría correspondiente y añadirá el título
          del libro.
        </p>
      </div>
    </div>
  )
}
