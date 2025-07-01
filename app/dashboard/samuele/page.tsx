'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import SchedaPaginaUno from '@/components/SchedaPaginaUno'; // questo importa le stat
import SchedaPaginaDue from '@/components/SchedaPaginaDue';// questo importa inv, monete, ecc.

import SchedaSaAl from '@/components/tastone'; // 👈 questo importa la scheda

export default function PaginaSamuele() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // se non sei loggato, ti rimanda al login
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




  