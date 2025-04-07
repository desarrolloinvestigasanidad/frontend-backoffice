"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CrearLibroForm() {
  const [coautores, setCoautores] = useState([{ nombre: "", email: "" }])

  const agregarCoautor = () => {
    if (coautores.length < 7) {
      setCoautores([...coautores, { nombre: "", email: "" }])
    }
  }

  const handleCoautorChange = (index, field, value) => {
    const nuevosCoautores = [...coautores]
    nuevosCoautores[index][field] = value
    setCoautores(nuevosCoautores)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar los datos del libro
    console.log("Libro creado")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="titulo">Título del libro</Label>
        <Input id="titulo" required />
      </div>
      <div>
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea id="descripcion" required />
      </div>
      <div>
        <Label htmlFor="categoria">Categoría</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="medicina-general">Medicina General</SelectItem>
            <SelectItem value="cardiologia">Cardiología</SelectItem>
            <SelectItem value="neurologia">Neurología</SelectItem>
            {/* Añadir más categorías según sea necesario */}
          </SelectContent>
        </Select>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Coautores (máximo 7)</h3>
        {coautores.map((coautor, index) => (
          <div key={index} className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor={`coautor-nombre-${index}`}>Nombre</Label>
              <Input
                id={`coautor-nombre-${index}`}
                value={coautor.nombre}
                onChange={(e) => handleCoautorChange(index, "nombre", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`coautor-email-${index}`}>Email</Label>
              <Input
                id={`coautor-email-${index}`}
                type="email"
                value={coautor.email}
                onChange={(e) => handleCoautorChange(index, "email", e.target.value)}
              />
            </div>
          </div>
        ))}
        {coautores.length < 7 && (
          <Button type="button" onClick={agregarCoautor} variant="outline">
            Agregar coautor
          </Button>
        )}
      </div>
      <Button type="submit">Crear Libro</Button>
    </form>
  )
}

