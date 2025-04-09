import { CertificateEditor } from "@/components/certificate-editor"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Plataforma Investiga Sanidad - Editor de Certificados</h1>
      <CertificateEditor />
    </main>
  )
}

