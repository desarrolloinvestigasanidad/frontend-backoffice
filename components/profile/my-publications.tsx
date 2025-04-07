import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function MisPublicaciones() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Mis Publicaciones</h2>
        <Link href="/crear-libro">
          <Button>Crear Nuevo Libro</Button>
        </Link>
      </div>
      <Tabs defaultValue="capitulos">
        <TabsList>
          <TabsTrigger value="capitulos">Capítulos de libro</TabsTrigger>
          <TabsTrigger value="libros">Libros propios</TabsTrigger>
        </TabsList>
        <TabsContent value="capitulos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Medicina Interna 2025</CardTitle>
                <CardDescription>Edición VIII</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Capítulo: Avances en Cardiología</p>
                <p>Fecha de publicación: 15/03/2025</p>
              </CardContent>
              <CardFooter>
                <Button>Descargar capítulo</Button>
                <Button variant="outline">Ver libro completo</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="libros">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Mi Libro de Medicina</CardTitle>
                <CardDescription>Autor principal</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Fecha de publicación: 20/05/2025</p>
                <p>Número de capítulos: 10</p>
              </CardContent>
              <CardFooter>
                <Button>Ver detalles</Button>
                <Button variant="outline">Editar libro</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

