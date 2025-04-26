"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
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
import { Breadcrumb } from "@/components/breadcrumb";
import { CheckCircle, AlertCircle, ImageIcon } from "lucide-react";

export default function NewBookPage() {
  const router = useRouter();
  const params = useParams();
  const { id: editionId } = params;
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    price: "",
    isbn: "",
    cover: "",
    openDate: "",
    deadlineChapters: "",
    publishDate: "",
    interests: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editionName, setEditionName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEditionDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setEditionName(data.name || "Edición");
        }
      } catch (error) {
        console.error("Error fetching edition details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEditionDetails();
  }, [editionId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setIsError(false);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        editionId,
        isbn: formData.isbn.trim() === "" ? null : formData.isbn,
        price: Number(formData.price),
        bookType: "libro edición",
        status: "desarrollo",
        active: true,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al crear el libro");
      }

      setMessage("Libro creado con éxito.");
      setTimeout(() => {
        router.push(`/dashboard/editions/${editionId}/books`);
      }, 1500);
    } catch (error: any) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-[60vh]'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Ediciones", href: "/dashboard/editions" },
    { label: editionName, href: `/dashboard/editions/${editionId}` },
    { label: "Libros", href: `/dashboard/editions/${editionId}/books` },
    {
      label: "Nuevo Libro",
      href: `/dashboard/editions/${editionId}/books/new`,
    },
  ];

  return (
    <div className='container mx-auto px-4 py-6'>
      <Breadcrumb items={breadcrumbItems} />

      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-primary'>Nuevo Libro</h1>
        <p className='text-muted-foreground'>
          Añadir un nuevo libro a la edición {editionName}
        </p>
      </div>

      {message && (
        <Alert
          className={`mb-6 ${
            isError
              ? "bg-red-50 text-red-800 border-red-200"
              : "bg-green-50 text-green-800 border-green-200"
          }`}>
          {isError ? (
            <AlertCircle className='h-4 w-4 mr-2' />
          ) : (
            <CheckCircle className='h-4 w-4 mr-2' />
          )}
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Card className='shadow-md'>
        <CardHeader>
          <CardTitle>Información del Libro</CardTitle>
        </CardHeader>
        <CardContent>
          <form id='bookForm' onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <Label htmlFor='title' className='font-medium'>
                  Título *
                </Label>
                <Input
                  id='title'
                  name='title'
                  value={formData.title}
                  onChange={handleChange}
                  className='border-gray-300 focus:ring-primary focus:border-primary'
                  placeholder='Título del libro'
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='subtitle' className='font-medium'>
                  Subtítulo
                </Label>
                <Input
                  id='subtitle'
                  name='subtitle'
                  value={formData.subtitle}
                  onChange={handleChange}
                  className='border-gray-300 focus:ring-primary focus:border-primary'
                  placeholder='Subtítulo (opcional)'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='isbn' className='font-medium'>
                  ISBN
                </Label>
                <Input
                  id='isbn'
                  name='isbn'
                  value={formData.isbn}
                  onChange={handleChange}
                  className='border-gray-300 focus:ring-primary focus:border-primary'
                  placeholder='Deja vacío si aún no se asigna'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='cover' className='font-medium'>
                URL de la Portada
              </Label>
              <Input
                id='cover'
                name='cover'
                value={formData.cover}
                onChange={handleChange}
                className='border-gray-300 focus:ring-primary focus:border-primary'
                placeholder='https://ejemplo.com/portada.jpg'
              />

              {formData.cover && (
                <div className='mt-2 border rounded-md p-4 bg-gray-50'>
                  <p className='text-sm text-gray-500 mb-2'>Vista previa:</p>
                  <div className='relative h-48 w-36 mx-auto border shadow-sm rounded overflow-hidden'>
                    <Image
                      src={formData.cover || "/placeholder.svg"}
                      alt='Vista previa de portada'
                      fill
                      style={{ objectFit: "cover" }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/abstract-book-cover.png";
                      }}
                    />
                  </div>
                </div>
              )}

              {!formData.cover && (
                <div className='mt-2 border rounded-md p-4 bg-gray-50 flex flex-col items-center justify-center'>
                  <ImageIcon className='h-8 w-8 text-gray-400 mb-2' />
                  <p className='text-sm text-gray-500'>
                    Ingresa una URL para ver la portada
                  </p>
                </div>
              )}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='space-y-2'>
                <Label htmlFor='openDate' className='font-medium'>
                  Fecha de Apertura
                </Label>
                <Input
                  id='openDate'
                  name='openDate'
                  type='date'
                  value={formData.openDate}
                  onChange={handleChange}
                  className='border-gray-300 focus:ring-primary focus:border-primary'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='deadlineChapters' className='font-medium'>
                  Fecha Límite de Capítulos
                </Label>
                <Input
                  id='deadlineChapters'
                  name='deadlineChapters'
                  type='date'
                  value={formData.deadlineChapters}
                  onChange={handleChange}
                  className='border-gray-300 focus:ring-primary focus:border-primary'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='publishDate' className='font-medium'>
                  Fecha de Publicación
                </Label>
                <Input
                  id='publishDate'
                  name='publishDate'
                  type='date'
                  value={formData.publishDate}
                  onChange={handleChange}
                  className='border-gray-300 focus:ring-primary focus:border-primary'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='interests' className='font-medium'>
                Intereses/Temáticas
              </Label>
              <Input
                id='interests'
                name='interests'
                value={formData.interests}
                onChange={handleChange}
                className='border-gray-300 focus:ring-primary focus:border-primary'
                placeholder='Separa las temáticas con comas (ej: Medicina, Investigación, Salud)'
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className='flex justify-between border-t p-6'>
          <Button
            variant='outline'
            type='button'
            onClick={() => router.back()}
            className='w-full md:w-auto'>
            Cancelar
          </Button>
          <Button
            type='submit'
            form='bookForm'
            disabled={saving}
            className='w-full md:w-auto ml-0 md:ml-2 mt-2 md:mt-0'
            variant='default'>
            {saving ? (
              <>
                <span className='animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full inline-block'></span>
                Guardando...
              </>
            ) : (
              "Crear Libro"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
