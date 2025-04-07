"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";

const RecuperarContrasenaForm = dynamic(
  () => import("@/components/recuperar-contrasena-form"),
  {
    ssr: false,
    loading: () => (
      <div className='flex justify-center items-center min-h-[300px]'>
        <div className='w-12 h-12 border-4 border-t-purple-500 border-b-purple-500/40 border-l-purple-300 border-r-purple-300/40 rounded-full animate-spin'></div>
      </div>
    ),
  }
);

export default function RecuperarContrasenaPage() {
  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-white to-purple-50'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='bg-white w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row'>
        {/* Columna izquierda con imagen y overlay */}
        <div className='relative md:w-1/2 min-h-[300px] md:min-h-0 bg-gradient-to-br from-purple-900 to-purple-700'>
          <Image
            src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/INVESTIGA%20SANIDAD%20SIN%20FONDO-BLQnlRYtFpCHZb4z2Xwzh7LiZbpq1R.png'
            alt='Investiga Sanidad'
            width={300}
            height={75}
            className='absolute top-8 left-1/2 -translate-x-1/2 z-20 w-40 h-auto'
          />
          <Image
            src='https://images.pexels.com/photos/8376232/pexels-photo-8376232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            alt='Recuperación de contraseña'
            fill
            className='object-cover absolute inset-0 mix-blend-overlay opacity-60'
          />
          <div className='absolute inset-0 bg-gradient-to-br from-purple-900/90 to-purple-700/90 z-10'></div>
          <div className='relative z-20 p-6 md:p-8 h-full flex flex-col justify-center mt-16'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}>
              <h2 className='text-2xl md:text-3xl font-bold text-white mb-4'>
                Recupera el acceso a tu cuenta
              </h2>
              <p className='text-white/90 mb-6 text-sm md:text-base'>
                Te enviaremos un enlace a tu correo electrónico para que puedas
                restablecer tu contraseña de forma segura.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Columna derecha con formulario */}
        <div className='md:w-1/2 p-6 md:p-8 lg:p-12'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='text-center mb-6 md:mb-8'>
            <h1 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-600 mb-2'>
              Recuperar Contraseña
            </h1>
            <p className='text-gray-600 text-sm md:text-base'>
              Introduce tu email para recibir instrucciones
            </p>
          </motion.div>

          <Suspense
            fallback={
              <div className='flex justify-center items-center min-h-[200px]'>
                <div className='w-12 h-12 border-4 border-t-purple-500 border-b-purple-500/40 border-l-purple-300 border-r-purple-300/40 rounded-full animate-spin'></div>
              </div>
            }>
            <RecuperarContrasenaForm />
          </Suspense>
        </div>
      </motion.div>
    </div>
  );
}
