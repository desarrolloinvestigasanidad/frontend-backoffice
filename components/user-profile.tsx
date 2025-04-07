"use client";

import Link from "next/link";
import {
  Home,
  User,
  FileBadge,
  BookOpen,
  Book,
  Library as LibraryIcon,
  Newspaper,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PersonalData from "./profile/personal-data";

export default function UserProfile() {
  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Encabezado / Menú principal */}
      <header className='flex flex-col items-center justify-center gap-4 mb-8 md:flex-row md:items-center md:justify-start'>
        {/* Opción: "Inicio" */}
        <Link
          href='/'
          className='flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors mx-2'>
          <Home className='h-8 w-8' />
          <span className='text-sm mt-1'>Inicio</span>
        </Link>

        {/* Opción: "Mi Perfil" */}
        <Link
          href='/profile'
          className='flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors mx-2'>
          <User className='h-8 w-8' />
          <span className='text-sm mt-1'>Mi Perfil</span>
        </Link>

        {/* Opción: "Certificados" (provisionales/definitivos) */}
        <Link
          href='/certificates'
          className='flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors mx-2'>
          <FileBadge className='h-8 w-8' />
          <span className='text-sm mt-1'>Certificados</span>
        </Link>

        {/* Opción: "Mis Publicaciones" */}
        <Link
          href='/publications'
          className='flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors mx-2'>
          <BookOpen className='h-8 w-8' />
          <span className='text-sm mt-1'>Mis Publicaciones</span>
        </Link>

        {/* Opción: "Biblioteca" */}
        <Link
          href='/library'
          className='flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors mx-2'>
          <LibraryIcon className='h-8 w-8' />
          <span className='text-sm mt-1'>Biblioteca</span>
        </Link>
      </header>

      {/* Contenedor principal del dashboard */}
      <main className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Tarjeta 1: Libros */}
        <div className='bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-200 flex flex-col items-center text-center'>
          <Book className='h-16 w-16 text-blue-600 mb-4' />
          <h3 className='text-xl font-semibold mb-2'>Libros</h3>
          <p className='text-gray-600 mb-4'>
            Explora y gestiona tus libros electrónicos
          </p>
          <Link href='/books' className='block w-full'>
            <Button variant='outline' className='w-full'>
              Ver Libros
            </Button>
          </Link>
        </div>

        {/* Tarjeta 2: Revistas */}
        <div className='bg-green-50 p-6 rounded-xl shadow-sm border border-green-200 flex flex-col items-center text-center'>
          <Newspaper className='h-16 w-16 text-green-600 mb-4' />
          <h3 className='text-xl font-semibold mb-2'>Revistas</h3>
          <p className='text-gray-600 mb-4'>
            Publicaciones en revistas científicas
          </p>
          <Link href='/journals' className='block w-full'>
            <Button variant='outline' className='w-full'>
              Ver Revistas
            </Button>
          </Link>
        </div>

        {/* Tarjeta 3: Crea tus propios libros */}
        <div className='bg-yellow-50 p-6 rounded-xl shadow-sm border border-yellow-200 flex flex-col items-center text-center'>
          <PlusCircle className='h-16 w-16 text-yellow-600 mb-4' />
          <h3 className='text-xl font-semibold mb-2'>
            Crea tus propios libros
          </h3>
          <p className='text-gray-600 mb-4'>
            Colabora con coautores y publica tu obra
          </p>
          <Link href='/create-book' className='block w-full'>
            <Button className='w-full bg-yellow-500 text-white hover:bg-yellow-600'>
              Empezar ahora
            </Button>
          </Link>
        </div>
      </main>
      <PersonalData />
    </div>
  );
}
