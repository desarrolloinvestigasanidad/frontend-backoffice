// app/layout.tsx
import "./globals.css";
import { ThemeProvider } from "next-themes";

export const metadata = {
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
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
