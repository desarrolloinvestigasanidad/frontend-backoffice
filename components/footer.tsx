import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className='bg-gray-800 text-white py-12'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div>
            <h4 className='text-lg font-semibold mb-4'>Libro electrónico</h4>
          </div>

          <div className='flex flex-col items-end'>
            <Image
              src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/INVESTIGA%20SANIDAD%20SIN%20FONDO-BLQnlRYtFpCHZb4z2Xwzh7LiZbpq1R.png'
              alt='Investiga Sanidad'
              width={200}
              height={50}
              className='h-12 w-auto mb-4 invert'
            />
            <div className='flex gap-4'>
              <Link href='#' className='hover:text-gray-300'>
                <Facebook className='w-6 h-6' />
              </Link>
              <Link href='#' className='hover:text-gray-300'>
                <Instagram className='w-6 h-6' />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
