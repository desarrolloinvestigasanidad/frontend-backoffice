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

export default function LoginPage() {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsVerifying(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

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
        // Verificar que roleId es 1 (administrador)
        if (Number(data.roleId) !== 1) {
          setMessage(
            "Acceso restringido: debes ser administrador para acceder."
          );
          setIsLoading(false);
          return;
        }

        // Guardar token en sessionStorage (solo durante la sesión)
        sessionStorage.setItem("token", data.token);
        router.replace("/dashboard");
      } else {
        setMessage(data.message || "Error al iniciar sesión.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error al iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='w-16 h-16 border-4 border-t-purple-500 border-b-purple-500/40 border-l-purple-300 border-r-purple-300/40 rounded-full animate-spin'></div>
      </div>
    );
  }

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
          />
          <Image
            src='https://images.pexels.com/photos/8376232/pexels-photo-8376232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            alt='Acceso Administrador'
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
                Panel de Administración
              </h2>
              <p className='text-white/90 mb-6 text-sm md:text-base'>
                Acceso exclusivo para administradores. Ingresa tus
                DNI/NIE/Pasaporte para continuar.
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
        <div className='md:w-1/2 p-6 md:p-8 lg:p-12'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='text-center mb-6 md:mb-8'>
            <h1 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-600 mb-2'>
              Iniciar Sesión - Administrador
            </h1>
            <p className='text-gray-600 text-sm md:text-base'>
              Ingresa tu DNI/NIE/Pasaporte para acceder al panel de
              administración.
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
                Identificador
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
                    value={formData.id}
                    onChange={handleChange}
                    className='bg-white border-gray-200 focus:border-purple-500 transition-all'
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
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className='bg-white border-gray-200 focus:border-purple-500 transition-all pr-10'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                    aria-label='Toggle password visibility'>
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
              className='w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 group'>
              <span className='flex items-center justify-center'>
                {isLoading ? "Accediendo..." : "Acceder"}
                <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
              </span>
            </Button>

            {message && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className='mt-4 text-center text-red-600 bg-red-50 p-2 rounded-md'>
                {message}
              </motion.p>
            )}
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className='mt-8 space-y-4'>
            <div className='text-center'>
              <Link
                href='/reset-password'
                className='text-sm text-purple-600 hover:text-purple-800 hover:underline transition-colors'>
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
