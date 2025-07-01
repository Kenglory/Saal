'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface BarProps {
  tipo: 'hp' | 'focus' | 'exp' | 'karma';
  attuale: number;
  massimo: number;
  setAttuale?: (val: number) => void;
  setMassimo?: (val: number) => void;
  modificabile?: boolean;
}

export default function Bar({
  tipo,
  attuale,
  massimo,
  setAttuale,
  setMassimo,
  modificabile = true,
}: BarProps) {
  const [colpito, setColpito] = useState(false);
  const [valoreAttuale, setValoreAttuale] = useState(attuale);
  const [valoreMassimo, setValoreMassimo] = useState(massimo);
  const [puntiDisponibili, setPuntiDisponibili] = useState(0);

  useEffect(() => {
    setValoreAttuale(attuale);
    setValoreMassimo(massimo);
  }, [attuale, massimo]);

  const handleHit = () => {
    setColpito(true);
    setTimeout(() => setColpito(false), 1000);
  };

  const handleConfirm = (target: 'attuale' | 'massimo') => {
    if (target === 'attuale' && setAttuale) setAttuale(valoreAttuale);
    if (target === 'massimo' && setMassimo) setMassimo(valoreMassimo);
    handleHit();
  };

  const coloreBase = {
    hp: 'bg-red-500',
    focus: 'bg-blue-500',
    exp: 'bg-green-500',
    karma: 'bg-purple-500',
  };

  const coloreHit = {
    hp: 'bg-red-800',
    focus: 'bg-blue-900',
    exp: 'bg-green-800',
    karma: 'bg-purple-900',
  };

  const percentuale = Math.max(0, Math.min((attuale / massimo) * 100, 100));

  return (
    <div className="mb-6 space-y-1">
      <div className="flex justify-between text-sm font-semibold">
        <span className="capitalize">{tipo}</span>
        <span className="text-gray-700">{attuale} / {massimo}</span>
      </div>

      <div className="w-full h-3 bg-gray-300 rounded overflow-hidden">
        <motion.div
          initial={false}
          animate={{
            width: `${percentuale}%`,
            scale: colpito ? 1.05 : 1,
            boxShadow: colpito ? '0px 0px 8px rgba(255, 0, 0, 0.6)' : 'none',
            x: colpito ? [0, -4, 4, -2, 2, 0] : 0,
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={clsx(
            'h-full transition-all duration-300',
            colpito ? coloreHit[tipo] : coloreBase[tipo]
          )}
        />
      </div>

      <div className="flex justify-between text-xs mt-1 gap-2">
        <div className="flex gap-1 items-center">
          <input
            type="number"
            value={valoreAttuale}
            onChange={(e) => setValoreAttuale(Number(e.target.value))}
            disabled={!modificabile}
            className="w-16 px-2 py-1 border border-gray-400 rounded text-center"
          />
          <button
            onClick={() => handleConfirm('attuale')}
            disabled={!modificabile}
            className="px-2 py-1 bg-green-500 text-white rounded"
          >
            ✅
          </button>
        </div>

        <div className="flex gap-1 items-center">
          <input
            type="number"
            value={valoreMassimo}
            onChange={(e) => setValoreMassimo(Number(e.target.value))}
            disabled={!modificabile}
            className="w-16 px-2 py-1 border border-gray-400 rounded text-center"
          />
          <button
            onClick={() => handleConfirm('massimo')}
            disabled={!modificabile}
            className="px-2 py-1 bg-green-500 text-white rounded"
          >
            ✅
          </button>
        </div>
      </div>
    </div>
  );
}