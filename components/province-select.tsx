import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const provinces = {
  Andalucía: ["Almería", "Cádiz", "Córdoba", "Granada", "Huelva", "Jaén", "Málaga", "Sevilla"],
  Aragón: ["Huesca", "Teruel", "Zaragoza"],
  Asturias: ["Asturias"],
  Baleares: ["Islas Baleares"],
  Canarias: ["Las Palmas", "Santa Cruz de Tenerife"],
  Cantabria: ["Cantabria"],
  "Castilla-La Mancha": ["Albacete", "Ciudad Real", "Cuenca", "Guadalajara", "Toledo"],
  "Castilla y León": ["Ávila", "Burgos", "León", "Palencia", "Salamanca", "Segovia", "Soria", "Valladolid", "Zamora"],
  Cataluña: ["Barcelona", "Girona", "Lleida", "Tarragona"],
  "Comunidad Valenciana": ["Alicante", "Castellón", "Valencia"],
  Extremadura: ["Badajoz", "Cáceres"],
  Galicia: ["A Coruña", "Lugo", "Ourense", "Pontevedra"],
  "La Rioja": ["La Rioja"],
  Madrid: ["Madrid"],
  Murcia: ["Murcia"],
  Navarra: ["Navarra"],
  "País Vasco": ["Álava", "Guipúzcoa", "Vizcaya"],
}

export default function ProvinceSelect({ region }) {
  const regionProvinces = provinces[region] || []

  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Selecciona una provincia" />
      </SelectTrigger>
      <SelectContent>
        {regionProvinces.map((province) => (
          <SelectItem key={province} value={province}>
            {province}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

