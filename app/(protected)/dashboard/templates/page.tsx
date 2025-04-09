import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImagenesPlantillas } from "@/components/plantillas/imagenes-plantillas";
import { ColoresPlantillas } from "@/components/plantillas/colores-plantillas";
import { CorreosPlantillas } from "@/components/plantillas/correos-plantillas";
import { TextosEstaticosPlantillas } from "@/components/plantillas/textos-estaticos-plantillas";
import { CertificadosPlantillas } from "@/components/plantillas/certificados-plantillas";
import { TextosPlataformaPlantillas } from "@/components/plantillas/textos-plataforma-plantillas";

export default function PlantillasPage() {
  return (
    <div className='container mx-auto py-6'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold tracking-tight'>Plantillas</h1>
        <p className='text-muted-foreground mt-2'>
          Gestiona las plantillas, imágenes, colores y textos de la plataforma.
        </p>
      </div>

      <Tabs defaultValue='imagenes' className='w-full'>
        <TabsList className='grid grid-cols-3 md:grid-cols-6 mb-8'>
          <TabsTrigger value='imagenes'>Imágenes</TabsTrigger>
          <TabsTrigger value='colores'>Colores</TabsTrigger>
          <TabsTrigger value='correos'>Textos correos</TabsTrigger>
          <TabsTrigger value='textos-estaticos'>Textos estáticos</TabsTrigger>
          <TabsTrigger value='certificados'>Certificados</TabsTrigger>
          <TabsTrigger value='textos-plataforma'>Textos plataforma</TabsTrigger>
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
