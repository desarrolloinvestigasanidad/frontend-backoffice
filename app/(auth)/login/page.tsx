"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, ArrowRight } from "lucide-react";
import { useUser } from "@/app/context/UserContext";

export default function LoginPage() {
  const { refreshUser } = useUser();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // useEffect para limpiar el mensaje si los datos del formulario cambian
  useEffect(() => {
    if (message) setMessage("");
  }, [formData.id, formData.password]); // Solo se limpia el mensaje, no el 'message' en sí.

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // **Punto Clave: Limpiar token antiguo ANTES de intentar un nuevo login**
    // Esto evita conflictos con tokens previos, ya sean válidos o inválidos.
    localStorage.removeItem("token");
    // Si guardaras otros datos del usuario en localStorage (ej: 'user'), límpialos también:
    // localStorage.removeItem("user");

    try {
      const res: Response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: formData.id,
            password: formData.password,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        if (Number(data.roleId) !== 1) {
          setMessage(
            "Acceso restringido: debes ser administrador para acceder."
          );
          setIsLoading(false);
          return;
        }

        localStorage.setItem("token", data.token);

        try {
          await refreshUser(); // Espera a que se cargue el user
          router.push("/dashboard"); // Redirige solo cuando esté cargado
        } catch (error) {
          console.error("❌ Error al refrescar usuario:", error);
          setMessage("No se pudo cargar el perfil de usuario.");
          setIsLoading(false);
        }
      } else {
        setMessage(
          data.message || "Error al iniciar sesión. Verifica tus credenciales."
        );

        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Error en la petición de login:", error);
      setMessage(
        "Se produjo un error de red o en el servidor. Inténtalo de nuevo."
      );
      localStorage.removeItem("token"); // Limpiar en caso de error de red/inesperado
    } finally {
      if (window.location.pathname !== "/dashboard") {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-white to-purple-50'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='bg-white w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row'>
        {/* Columna izquierda: Imagen y overlay */}
        <div className='relative md:w-1/2 min-h-[300px] md:min-h-0 bg-gradient-to-br from-purple-900 to-purple-700'>
          <Image
            src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/INVESTIGA%20SANIDAD%20SIN%20FONDO-BLQnlRYtFpCHZb4z2Xwzh7LiZbpq1R.png'
            alt='Investiga Sanidad'
            width={300}
            height={75}
            className='absolute top-8 left-1/2 -translate-x-1/2 z-20 w-40 h-auto'
            priority // Cargar la imagen del logo con prioridad
          />
          <Image
            src='https://images.pexels.com/photos/8376232/pexels-photo-8376232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            alt='Acceso Administrador'
            fill
            sizes='(max-width: 768px) 100vw, 50vw' // Ayuda al navegador a elegir la mejor fuente
            className='object-cover absolute inset-0 mix-blend-overlay opacity-60'
          />
          <div className='absolute inset-0 bg-gradient-to-br from-purple-900/90 to-purple-700/90 z-10'></div>
          <div className='relative z-20 p-6 md:p-8 h-full flex flex-col justify-center mt-16 md:mt-0'>
            {" "}
            {/* Ajustado mt en móvil */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}>
              <h2 className='text-2xl md:text-3xl font-bold text-white mb-4'>
                Panel de Administración
              </h2>
              <p className='text-white/90 mb-6 text-sm md:text-base'>
                Acceso exclusivo para administradores. Ingresa tus credenciales
                para continuar.
              </p>
              <div className='flex items-center space-x-2 text-white/80'>
                <div className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center'>
                  <LogIn className='w-4 h-4' />
                </div>
                <span className='text-sm md:text-base'>
                  Acceso seguro al backoffice
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Columna derecha: Formulario */}
        <div className='md:w-1/2 p-6 md:p-8 lg:p-12 flex flex-col justify-center'>
          {" "}
          {/* flex y justify-center para centrar verticalmente el contenido */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='text-center mb-6 md:mb-8'>
            <h1 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-600 mb-2'>
              Iniciar Sesión
            </h1>
            <p className='text-gray-600 text-sm md:text-base'>
              Usa tu identificador y contraseña para acceder.
            </p>
          </motion.div>
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onSubmit={handleSubmit}
            className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='id' className='text-gray-700 font-medium'>
                Identificador (DNI/NIE/Pasaporte)
              </Label>
              <div className='relative group'>
                <div className='absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg opacity-0 group-focus-within:opacity-70 blur transition duration-300'></div>
                <div className='relative'>
                  <Input
                    type='text'
                    id='id'
                    name='id'
                    placeholder='Introduce tu identificador'
                    required
                    autoComplete='username' // Ayuda a los gestores de contraseñas
                    value={formData.id}
                    onChange={handleChange}
                    className='bg-white border-gray-300 focus:border-purple-500 transition-all shadow-sm focus:ring-1 focus:ring-purple-500 py-3 px-4' // Clases mejoradas
                  />
                </div>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password' className='text-gray-700 font-medium'>
                Contraseña
              </Label>
              <div className='relative group'>
                <div className='absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg opacity-0 group-focus-within:opacity-70 blur transition duration-300'></div>
                <div className='relative'>
                  <Input
                    type={showPassword ? "text" : "password"}
                    id='password'
                    name='password'
                    placeholder='Introduce tu contraseña'
                    required
                    autoComplete='current-password' // Ayuda a los gestores de contraseñas
                    value={formData.password}
                    onChange={handleChange}
                    className='bg-white border-gray-300 focus:border-purple-500 transition-all shadow-sm focus:ring-1 focus:ring-purple-500 py-3 px-4 pr-10' // Clases mejoradas
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-md'
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }>
                    {showPassword ? (
                      <EyeOff className='w-5 h-5' />
                    ) : (
                      <Eye className='w-5 h-5' />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type='submit'
              disabled={isLoading}
              className='w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 group py-3 text-base font-semibold'>
              <span className='flex items-center justify-center'>
                {isLoading ? (
                  <>
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                    Accediendo...
                  </>
                ) : (
                  "Acceder"
                )}
                {!isLoading && (
                  <ArrowRight className='ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1' />
                )}
              </span>
            </Button>

            {message && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 text-center p-3 rounded-md text-sm ${
                  message.includes("Acceso restringido") ||
                  message.includes("Error") ||
                  message.includes("Verifica")
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200" // Para mensajes informativos si los hubiera
                }`}>
                {message}
              </motion.p>
            )}
          </motion.form>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className='mt-8 text-center'>
            {" "}
            {/* Eliminado space-y-4 innecesario */}
            <Link
              href='/reset-password' // Asegúrate que esta ruta existe
              className='text-sm text-purple-600 hover:text-purple-800 hover:underline transition-colors'>
              ¿Olvidaste tu contraseña?
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
