"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save } from "lucide-react"

export function ConfiguracionGeneral() {
  const [activeTab, setActiveTab] = useState("plataforma")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Configuración General</h2>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Guardar cambios
        </Button>
      </div>

      <Tabs defaultValue="plataforma" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="plataforma">Plataforma</TabsTrigger>
          <TabsTrigger value="contacto">Contacto</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
          <TabsTrigger value="social">Redes Sociales</TabsTrigger>
        </TabsList>

        <TabsContent value="plataforma">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Información básica</CardTitle>
                <CardDescription>Configura la información básica de la plataforma</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre-plataforma">Nombre de la plataforma</Label>
                  <Input id="nombre-plataforma" defaultValue="Editorial Médica" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descripcion-plataforma">Descripción</Label>
                  <Textarea
                    id="descripcion-plataforma"
                    defaultValue="Plataforma editorial para profesionales médicos"
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url-plataforma">URL de la plataforma</Label>
                  <Input id="url-plataforma" defaultValue="https://editorial-medica.com" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuración de correo</CardTitle>
                <CardDescription>Configura el servidor de correo saliente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-servidor">Servidor SMTP</Label>
                  <Input id="smtp-servidor" defaultValue="smtp.editorial-medica.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-puerto">Puerto</Label>
                  <Input id="smtp-puerto" defaultValue="587" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-usuario">Usuario</Label>
                  <Input id="smtp-usuario" defaultValue="no-reply@editorial-medica.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">Contraseña</Label>
                  <Input id="smtp-password" type="password" defaultValue="********" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Opciones generales</CardTitle>
                <CardDescription>Configura las opciones generales de la plataforma</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="modo-mantenimiento">Modo mantenimiento</Label>
                    <p className="text-sm text-muted-foreground">
                      Activa el modo mantenimiento para realizar actualizaciones
                    </p>
                  </div>
                  <Switch id="modo-mantenimiento" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="registro-abierto">Registro abierto</Label>
                    <p className="text-sm text-muted-foreground">Permite que nuevos usuarios se registren</p>
                  </div>
                  <Switch id="registro-abierto" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notificaciones-email">Notificaciones por email</Label>
                    <p className="text-sm text-muted-foreground">Envía notificaciones por email a los usuarios</p>
                  </div>
                  <Switch id="notificaciones-email" defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuración de archivos</CardTitle>
                <CardDescription>Configura las opciones de subida de archivos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="max-tamano-archivo">Tamaño máximo de archivo (MB)</Label>
                  <Input id="max-tamano-archivo" type="number" defaultValue="10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="formatos-permitidos">Formatos permitidos</Label>
                  <Input id="formatos-permitidos" defaultValue="pdf,doc,docx,jpg,png" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ruta-almacenamiento">Ruta de almacenamiento</Label>
                  <Input id="ruta-almacenamiento" defaultValue="/var/www/uploads" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacto">
          <Card>
            <CardHeader>
              <CardTitle>Información de contacto</CardTitle>
              <CardDescription>Configura la información de contacto de la plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-contacto">Email de contacto</Label>
                <Input id="email-contacto" defaultValue="contacto@editorial-medica.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono-contacto">Teléfono de contacto</Label>
                <Input id="telefono-contacto" defaultValue="+34 91 123 45 67" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Textarea
                  id="direccion"
                  defaultValue="Calle Gran Vía, 123\n28013 Madrid\nEspaña"
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horario-atencion">Horario de atención</Label>
                <Input id="horario-atencion" defaultValue="Lunes a Viernes, 9:00 - 18:00" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Guardar cambios</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="legal">
          <Card>
            <CardHeader>
              <CardTitle>Información legal</CardTitle>
              <CardDescription>Configura la información legal de la plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="razon-social">Razón social</Label>
                <Input id="razon-social" defaultValue="Editorial Médica S.L." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cif">CIF</Label>
                <Input id="cif" defaultValue="B12345678" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registro-mercantil">Datos de registro mercantil</Label>
                <Textarea
                  id="registro-mercantil"
                  defaultValue="Inscrita en el Registro Mercantil de Madrid, Tomo 12345, Folio 67, Hoja M-123456, Inscripción 1ª"
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsable-datos">Responsable de protección de datos</Label>
                <Input id="responsable-datos" defaultValue="protecciondatos@editorial-medica.com" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Guardar cambios</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Redes sociales</CardTitle>
              <CardDescription>Configura los enlaces a las redes sociales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input id="facebook" defaultValue="https://facebook.com/editorialmedica" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input id="twitter" defaultValue="https://twitter.com/editorialmedica" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input id="instagram" defaultValue="https://instagram.com/editorialmedica" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input id="linkedin" defaultValue="https://linkedin.com/company/editorialmedica" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube</Label>
                <Input id="youtube" defaultValue="https://youtube.com/c/editorialmedica" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Guardar cambios</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
