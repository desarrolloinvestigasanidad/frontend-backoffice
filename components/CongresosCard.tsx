import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  LinkIcon,
  Euro,
  Info,
  ExternalLink,
  Clock,
  Award,
} from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Tarifa {
  precio: string;
  fechaLimite: string;
}

interface Congreso {
  titulo: string;
  fecha: string;
  fechaLimiteEnvio: string;
  entregaCertificados: string;
  webCongreso: string;
  plataforma: string;
  tarifas: Tarifa[];
  imagen?: string;
}

interface CongresosCardProps {
  congresos: Congreso[];
}

const CongresosCard: React.FC<CongresosCardProps> = ({ congresos }) => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
      {congresos.map((congreso, index) => (
        <Card key={index} className='overflow-hidden border-none shadow-lg'>
          <div className='relative h-48 w-full'>
            <Image
              src={congreso.imagen || "/placeholder.svg?height=400&width=800"}
              alt={congreso.titulo}
              fill
              className='object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 flex items-end p-6'>
              <div>
                <Badge className='mb-2 bg-primary text-white'>Congreso</Badge>
                <h3 className='text-2xl font-bold text-white'>
                  {congreso.titulo}
                </h3>
              </div>
            </div>
          </div>

          <CardContent className='p-6'>
            <div className='grid gap-4'>
              <div className='flex items-center gap-3 text-sm'>
                <Calendar className='h-5 w-5 text-primary' />
                <div>
                  <span className='font-medium text-gray-700'>
                    Fecha del congreso
                  </span>
                  <p>{congreso.fecha}</p>
                </div>
              </div>

              <div className='flex items-center gap-3 text-sm'>
                <Clock className='h-5 w-5 text-primary' />
                <div>
                  <span className='font-medium text-gray-700'>
                    Fecha límite de envío
                  </span>
                  <p>{congreso.fechaLimiteEnvio}</p>
                </div>
              </div>

              <div className='flex items-center gap-3 text-sm'>
                <Award className='h-5 w-5 text-primary' />
                <div>
                  <span className='font-medium text-gray-700'>
                    Entrega de certificados
                  </span>
                  <p>{congreso.entregaCertificados}</p>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-2'>
                <a
                  href={congreso.webCongreso}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2 text-sm text-primary hover:underline'>
                  <LinkIcon className='h-4 w-4' />
                  <span>Web del congreso</span>
                  <ExternalLink className='h-3 w-3' />
                </a>

                <a
                  href={congreso.plataforma}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2 text-sm text-primary hover:underline'>
                  <LinkIcon className='h-4 w-4' />
                  <span>Plataforma</span>
                  <ExternalLink className='h-3 w-3' />
                </a>
              </div>
            </div>

            <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
              <h4 className='font-medium text-gray-800 mb-3'>
                Tarifas de inscripción:
              </h4>
              <ul className='space-y-2'>
                {congreso.tarifas.map((tarifa, i) => (
                  <li key={i} className='flex items-center gap-2 text-sm'>
                    <Euro className='h-4 w-4 text-primary' />
                    <span className='font-medium'>{tarifa.precio}</span>
                    <span className='text-gray-600'>
                      hasta {tarifa.fechaLimite}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>

          <CardFooter className='px-6 pb-6 pt-0'>
            <Button className='w-full bg-primary hover:bg-primary/90 gap-2'>
              <Info className='h-4 w-4' />
              Más información
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CongresosCard;
