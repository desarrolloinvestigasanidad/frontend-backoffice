// app/layout.tsx
import { UserProvider } from "./context/UserContext";
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
          <main>
            <UserProvider>{children}</UserProvider>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
