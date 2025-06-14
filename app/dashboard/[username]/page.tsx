'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PlayerDashboard() {
  const { username } = useParams();
  const [character, setCharacter] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/users');
      const users = await res.json();
      const user = users.find((u: any) => u.username === username);
      setCharacter(user);
    };
    fetchData();
  }, [username]);

  if (!character) {
    return <p className="p-4">Caricamento scheda in corso...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Benvenuto, {character.characterName}!</h1>
      <p className="text-lg">Questa sarà la tua scheda personale di D&D.</p>

      <div className="mt-6 border-t pt-4">
        <p className="text-sm text-gray-500">Nome utente: {character.username}</p>
      </div>
    </div>
  );
}