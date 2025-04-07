import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

export default function UpcomingEditions() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Próximas Ediciones</h2>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Calendar className="h-6 w-6 text-primary mr-2" />
            <h3 className="text-xl font-semibold">Edición VIII (Marzo 2025)</h3>
          </div>
          <ul className="space-y-2 mb-6">
            <li>Envío capítulos: 10 marzo</li>
            <li>Publicación oficial: 14 marzo</li>
          </ul>
          <Button>Publicar</Button>
        </div>
        <div className="mt-8 p-4 bg-blue-100 rounded-lg">
          <p className="text-blue-800 font-semibold">Descarga de certificados: A partir del 14 de marzo del 2025.</p>
        </div>
      </div>
    </section>
  )
}

