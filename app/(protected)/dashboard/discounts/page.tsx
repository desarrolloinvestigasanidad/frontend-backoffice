"use client";

import { useEffect, useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
  editionId: "",
  expirationDate: "",
  applyToOwnBook: false,
};

export default function DiscountsPage() {
  const router = useRouter();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState(initialFormState);
  // discountToEdit !== null => modo edición
  const [discountToEdit, setDiscountToEdit] = useState<Discount | null>(null);
  const [message, setMessage] = useState("");

  // Cargar descuentos
  const fetchDiscounts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/discounts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDiscounts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar los descuentos:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchDiscounts();
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

  // Crear o Editar
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");

    const token = sessionStorage.getItem("token");

    // Prepara payload con conversión de ciertos campos a número o null
    const payload = {
      code: formData.code,
      discountType: formData.discountType as "percentage" | "fixed",
      value: parseFloat(formData.value),
      minimumPrice: formData.minimumPrice
        ? parseFloat(formData.minimumPrice)
        : null,
      maxUses: parseInt(formData.maxUses, 10),
      timesUsed: parseInt(formData.timesUsed, 10),
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
      notes: formData.notes || null,
      appliesToAllEditions: formData.appliesToAllEditions,
      editionId: formData.editionId || null,
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
      setMessage("Operación realizada correctamente");
      setDiscountToEdit(null);
      setFormData(initialFormState);
    } catch (err: any) {
      console.error(err);
      setMessage(err.message);
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
      editionId: discount.editionId || "",
      expirationDate: discount.expirationDate || "",
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
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) return <div className='p-4'>Cargando descuentos...</div>;

  return (
    <div className='container mx-auto px-4 py-8 space-y-8'>
      {/* Formulario */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='bg-white shadow p-6 rounded-lg'>
        <h2 className='text-xl font-semibold mb-4'>
          {discountToEdit ? "Editar Descuento" : "Crear Descuento"}
        </h2>
        {message && <p className='mb-4 text-green-600'>{message}</p>}
        <form
          onSubmit={handleSubmit}
          className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Código */}
          <div>
            <label className='block font-medium mb-1'>Código</label>
            <input
              type='text'
              name='code'
              value={formData.code}
              onChange={handleInputChange}
              className='w-full border rounded p-2'
              required
            />
          </div>

          {/* Tipo (percentage, fixed) */}
          <div>
            <label className='block font-medium mb-1'>Tipo</label>
            <select
              name='discountType'
              value={formData.discountType}
              onChange={handleInputChange}
              className='w-full border rounded p-2'>
              <option value='percentage'>Porcentaje</option>
              <option value='fixed'>Fijo (€)</option>
            </select>
          </div>

          {/* Valor / Porcentaje */}
          <div>
            <label className='block font-medium mb-1'>
              {formData.discountType === "percentage"
                ? "Porcentaje (%)"
                : "Valor (€)"}
            </label>
            <input
              type='number'
              name='value'
              value={formData.value}
              onChange={handleInputChange}
              className='w-full border rounded p-2'
              step='0.01'
              required
            />
          </div>

          {/* Importe mínimo */}
          <div>
            <label className='block font-medium mb-1'>
              Importe mínimo (€) (opcional)
            </label>
            <input
              type='number'
              name='minimumPrice'
              value={formData.minimumPrice}
              onChange={handleInputChange}
              className='w-full border rounded p-2'
              step='0.01'
            />
          </div>

          {/* Máx. Usos */}
          <div>
            <label className='block font-medium mb-1'>Máx. Usos</label>
            <input
              type='number'
              name='maxUses'
              value={formData.maxUses}
              onChange={handleInputChange}
              className='w-full border rounded p-2'
            />
          </div>

          {/* Usado (veces ya usado) */}
          <div>
            <label className='block font-medium mb-1'>Usado</label>
            <input
              type='number'
              name='timesUsed'
              value={formData.timesUsed}
              onChange={handleInputChange}
              className='w-full border rounded p-2'
            />
          </div>

          {/* Fecha de inicio */}
          <div>
            <label className='block font-medium mb-1'>Fecha de Inicio</label>
            <input
              type='date'
              name='startDate'
              value={formData.startDate}
              onChange={handleInputChange}
              className='w-full border rounded p-2'
            />
          </div>

          {/* Fecha de fin */}
          <div>
            <label className='block font-medium mb-1'>Fecha de Fin</label>
            <input
              type='date'
              name='endDate'
              value={formData.endDate}
              onChange={handleInputChange}
              className='w-full border rounded p-2'
            />
          </div>

          {/* Observaciones */}
          <div className='md:col-span-2'>
            <label className='block font-medium mb-1'>Observaciones</label>
            <textarea
              name='notes'
              value={formData.notes}
              onChange={handleInputChange}
              className='w-full border rounded p-2'
              rows={3}
            />
          </div>

          {/* appliesToAllEditions + editionId + expirationDate + applyToOwnBook, opcionales */}
          <div className='flex items-center space-x-2'>
            <label className='block font-medium'>
              Aplica a todas las ediciones
            </label>
            <input
              type='checkbox'
              name='appliesToAllEditions'
              checked={formData.appliesToAllEditions}
              onChange={handleInputChange}
              className='h-5 w-5'
            />
          </div>

          <div>
            <label className='block font-medium mb-1'>
              Edición ID (opcional)
            </label>
            <input
              type='text'
              name='editionId'
              value={formData.editionId}
              onChange={handleInputChange}
              className='w-full border rounded p-2'
            />
          </div>

          <div>
            <label className='block font-medium mb-1'>
              Fecha de expiración (opcional)
            </label>
            <input
              type='date'
              name='expirationDate'
              value={formData.expirationDate}
              onChange={handleInputChange}
              className='w-full border rounded p-2'
            />
          </div>

          <div className='flex items-center space-x-2'>
            <label className='block font-medium'>Aplica a libro propio</label>
            <input
              type='checkbox'
              name='applyToOwnBook'
              checked={formData.applyToOwnBook}
              onChange={handleInputChange}
              className='h-5 w-5'
            />
          </div>

          {/* Botones */}
          <div className='md:col-span-2 flex items-center space-x-4 mt-4'>
            <Button type='submit' variant='default'>
              {discountToEdit ? "Actualizar Descuento" : "Crear Descuento"}
            </Button>
            {discountToEdit && (
              <Button variant='destructive' onClick={handleCancelEdit}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </motion.div>

      {/* Tabla */}
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-300 text-sm shadow rounded-lg'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='px-4 py-2 border-r border-gray-300'>Código</th>
              <th className='px-4 py-2 border-r border-gray-300'>Tipo</th>
              <th className='px-4 py-2 border-r border-gray-300'>Valor</th>
              <th className='px-4 py-2 border-r border-gray-300'>Mínimo (€)</th>
              <th className='px-4 py-2 border-r border-gray-300'>Max. Usos</th>
              <th className='px-4 py-2 border-r border-gray-300'>Usado</th>
              <th className='px-4 py-2 border-r border-gray-300'>Inicio</th>
              <th className='px-4 py-2 border-r border-gray-300'>Fin</th>
              <th className='px-4 py-2 border-r border-gray-300'>
                Observaciones
              </th>
              <th className='px-4 py-2 border-r border-gray-300'>Creado</th>
              <th className='px-4 py-2 border-r border-gray-300'>
                Actualizado
              </th>
              <th className='px-4 py-2'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => {
              return (
                <tr key={d.id} className='hover:bg-gray-50'>
                  <td className='border-r border-gray-300 px-4 py-2'>
                    {d.code}
                  </td>
                  <td className='border-r border-gray-300 px-4 py-2'>
                    {d.discountType === "percentage" ? "Porcentaje" : "Fijo"}
                  </td>
                  <td className='border-r border-gray-300 px-4 py-2'>
                    {parseFloat(d.value.toString()).toFixed(2)}
                    {d.discountType === "percentage" ? "%" : " €"}
                  </td>
                  <td className='border-r border-gray-300 px-4 py-2'>
                    {d.minimumPrice
                      ? parseFloat(d.minimumPrice.toString()).toFixed(2) + " €"
                      : "N/A"}
                  </td>
                  <td className='border-r border-gray-300 px-4 py-2'>
                    {d.maxUses}
                  </td>
                  <td className='border-r border-gray-300 px-4 py-2'>
                    {d.timesUsed}
                  </td>
                  <td className='border-r border-gray-300 px-4 py-2'>
                    {formatDate(d.startDate)}
                  </td>
                  <td className='border-r border-gray-300 px-4 py-2'>
                    {formatDate(d.endDate)}
                  </td>
                  <td className='border-r border-gray-300 px-4 py-2'>
                    {d.notes || "N/A"}
                  </td>
                  <td className='border-r border-gray-300 px-4 py-2'>
                    {formatDate(d.createdAt)}
                  </td>
                  <td className='border-r border-gray-300 px-4 py-2'>
                    {formatDate(d.updatedAt)}
                  </td>
                  <td className='px-4 py-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleEdit(d)}>
                      Editar
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
