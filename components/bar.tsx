'use client';

import { useState, useEffect } from 'react';

interface BarProps {
  tipo: 'hp' | 'focus' | 'exp' | 'karma';
  attuale: number;
  massimo: number;
  setAttuale?: (val: number) => void;
  setMassimo?: (val: number) => void;
  salvaBar?: (campo: string, valore: number) => void;
}

export default function Bar({
  tipo,
  attuale,
  massimo,
  setAttuale,
  setMassimo,
  salvaBar
}: BarProps) {
  const [valAtt, setValAtt] = useState(attuale);
  const [valMax, setValMax] = useState(massimo);

  useEffect(() => {
    setValAtt(attuale);
    setValMax(massimo);
  }, [attuale, massimo]);

  const percentuale = Math.max(0, Math.min((attuale / massimo) * 100, 100));

  const etichette: Record<BarProps["tipo"], string> = {
    hp: '❤️ HP',
    focus: '🧘‍♂️ Focus',
    exp: '⭐️ EXP',
    karma: '☯️ Karma',
  };

  const colori: Record<BarProps["tipo"], string> = {
    hp: 'bg-red-500',
    focus: 'bg-blue-500',
    exp: 'bg-green-500',
    karma: 'bg-purple-500',
  };

  const confermaAtt = () => {
    if (setAttuale) {
      setAttuale(valAtt);
    }
    if (salvaBar) {
      salvaBar(tipo, valAtt);
    }
  };

  const confermaMax = () => {
    if (setMassimo) {
      setMassimo(valMax);
    }
    if (salvaBar) {
      salvaBar(`${tipo}Max`, valMax);
    }
  };

  return (
    <div className="mb-8 space-y-2 p-4 rounded-xl border shadow bg-white">
      {/* Titolo e valori */}
      <div className="flex justify-between items-center text-base font-bold">
        <span>{etichette[tipo]}</span>
        <span className="text-gray-800">
          {attuale} / {massimo}
        </span>
      </div>

      {/* Barra colorata */}
      <div className="relative h-6 bg-gray-300 rounded-full overflow-hidden">
        <div
          className={`${colori[tipo]} h-full transition-all duration-500`}
          style={{ width: `${percentuale}%` }}
        />
      </div>

      {/* Input per modificare */}
      <div className="flex justify-between gap-4 mt-2">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-700">Attuale:</label>
          <input
            type="number"
            value={valAtt}
            onChange={(e) => setValAtt(Number(e.target.value))}
            className="w-20 px-2 py-1 border rounded shadow-sm text-center"
          />
          <button
            onClick={confermaAtt}
            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            ✅
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-700">Massimo:</label>
          <input
            type="number"
            value={valMax}
            onChange={(e) => setValMax(Number(e.target.value))}
            className="w-20 px-2 py-1 border rounded shadow-sm text-center"
          />
          <button
            onClick={confermaMax}
            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            ✅
          </button>
        </div>
      </div>
    </div>
  );
}