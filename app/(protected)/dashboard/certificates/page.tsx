import { CertificateEditor } from "@/components/certificate-editor";
import { BackgroundBlobs } from "@/components/background-blobs";
import { Breadcrumb } from "@/components/breadcrumb";

export default function CertificatesPage() {
  return (
    <main className='relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'>
      <BackgroundBlobs />
      <div className='container mx-auto py-8 px-4 relative z-10'>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Certificados", href: "/dashboard/certificates" },
          ]}
        />
        <h1 className='text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400'>
          Editor de Certificados
        </h1>
        <CertificateEditor />
      </div>
    </main>
  );
}
