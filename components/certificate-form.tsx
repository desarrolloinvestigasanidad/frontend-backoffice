"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  X,
  Calendar,
  Hash,
  Book,
  FileText,
  Users,
  MapPin,
  Link,
  ImageIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import type { CertificateType, CertificateData } from "@/types/certificate";

interface CertificateFormProps {
  type: CertificateType;
  data: CertificateData;
  onChange: (data: Partial<CertificateData>) => void;
  section?: "basic-info" | "authors" | "images" | "advanced";
}

export function CertificateForm({
  type,
  data,
  onChange,
  section = "basic-info",
}: CertificateFormProps) {
  const [newAuthor, setNewAuthor] = useState("");
  const [newCoauthor, setNewCoauthor] = useState("");

  const handleAddAuthor = () => {
    if (newAuthor.trim()) {
      onChange({ authors: [...data.authors, newAuthor.trim()] });
      setNewAuthor("");
    }
  };

  const handleAddCoauthor = () => {
    if (newCoauthor.trim()) {
      onChange({ coauthors: [...data.coauthors, newCoauthor.trim()] });
      setNewCoauthor("");
    }
  };

  const handleRemoveAuthor = (index: number) => {
    const newAuthors = [...data.authors];
    newAuthors.splice(index, 1);
    onChange({ authors: newAuthors });
  };

  const handleRemoveCoauthor = (index: number) => {
    const newCoauthors = [...data.coauthors];
    newCoauthors.splice(index, 1);
    onChange({ coauthors: newCoauthors });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof CertificateData
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onChange({ [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const regions = [
    "Andalucía",
    "Aragón",
    "Asturias",
    "Baleares",
    "Canarias",
    "Cantabria",
    "Castilla La Mancha",
    "Castilla y León",
    "Cataluña",
    "Extremadura",
    "Galicia",
    "La Rioja",
    "Madrid",
    "Murcia",
    "Navarra",
    "País Vasco",
    "Valencia",
    "Genérico",
  ];

  // Render only the section that matches the current step
  if (section === "basic-info") {
    return (
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold mb-4'>Información Básica</h3>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title' className='flex items-center gap-2'>
              <FileText className='h-4 w-4 text-purple-600 dark:text-purple-400' />
              Título del Certificado
            </Label>
            <Input
              id='title'
              value={data.title}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder='Título del certificado'
              className='border-slate-300 dark:border-slate-700'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='bookTitle' className='flex items-center gap-2'>
              <Book className='h-4 w-4 text-purple-600 dark:text-purple-400' />
              Título del Libro
            </Label>
            <Input
              id='bookTitle'
              value={data.bookTitle}
              onChange={(e) => onChange({ bookTitle: e.target.value })}
              placeholder='Título del libro'
              className='border-slate-300 dark:border-slate-700'
            />
          </div>

          {type === "chapter" && (
            <>
              <div className='space-y-2'>
                <Label
                  htmlFor='chapterTitle'
                  className='flex items-center gap-2'>
                  <FileText className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                  Título del Capítulo
                </Label>
                <Input
                  id='chapterTitle'
                  value={data.chapterTitle}
                  onChange={(e) => onChange({ chapterTitle: e.target.value })}
                  placeholder='Título del capítulo'
                  className='border-slate-300 dark:border-slate-700'
                />
              </div>
              <div className='space-y-2'>
                <Label
                  htmlFor='chapterNumber'
                  className='flex items-center gap-2'>
                  <Hash className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                  Número del Capítulo
                </Label>
                <Input
                  id='chapterNumber'
                  value={data.chapterNumber}
                  onChange={(e) => onChange({ chapterNumber: e.target.value })}
                  placeholder='Ej: 311'
                  className='border-slate-300 dark:border-slate-700'
                />
              </div>
            </>
          )}

          <div className='space-y-2'>
            <Label htmlFor='isbn' className='flex items-center gap-2'>
              <Hash className='h-4 w-4 text-purple-600 dark:text-purple-400' />
              ISBN
            </Label>
            <Input
              id='isbn'
              value={data.isbn}
              onChange={(e) => onChange({ isbn: e.target.value })}
              placeholder='ISBN del libro'
              className='border-slate-300 dark:border-slate-700'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='pages' className='flex items-center gap-2'>
                <FileText className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                Páginas
              </Label>
              <Input
                id='pages'
                value={data.pages}
                onChange={(e) => onChange({ pages: e.target.value })}
                placeholder='Ej: 45-67'
                className='border-slate-300 dark:border-slate-700'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='totalPages' className='flex items-center gap-2'>
                <Book className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                Total de Páginas
              </Label>
              <Input
                id='totalPages'
                value={data.totalPages}
                onChange={(e) => onChange({ totalPages: e.target.value })}
                placeholder='Ej: 320'
                className='border-slate-300 dark:border-slate-700'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='publicationDate'
              className='flex items-center gap-2'>
              <Calendar className='h-4 w-4 text-purple-600 dark:text-purple-400' />
              Fecha de Publicación
            </Label>
            <Input
              id='publicationDate'
              type='date'
              value={data.publicationDate}
              onChange={(e) => onChange({ publicationDate: e.target.value })}
              className='border-slate-300 dark:border-slate-700'
            />
          </div>

          {type === "region" && (
            <div className='space-y-2'>
              <Label htmlFor='region' className='flex items-center gap-2'>
                <MapPin className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                Comunidad Autónoma
              </Label>
              <Select
                value={data.region}
                onValueChange={(value) => onChange({ region: value })}>
                <SelectTrigger
                  id='region'
                  className='border-slate-300 dark:border-slate-700'>
                  <SelectValue placeholder='Seleccionar región' />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className='space-y-2'>
            <Label htmlFor='validationUrl' className='flex items-center gap-2'>
              <Link className='h-4 w-4 text-purple-600 dark:text-purple-400' />
              URL de Validación
            </Label>
            <Input
              id='validationUrl'
              value={data.validationUrl}
              onChange={(e) => onChange({ validationUrl: e.target.value })}
              placeholder='URL para el código QR'
              className='border-slate-300 dark:border-slate-700'
            />
          </div>
        </div>
      </div>
    );
  }

  if (section === "authors") {
    return (
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold mb-4'>Autores y Coautores</h3>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <Label className='flex items-center gap-2'>
              <Users className='h-4 w-4 text-purple-600 dark:text-purple-400' />
              Autores
            </Label>
            <div className='flex space-x-2'>
              <Input
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder='Nombre del autor'
                className='border-slate-300 dark:border-slate-700'
              />
              <Button
                type='button'
                size='icon'
                onClick={handleAddAuthor}
                className='bg-purple-600 hover:bg-purple-700 text-white'>
                <PlusCircle className='h-4 w-4' />
              </Button>
            </div>
            <div className='mt-2 space-y-2'>
              {data.authors.map((author, index) => (
                <motion.div
                  key={index}
                  className='flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-2 rounded-md'
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}>
                  <span>{author}</span>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    onClick={() => handleRemoveAuthor(index)}
                    className='text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30'>
                    <X className='h-4 w-4' />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          <div className='space-y-2'>
            <Label className='flex items-center gap-2'>
              <Users className='h-4 w-4 text-purple-600 dark:text-purple-400' />
              Coautores
            </Label>
            <div className='flex space-x-2'>
              <Input
                value={newCoauthor}
                onChange={(e) => setNewCoauthor(e.target.value)}
                placeholder='Nombre del coautor'
                className='border-slate-300 dark:border-slate-700'
              />
              <Button
                type='button'
                size='icon'
                onClick={handleAddCoauthor}
                className='bg-purple-600 hover:bg-purple-700 text-white'>
                <PlusCircle className='h-4 w-4' />
              </Button>
            </div>
            <div className='mt-2 space-y-2'>
              {data.coauthors.map((coauthor, index) => (
                <motion.div
                  key={index}
                  className='flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-2 rounded-md'
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}>
                  <span>{coauthor}</span>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    onClick={() => handleRemoveCoauthor(index)}
                    className='text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30'>
                    <X className='h-4 w-4' />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (section === "images") {
    return (
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold mb-4'>Imágenes y Firma</h3>
        <div className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='logo' className='flex items-center gap-2'>
                <ImageIcon className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                Logo
              </Label>
              <div className='flex flex-col space-y-2'>
                <Input
                  id='logo'
                  type='file'
                  accept='image/*'
                  onChange={(e) => handleFileChange(e, "logo")}
                  className='border-slate-300 dark:border-slate-700'
                />
                {data.logo && (
                  <div className='relative w-32 h-32 mx-auto border rounded-md overflow-hidden'>
                    <img
                      src={(data.logo as string) || "/placeholder.svg"}
                      alt='Logo'
                      className='w-full h-full object-contain'
                    />
                    <Button
                      type='button'
                      variant='destructive'
                      size='icon'
                      className='absolute top-1 right-1 w-6 h-6'
                      onClick={() => onChange({ logo: null })}>
                      <X className='h-3 w-3' />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='signature' className='flex items-center gap-2'>
                <ImageIcon className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                Firma
              </Label>
              <div className='flex flex-col space-y-2'>
                <Input
                  id='signature'
                  type='file'
                  accept='image/*'
                  onChange={(e) => handleFileChange(e, "signature")}
                  className='border-slate-300 dark:border-slate-700'
                />
                {data.signature && (
                  <div className='relative w-32 h-32 mx-auto border rounded-md overflow-hidden'>
                    <img
                      src={(data.signature as string) || "/placeholder.svg"}
                      alt='Firma'
                      className='w-full h-full object-contain'
                    />
                    <Button
                      type='button'
                      variant='destructive'
                      size='icon'
                      className='absolute top-1 right-1 w-6 h-6'
                      onClick={() => onChange({ signature: null })}>
                      <X className='h-3 w-3' />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='headerImage' className='flex items-center gap-2'>
                <ImageIcon className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                Imagen de Cabecera
              </Label>
              <div className='flex flex-col space-y-2'>
                <Input
                  id='headerImage'
                  type='file'
                  accept='image/*'
                  onChange={(e) => handleFileChange(e, "headerImage")}
                  className='border-slate-300 dark:border-slate-700'
                />
                {data.headerImage && (
                  <div className='relative w-full h-20 mx-auto border rounded-md overflow-hidden'>
                    <img
                      src={(data.headerImage as string) || "/placeholder.svg"}
                      alt='Cabecera'
                      className='w-full h-full object-contain'
                    />
                    <Button
                      type='button'
                      variant='destructive'
                      size='icon'
                      className='absolute top-1 right-1 w-6 h-6'
                      onClick={() => onChange({ headerImage: null })}>
                      <X className='h-3 w-3' />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='footerImage' className='flex items-center gap-2'>
                <ImageIcon className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                Imagen de Pie
              </Label>
              <div className='flex flex-col space-y-2'>
                <Input
                  id='footerImage'
                  type='file'
                  accept='image/*'
                  onChange={(e) => handleFileChange(e, "footerImage")}
                  className='border-slate-300 dark:border-slate-700'
                />
                {data.footerImage && (
                  <div className='relative w-full h-20 mx-auto border rounded-md overflow-hidden'>
                    <img
                      src={(data.footerImage as string) || "/placeholder.svg"}
                      alt='Pie'
                      className='w-full h-full object-contain'
                    />
                    <Button
                      type='button'
                      variant='destructive'
                      size='icon'
                      className='absolute top-1 right-1 w-6 h-6'
                      onClick={() => onChange({ footerImage: null })}>
                      <X className='h-3 w-3' />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (section === "advanced") {
    return (
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold mb-4'>Configuración Avanzada</h3>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='customText' className='flex items-center gap-2'>
              <FileText className='h-4 w-4 text-purple-600 dark:text-purple-400' />
              Texto Personalizado
            </Label>
            <Textarea
              id='customText'
              value={data.customText || ""}
              onChange={(e) => onChange({ customText: e.target.value })}
              placeholder='Texto adicional para el certificado'
              className='min-h-[100px] border-slate-300 dark:border-slate-700'
            />
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='certificateType'
              className='flex items-center gap-2'>
              <FileText className='h-4 w-4 text-purple-600 dark:text-purple-400' />
              Tipo de Certificado
            </Label>
            <Select
              value={data.certificateType || "standard"}
              onValueChange={(value) => onChange({ certificateType: value })}>
              <SelectTrigger
                id='certificateType'
                className='border-slate-300 dark:border-slate-700'>
                <SelectValue placeholder='Seleccionar tipo' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='standard'>Estándar</SelectItem>
                <SelectItem value='castillaLaMancha'>
                  Castilla La Mancha
                </SelectItem>
                <SelectItem value='book'>Libro Completo</SelectItem>
                <SelectItem value='chapter'>Capítulo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
