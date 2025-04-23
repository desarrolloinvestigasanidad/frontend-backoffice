import { BackgroundBlobs } from "@/components/background-blobs";
import { BookOpen } from "lucide-react";

export default function Loading() {
  return (
    <div className='relative overflow-hidden min-h-screen py-8'>
      <BackgroundBlobs />
      <div className='container mx-auto px-4 relative z-10'>
        <div className='flex items-center justify-center h-64'>
          <div className='relative'>
            <div className='h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin'></div>
            <div className='absolute inset-0 flex items-center justify-center'>
              <BookOpen className='h-6 w-6 text-purple-500' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
