import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import MaintenanceWrapper from './MaintenanceWrapper';

export const metadata: Metadata = {
  title: 'Randy Grullon - Fullstack Developer Portfolio',
  description: 'Personal portfolio of Randy Grullon, Fullstack Developer.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
          <AuthProvider>
            <MaintenanceWrapper>
              {children}
            </MaintenanceWrapper>
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  );
}
