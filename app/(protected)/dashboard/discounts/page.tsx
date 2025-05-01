"use client";

import type React from "react";

import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BackgroundBlobs } from "@/components/background-blobs";
import { Breadcrumb } from "@/components/breadcrumb";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tag,
  Percent,
  DollarSign,
  Calendar,
  Edit,
  Plus,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  BookOpen,
  Search,
  LayoutGrid,
  List,
  Loader2,
} from "lucide-react";

// Tipo de datos para el descuento
type Discount = {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  value: number | string;
  minimumPrice?: number | string | null;
  maxUses: number;
  timesUsed: number;
  startDate?: string | null;
  endDate?: string | null;
  notes?: string | null;
  appliesToAllEditions: boolean;
  editionId?: string | null;
  expirationDate?: string | null;
  applyToOwnBook: boolean;
  createdAt: string;
  updatedAt: string;
};

// Tipo para las ediciones
type Edition = {
  id: string;
  title: string;
};

const initialFormState = {
  code: "",
  discountType: "percentage",
  value: "",
  minimumPrice: "",
  maxUses: "1",
  timesUsed: "0",
  startDate: "",
  endDate: "",
  notes: "",
  appliesToAllEditions: true,
  editionId: "none",
  expirationDate: "",
  applyToOwnBook: false,
};

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [editions, setEditions] = useState<Edition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [formData, setFormData] = useState(initialFormState);
  const [discountToEdit, setDiscountToEdit] = useState<Discount | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">(
    "success"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});

  const handleMouseEnter = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: false }));
  };

  // Cargar descuentos y ediciones
  const fetchDiscounts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/discounts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error("Error al cargar los descuentos");
      }
      const data = await res.json();
      setDiscounts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar los descuentos:", error);
      setMessage("Error al cargar los descuentos. Inténtalo de nuevo.");
      setMessageType("error");
    }
  };

  const fetchEditions = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/editions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error("Error al cargar las ediciones");
      }
      const data = await res.json();
      setEditions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar las ediciones:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchDiscounts(), fetchEditions()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Manejo de inputs
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const check = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: check }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Manejo de selects de shadcn
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejo de checkbox de shadcn
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // Crear o Editar
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const token = sessionStorage.getItem("token");

    // Prepara payload con conversión de ciertos campos a número o null
    const payload = {
      code: formData.code,
      discountType: formData.discountType as "percentage" | "fixed",
      value: Number.parseFloat(formData.value),
      minimumPrice: formData.minimumPrice
        ? Number.parseFloat(formData.minimumPrice)
        : null,
      maxUses: Number.parseInt(formData.maxUses, 10),
      timesUsed: Number.parseInt(formData.timesUsed, 10),
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
      notes: formData.notes || null,
      appliesToAllEditions: formData.appliesToAllEditions,
      editionId:
        formData.editionId === "none" ? null : formData.editionId || null,
      expirationDate: formData.expirationDate || null,
      applyToOwnBook: formData.applyToOwnBook,
    };

    try {
      let res: Response;
      if (discountToEdit) {
        // Actualizar
        res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/discounts/${discountToEdit.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        // Crear
        res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/discounts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error en la operación");
      }

      // Éxito
      await fetchDiscounts();
      setMessage(
        discountToEdit
          ? "Descuento actualizado correctamente"
          : "Descuento creado correctamente"
      );
      setMessageType("success");
      setDiscountToEdit(null);
      setFormData(initialFormState);
    } catch (err: any) {
      console.error(err);
      setMessage(err.message);
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Editar: cargar datos en form
  const handleEdit = (discount: Discount) => {
    setDiscountToEdit(discount);
    setFormData({
      code: discount.code,
      discountType: discount.discountType,
      value: discount.value.toString(),
      minimumPrice: discount.minimumPrice
        ? discount.minimumPrice.toString()
        : "",
      maxUses: discount.maxUses.toString(),
      timesUsed: discount.timesUsed.toString(),
      startDate: discount.startDate ? discount.startDate.substring(0, 10) : "",
      endDate: discount.endDate ? discount.endDate.substring(0, 10) : "",
      notes: discount.notes || "",
      appliesToAllEditions: discount.appliesToAllEditions,
      editionId: discount.editionId || "none",
      expirationDate: discount.expirationDate
        ? discount.expirationDate.substring(0, 10)
        : "",
      applyToOwnBook: discount.applyToOwnBook,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setDiscountToEdit(null);
    setFormData(initialFormState);
    setMessage("");
  };

  // Función para formatear fecha en tabla
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      return "Fecha inválida";
    }
  };

  // Filtrar descuentos por búsqueda
  const filteredDiscounts = discounts.filter((discount) => {
    const searchFields = [
      discount.code,
      discount.discountType === "percentage" ? "Porcentaje" : "Fijo",
      discount.notes,
      discount.editionId,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchTerm === "" || searchFields.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className='relative overflow-hidden min-h-screen py-8'>
        <BackgroundBlobs />
        <div className='container mx-auto px-4 relative z-10'>
          <div className='flex items-center justify-center h-64'>
            <div className='relative'>
              <div className='h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin'></div>
              <div className='absolute inset-0 flex items-center justify-center'>
                <Tag className='h-6 w-6 text-purple-500' />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='relative overflow-hidden min-h-screen py-8'>
      <BackgroundBlobs />

      <div className='container mx-auto px-4 relative z-10 space-y-8'>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex items-center justify-between'>
          <Breadcrumb items={[{ label: "Gestión de Descuentos", href: "#" }]} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            {discountToEdit ? "Editar Descuento" : "Gestión de Descuentos"}
          </h2>
          <p className='text-gray-600 text-sm md:text-base'>
            {discountToEdit
              ? "Modifica los detalles del descuento seleccionado"
              : "Crea y administra códigos de descuento para tus clientes"}
          </p>
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto'></div>
        </motion.div>

        {message && (
          <Alert
            className={`${
              messageType === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            } mb-6`}>
            {messageType === "success" ? (
              <CheckCircle className='h-4 w-4 text-green-600' />
            ) : (
              <AlertCircle className='h-4 w-4 text-red-600' />
            )}
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg'>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <div className='bg-purple-100 p-3 rounded-full'>
                  {discountToEdit ? (
                    <Edit className='h-6 w-6 text-purple-700' />
                  ) : (
                    <Plus className='h-6 w-6 text-purple-700' />
                  )}
                </div>
                <div>
                  <CardTitle>
                    {discountToEdit
                      ? "Editar Descuento"
                      : "Crear Nuevo Descuento"}
                  </CardTitle>
                  <CardDescription>
                    {discountToEdit
                      ? "Modifica los detalles del descuento seleccionado"
                      : "Completa el formulario para crear un nuevo código de descuento"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* Código */}
                  <div className='space-y-2'>
                    <Label
                      htmlFor='code'
                      className='flex items-center gap-2 text-gray-700'>
                      <Tag className='h-4 w-4 text-purple-600' />
                      Código
                    </Label>
                    <Input
                      id='code'
                      name='code'
                      value={formData.code}
                      onChange={handleInputChange}
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                      required
                    />
                  </div>

                  {/* Tipo (percentage, fixed) */}
                  <div className='space-y-2'>
                    <Label
                      htmlFor='discountType'
                      className='flex items-center gap-2 text-gray-700'>
                      <Percent className='h-4 w-4 text-purple-600' />
                      Tipo de Descuento
                    </Label>
                    <Select
                      value={formData.discountType}
                      onValueChange={(value) =>
                        handleSelectChange("discountType", value)
                      }>
                      <SelectTrigger className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'>
                        <SelectValue placeholder='Selecciona el tipo' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='percentage'>
                          Porcentaje (%)
                        </SelectItem>
                        <SelectItem value='fixed'>Fijo (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Valor / Porcentaje */}
                  <div className='space-y-2'>
                    <Label
                      htmlFor='value'
                      className='flex items-center gap-2 text-gray-700'>
                      {formData.discountType === "percentage" ? (
                        <Percent className='h-4 w-4 text-purple-600' />
                      ) : (
                        <DollarSign className='h-4 w-4 text-purple-600' />
                      )}
                      {formData.discountType === "percentage"
                        ? "Porcentaje (%)"
                        : "Valor (€)"}
                    </Label>
                    <Input
                      id='value'
                      name='value'
                      type='number'
                      value={formData.value}
                      onChange={handleInputChange}
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                      step='0.01'
                      required
                    />
                  </div>

                  {/* Máx. Usos */}
                  <div className='space-y-2'>
                    <Label
                      htmlFor='maxUses'
                      className='flex items-center gap-2 text-gray-700'>
                      <Tag className='h-4 w-4 text-purple-600' />
                      Máximo de Usos
                    </Label>
                    <Input
                      id='maxUses'
                      name='maxUses'
                      type='number'
                      value={formData.maxUses}
                      onChange={handleInputChange}
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                      min='1'
                      required
                    />
                  </div>

                  {/* Usado (veces ya usado) */}
                  <div className='space-y-2'>
                    <Label
                      htmlFor='timesUsed'
                      className='flex items-center gap-2 text-gray-700'>
                      <Clock className='h-4 w-4 text-purple-600' />
                      Veces Usado
                    </Label>
                    <Input
                      id='timesUsed'
                      name='timesUsed'
                      type='number'
                      value={formData.timesUsed}
                      onChange={handleInputChange}
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                      min='0'
                    />
                  </div>

                  {/* Fecha de inicio */}
                  <div className='space-y-2'>
                    <Label
                      htmlFor='startDate'
                      className='flex items-center gap-2 text-gray-700'>
                      <Calendar className='h-4 w-4 text-purple-600' />
                      Fecha de Inicio
                    </Label>
                    <Input
                      id='startDate'
                      name='startDate'
                      type='date'
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                    />
                  </div>

                  {/* Fecha de fin */}
                  <div className='space-y-2'>
                    <Label
                      htmlFor='endDate'
                      className='flex items-center gap-2 text-gray-700'>
                      <Calendar className='h-4 w-4 text-purple-600' />
                      Fecha de Fin
                    </Label>
                    <Input
                      id='endDate'
                      name='endDate'
                      type='date'
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                    />
                  </div>

                  {/* Edición ID */}
                  <div className='space-y-2'>
                    <Label
                      htmlFor='editionId'
                      className='flex items-center gap-2 text-gray-700'>
                      <BookOpen className='h-4 w-4 text-purple-600' />
                      Edición (opcional)
                    </Label>
                    <Select
                      value={formData.editionId}
                      onValueChange={(value) =>
                        handleSelectChange("editionId", value)
                      }
                      disabled={formData.appliesToAllEditions}>
                      <SelectTrigger className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'>
                        <SelectValue placeholder='Selecciona una edición' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='none'>Ninguna</SelectItem>
                        {editions.map((edition) => (
                          <SelectItem key={edition.id} value={edition.id}>
                            {edition.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Observaciones */}
                <div className='space-y-2'>
                  <Label
                    htmlFor='notes'
                    className='flex items-center gap-2 text-gray-700'>
                    <FileText className='h-4 w-4 text-purple-600' />
                    Observaciones
                  </Label>
                  <Textarea
                    id='notes'
                    name='notes'
                    value={formData.notes || ""}
                    onChange={handleInputChange}
                    className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                    rows={3}
                  />
                </div>

                {/* Checkboxes */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='appliesToAllEditions'
                      checked={formData.appliesToAllEditions}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "appliesToAllEditions",
                          checked as boolean
                        )
                      }
                    />
                    <Label
                      htmlFor='appliesToAllEditions'
                      className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                      Aplica a todas las ediciones
                    </Label>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='applyToOwnBook'
                      checked={formData.applyToOwnBook}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "applyToOwnBook",
                          checked as boolean
                        )
                      }
                    />
                    <Label
                      htmlFor='applyToOwnBook'
                      className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                      Aplica a libro personalizado
                    </Label>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className='flex justify-between'>
              {discountToEdit ? (
                <>
                  <Button
                    variant='outline'
                    type='button'
                    onClick={handleCancelEdit}
                    className='border-gray-200 text-gray-700 hover:bg-gray-50'
                    disabled={isSubmitting}>
                    <X className='mr-2 h-4 w-4' /> Cancelar
                  </Button>
                  <Button
                    type='submit'
                    onClick={handleSubmit}
                    className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'
                    disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />{" "}
                        Actualizando...
                      </>
                    ) : (
                      <>
                        <Save className='mr-2 h-4 w-4' /> Actualizar Descuento
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  type='submit'
                  onClick={handleSubmit}
                  className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 ml-auto'
                  disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />{" "}
                      Creando...
                    </>
                  ) : (
                    <>
                      <Plus className='mr-2 h-4 w-4' /> Crear Descuento
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>

        {/* Lista de Descuentos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='space-y-6'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4 mb-6'>
            <div className='relative w-full md:w-auto flex-1 max-w-md'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
              <input
                type='text'
                placeholder='Buscar descuentos...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 w-full'
              />
            </div>
            <div className='flex items-center gap-3'>
              <Badge variant='default' className='py-1.5'>
                {filteredDiscounts.length} descuentos encontrados
              </Badge>
              <div className='flex items-center border rounded-lg overflow-hidden'>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                  title='Vista de cuadrícula'>
                  <LayoutGrid className='h-5 w-5' />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                  title='Vista de lista'>
                  <List className='h-5 w-5' />
                </button>
              </div>
            </div>
          </div>

          {filteredDiscounts.length === 0 ? (
            <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg text-center p-8'>
              <div className='flex flex-col items-center justify-center'>
                <Tag className='w-16 h-16 text-purple-300 mb-4' />
                <h3 className='text-xl font-semibold text-gray-700 mb-2'>
                  No se encontraron descuentos
                </h3>
                <p className='text-gray-500 mb-6'>
                  {searchTerm
                    ? "No se encontraron descuentos que coincidan con tu búsqueda."
                    : "No hay descuentos registrados. Crea tu primer descuento usando el formulario."}
                </p>
              </div>
            </Card>
          ) : viewMode === "grid" ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredDiscounts.map((discount, index) => (
                <motion.div
                  key={discount.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}>
                  <Card className='backdrop-blur-sm bg-white/80 border-white/50 shadow-lg overflow-hidden h-full hover:shadow-xl transition-shadow'>
                    <CardHeader className='pb-2'>
                      <div className='flex justify-between items-start'>
                        <CardTitle className='text-lg font-bold'>
                          {discount.code}
                        </CardTitle>
                        <Badge
                          variant={
                            discount.discountType === "percentage"
                              ? "default"
                              : "secondary"
                          }>
                          {discount.discountType === "percentage" ? (
                            <Percent className='h-3 w-3 mr-1' />
                          ) : (
                            <DollarSign className='h-3 w-3 mr-1' />
                          )}
                          {discount.discountType === "percentage"
                            ? "Porcentaje"
                            : "Fijo"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className='pt-2'>
                      <div className='space-y-3'>
                        <div className='flex justify-between items-center'>
                          <div className='flex items-center text-sm text-gray-600'>
                            {discount.discountType === "percentage" ? (
                              <Percent className='h-4 w-4 mr-2 text-purple-600 flex-shrink-0' />
                            ) : (
                              <DollarSign className='h-4 w-4 mr-2 text-purple-600 flex-shrink-0' />
                            )}
                            <span className='font-medium'>Valor:</span>
                          </div>
                          <span className='text-lg font-bold text-gray-900'>
                            {Number.parseFloat(
                              discount.value.toString()
                            ).toFixed(2)}
                            {discount.discountType === "percentage" ? "%" : "€"}
                          </span>
                        </div>

                        <div className='flex items-center text-sm text-gray-600'>
                          <DollarSign className='h-4 w-4 mr-2 text-purple-600 flex-shrink-0' />
                          <span className='font-medium'>Mínimo:</span>
                          <span className='ml-2'>
                            {discount.minimumPrice
                              ? Number.parseFloat(
                                  discount.minimumPrice.toString()
                                ).toFixed(2) + "€"
                              : "N/A"}
                          </span>
                        </div>

                        <div className='flex items-center text-sm text-gray-600'>
                          <Tag className='h-4 w-4 mr-2 text-purple-600 flex-shrink-0' />
                          <span className='font-medium'>Usos:</span>
                          <span className='ml-2'>
                            {discount.timesUsed} de {discount.maxUses}
                          </span>
                        </div>

                        <div className='flex items-center text-sm text-gray-600'>
                          <Calendar className='h-4 w-4 mr-2 text-purple-600 flex-shrink-0' />
                          <span className='font-medium'>Vigencia:</span>
                          <span className='ml-2'>
                            {formatDate(discount.startDate)} -{" "}
                            {formatDate(discount.endDate)}
                          </span>
                        </div>

                        {discount.notes && (
                          <div className='text-sm text-gray-600 border-t pt-2 mt-2'>
                            <p className='font-medium mb-1'>Observaciones:</p>
                            <p className='text-gray-500'>{discount.notes}</p>
                          </div>
                        )}

                        <div className='flex justify-end mt-4'>
                          <Button
                            variant='outline'
                            size='sm'
                            className='border-purple-200 text-purple-700 hover:bg-purple-50'
                            onClick={() => handleEdit(discount)}
                            onMouseEnter={() =>
                              handleMouseEnter(`edit-${discount.id}`)
                            }
                            onMouseLeave={() =>
                              handleMouseLeave(`edit-${discount.id}`)
                            }>
                            <motion.span
                              className='flex items-center'
                              animate={{
                                x: hoverStates[`edit-${discount.id}`] ? 2 : 0,
                              }}
                              transition={{ duration: 0.2 }}>
                              <Edit className='mr-1 h-4 w-4' /> Editar
                            </motion.span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className='overflow-hidden rounded-xl border border-white/50 backdrop-blur-sm bg-white/80 shadow-lg'>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-purple-50 text-purple-900'>
                    <tr>
                      <th className='px-4 py-3 text-left'>Código</th>
                      <th className='px-4 py-3 text-left'>Tipo</th>
                      <th className='px-4 py-3 text-left'>Valor</th>
                      <th className='px-4 py-3 text-left'>Mínimo (€)</th>
                      <th className='px-4 py-3 text-left'>Usos</th>
                      <th className='px-4 py-3 text-left'>Vigencia</th>
                      <th className='px-4 py-3 text-left'>Observaciones</th>
                      <th className='px-4 py-3 text-center'>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-100'>
                    {filteredDiscounts.map((discount) => (
                      <tr
                        key={discount.id}
                        className='hover:bg-purple-50/50 transition-colors'>
                        <td className='px-4 py-4 font-medium'>
                          {discount.code}
                        </td>
                        <td className='px-4 py-4'>
                          <Badge
                            variant={
                              discount.discountType === "percentage"
                                ? "default"
                                : "secondary"
                            }>
                            {discount.discountType === "percentage" ? (
                              <Percent className='h-3 w-3 mr-1' />
                            ) : (
                              <DollarSign className='h-3 w-3 mr-1' />
                            )}
                            {discount.discountType === "percentage"
                              ? "Porcentaje"
                              : "Fijo"}
                          </Badge>
                        </td>
                        <td className='px-4 py-4 font-medium'>
                          {Number.parseFloat(discount.value.toString()).toFixed(
                            2
                          )}
                          {discount.discountType === "percentage" ? "%" : "€"}
                        </td>
                        <td className='px-4 py-4'>
                          {discount.minimumPrice
                            ? Number.parseFloat(
                                discount.minimumPrice.toString()
                              ).toFixed(2) + "€"
                            : "N/A"}
                        </td>
                        <td className='px-4 py-4'>
                          {discount.timesUsed} / {discount.maxUses}
                        </td>
                        <td className='px-4 py-4'>
                          <div className='flex flex-col text-sm'>
                            <span>
                              Inicio: {formatDate(discount.startDate)}
                            </span>
                            <span>Fin: {formatDate(discount.endDate)}</span>
                          </div>
                        </td>
                        <td className='px-4 py-4'>
                          <p className='text-sm text-gray-600 truncate max-w-[200px]'>
                            {discount.notes || "N/A"}
                          </p>
                        </td>
                        <td className='px-4 py-4 text-center'>
                          <Button
                            variant='outline'
                            size='sm'
                            className='border-purple-200 text-purple-700 hover:bg-purple-50'
                            onClick={() => handleEdit(discount)}>
                            <Edit className='mr-1 h-4 w-4' /> Editar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
