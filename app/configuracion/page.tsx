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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function ConfiguracionPage() {
  const [siteName, setSiteName] = useState("WikScience");
  const [siteDescription, setSiteDescription] = useState(
    "La Editorial Científica Sanitaria"
  );
  const [isbnPrefix, setIsbnPrefix] = useState("");
  const [paymentMethods, setPaymentMethods] = useState({
    paypal: true,
    stripe: true,
    bankTransfer: false,
  });

  return (
    <div className='space-y-4'>
      <h1 className='text-3xl font-bold'>Configuración</h1>
      <Tabs defaultValue='general'>
        <TabsList>
          <TabsTrigger value='general'>General</TabsTrigger>
          <TabsTrigger value='isbn'>ISBN</TabsTrigger>
          <TabsTrigger value='pagos'>Métodos de Pago</TabsTrigger>
          <TabsTrigger value='categorias'>Categorías Profesionales</TabsTrigger>
          <TabsTrigger value='comunidades'>Comunidades Autónomas</TabsTrigger>
          <TabsTrigger value='provincias'>Provincias</TabsTrigger>
        </TabsList>
        <TabsContent value='general'>
          <Card>
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
              <CardDescription>
                Configura los ajustes generales de la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <Label htmlFor='site-name'>Nombre del Sitio</Label>
                <Input
                  id='site-name'
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor='site-description'>Descripción del Sitio</Label>
                <Textarea
                  id='site-description'
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                />
              </div>
              <Button>Guardar Cambios</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='isbn'>
          <Card>
            <CardHeader>
              <CardTitle>Configuración de ISBN</CardTitle>
              <CardDescription>
                Gestiona la configuración de ISBN
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='isbn-prefix'>Prefijo de ISBN</Label>
                  <Input
                    id='isbn-prefix'
                    placeholder='Introduce el prefijo de ISBN'
                    value={isbnPrefix}
                    onChange={(e) => setIsbnPrefix(e.target.value)}
                  />
                </div>
                <Button>Guardar Cambios</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='pagos'>
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Pago</CardTitle>
              <CardDescription>
                Configura los métodos de pago disponibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center space-x-2'>
                  <Switch
                    id='paypal'
                    checked={paymentMethods.paypal}
                    onCheckedChange={(checked: boolean) =>
                      setPaymentMethods({ ...paymentMethods, paypal: checked })
                    }
                  />
                  <Label htmlFor='paypal'>PayPal</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Switch
                    id='stripe'
                    checked={paymentMethods.stripe}
                    onCheckedChange={(checked: boolean) =>
                      setPaymentMethods({ ...paymentMethods, stripe: checked })
                    }
                  />
                  <Label htmlFor='stripe'>Stripe</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Switch
                    id='bankTransfer'
                    checked={paymentMethods.bankTransfer}
                    onCheckedChange={(checked: boolean) =>
                      setPaymentMethods({
                        ...paymentMethods,
                        bankTransfer: checked,
                      })
                    }
                  />
                  <Label htmlFor='bankTransfer'>Transferencia Bancaria</Label>
                </div>
                <Button>Guardar Cambios</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='categorias'>
          <Card>
            <CardHeader>
              <CardTitle>Categorías Profesionales</CardTitle>
              <CardDescription>
                Gestiona las categorías profesionales disponibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='new-category'>Nueva Categoría</Label>
                  <Input
                    id='new-category'
                    placeholder='Introduce una nueva categoría profesional'
                  />
                </div>
                <Button>Añadir Categoría</Button>
                <div>
                  <Label>Categorías Existentes</Label>
                  <ul className='list-disc list-inside mt-2'>
                    <li>Médico</li>
                    <li>Enfermero</li>
                    <li>Fisioterapeuta</li>
                    {/* Add more categories as needed */}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='comunidades'>
          <Card>
            <CardHeader>
              <CardTitle>Comunidades Autónomas</CardTitle>
              <CardDescription>
                Gestiona las comunidades autónomas disponibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='new-comunidad'>
                    Nueva Comunidad Autónoma
                  </Label>
                  <Input
                    id='new-comunidad'
                    placeholder='Introduce una nueva comunidad autónoma'
                  />
                </div>
                <Button>Añadir Comunidad</Button>
                <div>
                  <Label>Comunidades Existentes</Label>
                  <ul className='list-disc list-inside mt-2'>
                    <li>Andalucía</li>
                    <li>Cataluña</li>
                    <li>Madrid</li>
                    {/* Add more communities as needed */}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='provincias'>
          <Card>
            <CardHeader>
              <CardTitle>Provincias</CardTitle>
              <CardDescription>
                Gestiona las provincias disponibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='new-provincia'>Nueva Provincia</Label>
                  <Input
                    id='new-provincia'
                    placeholder='Introduce una nueva provincia'
                  />
                </div>
                <Select>
                  <SelectTrigger className='w-[200px]'>
                    <SelectValue placeholder='Selecciona Comunidad' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='andalucia'>Andalucía</SelectItem>
                    <SelectItem value='cataluna'>Cataluña</SelectItem>
                    <SelectItem value='madrid'>Madrid</SelectItem>
                    {/* Add more options as needed */}
                  </SelectContent>
                </Select>
                <Button>Añadir Provincia</Button>
                <div>
                  <Label>Provincias Existentes</Label>
                  <ul className='list-disc list-inside mt-2'>
                    <li>Barcelona (Cataluña)</li>
                    <li>Sevilla (Andalucía)</li>
                    <li>Madrid (Madrid)</li>
                    {/* Add more provinces as needed */}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
