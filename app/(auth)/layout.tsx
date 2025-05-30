import type React from "react";
import type { Metadata } from "next";

import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { RedirectIfAuthenticated } from "@/components/auth/RedirectIfAuthenticated";

export const metadata: Metadata = {
  title: "Investiga Sanidad - Autenticación",
  description: "Portal de autenticación de Investiga Sanidad",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='es' suppressHydrationWarning>
      <body className={` overflow-hidden`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange>
          <main className='h-screen w-screen overflow-auto'>
            <RedirectIfAuthenticated>{children}</RedirectIfAuthenticated>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
