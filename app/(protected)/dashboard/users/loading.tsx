import { RefreshCw } from "lucide-react";
import { BackgroundBlobs } from "@/components/background-blobs";

export default function Loading() {
  return (
    <div className='relative min-h-screen flex items-center justify-center'>
      <BackgroundBlobs />
      <div className='relative z-10 text-center space-y-4'>
        <RefreshCw className='animate-spin h-10 w-10 mx-auto text-purple-600' />
        <p className='text-lg font-medium'>
          Cargando usuarios administradores...
        </p>
      </div>
    </div>
  );
}
