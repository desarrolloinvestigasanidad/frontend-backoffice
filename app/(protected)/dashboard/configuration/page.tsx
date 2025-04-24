import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ConfiguracionISBN } from "@/components/configuration/configuracion-isbn";
import { ConfiguracionPortadas } from "@/components/configuration/configuracion-portadas";
import { ConfiguracionPagos } from "@/components/configuration/configuracion-pagos";
import { ConfiguracionCategorias } from "@/components/configuration/configuracion-categorias";
import { ConfiguracionComunidades } from "@/components/configuration/configuracion-comunidades";
import { ConfiguracionProvincias } from "@/components/configuration/configuracion-provincias";
import { ConfiguracionEstadosLibro } from "@/components/configuration/configuracion-estados-libro";
import { ConfiguracionEstadosCapitulo } from "@/components/configuration/configuracion-estados-capitulo";
import { ConfiguracionTiposEstudio } from "@/components/configuration/configuracion-tipos-estudio";
import { ConfiguracionTiposLibro } from "@/components/configuration/configuracion-tipos-libro";
import { ConfiguracionTiposAsociacion } from "@/components/configuration/configuracion-tipos-asociacion";
import { ConfiguracionTiposIdentificacion } from "@/components/configuration/configuracion-tipos-identificacion";

export default function ConfiguracionPage() {
  return (
    <div className='container mx-auto py-6'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold tracking-tight'>Configuración</h1>
        <p className='text-muted-foreground mt-2'>
          Gestiona las configuraciones generales y específicas de la plataforma.
        </p>
      </div>

      <Tabs defaultValue='general' className='w-full'>
        <TabsList className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-8'>
          <TabsTrigger value='isbn'>ISBN</TabsTrigger>
          <TabsTrigger value='portadas'>Portadas</TabsTrigger>
          <TabsTrigger value='pagos'>Métodos de pago</TabsTrigger>
          <TabsTrigger value='categorias'>Categorías</TabsTrigger>
          <TabsTrigger value='comunidades'>Comunidades</TabsTrigger>
          <TabsTrigger value='provincias'>Provincias</TabsTrigger>
          <TabsTrigger value='estados-libro'>Estados libro</TabsTrigger>
          <TabsTrigger value='estados-capitulo'>Estados capítulo</TabsTrigger>
          <TabsTrigger value='tipos-estudio'>Tipos estudio</TabsTrigger>
          <TabsTrigger value='tipos-libro'>Tipos libro</TabsTrigger>
          <TabsTrigger value='tipos-asociacion'>Tipos asociación</TabsTrigger>
          <TabsTrigger value='tipos-identificacion'>
            Tipos identificación
          </TabsTrigger>
        </TabsList>

        <TabsContent value='isbn'>
          <ConfiguracionISBN />
        </TabsContent>
        <TabsContent value='portadas'>
          <ConfiguracionPortadas />
        </TabsContent>
        <TabsContent value='pagos'>
          <ConfiguracionPagos />
        </TabsContent>
        <TabsContent value='categorias'>
          <ConfiguracionCategorias />
        </TabsContent>
        <TabsContent value='comunidades'>
          <ConfiguracionComunidades />
        </TabsContent>
        <TabsContent value='provincias'>
          <ConfiguracionProvincias />
        </TabsContent>
        <TabsContent value='estados-libro'>
          <ConfiguracionEstadosLibro />
        </TabsContent>
        <TabsContent value='estados-capitulo'>
          <ConfiguracionEstadosCapitulo />
        </TabsContent>
        <TabsContent value='tipos-estudio'>
          <ConfiguracionTiposEstudio />
        </TabsContent>
        <TabsContent value='tipos-libro'>
          <ConfiguracionTiposLibro />
        </TabsContent>
        <TabsContent value='tipos-asociacion'>
          <ConfiguracionTiposAsociacion />
        </TabsContent>
        <TabsContent value='tipos-identificacion'>
          <ConfiguracionTiposIdentificacion />
        </TabsContent>
      </Tabs>
    </div>
  );
}
