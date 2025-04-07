import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const countries = [
  { code: "ES", name: "España" },
  { code: "US", name: "Estados Unidos" },
  { code: "FR", name: "Francia" },
  // Añade más países según sea necesario
]

export default function CountrySelect({ value, onChange }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Selecciona un país" />
      </SelectTrigger>
      <SelectContent>
        {countries.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            {country.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

