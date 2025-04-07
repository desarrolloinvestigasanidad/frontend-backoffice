"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EnviarCapituloForm() {
  const [coautores, setCoautores] = useState([])

  const agregarCoautor = () => {
    setCoautores([...coautores, { nombre: "", email: "" }])
  }

  const handleCoautorChange = (index, field, value) => {
    const nuevosCoautores = [...coautores]
    nuevosCoautores[index][field] = value
    setCoautores(nuevosCoautores)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar el capítulo
    console.log("Capítulo enviado")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="titulo">Título del capítulo</Label>
        <Input id="titulo" required />
      </div>
      <div>
        <Label htmlFor="resumen">Resumen</Label>
        <Textarea id="resumen" required />
      </div>
      <div>
        <Label htmlFor="palabras-clave">Palabras clave (separadas por comas)</Label>
        <Input id="palabras-clave" required />
      </div>
      <div>
        <Label htmlFor="edicion">Edición</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una edición" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="edicion-viii">Edición VIII</SelectItem>
            <SelectItem value="edicion-ix">Edición IX</SelectItem>
            {/* Añadir más ediciones según sea necesario */}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="archivo">Archivo del capítulo (PDF)</Label>
        <Input id="archivo" type="file" accept=".pdf" required />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Coautores</h3>
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
        <Button type="button" onClick={agregarCoautor} variant="outline">
          Agregar coautor
        </Button>
      </div>
      <Button type="submit">Enviar Capítulo</Button>
    </form>
  )
}

