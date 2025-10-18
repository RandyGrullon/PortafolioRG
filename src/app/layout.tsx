import type {Metadata} from 'next';
import './globals.css';
import { Space_Grotesk } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import MaintenanceWrapper from './MaintenanceWrapper';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'Randy Grullon - Fullstack Developer Portfolio',
  description: 'Personal portfolio of Randy Grullon, Fullstack Developer.',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={spaceGrotesk.variable}>
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
