"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BackgroundBlobs } from "@/components/background-blobs";
import { CheckCircle, AlertCircle, BookPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";

type FormData = {
  title: string;
  subtitle: string;
  isbn: string | null;
  cover: string;
  interests: string;
  price: string;
};

export default function NewCustomBookPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    subtitle: "",
    isbn: null,
    cover: "",
    interests: "",
    price: "",
  });
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});

  const handleMouseEnter = (id: string) =>
    setHoverStates((prev) => ({ ...prev, [id]: true }));
  const handleMouseLeave = (id: string) =>
    setHoverStates((prev) => ({ ...prev, [id]: false }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateISBN = () => {
    setMessage("ISBN generado automáticamente");
    setIsError(false);
    setFormData((prev) => ({ ...prev, isbn: "ISBN-AUTOGENERADO-1234" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setIsError(false);
    try {
      if (!formData.title.trim() || !formData.price.trim()) {
        throw new Error("Campos obligatorios faltantes: título y precio.");
      }
      const token = localStorage.getItem("token");
      const payload = {
        title: formData.title,
        subtitle: formData.subtitle || null,
        isbn: formData.isbn,
        cover: formData.cover || null,
        interests: formData.interests || null,
        editionId: null,
        bookType: "libro propio",
        status: "desarrollo",
        active: true,
        price: parseFloat(formData.price),
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al crear libro");
      }
      setMessage("Libro personalizado creado con éxito.");
      setTimeout(() => router.push("/dashboard/books"), 1500);
    } catch (err: any) {
      setMessage(err.message);
      setIsError(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='relative overflow-hidden min-h-screen py-8'>
      <BackgroundBlobs />
      <div className='container mx-auto px-4 relative z-10 space-y-8'>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex items-center gap-2'>
          <Link href='/dashboard/books'>
            <Button
              variant='ghost'
              size='sm'
              onMouseEnter={() => handleMouseEnter("back")}
              onMouseLeave={() => handleMouseLeave("back")}
              className='text-purple-700 hover:text-purple-900 hover:bg-purple-50'>
              <motion.span
                className='flex items-center'
                animate={{ x: hoverStates["back"] ? -3 : 0 }}
                transition={{ duration: 0.2 }}>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Volver a Libros
              </motion.span>
            </Button>
          </Link>
          <span className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
            Nuevo Libro Personalizado
          </span>
        </motion.div>

        {message && (
          <Alert
            className={`${
              isError
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-green-50 border-green-200 text-green-800"
            }`}>
            {isError ? (
              <AlertCircle className='h-4 w-4 text-red-600' />
            ) : (
              <CheckCircle className='h-4 w-4 text-green-600' />
            )}
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg'>
            <CardHeader>
              <CardTitle>Información del Libro</CardTitle>
            </CardHeader>
            <CardContent>
              <form id='bookForm' onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='title'>
                      Título <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='title'
                      name='title'
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='subtitle'>Subtítulo</Label>
                    <Input
                      id='subtitle'
                      name='subtitle'
                      value={formData.subtitle}
                      onChange={handleChange}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='price'>
                      Precio (€) <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='price'
                      name='price'
                      type='number'
                      step='0.01'
                      value={formData.price}
                      onChange={handleChange}
                      placeholder='0.00'
                      required
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='flex justify-between items-center'>
                    <Label htmlFor='isbn'>ISBN</Label>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={generateISBN}>
                      Generar ISBN
                    </Button>
                  </div>
                  <Input
                    id='isbn'
                    name='isbn'
                    value={formData.isbn || ""}
                    onChange={handleChange}
                    placeholder='Opcional'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='cover'>URL Portada</Label>
                  <Input
                    id='cover'
                    name='cover'
                    value={formData.cover}
                    onChange={handleChange}
                    placeholder='https://...'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='interests'>Temáticas</Label>
                  <Input
                    id='interests'
                    name='interests'
                    value={formData.interests}
                    onChange={handleChange}
                    placeholder='Ej: Medicina, Salud'
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className='flex justify-end gap-3'>
              <Button
                variant='outline'
                type='button'
                onClick={() => router.push("/dashboard/books")}>
                Cancelar
              </Button>
              <Button type='submit' form='bookForm' disabled={saving}>
                {saving ? (
                  "Guardando..."
                ) : (
                  <>
                    <BookPlus className='mr-2 h-4 w-4' /> Crear Libro
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
