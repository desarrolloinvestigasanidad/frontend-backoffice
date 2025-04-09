"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CertificateType, CertificateData } from "@/types/certificate"
import { PlusCircle, X } from "lucide-react"

interface CertificateFormProps {
  type: CertificateType
  data: CertificateData
  onChange: (data: Partial<CertificateData>) => void
}

export function CertificateForm({ type, data, onChange }: CertificateFormProps) {
  const [newAuthor, setNewAuthor] = useState("")
  const [newCoauthor, setNewCoauthor] = useState("")

  const handleAddAuthor = () => {
    if (newAuthor.trim()) {
      onChange({ authors: [...data.authors, newAuthor.trim()] })
      setNewAuthor("")
    }
  }

  const handleAddCoauthor = () => {
    if (newCoauthor.trim()) {
      onChange({ coauthors: [...data.coauthors, newCoauthor.trim()] })
      setNewCoauthor("")
    }
  }

  const handleRemoveAuthor = (index: number) => {
    const newAuthors = [...data.authors]
    newAuthors.splice(index, 1)
    onChange({ authors: newAuthors })
  }

  const handleRemoveCoauthor = (index: number) => {
    const newCoauthors = [...data.coauthors]
    newCoauthors.splice(index, 1)
    onChange({ coauthors: newCoauthors })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof CertificateData) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        onChange({ [field]: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const regions = [
    "Andalucía",
    "Aragón",
    "Asturias",
    "Baleares",
    "Canarias",
    "Cantabria",
    "Castilla La Mancha",
    "Castilla y León",
    "Cataluña",
    "Extremadura",
    "Galicia",
    "La Rioja",
    "Madrid",
    "Murcia",
    "Navarra",
    "País Vasco",
    "Valencia",
    "Genérico",
  ]

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título del Certificado</Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Título del certificado"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bookTitle">Título del Libro</Label>
        <Input
          id="bookTitle"
          value={data.bookTitle}
          onChange={(e) => onChange({ bookTitle: e.target.value })}
          placeholder="Título del libro"
        />
      </div>

      {type === "chapter" && (
        <div className="space-y-2">
          <Label htmlFor="chapterTitle">Título del Capítulo</Label>
          <Input
            id="chapterTitle"
            value={data.chapterTitle}
            onChange={(e) => onChange({ chapterTitle: e.target.value })}
            placeholder="Título del capítulo"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="isbn">ISBN</Label>
        <Input
          id="isbn"
          value={data.isbn}
          onChange={(e) => onChange({ isbn: e.target.value })}
          placeholder="ISBN del libro"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pages">Páginas</Label>
          <Input
            id="pages"
            value={data.pages}
            onChange={(e) => onChange({ pages: e.target.value })}
            placeholder="Ej: 45-67"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="totalPages">Total de Páginas</Label>
          <Input
            id="totalPages"
            value={data.totalPages}
            onChange={(e) => onChange({ totalPages: e.target.value })}
            placeholder="Ej: 320"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="publicationDate">Fecha de Publicación</Label>
        <Input
          id="publicationDate"
          type="date"
          value={data.publicationDate}
          onChange={(e) => onChange({ publicationDate: e.target.value })}
        />
      </div>

      {type === "region" && (
        <div className="space-y-2">
          <Label htmlFor="region">Comunidad Autónoma</Label>
          <Select value={data.region} onValueChange={(value) => onChange({ region: value })}>
            <SelectTrigger id="region">
              <SelectValue placeholder="Seleccionar región" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="validationUrl">URL de Validación</Label>
        <Input
          id="validationUrl"
          value={data.validationUrl}
          onChange={(e) => onChange({ validationUrl: e.target.value })}
          placeholder="URL para el código QR"
        />
      </div>

      <div className="space-y-2">
        <Label>Autores</Label>
        <div className="flex space-x-2">
          <Input value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} placeholder="Nombre del autor" />
          <Button type="button" size="icon" onClick={handleAddAuthor}>
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 space-y-2">
          {data.authors.map((author, index) => (
            <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
              <span>{author}</span>
              <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveAuthor(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Coautores</Label>
        <div className="flex space-x-2">
          <Input
            value={newCoauthor}
            onChange={(e) => setNewCoauthor(e.target.value)}
            placeholder="Nombre del coautor"
          />
          <Button type="button" size="icon" onClick={handleAddCoauthor}>
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 space-y-2">
          {data.coauthors.map((coauthor, index) => (
            <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
              <span>{coauthor}</span>
              <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveCoauthor(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="logo">Logo</Label>
          <Input id="logo" type="file" accept="image/*" onChange={(e) => handleFileChange(e, "logo")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signature">Firma</Label>
          <Input id="signature" type="file" accept="image/*" onChange={(e) => handleFileChange(e, "signature")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="headerImage">Imagen de Cabecera</Label>
          <Input id="headerImage" type="file" accept="image/*" onChange={(e) => handleFileChange(e, "headerImage")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="footerImage">Imagen de Pie</Label>
          <Input id="footerImage" type="file" accept="image/*" onChange={(e) => handleFileChange(e, "footerImage")} />
        </div>
      </div>
    </div>
  )
}

