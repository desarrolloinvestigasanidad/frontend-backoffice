import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SearchBar({ placeholder = "Buscar...", onSearch }) {
  return (
    <div className="relative">
      <Input type="text" placeholder={placeholder} onChange={(e) => onSearch(e.target.value)} className="pl-10" />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
    </div>
  )
}

