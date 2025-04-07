import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Version {
  id: string
  date: string
  author: string
  changes: string
}

interface VersionHistoryProps {
  versions: Version[]
  onRevert: (versionId: string) => void
}

export function VersionHistory({ versions, onRevert }: VersionHistoryProps) {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)

  return (
    <div className="border rounded-md p-4">
      <h3 className="text-lg font-semibold mb-2">Historial de versiones</h3>
      <ScrollArea className="h-[200px]">
        {versions.map((version) => (
          <div
            key={version.id}
            className={`p-2 cursor-pointer ${selectedVersion === version.id ? "bg-secondary/10" : ""}`}
            onClick={() => setSelectedVersion(version.id)}
          >
            <p className="font-medium">{version.date}</p>
            <p className="text-sm text-gray-600">Autor: {version.author}</p>
            <p className="text-sm">{version.changes}</p>
          </div>
        ))}
      </ScrollArea>
      {selectedVersion && (
        <Button className="mt-4" onClick={() => onRevert(selectedVersion)}>
          Revertir a esta versión
        </Button>
      )}
    </div>
  )
}

