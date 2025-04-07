"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Book } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

/**
 * Página para crear un libro propio
 */
export default function CreateBookPage() {
  // Control de pasos: "normativa" o "titulo"
  const [step, setStep] = useState<"normativa" | "titulo">("normativa");
  const [titulo, setTitulo] = useState("");

  // Función que maneja el avance de pasos o la creación final
  const handleCreateBook = () => {
    if (step === "normativa") {
      // Paso 1 -> Paso 2
      setStep("titulo");
    } else if (step === "titulo" && titulo.trim()) {
      // Redirigir al checkout de Stripe o tu lógica para crear el libro en el backend
      window.location.href = "https://buy.stripe.com/test_dR69E32D104PcUw6oo";
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-4'>
      {step === "normativa" && (
        <>
          <div className='flex items-center gap-2 text-2xl mb-4'>
            <Book className='h-6 w-6' />
            <h1 className='font-bold'>Normativa para crear tu propio libro</h1>
          </div>

          <div className='grid md:grid-cols-[2fr,1fr] gap-6'>
            {/* Columna Izquierda */}
            <div className='space-y-4'>
              <div className='bg-secondary/10 p-4 rounded-lg'>
                <h3 className='font-semibold text-xl mb-2'>
                  Crea tu propio libro
                </h3>
                <p className='text-2xl font-bold text-primary'>99€</p>
                <p className='text-sm text-gray-600'>IVA incluido</p>
              </div>

              <div className='space-y-4'>
                <h4 className='font-semibold'>Participación</h4>
                <p>
                  Un usuario podrá crear un libro con hasta otros 6 autores (7
                  autores en total). El autor que proponga el libro será el
                  "coordinador" y el encargado de vincular a todos los autores
                  que quiera que participen en ese libro.
                </p>

                <Alert>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>
                    Todos los autores deberán estar registrados e inscritos para
                    que el libro se pueda publicar.
                  </AlertDescription>
                </Alert>

                <div className='space-y-2'>
                  <h4 className='font-semibold'>El coordinador podrá:</h4>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>
                      Añadir o quitar coautores en cualquier momento hasta
                      llegar al máximo permitido de 7.
                    </li>
                    <li>
                      Consultar todos los capítulos que forman parte de su libro
                      y su estado.
                    </li>
                    <li>
                      Visualizar el libro definitivo antes de mandarlo a
                      publicar.
                    </li>
                  </ul>
                </div>

                <div className='space-y-2'>
                  <h4 className='font-semibold'>Medidas anti-plagio</h4>
                  <p className='text-sm text-gray-600'>
                    Si tu capítulo es detectado con un porcentaje de plagio
                    superior al 45%, será rechazado directamente. Puedes
                    comprobar el plagio en:{" "}
                    <a
                      href='http://plagiarisma.net/es/'
                      className='text-primary hover:underline'
                      target='_blank'
                      rel='noopener noreferrer'>
                      plagiarisma.net
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Columna Derecha */}
            <div className='flex flex-col items-center justify-center p-4'>
              <Button onClick={handleCreateBook} className='w-full'>
                Participar
              </Button>
            </div>
          </div>
        </>
      )}

      {step === "titulo" && (
        <>
          <div className='mb-4'>
            <h1 className='text-2xl font-bold'>Nuevo libro</h1>
            <p className='text-gray-600'>
              Introduce el título de tu nuevo libro
            </p>
          </div>
          <div className='space-y-4'>
            <Input
              placeholder='Introduce el título del nuevo libro'
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
            <div className='flex justify-end gap-2'>
              <Button variant='outline' onClick={() => setStep("normativa")}>
                Volver
              </Button>
              <Button onClick={handleCreateBook} disabled={!titulo.trim()}>
                Crear libro
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
