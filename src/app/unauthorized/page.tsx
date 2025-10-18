'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX } from 'lucide-react';

export default function Unauthorized() {
  const router = useRouter();

  useEffect(() => {
    // Optional: Log unauthorized access
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <ShieldX className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-2xl mb-2">Acceso no autorizado</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            No tienes permisos para acceder a esta página.
          </p>
          <div className="space-x-2">
            <Button onClick={() => router.back()} variant="outline">
              Volver atrás
            </Button>
            <Button onClick={() => router.push('/')}>
              Ir al inicio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}