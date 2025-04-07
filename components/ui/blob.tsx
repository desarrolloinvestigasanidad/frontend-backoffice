export default function Blob() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
      {/* Blob 1 - Purple */}
      <div className="absolute animate-blob opacity-70 blur-2xl bg-primary/30 w-72 h-72 rounded-full -translate-x-4 translate-y-4" />

      {/* Blob 2 - Orange */}
      <div className="absolute animate-blob animation-delay-2000 opacity-70 blur-2xl bg-secondary/30 w-72 h-72 rounded-full translate-x-4 -translate-y-4" />
    </div>
  )
}

