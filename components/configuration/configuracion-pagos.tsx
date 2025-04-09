"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, X, Edit, CreditCard, Euro } from "lucide-react"
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
const metodosPagoEjemplo = [
  {
    id: 1,
    nombre: "Tarjeta de crédito",
    activo: true,
    comision: 1.5,
    descripcion: "Pago con tarjeta de crédito/débito",
  },
  { id: 2, nombre: "PayPal", activo: true, comision: 2.9, descripcion: "Pago a través de PayPal" },
  {
    id: 3,
    nombre: "Transferencia bancaria",
    activo: true,
    comision: 0,
    descripcion: "Pago mediante transferencia bancaria",
  },
  { id: 4, nombre: "Bizum", activo: false, comision: 0.5, descripcion: "Pago mediante Bizum" },
]

const preciosEjemplo = [
  {
    id: 1,
    concepto: "Capítulo en libro de edición",
    precio: 250,
    descripcion: "Precio por capítulo en libro de edición",
  },
  { id: 2, concepto: "Libro propio (hasta 100 páginas)", precio: 1200, descripcion: "Precio base para libro propio" },
  {
    id: 3,
    concepto: "Página adicional libro propio",
    precio: 10,
    descripcion: "Precio por página adicional en libro propio",
  },
  { id: 4, concepto: "Diseño de portada personalizada", precio: 150, descripcion: "Diseño de portada personalizada" },
]

export function ConfiguracionPagos() {
  const [metodosPago, setMetodosPago] = useState(metodosPagoEjemplo)
  const [precios, setPrecios] = useState(preciosEjemplo)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [precioDialogOpen, setPrecioDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("metodos")

  const handleToggleMetodoPago = (id: number) => {
    setMetodosPago(metodosPago.map((metodo) => (metodo.id === id ? { ...metodo, activo: !metodo.activo } : metodo)))
  }

  const handleEliminarMetodoPago = (id: number) => {
    setMetodosPago(metodosPago.filter((metodo) => metodo.id !== id))
  }

  const handleEliminarPrecio = (id: number) => {
    setPrecios(precios.filter((precio) => precio.id !== id))
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="metodos" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="metodos">Métodos de pago</TabsTrigger>
            <TabsTrigger value="precios">Precios</TabsTrigger>
          </TabsList>

          {activeTab === "metodos" ? (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Añadir método de pago
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Añadir método de pago</DialogTitle>
                  <DialogDescription>Configura un nuevo método de pago para la plataforma.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nombre-metodo" className="text-right">
                      Nombre
                    </Label>
                    <Input id="nombre-metodo" placeholder="Ej: Stripe" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="comision" className="text-right">
                      Comisión (%)
                    </Label>
                    <Input id="comision" type="number" step="0.1" placeholder="0.0" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="descripcion-metodo" className="text-right pt-2">
                      Descripción
                    </Label>
                    <Input
                      id="descripcion-metodo"
                      placeholder="Descripción del método de pago"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="activo-metodo" className="text-right">
                      Activo
                    </Label>
                    <div className="col-span-3 flex items-center space-x-2">
                      <Switch id="activo-metodo" defaultChecked />
                      <Label htmlFor="activo-metodo">Método de pago activo</Label>
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
          ) : (
            <Dialog open={precioDialogOpen} onOpenChange={setPrecioDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Añadir precio
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Añadir nuevo precio</DialogTitle>
                  <DialogDescription>Configura un nuevo precio para la plataforma.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="concepto" className="text-right">
                      Concepto
                    </Label>
                    <Input id="concepto" placeholder="Ej: Capítulo en libro" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="precio" className="text-right">
                      Precio (€)
                    </Label>
                    <Input id="precio" type="number" placeholder="0" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="descripcion-precio" className="text-right pt-2">
                      Descripción
                    </Label>
                    <Input id="descripcion-precio" placeholder="Descripción del precio" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={() => setPrecioDialogOpen(false)}>
                    Guardar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <TabsContent value="metodos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Métodos de pago disponibles</CardTitle>
              <CardDescription>Configura los métodos de pago que estarán disponibles en la plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Método de pago</TableHead>
                    <TableHead>Comisión (%)</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metodosPago.map((metodo) => (
                    <TableRow key={metodo.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          {metodo.nombre}
                        </div>
                      </TableCell>
                      <TableCell>{metodo.comision}%</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch checked={metodo.activo} onCheckedChange={() => handleToggleMetodoPago(metodo.id)} />
                          <span className={metodo.activo ? "text-green-600" : "text-muted-foreground"}>
                            {metodo.activo ? "Activo" : "Inactivo"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{metodo.descripcion}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleEliminarMetodoPago(metodo.id)}
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
        </TabsContent>

        <TabsContent value="precios" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Precios de la plataforma</CardTitle>
              <CardDescription>Configura los precios de los diferentes servicios de la plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Precio (€)</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {precios.map((precio) => (
                    <TableRow key={precio.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Euro className="h-4 w-4" />
                          {precio.concepto}
                        </div>
                      </TableCell>
                      <TableCell>{precio.precio.toFixed(2)} €</TableCell>
                      <TableCell className="max-w-[300px] truncate">{precio.descripcion}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleEliminarPrecio(precio.id)}
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
