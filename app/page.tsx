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
      const parsed: User = JSON.parse(stored);
      setUser(parsed);
      console.log('👤 Utente loggato:', parsed.characterName);
    } else {
      console.log('🕵 Nessun utente trovato nel localStorage');
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  if (loading) return null;
  
  const handleGoToSheet = () => {
  if (user && user.username) {
    router.push(`/dashboard/${user.username}`);
  }
};

  return (
  <div className="flex flex-col items-center justify-center h-screen space-y-4">
    {user && (
      <>
        <h1 className="text-3xl font-bold">Benvenuto, {user.characterName}!</h1>
        <button onClick={handleGoToSheet} className="bg-blue-600 text-white px-4 py-2 rounded">
          Vai alla tua scheda
        </button>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </>
    )}
  </div>
);
       
      (
        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Accedi
        </button>
      )}
    
  

