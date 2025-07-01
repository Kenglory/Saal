'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';

import SchedaPaginaUno from '@/components/SchedaPaginaUno';
import SchedaPaginaDue from '@/components/SchedaPaginaDue';
import { app } from '@/lib/firebase';

export default function PaginaScheda() {
  const [pagina, setPagina] = useState(1);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between p-4 max-w-5xl mx-auto">
      
      <div>
        {pagina === 1 ? <SchedaPaginaUno /> : <SchedaPaginaDue />}
      </div>

      {/* 🔘 Barra centrale di navigazione */}
      <div className="w-full flex justify-center mt-10 gap-4 border-t pt-6">
        <button
          onClick={() => setPagina(1)}
          className={`px-4 py-2 rounded-xl font-semibold transition ${
            pagina === 1 ? 'bg-black text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          ⬅️ Pagina 1
        </button>
        <button
          onClick={() => setPagina(2)}
          className={`px-4 py-2 rounded-xl font-semibold transition ${
            pagina === 2 ? 'bg-black text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Pagina 2 ➡️
        </button>
      </div>

      {/* 🌟 Bottone Logout in basso a destra */}
      <button
        onClick={handleLogout}
        className="fixed bottom-4 right-4 px-4 py-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition"
      >
        🚪 Logout
      </button>
    </div>
  );
}