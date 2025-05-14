"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";

interface BookGenerationOverlayProps {
  isGenerating: boolean;
}

export function BookGenerationOverlay({
  isGenerating,
}: BookGenerationOverlayProps) {
  return (
    <AnimatePresence>
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 bg-purple-900/70 backdrop-blur-sm z-50 flex items-center justify-center'>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='bg-white/90 rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 text-center'>
            <div className='relative mb-6 mx-auto'>
              {/* Libro base */}
              <motion.div
                className='w-32 h-40 bg-gradient-to-br from-purple-600 to-purple-800 rounded-r-md rounded-b-md mx-auto relative shadow-lg'
                initial={{ rotateY: 0 }}
                animate={{ rotateY: [0, 180, 360] }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}>
                {/* Páginas del libro */}
                <motion.div
                  className='absolute inset-2 right-0 bg-white rounded-r-sm rounded-b-sm'
                  animate={{
                    opacity: [1, 0.7, 1],
                    scale: [1, 0.98, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />

                {/* Lomo del libro */}
                <div className='absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-b from-purple-700 to-purple-900 rounded-l-sm' />

                {/* Icono de libro */}
                <div className='absolute inset-0 flex items-center justify-center'>
                  <BookOpen className='h-12 w-12 text-white/70' />
                </div>
              </motion.div>

              {/* Partículas/destellos alrededor del libro */}
              <div className='absolute inset-0 flex items-center justify-center'>
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className='absolute w-2 h-2 rounded-full bg-yellow-400'
                    initial={{
                      x: 0,
                      y: 0,
                      opacity: 0,
                    }}
                    animate={{
                      x: [0, (i % 2 === 0 ? 1 : -1) * (20 + i * 10)],
                      y: [
                        (i % 3 === 0 ? 1 : -1) * (10 + i * 5),
                        (i % 2 === 0 ? -1 : 1) * (30 + i * 5),
                      ],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2 + i * 0.2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </div>
            </div>

            <h3 className='text-xl font-bold text-purple-900 mb-2'>
              Generando Libro
            </h3>
            <p className='text-gray-600'>
              Estamos procesando todos los capítulos y creando tu libro. Este
              proceso puede tardar unos momentos...
            </p>

            {/* Barra de progreso */}
            <div className='mt-6 h-2 bg-gray-200 rounded-full overflow-hidden'>
              <motion.div
                className='h-full bg-gradient-to-r from-purple-500 to-purple-700'
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
