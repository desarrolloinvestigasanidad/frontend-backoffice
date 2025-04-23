import {
  Users,
  BookOpen,
  FileText,
  DollarSign,
  Tag,
  Settings,
  Layers,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

const navItems = [
  {
    label: "Panel de Control",
    href: "/dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  { label: "Clientes", href: "/dashboard/clients", icon: <Users size={18} /> },
  {
    label: "Ediciones",
    href: "/dashboard/editions",
    icon: <BookOpen size={18} />,
  },
  { label: "Libros", href: "/dashboard/books", icon: <FileText size={18} /> },
  {
    label: "Capítulos",
    href: "/dashboard/chapters",
    icon: <Layers size={18} />,
  },
  {
    label: "Pagos",
    href: "/dashboard/payments",
    icon: <DollarSign size={18} />,
  },
  {
    label: "Descuentos",
    href: "/dashboard/discounts",
    icon: <Tag size={18} />,
  },
  { label: "Usuarios", href: "/dashboard/users", icon: <Users size={18} /> },
  { label: "Roles", href: "/dashboard/roles", icon: <Settings size={18} /> },
  {
    label: "Plantillas",
    href: "/dashboard/templates",
    icon: <FileText size={18} />,
  },
  {
    label: "Configuración",
    href: "/dashboard/configuration",
    icon: <Settings size={18} />,
  },
  {
    label: "Certificados",
    href: "/dashboard/certificates",
    icon: <FileText size={18} />,
  },
];

const Sidebar = () => {
  return (
    <div className='w-64 bg-gray-100 h-screen p-4'>
      <h1 className='text-2xl font-bold mb-4'>Panel de Administración</h1>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.label} className='mb-2'>
              <a
                href={item.href}
                className='flex items-center text-gray-700 hover:text-blue-500'>
                {item.icon}
                <span className='ml-2'>{item.label}</span>
              </a>
            </li>
          ))}
          <li className='mt-4'>
            <a
              href='/'
              className='flex items-center text-gray-700 hover:text-blue-500'>
              <LogOut size={18} />
              <span className='ml-2'>Cerrar Sesión</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
