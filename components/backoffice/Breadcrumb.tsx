// components/Breadcrumb.tsx
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label='breadcrumb' className='mb-4'>
      <ol className='flex space-x-2 text-sm text-gray-600'>
        {items.map((item, index) => (
          <li key={index} className='flex items-center'>
            {item.href ? (
              <Link href={item.href} className='hover:text-gray-800'>
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
            {index < items.length - 1 && <span className='mx-2'>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
