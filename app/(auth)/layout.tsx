import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} overflow-hidden`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange>
          <main className='h-screen w-screen overflow-auto'>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
