"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// ... (tus importaciones de Dialog, iconos, etc. se mantienen)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Settings,
  Barcode,
  ImageIcon,
  CreditCard,
  Layers3,
  MapPinned,
  BookCheck,
  FileCheck2,
  Microscope,
  BookCopy,
  Users2,
  Fingerprint,
  ChevronRight,
  X as XIcon,
} from "lucide-react";

// ... (tus importaciones de componentes de configuración)
import { ConfiguracionISBN } from "@/components/configuration/configuracion-isbn";
import { ConfiguracionPortadas } from "@/components/configuration/configuracion-portadas";
import { ConfiguracionPagos } from "@/components/configuration/configuracion-pagos";
import { ConfiguracionCategorias } from "@/components/configuration/configuracion-categorias";
// import { ConfiguracionTerritorial } from "@/components/configuration/configuracion-territorial"; // NUEVO COMPONENTE
import { ConfiguracionEstadosLibro } from "@/components/configuration/configuracion-estados-libro";
import { ConfiguracionEstadosCapitulo } from "@/components/configuration/configuracion-estados-capitulo";
import { ConfiguracionTiposEstudio } from "@/components/configuration/configuracion-tipos-estudio";
import { ConfiguracionTiposLibro } from "@/components/configuration/configuracion-tipos-libro";
import { ConfiguracionTiposAsociacion } from "@/components/configuration/configuracion-tipos-asociacion";
import { ConfiguracionTiposIdentificacion } from "@/components/configuration/configuracion-tipos-identificacion";

type ConfigSection = {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  component: JSX.Element;
};

const configSections: ConfigSection[] = [
  {
    id: "isbn",
    title: "ISBN",
    icon: Barcode,
    description: "Prefijos y ajustes de ISBN.",
    component: <ConfiguracionISBN />,
  },
  {
    id: "portadas",
    title: "Portadas",
    icon: ImageIcon,
    description: "Plantillas y opciones de portadas.",
    component: <ConfiguracionPortadas />,
  },
  {
    id: "pagos",
    title: "Métodos de Pago",
    icon: CreditCard,
    description: "Pasarelas y opciones de pago.",
    component: <ConfiguracionPagos />,
  },
  {
    id: "categorias",
    title: "Categorías profesionales",
    icon: Layers3,
    description: "Administra las categorías profesionales.",
    component: <ConfiguracionCategorias />,
  },
  // {
  //   // MODIFICADO: Sección unificada para Comunidades y Provincias
  //   id: "territorial_spain", // ID único para esta sección combinada
  //   title: "Gestión Territorial (España)",
  //   icon: MapPinned, // Icono representativo
  //   description: "Administra Comunidades Autónomas y Provincias de España.",
  //   component: <ConfiguracionTerritorial />, // Apunta al nuevo componente combinado
  // },
  {
    id: "tipos-estudio",
    title: "Tipos de Estudio",
    icon: Microscope,
    description: "Tipos de estudios científicos.",
    component: <ConfiguracionTiposEstudio />,
  },
  {
    id: "tipos-libro",
    title: "Tipos de Libro",
    icon: BookCopy,
    description: "Clasificación de tipos de libros.",
    component: <ConfiguracionTiposLibro />,
  },
  {
    id: "tipos-identificacion",
    title: "Tipos de Identificación",
    icon: Fingerprint,
    description: "Documentos de identificación.",
    component: <ConfiguracionTiposIdentificacion />,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

export default function ConfiguracionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<ConfigSection | null>(
    null
  );

  const handleCardClick = (section: ConfigSection) => {
    setSelectedConfig(section);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow;
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isModalOpen]);

  return (
    <div className='container mx-auto py-8 px-4 md:px-6 relative'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='mb-10'>
        <div className='flex items-center gap-3 mb-2'>
          <Settings className='h-8 w-8 text-purple-600' />
          <h1 className='text-3xl md:text-4xl font-bold tracking-tight text-gray-800'>
            Configuración General
          </h1>
        </div>
        <p className='text-gray-600 text-base md:text-lg max-w-2xl'>
          Selecciona una sección para gestionar y personaliza los parámetros de
          la plataforma.
        </p>
        <div className='mt-6 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full'></div>
      </motion.div>
      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mb-12'>
        {configSections.map((section) => {
          const IconComponent = section.icon;
          return (
            <motion.div
              key={section.id}
              variants={itemVariants}
              onClick={() => handleCardClick(section)}
              className={`
                w-full h-full p-0 rounded-xl border-2 transition-all duration-300 ease-in-out cursor-pointer
                focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-500 focus:outline-none
                group relative overflow-hidden bg-white text-gray-800 border-gray-200 hover:shadow-xl hover:border-purple-400 hover:scale-[1.03]
              `}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  handleCardClick(section);
              }}>
              <div className='flex flex-col items-start text-left p-5 space-y-3 h-full'>
                <div className='p-3 rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors duration-300'>
                  <IconComponent className='h-7 w-7 text-purple-600 transition-colors duration-300' />
                </div>
                <div>
                  <h3 className='text-lg font-semibold group-hover:text-purple-700'>
                    {section.title}
                  </h3>
                  <p className='text-xs mt-1 text-gray-500 group-hover:text-gray-600'>
                    {section.description}
                  </p>
                </div>
                <ChevronRight className='h-5 w-5 ml-auto mt-auto self-end text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300' />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='fixed inset-0 z-[100] m-0 h-screen w-screen max-w-full overflow-hidden !rounded-none border-0 bg-gray-100 p-0 shadow-none outline-none dark:bg-gray-900 sm:!rounded-none md:!rounded-none lg:!rounded-none xl:!rounded-none !translate-x-0 !translate-y-0 !transform-none !top-0 !left-0 flex flex-col'>
          {selectedConfig && (
            <>
              <DialogHeader className='px-6 py-4 border-b bg-white dark:bg-gray-800 sticky top-0 z-10 flex flex-row shrink-0 items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <selectedConfig.icon className='h-6 w-6 text-purple-600' />
                  <DialogTitle className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
                    {selectedConfig.title}
                  </DialogTitle>
                </div>
                {/* CORRECTED PART: Removed {" "} before <button> */}
                <DialogClose asChild>
                  <button
                    className='p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
                    aria-label='Cerrar modal'>
                    <XIcon className='h-6 w-6' />
                  </button>
                </DialogClose>
              </DialogHeader>
              <div className='flex-grow overflow-y-auto'>
                <div className='p-6'>
                  <AnimatePresence mode='wait'>
                    <motion.div
                      key={selectedConfig.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}>
                      {selectedConfig.component}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
