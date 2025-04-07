import { CheckCircle, Book, Award, FileText } from "lucide-react"

const features = [
  {
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
    title: "Validación",
    description: "Sistema de validación permanente. Certificados oficiales.",
  },
  {
    icon: <Book className="h-6 w-6 text-primary" />,
    title: "Ediciones",
    description: "Publicamos ediciones de libros científicos de manera periódica.",
  },
  {
    icon: <Award className="h-6 w-6 text-primary" />,
    title: "Revisión",
    description: "Comité científico especializado y análisis de plagio.",
  },
  {
    icon: <FileText className="h-6 w-6 text-primary" />,
    title: "ISBN",
    description: "Cada libro, un ISBN diferente. Registro oficial de publicación.",
  },
]

export default function Features() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Nuestras Características</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

