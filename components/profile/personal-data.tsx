"use client";

import { useEffect, useState } from "react";
import Image from "next/image"; // Si deseas usar una imagen estática o Next Image
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PersonalData() {
  interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    category?: string;
    country?: string;
    region?: string;
    province?: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Estados para editar campos
  const [formData, setFormData] = useState<Omit<User, "id" | "email">>({
    firstName: "",
    lastName: "",
    phone: "",
    category: "",
    country: "",
    region: "",
    province: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token de autenticación no encontrado.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al obtener la información del usuario.");
        }
        return res.json();
      })
      .then((data: User) => {
        setUser(data);
        // Rellenamos el formData con los valores del usuario
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
          category: data.category || "",
          country: data.country || "",
          region: data.region || "",
          province: data.province || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token de autenticación no encontrado.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Error al actualizar el perfil.");
      }

      const data = await res.json();
      // Actualizamos la info de usuario con la respuesta
      setUser(data.user);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Cargando información del usuario...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!user) {
    return <p>No se pudo obtener la información del usuario.</p>;
  }

  return (
    <div className='flex flex-col md:flex-row gap-6'>
      {/* Sección izquierda (imagen e identificador) */}
      <div className='flex flex-col items-center md:items-start'>
        {/* Imagen (puedes usar la tuya propia o un placeholder) */}
        <div className='w-48 h-48 mb-4'>
          <Image
            src='/doctor.png' // Ajusta la ruta según tu proyecto
            alt='Ícono de perfil'
            width={200}
            height={300}
            className='rounded-full'
          />
        </div>
      </div>

      {/* Sección derecha (datos personales) */}
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Mis datos personales</CardTitle>
          <CardDescription>
            Aquí puedes ver y actualizar tu información
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2'>
            {/* DNI/Pasaporte (id) */}
            <div>
              <Label>DNI/Pasaporte</Label>
              <Input type='text' value={user.id} disabled className='mt-1' />
            </div>
            {/* Email */}
            <div>
              <Label>Email</Label>
              <Input type='text' value={user.email} disabled className='mt-1' />
            </div>
            {/* Nombre */}
            <div>
              <Label>Nombre</Label>
              <Input
                type='text'
                name='firstName'
                value={formData.firstName}
                disabled={!isEditing}
                onChange={handleChange}
                className='mt-1'
              />
            </div>
            {/* Apellidos */}
            <div>
              <Label>Apellidos</Label>
              <Input
                type='text'
                name='lastName'
                value={formData.lastName}
                disabled={!isEditing}
                onChange={handleChange}
                className='mt-1'
              />
            </div>
            {/* Teléfono */}
            <div>
              <Label>Móvil</Label>
              <Input
                type='text'
                name='phone'
                value={formData.phone}
                disabled={!isEditing}
                onChange={handleChange}
                className='mt-1'
              />
            </div>
            {/* Categoría Profesional */}
            <div>
              <Label>Categoría Profesional</Label>
              <Input
                type='text'
                name='category'
                value={formData.category}
                disabled={!isEditing}
                onChange={handleChange}
                className='mt-1'
              />
            </div>
            {/* País */}
            <div>
              <Label>País</Label>
              <Input
                type='text'
                name='country'
                value={formData.country}
                disabled={!isEditing}
                onChange={handleChange}
                className='mt-1'
              />
            </div>
            {/* Región */}
            <div>
              <Label>Región</Label>
              <Input
                type='text'
                name='region'
                value={formData.region}
                disabled={!isEditing}
                onChange={handleChange}
                className='mt-1'
              />
            </div>
            {/* Provincia */}
            <div>
              <Label>Provincia</Label>
              <Input
                type='text'
                name='province'
                value={formData.province}
                disabled={!isEditing}
                onChange={handleChange}
                className='mt-1'
              />
            </div>
          </div>
          {/* Mensaje de error si lo hay */}
          {error && <p className='text-red-500 mt-4'>{error}</p>}
          {/* Botones */}
          <div className='mt-6 flex gap-2'>
            {!isEditing ? (
              <Button onClick={handleEditToggle}>Editar</Button>
            ) : (
              <>
                <Button onClick={handleUpdateProfile}>Guardar</Button>
                <Button variant='outline' onClick={handleEditToggle}>
                  Cancelar
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
