import { Button } from "@/components/ui/button"
import { BookOpen, Award, FileText } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Blob from "@/components/ui/blob"

export default function Hero() {
  const stats = [
    { value: "500+", label: "Autores publicados" },
    { value: "50+", label: "Libros publicados" },
    { value: "98%", label: "Tasa de aceptación" },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="relative h-32 flex items-center justify-start">
              <Blob />
              <Link href="/" className="relative block w-[300px]">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/INVESTIGA%20SANIDAD%20SIN%20FONDO-BLQnlRYtFpCHZb4z2Xwzh7LiZbpq1R.png"
                  alt="Investiga Sanidad"
                  width={300}
                  height={75}
                  className="w-[300px] h-auto"
                  priority
                />
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Publica tus trabajos científicos con nosotros
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-lg">
              Una editorial científica en la que podrás publicar un libro completo o un capítulo de libro en diferentes
              ediciones.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white">
                Publica Capítulos de Libro
              </Button>
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-white/10 hover:text-white transition-colors border-2 border-primary"
              >
                Publica Tu Propio Libro
              </Button>
            </div>

            {/* Floating Features */}
            <div className="hidden md:block absolute top-1/4 right-1/3 bg-white p-3 rounded-xl shadow-lg">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-secondary" />
                <span className="text-sm font-medium">ISBN Oficial</span>
              </div>
            </div>
            <div className="hidden md:block absolute top-2/3 right-1/4 bg-white p-3 rounded-xl shadow-lg">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Revisión por expertos</span>
              </div>
            </div>
            <div className="hidden md:block absolute bottom-1/4 right-1/3 bg-white p-3 rounded-xl shadow-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-secondary" />
                <span className="text-sm font-medium">Certificado oficial</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[600px] hidden md:block">
            <Image
              src="https://images.pexels.com/photos/8376232/pexels-photo-8376232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Profesional médico escribiendo"
              fill
              className="object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-primary/10 rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}

