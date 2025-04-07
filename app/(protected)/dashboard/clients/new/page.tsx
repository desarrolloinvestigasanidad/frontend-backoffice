// app/(protected)/clientes/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewClientPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al crear cliente");
      }
      // Si se creó con éxito, redirigir al listado
      router.push("/clients");
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='space-y-4'>
      <h1 className='text-2xl font-bold'>Nuevo Cliente</h1>
      <form onSubmit={handleSubmit} className='space-y-4 max-w-md'>
        <div className='space-y-2'>
          <Label htmlFor='id'>ID (DNI/Pasaporte/NIE)</Label>
          <Input
            id='id'
            name='id'
            value={formData.id}
            onChange={handleChange}
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='firstName'>Nombre</Label>
          <Input
            id='firstName'
            name='firstName'
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='lastName'>Apellidos</Label>
          <Input
            id='lastName'
            name='lastName'
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            name='email'
            type='email'
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='phone'>Teléfono</Label>
          <Input
            id='phone'
            name='phone'
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {message && <p className='text-red-600'>{message}</p>}

        <div className='flex gap-2'>
          <Button type='submit' disabled={loading}>
            {loading ? "Creando..." : "Crear Cliente"}
          </Button>
          <Button variant='outline' type='button' onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </section>
  );
}
