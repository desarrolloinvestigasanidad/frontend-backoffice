import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const pricingData = [
  {
    titulo: "1 Capítulo",
    precio: "50 €",
    caracteristicas: [
      "Participación como autor",
      "Revisión por expertos",
      "Certificado oficial",
      "ISBN individual",
    ],
  },
  {
    titulo: "2 Capítulos",
    precio: "67 €",
    caracteristicas: [
      "Participación como autor",
      "Revisión por expertos",
      "Certificado oficial",
      "ISBN individual",
    ],
  },
  {
    titulo: "3 Capítulos",
    precio: "80 €",
    caracteristicas: [
      "Participación como autor",
      "Revisión por expertos",
      "Certificado oficial",
      "ISBN individual",
    ],
  },
  {
    titulo: "4 Capítulos",
    precio: "97 €",
    caracteristicas: [
      "Participación como autor",
      "Revisión por expertos",
      "Certificado oficial",
      "ISBN individual",
    ],
  },
  {
    titulo: "5 Capítulos",
    precio: "117 €",
    destacado: true,
    subtitulo: "Ilimitada como coautor",
    caracteristicas: [
      "Participación como autor",
      "Revisión por expertos",
      "Certificado oficial",
      "ISBN individual",
      "Promoción destacada",
    ],
  },
  {
    titulo: "Libro completo",
    precio: "99 €",
    destacado: true,
    subtitulo: "Ilimitada como coautor",
    caracteristicas: [
      "Participación como autor",
      "Revisión por expertos",
      "Certificado oficial",
      "ISBN individual",
      "Promoción destacada",
    ],
  },
];

export default function Pricing() {
  return (
    <section className='py-16 bg-white'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold mb-3'>Tarifas</h2>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Elige la opción que mejor se adapte a tus necesidades de publicación
            científica
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6'>
          {pricingData.map((plan, index) => (
            <Card
              key={index}
              className={`border-2 ${
                plan.destacado ? "border-primary shadow-lg" : "border-gray-200"
              } h-full flex flex-col`}>
              <CardHeader className='pb-2'>
                <div className='text-center'>
                  <h3 className='text-xl font-bold'>{plan.titulo}</h3>
                  {plan.subtitulo && (
                    <p className='text-sm text-gray-500'>{plan.subtitulo}</p>
                  )}
                  <div className='mt-4 mb-2'>
                    <span className='text-3xl font-bold text-primary'>
                      {plan.precio}
                    </span>
                  </div>
                  {plan.destacado && (
                    <Badge className='bg-primary text-white mt-2'>
                      Recomendado
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className='flex-grow'>
                <ul className='space-y-3'>
                  {plan.caracteristicas.map((caracteristica, i) => (
                    <li key={i} className='flex items-start gap-2'>
                      <Check className='h-5 w-5 text-primary flex-shrink-0 mt-0.5' />
                      <span className='text-sm'>{caracteristica}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className='w-full bg-primary hover:bg-primary/90'>
                  Seleccionar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className='mt-8 text-center'>
          <p className='text-sm text-gray-600'>
            * Las tasas son individuales e independientes. Cada participante del
            libro debe abonar la tarifa correspondiente.
          </p>
        </div>
      </div>
    </section>
  );
}
