"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Breadcrumb } from "@/components/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ChevronLeft,
  User,
  UserPlus,
  Mail,
  Phone,
  CreditCard,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function NewClientPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al crear cliente");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/clients");
      }, 1500);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='relative overflow-hidden py-8'>
      {/* Fondo con gradiente y "blobs" */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 to-white'></div>
        <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
        <div className='absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
      </div>

      <div className='container mx-auto px-4 relative z-10 space-y-8'>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex items-center justify-between'>
          <Breadcrumb>
            <Button
              variant='ghost'
              className='flex items-center text-purple-700 hover:text-purple-900 hover:bg-purple-50 mr-2'
              onClick={() => router.back()}>
              <ChevronLeft className='mr-1 h-4 w-4' />
              Volver
            </Button>
            <span className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
              Nuevo Cliente
            </span>
          </Breadcrumb>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            Registrar Nuevo Cliente
          </h2>
          <p className='text-gray-600 text-sm md:text-base'>
            Completa el formulario para añadir un nuevo cliente a la plataforma
          </p>
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto'></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='max-w-md mx-auto'>
          <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg'>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <div className='bg-purple-100 p-3 rounded-full'>
                  <UserPlus className='h-6 w-6 text-purple-700' />
                </div>
                <div>
                  <CardTitle>Datos del Cliente</CardTitle>
                  <CardDescription>
                    Introduce la información del nuevo cliente
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {success ? (
                <Alert className='bg-green-50 border-green-200 text-green-800'>
                  <CheckCircle className='h-4 w-4 text-green-600' />
                  <AlertDescription>
                    Cliente creado correctamente. Redirigiendo...
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='id'
                      className='flex items-center gap-2 text-gray-700'>
                      <CreditCard className='h-4 w-4 text-purple-600' />
                      ID (DNI/Pasaporte/NIE)
                    </Label>
                    <Input
                      id='id'
                      name='id'
                      value={formData.id}
                      onChange={handleChange}
                      required
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                      placeholder='Ej: 12345678A'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='firstName'
                      className='flex items-center gap-2 text-gray-700'>
                      <User className='h-4 w-4 text-purple-600' />
                      Nombre
                    </Label>
                    <Input
                      id='firstName'
                      name='firstName'
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                      placeholder='Nombre del cliente'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='lastName'
                      className='flex items-center gap-2 text-gray-700'>
                      <User className='h-4 w-4 text-purple-600' />
                      Apellidos
                    </Label>
                    <Input
                      id='lastName'
                      name='lastName'
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                      placeholder='Apellidos del cliente'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='email'
                      className='flex items-center gap-2 text-gray-700'>
                      <Mail className='h-4 w-4 text-purple-600' />
                      Email
                    </Label>
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                      placeholder='correo@ejemplo.com'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='phone'
                      className='flex items-center gap-2 text-gray-700'>
                      <Phone className='h-4 w-4 text-purple-600' />
                      Teléfono
                    </Label>
                    <Input
                      id='phone'
                      name='phone'
                      value={formData.phone}
                      onChange={handleChange}
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                      placeholder='Ej: 612345678'
                    />
                  </div>

                  {message && (
                    <Alert className='bg-red-50 border-red-200 text-red-800'>
                      <AlertCircle className='h-4 w-4 text-red-600' />
                      <AlertDescription>{message}</AlertDescription>
                    </Alert>
                  )}
                </form>
              )}
            </CardContent>
            <CardFooter className='flex justify-between'>
              <Button
                variant='outline'
                type='button'
                onClick={() => router.back()}
                className='border-gray-200 text-gray-700 hover:bg-gray-50'
                disabled={loading || success}>
                Cancelar
              </Button>
              <Button
                type='submit'
                onClick={handleSubmit}
                className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'
                disabled={loading || success}>
                {loading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Creando...
                  </>
                ) : (
                  <>
                    <UserPlus className='mr-2 h-4 w-4' />
                    Crear Cliente
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
