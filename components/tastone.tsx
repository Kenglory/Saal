'use client';

import { useState } from 'react';
import SchedaPaginaUno from '@/components/SchedaPaginaUno';
import SchedaPaginaDue from '@/components/SchedaPaginaDue';

export default function Scheda() {
  const [pagina, setPagina] = useState(1);

  return (
    <div className="relative">
      {/* 🔀 Pulsanti di switch */}
      <div className="fixed top-1/2 left-2 z-50">
        {pagina === 2 && (
          <button onClick={() => setPagina(1)} className="text-2xl p-2 bg-gray-200 rounded-full shadow">
            ⬅
          </button>
        )}
      </div>

      <div className="fixed top-1/2 right-2 z-50">
        {pagina === 1 && (
          <button onClick={() => setPagina(2)} className="text-2xl p-2 bg-gray-200 rounded-full shadow">
            ➡
          </button>
        )}
      </div>

      {/* 📄 Pagina attuale */}
      <div className="p-4">
        {pagina === 1 ? <SchedaPaginaUno /> : <SchedaPaginaDue />}
      </div>
    </div>
  );
}