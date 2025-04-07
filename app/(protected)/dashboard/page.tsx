// app/(protected)/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <section className='space-y-4'>
      <h1 className='text-2xl font-bold text-gray-800'>Dashboard</h1>
      <p className='text-gray-600'>
        Bienvenido al panel de administración. Selecciona una opción en el menú
        lateral para comenzar.
      </p>
    </section>
  );
}
