'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from 'lucide-react';

export default function Maintenance() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Wrench className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <CardTitle className="text-2xl mb-2">Sitio en mantenimiento</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Estamos realizando mejoras en el sitio. Volveremos pronto.
          </p>
          <p className="text-sm text-muted-foreground">
            Gracias por tu paciencia.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}