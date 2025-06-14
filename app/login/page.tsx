'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const res = await fetch('/api/users');
    const users = await res.json();

    const user = users.find(
      (u: any) => u.username === username && u.password === password
    );

    if (user) {
      router.push(`/dashboard/${user.username}`);
    } else {
      setError('Nome utente o password errati!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Login Campagna D&D</h1>
      <input
        type="text"
        placeholder="Nome utente"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mb-3 p-2 border border-gray-300 rounded w-64"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-64"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
      >
        Entra
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}