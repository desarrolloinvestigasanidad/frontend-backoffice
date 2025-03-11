"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function PlantillasPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#ffffff");
  const [welcomeEmail, setWelcomeEmail] = useState("");
  const [aboutUs, setAboutUs] = useState("");
  const [certificateTemplate, setCertificateTemplate] = useState("");

  interface ImageUploadEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & EventTarget;
  }

  const handleImageUpload = (event: ImageUploadEvent): void => {
    if (event.target.files && event.target.files.length > 0) {
      const file: File = event.target.files[0];
      // Here you would typically upload the file to your server
      console.log("Uploading file:", file.name);
      setSelectedImage(file.name);
    }
  };

  return (
    <div className='space-y-4'>
      <h1 className='text-3xl font-bold'>Plantillas</h1>
      <Tabs defaultValue='imagenes'>
        <TabsList>
          <TabsTrigger value='imagenes'>Imágenes</TabsTrigger>
          <TabsTrigger value='colores'>Colores</TabsTrigger>
          <TabsTrigger value='correos'>Correos</TabsTrigger>
          <TabsTrigger value='textos'>Textos Estáticos</TabsTrigger>
          <TabsTrigger value='certificados'>Certificados</TabsTrigger>
        </TabsList>
        <TabsContent value='imagenes'>
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Imágenes</CardTitle>
              <CardDescription>
                Sube y gestiona las imágenes de la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='image-upload'>Subir nueva imagen</Label>
                  <Input
                    id='image-upload'
                    type='file'
                    onChange={handleImageUpload}
                  />
                </div>
                {selectedImage && <p>Imagen seleccionada: {selectedImage}</p>}
                <Button>Subir Imagen</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='colores'>
          <Card>
            <CardHeader>
              <CardTitle>Colores de la Plataforma</CardTitle>
              <CardDescription>
                Personaliza los colores principales de la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <Label htmlFor='primary-color'>Color Primario</Label>
                <Input
                  id='primary-color'
                  type='color'
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor='secondary-color'>Color Secundario</Label>
                <Input
                  id='secondary-color'
                  type='color'
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                />
              </div>
              <Button>Guardar Cambios</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='correos'>
          <Card>
            <CardHeader>
              <CardTitle>Plantillas de Correos</CardTitle>
              <CardDescription>
                Edita las plantillas de correos electrónicos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='welcome-email'>Correo de Bienvenida</Label>
                  <Textarea
                    id='welcome-email'
                    placeholder='Escribe aquí la plantilla del correo de bienvenida...'
                    value={welcomeEmail}
                    onChange={(e) => setWelcomeEmail(e.target.value)}
                    rows={10}
                  />
                </div>
                <Button>Guardar Cambios</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='textos'>
          <Card>
            <CardHeader>
              <CardTitle>Textos Estáticos</CardTitle>
              <CardDescription>
                Edita los textos estáticos de la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='about-us'>Sobre Nosotros</Label>
                  <Textarea
                    id='about-us'
                    placeholder="Escribe aquí el texto de 'Sobre Nosotros'..."
                    value={aboutUs}
                    onChange={(e) => setAboutUs(e.target.value)}
                    rows={10}
                  />
                </div>
                <Button>Guardar Cambios</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='certificados'>
          <Card>
            <CardHeader>
              <CardTitle>Plantillas de Certificados</CardTitle>
              <CardDescription>
                Gestiona las plantillas de certificados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='certificate-template'>
                    Plantilla de Certificado
                  </Label>
                  <Textarea
                    id='certificate-template'
                    placeholder='Diseña aquí la plantilla del certificado...'
                    value={certificateTemplate}
                    onChange={(e) => setCertificateTemplate(e.target.value)}
                    rows={10}
                  />
                </div>
                <p className='text-sm text-gray-500'>
                  Etiquetas disponibles: {"{nombre}"}, {"{titulo}"}, {"{fecha}"}
                </p>
                <Button>Guardar Cambios</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
