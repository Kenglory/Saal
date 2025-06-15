'use client';

import { useEffect, useState } from 'react'; 
import { useRouter } from 'next/navigation';

interface SaalStats { 
    characterName: string; 
    currentHP: number; 
    maxHP: number; 
    focus: number; 
    actionsLeft: number; 
    form: 'base' | 'aurea'; 
}

const defaultStats: SaalStats = { 
    characterName: 'SaAl' ,
    currentHP: 1200, 
    maxHP: 1500, 
    focus: 10,
    actionsLeft: 10, 
    form: 'aurea', 
};

export default function SaalDashboard() { 
    const [stats, setStats] = useState<SaalStats>(defaultStats); 
    const router = useRouter();

const handleLogout = () => { 
    localStorage.removeItem('user'); 
    router.push('/login'); 
};

const weapons = [ 
    'Cannone Aureo', 
    'Katar x2', 
    'Macuahuitl', 
    'Bolas', 
    'Chakram Aurei', 
    'Zhanmadao', 
    'Shotel', 
    'Lunga Urumi', 
    'Mambele', 
    'Zweihänder Aurea', 
];

return ( <div className="p-8 min-h-screen bg-gray-100 flex flex-col items-center"> 
<h1 className="text-4xl font-bold mb-4">Scheda di {stats.characterName}</h1>

<div className="bg-white shadow rounded p-6 w-full max-w-xl">
    <p className="mb-2"><strong>Forma:</strong> {stats.form}</p>
    <p className="mb-2"><strong>Vita:</strong> {stats.currentHP} / {stats.maxHP}</p>
    <p className="mb-2"><strong>Focus:</strong> {stats.focus}</p>
    <p className="mb-4"><strong>Azioni auree rimaste:</strong> {stats.actionsLeft}</p>

    <h2 className="text-2xl font-semibold mt-4 mb-2">Armi attivabili:</h2>
    <ul className="list-disc list-inside">
      {weapons.map((weapon, index) => (
        <li key={index}>{weapon}</li>
      ))}
    </ul>

    <button
      onClick={handleLogout}
      className="mt-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  </div>
</div>

); }