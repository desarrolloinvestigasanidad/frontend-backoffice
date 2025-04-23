"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BackgroundBlobs } from "@/components/background-blobs";
import {
  BarChart3,
  Users,
  BookOpen,
  FileText,
  Settings,
  Bell,
  Search,
  ArrowRight,
  CheckCircle,
  Clock,
  Calendar,
} from "lucide-react";

export default function BackofficePage() {
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});

  const handleMouseEnter = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div className='relative overflow-hidden min-h-screen py-8'>
      {/* Fondo con gradiente y "blobs" */}
      <BackgroundBlobs />

      <div className='container mx-auto px-4 relative z-10 space-y-8'>
        {/* Cabecera */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <h1 className='text-2xl font-bold text-gray-900'>Backoffice</h1>
          </div>
          <div className='flex items-center gap-3'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
              <input
                type='text'
                placeholder='Buscar...'
                className='pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 w-full max-w-xs'
              />
            </div>
            <Button
              variant='outline'
              size='icon'
              className='rounded-full relative'>
              <Bell className='h-5 w-5 text-gray-600' />
              <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                3
              </span>
            </Button>
            <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-sm font-bold'>
              AD
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            Panel de Administración
          </h2>
          <p className='text-gray-600 text-sm md:text-base'>
            Gestiona todos los aspectos de tu plataforma desde un solo lugar
          </p>
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto'></div>
        </motion.div>

        {/* Estadísticas */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <StatsCard
            icon={<Users className='h-6 w-6 text-purple-600' />}
            title='Usuarios'
            value='1,248'
            trend='+12%'
            trendUp={true}
          />
          <StatsCard
            icon={<BookOpen className='h-6 w-6 text-blue-600' />}
            title='Libros'
            value='156'
            trend='+8%'
            trendUp={true}
          />
          <StatsCard
            icon={<FileText className='h-6 w-6 text-green-600' />}
            title='Capítulos'
            value='2,845'
            trend='+24%'
            trendUp={true}
          />
          <StatsCard
            icon={<BarChart3 className='h-6 w-6 text-yellow-600' />}
            title='Ingresos'
            value='€24,500'
            trend='+18%'
            trendUp={true}
          />
        </div>

        {/* Contenido principal */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Columna izquierda */}
          <div className='lg:col-span-2 space-y-8'>
            <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg'>
              <CardHeader>
                <CardTitle>Últimas Publicaciones</CardTitle>
                <CardDescription>
                  Libros y capítulos publicados recientemente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {[1, 2, 3, 4].map((item) => (
                    <motion.div
                      key={item}
                      whileHover={{ y: -3 }}
                      className='bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:border-purple-200 transition-all'>
                      <div className='flex items-start gap-4'>
                        <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                          <BookOpen className='h-6 w-6 text-purple-600' />
                        </div>
                        <div className='flex-1'>
                          <div className='flex items-center justify-between mb-1'>
                            <h4 className='font-medium text-gray-900'>
                              Avances en Medicina Preventiva
                            </h4>
                            <Badge variant='default'>Publicado</Badge>
                          </div>
                          <p className='text-sm text-gray-500 mb-2'>
                            Libro colectivo con 12 capítulos
                          </p>
                          <div className='flex items-center mt-1 text-xs text-gray-500 space-x-3'>
                            <span className='flex items-center'>
                              <Users className='h-3 w-3 mr-1' />8 autores
                            </span>
                            <span className='flex items-center'>
                              <Calendar className='h-3 w-3 mr-1' />
                              {new Date().toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant='default'
                  className='w-full'
                  onMouseEnter={() => handleMouseEnter("publications")}
                  onMouseLeave={() => handleMouseLeave("publications")}>
                  <span className='flex items-center justify-center'>
                    Ver todas las publicaciones
                    <motion.span
                      animate={{ x: hoverStates["publications"] ? 5 : 0 }}
                      transition={{ duration: 0.2 }}>
                      <ArrowRight className='ml-2 h-4 w-4' />
                    </motion.span>
                  </span>
                </Button>
              </CardFooter>
            </Card>

            <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg'>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>
                  Últimas acciones en la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <ActivityItem
                    icon={<Users className='h-5 w-5 text-blue-600' />}
                    title='Nuevo usuario registrado'
                    description='María López se ha registrado en la plataforma'
                    time='Hace 5 minutos'
                  />
                  <ActivityItem
                    icon={<FileText className='h-5 w-5 text-green-600' />}
                    title='Capítulo enviado'
                    description='Juan Pérez ha enviado un nuevo capítulo para revisión'
                    time='Hace 1 hora'
                  />
                  <ActivityItem
                    icon={<CheckCircle className='h-5 w-5 text-purple-600' />}
                    title='Libro aprobado'
                    description="El libro 'Avances en Neurología' ha sido aprobado"
                    time='Hace 3 horas'
                  />
                  <ActivityItem
                    icon={<Clock className='h-5 w-5 text-yellow-600' />}
                    title='Fecha límite próxima'
                    description="La edición 'Medicina 2023' cierra en 2 días"
                    time='Hace 5 horas'
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant='outline'
                  className='w-full border-purple-200 text-purple-700 hover:bg-purple-50'>
                  Ver todo el historial de actividad
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Columna derecha */}
          <div className='space-y-8'>
            <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg'>
              <CardHeader>
                <CardTitle>Tareas Pendientes</CardTitle>
                <CardDescription>
                  Acciones que requieren tu atención
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <TaskItem
                    title='Revisar capítulos pendientes'
                    count={12}
                    priority='high'
                  />
                  <TaskItem
                    title='Aprobar nuevos usuarios'
                    count={5}
                    priority='medium'
                  />
                  <TaskItem
                    title='Actualizar normativa'
                    count={1}
                    priority='low'
                  />
                  <TaskItem
                    title='Responder mensajes'
                    count={8}
                    priority='medium'
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant='default' className='w-full'>
                  Gestionar tareas
                </Button>
              </CardFooter>
            </Card>

            <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg'>
              <CardHeader>
                <CardTitle>Próximas Ediciones</CardTitle>
                <CardDescription>Ediciones programadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <EditionItem
                    title='Medicina Preventiva 2023'
                    date='15 de diciembre, 2023'
                    status='active'
                    progress={75}
                  />
                  <EditionItem
                    title='Avances en Pediatría'
                    date='10 de enero, 2024'
                    status='upcoming'
                    progress={25}
                  />
                  <EditionItem
                    title='Investigación Clínica'
                    date='28 de febrero, 2024'
                    status='upcoming'
                    progress={10}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant='outline'
                  className='w-full border-purple-200 text-purple-700 hover:bg-purple-50'>
                  Administrar ediciones
                </Button>
              </CardFooter>
            </Card>

            <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg'>
              <CardHeader>
                <CardTitle>Configuración Rápida</CardTitle>
                <CardDescription>
                  Accesos directos a configuraciones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 gap-3'>
                  <QuickSettingButton
                    icon={<Users className='h-5 w-5' />}
                    label='Usuarios'
                  />
                  <QuickSettingButton
                    icon={<BookOpen className='h-5 w-5' />}
                    label='Libros'
                  />
                  <QuickSettingButton
                    icon={<Bell className='h-5 w-5' />}
                    label='Notificaciones'
                  />
                  <QuickSettingButton
                    icon={<Settings className='h-5 w-5' />}
                    label='Sistema'
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componentes auxiliares
function StatsCard({
  icon,
  title,
  value,
  trend,
  trendUp,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-lg border border-white/50'>
      <div className='flex justify-between items-start mb-4'>
        <div className='bg-purple-50 p-3 rounded-xl'>{icon}</div>
        <span
          className={`text-sm font-medium py-1 px-2 rounded-full flex items-center ${
            trendUp ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
          <span
            className={`mr-1 ${trendUp ? "text-green-600" : "text-red-600"}`}>
            {trendUp ? "↑" : "↓"}
          </span>
          {trend}
        </span>
      </div>
      <h3 className='text-2xl font-bold text-gray-900'>{value}</h3>
      <p className='text-sm text-gray-500'>{title}</p>
    </motion.div>
  );
}

function ActivityItem({
  icon,
  title,
  description,
  time,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className='flex items-start gap-3'>
      <div className='bg-purple-50 p-2 rounded-full'>{icon}</div>
      <div className='flex-1'>
        <h4 className='text-sm font-medium text-gray-900'>{title}</h4>
        <p className='text-xs text-gray-600'>{description}</p>
        <span className='text-xs text-gray-400 mt-1'>{time}</span>
      </div>
    </div>
  );
}

function TaskItem({
  title,
  count,
  priority,
}: {
  title: string;
  count: number;
  priority: "low" | "medium" | "high";
}) {
  const getPriorityColor = (p: string) => {
    switch (p) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className='flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100'>
      <div className='flex items-center gap-3'>
        <div className='bg-purple-100 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-purple-700'>
          {count}
        </div>
        <span className='text-sm font-medium text-gray-800'>{title}</span>
      </div>
      <Badge className={getPriorityColor(priority)}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    </div>
  );
}

function EditionItem({
  title,
  date,
  status,
  progress,
}: {
  title: string;
  date: string;
  status: "active" | "upcoming" | "completed";
  progress: number;
}) {
  return (
    <div className='p-3 bg-white rounded-lg border border-gray-100'>
      <div className='flex justify-between items-start mb-2'>
        <h4 className='text-sm font-medium text-gray-900'>{title}</h4>
        <Badge
          variant={
            status === "active"
              ? "default"
              : status === "upcoming"
              ? "secondary"
              : "outline"
          }>
          {status === "active"
            ? "Activa"
            : status === "upcoming"
            ? "Próxima"
            : "Completada"}
        </Badge>
      </div>
      <p className='text-xs text-gray-500 mb-2'>
        <Calendar className='inline h-3 w-3 mr-1' />
        {date}
      </p>
      <div className='w-full bg-gray-100 rounded-full h-2.5'>
        <div
          className='bg-gradient-to-r from-purple-500 to-purple-700 h-2.5 rounded-full'
          style={{ width: `${progress}%` }}></div>
      </div>
      <p className='text-xs text-right mt-1 text-gray-500'>
        {progress}% completado
      </p>
    </div>
  );
}

function QuickSettingButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Button
      variant='outline'
      className='flex flex-col items-center justify-center h-auto py-3 border-gray-200 hover:border-purple-200 hover:bg-purple-50'>
      <div className='bg-purple-100 p-2 rounded-full mb-2'>{icon}</div>
      <span className='text-xs'>{label}</span>
    </Button>
  );
}
