import { Skeleton } from "@/components/ui/skeleton";
import { BackgroundBlobs } from "@/components/background-blobs";
import { Breadcrumb } from "@/components/breadcrumb";

export default function CertificatesLoading() {
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
        <Skeleton className='h-10 w-3/4 mx-auto mb-8' />
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <Skeleton className='h-[600px] rounded-lg' />
          <Skeleton className='h-[600px] rounded-lg' />
        </div>
      </div>
    </main>
  );
}
