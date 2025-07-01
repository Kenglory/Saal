'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import SchedaPaginaUno from '@/components/SchedaPaginaUno'; 

export default function PaginaSamuele() {
  const { user, loading } = useAuth();
  const router = useRouter();

 
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="p-4">Caricamento...</div>;
  }

  // se sei loggato → mostra la scheda
  return <SchedaPaginaUno />;
}




  