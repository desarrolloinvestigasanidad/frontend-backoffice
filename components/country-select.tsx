import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const countries = [
  { code: "ES", name: "España" },
  { code: "US", name: "Estados Unidos" },
  { code: "FR", name: "Francia" },
  // Añade más países según sea necesario
];

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CountrySelect({ value, onChange }: CountrySelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder='Selecciona un país' />
      </SelectTrigger>
      <SelectContent>
        {countries.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            {country.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
