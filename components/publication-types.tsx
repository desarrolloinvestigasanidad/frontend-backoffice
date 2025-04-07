import { Button } from "@/components/ui/button"
import { BookOpen, BookPlus } from "lucide-react"

export default function PublicationTypes() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Tipos de Publicaciones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <BookOpen className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Capítulos de libro</h3>
            <p className="text-gray-600 mb-6">
              Publica tus trabajos científicos como capítulos de libro en las diferentes ediciones de temática sanitaria
              que tenemos. Cada edición cuenta con 8 libros diferentes y cada uno con su propio ISBN oficial.
            </p>
            <div className="space-y-4">
              <Button className="w-full">Publicar</Button>
              <Button variant="outline" className="w-full">
                Pasos a seguir
              </Button>
              <Button variant="outline" className="w-full">
                Ediciones y tarifas
              </Button>
            </div>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <BookPlus className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Crea tu Propio Libro</h3>
            <p className="text-gray-600 mb-6">
              Puedes formar tu libro científico de temática sanitaria desde cero con nuestra plataforma. Podrás añadir
              hasta 7 coautores y todos participar en su elaboración. Cada libro tendrá su propio ISBN oficial.
            </p>
            <div className="space-y-4">
              <Button className="w-full">Publicar</Button>
              <Button variant="outline" className="w-full">
                Pasos a seguir
              </Button>
              <Button variant="outline" className="w-full">
                Tarifas
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

