'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Optional: Log the 404 or send to analytics
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-6xl font-bold text-muted-foreground mb-4">404</CardTitle>
          <CardTitle className="text-2xl mb-2">Página no encontrada</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Lo sentimos, la página que buscas no existe.
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