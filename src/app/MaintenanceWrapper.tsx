'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SettingsData } from '@/lib/types';
import Maintenance from './maintenance/page';

interface MaintenanceWrapperProps {
  children: React.ReactNode;
}

export default function MaintenanceWrapper({ children }: MaintenanceWrapperProps) {
  const [isMaintenance, setIsMaintenance] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
        if (settingsDoc.exists()) {
          const settings = settingsDoc.data() as SettingsData;
          setIsMaintenance(settings.maintenanceMode);
        } else {
          setIsMaintenance(false); // Default to false if no settings
        }
      } catch (error) {
        console.error('Error checking maintenance mode:', error);
        setIsMaintenance(false); // Default to false on error
      } finally {
        setLoading(false);
      }
    };

    checkMaintenance();
  }, []);

  // Skip maintenance check for admin pages
  if (pathname?.startsWith('/admin')) {
    return <>{children}</>;
  }

  if (loading) {
    // Show loading while checking
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Cargando...</div>
      </div>
    );
  }

  if (isMaintenance) {
    return <Maintenance />;
  }

  return <>{children}</>;
}