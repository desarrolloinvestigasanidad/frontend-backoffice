import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImagenesPlantillas } from "@/components/plantillas/imagenes-plantillas";
import { ColoresPlantillas } from "@/components/plantillas/colores-plantillas";
import { CorreosPlantillas } from "@/components/plantillas/correos-plantillas";
import { TextosEstaticosPlantillas } from "@/components/plantillas/textos-estaticos-plantillas";
import { CertificadosPlantillas } from "@/components/plantillas/certificados-plantillas";
import { TextosPlataformaPlantillas } from "@/components/plantillas/textos-plataforma-plantillas";
import { Breadcrumb } from "@/components/breadcrumb";
import {
  ImageIcon,
  Palette,
  Mail,
  FileText,
  Award,
  MessageSquare,
} from "lucide-react";

export default function PlantillasPage() {
  return (
    <div className='container mx-auto py-6'>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Plantillas", href: "/dashboard/templates" },
        ]}
      />

      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight'>Plantillas</h1>
        <p className='text-muted-foreground mt-2'>
          Gestiona las plantillas, imágenes, colores y textos de la plataforma.
        </p>
      </div>

      <Tabs defaultValue='imagenes' className='w-full'>
        <TabsList className='grid grid-cols-3 md:grid-cols-6 mb-8'>
          <TabsTrigger value='imagenes' className='flex items-center gap-2'>
            <ImageIcon className='h-4 w-4' />
            <span className='hidden sm:inline'>Imágenes</span>
          </TabsTrigger>
          <TabsTrigger value='colores' className='flex items-center gap-2'>
            <Palette className='h-4 w-4' />
            <span className='hidden sm:inline'>Colores</span>
          </TabsTrigger>
          <TabsTrigger value='correos' className='flex items-center gap-2'>
            <Mail className='h-4 w-4' />
            <span className='hidden sm:inline'>Correos</span>
          </TabsTrigger>
          <TabsTrigger
            value='textos-estaticos'
            className='flex items-center gap-2'>
            <FileText className='h-4 w-4' />
            <span className='hidden sm:inline'>Textos</span>
          </TabsTrigger>
          <TabsTrigger value='certificados' className='flex items-center gap-2'>
            <Award className='h-4 w-4' />
            <span className='hidden sm:inline'>Certificados</span>
          </TabsTrigger>
          <TabsTrigger
            value='textos-plataforma'
            className='flex items-center gap-2'>
            <MessageSquare className='h-4 w-4' />
            <span className='hidden sm:inline'>Notificaciones</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value='imagenes'>
          <ImagenesPlantillas />
        </TabsContent>
        <TabsContent value='colores'>
          <ColoresPlantillas />
        </TabsContent>
        <TabsContent value='correos'>
          <CorreosPlantillas />
        </TabsContent>
        <TabsContent value='textos-estaticos'>
          <TextosEstaticosPlantillas />
        </TabsContent>
        <TabsContent value='certificados'>
          <CertificadosPlantillas />
        </TabsContent>
        <TabsContent value='textos-plataforma'>
          <TextosPlataformaPlantillas />
        </TabsContent>
      </Tabs>
    </div>
  );
}
