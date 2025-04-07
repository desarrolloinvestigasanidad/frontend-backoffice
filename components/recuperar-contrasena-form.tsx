"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  // Estados para el paso de recuperación (enviar email)
  const [identifier, setIdentifier] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para el paso de restablecimiento (nuevo password)
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [success, setSuccess] = useState(false);

  // Manejo del formulario de recuperación (envío de correo)
  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: identifier }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error al solicitar recuperación.");
      }
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Manejo del formulario para restablecer la contraseña
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Verifica que ambas contraseñas coincidan
    if (newPassword !== confirmNewPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error al restablecer la contraseña.");
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Si existe un token en la URL, mostramos el formulario para restablecer la contraseña
  if (token) {
    if (success) {
      return (
        <Alert>
          <CheckCircle2 className='h-4 w-4' />
          <AlertTitle>¡Contraseña actualizada!</AlertTitle>
          <AlertDescription>
            Tu contraseña ha sido restablecida correctamente. Ahora puedes
            iniciar sesión.
          </AlertDescription>
        </Alert>
      );
    }
    return (
      <div className='max-w-md mx-auto'>
        <h2 className='text-2xl font-bold mb-6'>Restablecer Contraseña</h2>
        {error && <p className='text-red-600 mb-4'>{error}</p>}
        <form onSubmit={handleResetSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='newPassword'>Nueva Contraseña</Label>
            <Input
              type='password'
              id='newPassword'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor='confirmNewPassword'>
              Confirmar Nueva Contraseña
            </Label>
            <Input
              type='password'
              id='confirmNewPassword'
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>
          <Button type='submit' className='w-full'>
            Restablecer
          </Button>
        </form>
      </div>
    );
  }

  // Si no hay token, mostramos el formulario para enviar el correo de recuperación
  if (isSubmitted) {
    return (
      <Alert>
        <CheckCircle2 className='h-4 w-4' />
        <AlertTitle>Correo enviado</AlertTitle>
        <AlertDescription>
          Se ha enviado un correo con las instrucciones para recuperar tu
          contraseña. Por favor, revisa tu bandeja de entrada y sigue las
          instrucciones.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className='max-w-md mx-auto'>
      <h2 className='text-2xl font-bold mb-6'>Recuperar Contraseña</h2>
      {error && <p className='text-red-600 mb-4'>{error}</p>}
      <form onSubmit={handleRecoverySubmit} className='space-y-4'>
        <div>
          <Label htmlFor='identifier'>DNI/PASAPORTE/NIE</Label>
          <Input
            type='text'
            id='identifier'
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>
        <Button type='submit' className='w-full'>
          Enviar correo de recuperación
        </Button>
      </form>
    </div>
  );
}
