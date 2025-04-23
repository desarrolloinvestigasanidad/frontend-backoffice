export function BackgroundBlobs() {
  return (
    <div className='absolute inset-0 z-0'>
      <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 to-white'></div>
      <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
      <div className='absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
    </div>
  );
}
