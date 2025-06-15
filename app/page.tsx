'use client';

import { useEffect, useState } from 'react';

interface User {
  username: string;
  password: string;
  characterName: string;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    location.reload(); // oppure router.push('/login')
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">
        {user ? 'Benvenuto, ${user.characterName}!' : 'Benvenuto!'}
      </h1>

      {user && (
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      )}
    </div>
  );
}