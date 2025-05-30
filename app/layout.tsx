// app/layout.tsx
import { UserProvider } from "./context/UserContext";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My App",
  description: "Descripción de mi app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='es'>
      <body>
        <ThemeProvider attribute='class' defaultTheme='light'>
          <UserProvider>{children}</UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
