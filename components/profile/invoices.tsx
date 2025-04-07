import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export default function Facturas() {
  const facturas = [
    { id: "F001", fecha: "15/03/2025", concepto: "Capítulo de libro", importe: "29.00€" },
    { id: "F002", fecha: "20/04/2025", concepto: "Libro completo", importe: "97.00€" },
    // Añade más facturas de ejemplo aquí
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Mis Facturas</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nº Factura</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Concepto</TableHead>
            <TableHead>Importe</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {facturas.map((factura) => (
            <TableRow key={factura.id}>
              <TableCell>{factura.id}</TableCell>
              <TableCell>{factura.fecha}</TableCell>
              <TableCell>{factura.concepto}</TableCell>
              <TableCell>{factura.importe}</TableCell>
              <TableCell>
                <Button variant="outline">Descargar PDF</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

