import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Publicaciones() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Mis Publicaciones</h2>
      <Tabs defaultValue="capitulos">
        <TabsList>
          <TabsTrigger value="capitulos">Capítulos libro de edición</TabsTrigger>
          <TabsTrigger value="libros">Crea tu propio libro</TabsTrigger>
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
                <Button>Descargar mis capítulos</Button>
                <Button variant="outline">Ver libro completo</Button>
              </CardFooter>
            </Card>
            {/* Add more cards for other publications */}
          </div>
        </TabsContent>
        <TabsContent value="libros">{/* Similar structure for "crea tu propio libro" publications */}</TabsContent>
      </Tabs>
    </div>
  )
}

