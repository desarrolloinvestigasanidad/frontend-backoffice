import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Biblioteca() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Biblioteca</h2>
      <Tabs defaultValue="2025">
        <TabsList>
          <TabsTrigger value="2025">2025</TabsTrigger>
          <TabsTrigger value="2024">2024</TabsTrigger>
          <TabsTrigger value="2023">2023</TabsTrigger>
        </TabsList>
        <TabsContent value="2025">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Medicina Interna 2025</CardTitle>
                <CardDescription>Edición VIII</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Fecha de publicación: 15/03/2025</p>
                <p>Número de capítulos: 50</p>
              </CardContent>
              <CardFooter>
                <Button>Ver libro</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="2024">{/* Contenido similar para libros de 2024 */}</TabsContent>
        <TabsContent value="2023">{/* Contenido similar para libros de 2023 */}</TabsContent>
      </Tabs>
    </div>
  )
}

