import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MessageSquare } from "lucide-react"

export default function Contact() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Contacto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Información de contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2" />
                <span>(34) 623 936 285</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2" />
                <span>contacto@investigasanidad.com</span>
              </li>
              <li className="flex items-center">
                <MessageSquare className="h-5 w-5 text-primary mr-2" />
                <span>WhatsApp: (34) 623 936 285</span>
              </li>
            </ul>
            <p className="mt-4">Horario: Lunes a viernes 8h - 21h, Sábados 8:30-13:30h</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Envíanos un mensaje</h3>
            <form className="space-y-4">
              <Input placeholder="Nombre" />
              <Input type="email" placeholder="Correo electrónico" />
              <Textarea placeholder="Mensaje" />
              <Button type="submit">Enviar mensaje</Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

