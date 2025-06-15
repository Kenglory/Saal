'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  username: string;
  password: string;
  characterName: string;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      console.log('✅ Utente loggato:', parsed.characterName);
    } else {
      console.log('⚠️ Nessun utente trovato nel localStorage');
    }
    setLoading(false);
  }, []);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

    const handleGoToSheet = () => {
  if (user?.username === 'samuele') {
    router.push('/dashboard/samuele');
  } else if (user?.username === 'matteo') {
    router.push('/dashboard/matteo');
  } else {
    alert('Utente non riconosciuto');
  }
};
  

  if (loading) return <p className="p-8 text-lg">Caricamento in corso...</p>;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center space-y-4">
        <p className="text-xl text-red-500">Nessun utente trovato. Effettua il login per continuare.</p>
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Torna al login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-3xl font-bold">Benvenuto, {user.characterName}!</h1>
      <button
        onClick={handleGoToSheet}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Vai alla tua scheda
      </button>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
  

