'use client';

import { useEffect, useState } from 'react'; import { useRouter } from 'next/navigation';

interface User { username: string; password: string; characterName: string; }

export default function HomePage() { const [user, setUser] = useState<User | null>(null); const router = useRouter();

useEffect(() => { const stored = localStorage.getItem('user'); if (stored) { setUser(JSON.parse(stored)); } }, []);

const handleLogout = () => { localStorage.removeItem('user'); router.push('/login'); };

return ( <div className="flex flex-col items-center justify-center h-screen p-4"> <h1 className="text-3xl font-bold mb-6"> {user ? 'Benvenuto, ${user.characterName}!' : 'Benvenuto nella Campagna D&D'} </h1>

{user && (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={() => router.push('/dashboard/${user.username}')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
      >
        Vai alla tua scheda
      </button>

      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
      >
        Logout
      </button>
    </div>
  )}
</div>

); }