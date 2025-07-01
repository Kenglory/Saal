'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Se vuoi reindirizzare automaticamente al login, decommenta la riga qui sotto:
    // router.push('/login');
  }, [router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black px-4">
      <h1 className="text-4xl font-bold mb-4">✨ Benvenuto nell&apos;app di Cronache Di Dusius ✨</h1>
      <p className="text-lg mb-6 text-center">
        Da qui puoi accedere alla tua scheda giocatore o forse...non te lo dico dai
      </p>
      <button
        onClick={() => router.push('/login')}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        🔐 Accedi con Google
      </button>
    </main>
  );
}