import Link from "next/link"
import { Users, BookOpen, Book, FileText, CreditCard, Tag, UserCog, Settings, Image } from "lucide-react"

const sidebarItems = [
  { name: "Clientes", href: "/backoffice/clientes", icon: Users },
  { name: "Ediciones", href: "/backoffice/ediciones", icon: BookOpen },
  { name: "Libros", href: "/backoffice/libros", icon: Book },
  { name: "Capítulos", href: "/backoffice/capitulos", icon: FileText },
  { name: "Pagos", href: "/backoffice/pagos", icon: CreditCard },
  { name: "Descuentos", href: "/backoffice/descuentos", icon: Tag },
  { name: "Usuarios", href: "/backoffice/usuarios", icon: UserCog },
  { name: "Roles y permisos", href: "/backoffice/roles", icon: Settings },
  { name: "Plantillas", href: "/backoffice/plantillas", icon: Image },
  { name: "Configuración", href: "/backoffice/configuracion", icon: Settings },
]

export function Sidebar() {
  return (
    <div className="flex flex-col h-screen w-64 bg-white border-r">
      <div className="flex items-center justify-center h-16 border-b">
        <span className="text-2xl font-semibold">WikScience Admin</span>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100">
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

