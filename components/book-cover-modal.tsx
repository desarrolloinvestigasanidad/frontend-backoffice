"use client";

import type React from "react";

import { useState, useRef } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { Upload, LinkIcon, X, Check, ImageIcon, RefreshCw } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

type BookCoverModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (coverUrl: string) => void;
  bookTitle?: string;
  currentCover?: string;
};

export function BookCoverModal({
  isOpen,
  onClose,
  onConfirm,
  bookTitle = "Libro",
  currentCover,
}: BookCoverModalProps) {
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [coverUrl, setCoverUrl] = useState<string>(currentCover || "");
  const [urlInput, setUrlInput] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentCover || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manejar subida de archivo
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, sube una imagen válida");
      return;
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no debe superar los 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // Crear preview local
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      // Simular subida a servidor (aquí implementarías la subida real)
      // En un caso real, usarías FormData y fetch para subir el archivo
      const mockUploadResponse = await new Promise<string>((resolve) => {
        setTimeout(() => {
          // Simular URL devuelta por el servidor
          resolve(URL.createObjectURL(file));
        }, 1000);
      });

      setCoverUrl(mockUploadResponse);
      toast.success("Imagen subida correctamente");
    } catch (error) {
      toast.error("Error al subir la imagen");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  // Manejar URL externa
  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      toast.error("Por favor, introduce una URL válida");
      return;
    }

    // Validar formato de URL
    try {
      new URL(urlInput);
      setPreviewUrl(urlInput);
      setCoverUrl(urlInput);
    } catch (error) {
      toast.error("Por favor, introduce una URL válida");
    }
  };

  // Confirmar selección
  const handleConfirm = () => {
    if (!coverUrl) {
      toast.error("Por favor, selecciona o sube una portada");
      return;
    }
    onConfirm(coverUrl);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-md md:max-w-lg max-h-[60vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-center'>
            Seleccionar Portada para {bookTitle}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className='mt-4'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='upload' className='flex items-center gap-2'>
              <Upload className='h-4 w-4' />
              Subir Imagen
            </TabsTrigger>
            <TabsTrigger value='url' className='flex items-center gap-2'>
              <LinkIcon className='h-4 w-4' />
              URL Externa
            </TabsTrigger>
          </TabsList>

          <TabsContent value='upload' className='py-4'>
            <div className='space-y-4'>
              <div
                className='border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors'
                onClick={() => fileInputRef.current?.click()}>
                <input
                  type='file'
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept='image/*'
                  className='hidden'
                />
                <ImageIcon className='h-10 w-10 mx-auto text-gray-400 mb-2' />
                <p className='text-sm text-gray-600 mb-1'>
                  Haz clic para seleccionar o arrastra una imagen
                </p>
                <p className='text-xs text-gray-500'>
                  PNG, JPG o WEBP (máx. 5MB)
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='url' className='py-4'>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='cover-url'>URL de la imagen</Label>
                <div className='flex mt-1.5'>
                  <Input
                    id='cover-url'
                    placeholder='https://ejemplo.com/imagen.jpg'
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className='flex-1'
                  />
                  <Button
                    onClick={handleUrlSubmit}
                    className='ml-2 bg-purple-600 hover:bg-purple-700'>
                    <Check className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Preview de la imagen */}
        {previewUrl && (
          <div className='mt-2 relative max-h-[30vh] overflow-hidden'>
            <div
              className='relative rounded-md overflow-hidden border'
              style={{ maxHeight: "calc(30vh - 20px)" }}>
              <div className='aspect-[2/3] relative w-full h-full max-h-full'>
                <Image
                  src={previewUrl || "/placeholder.svg"}
                  alt='Vista previa de portada'
                  fill
                  className='object-contain'
                  onError={() => {
                    setPreviewUrl("");
                    setCoverUrl("");
                    toast.error("No se pudo cargar la imagen");
                  }}
                />
              </div>
            </div>
            <Button
              variant='outline'
              size='icon'
              className='absolute top-2 right-2 bg-white/80 hover:bg-white'
              onClick={() => {
                setPreviewUrl("");
                setCoverUrl("");
                setUrlInput("");
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}>
              <X className='h-4 w-4' />
            </Button>
          </div>
        )}

        <DialogFooter className='flex justify-between sm:justify-between'>
          <Button variant='outline' onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!coverUrl || isUploading}
            className='bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900'>
            {isUploading ? (
              <>
                <RefreshCw className='mr-2 h-4 w-4 animate-spin' /> Subiendo...
              </>
            ) : (
              <>
                <Check className='mr-2 h-4 w-4' /> Confirmar y Continuar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
