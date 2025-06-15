'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import SchedaPersonaggio from '@/components/SchedaPersonaggio';
interface User {
  username: string;
  password: string;
  characterName: string;
}

export default function PlayerDashboard() {
  const { username } = useParams();
  const [character, setCharacter] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/users');
      const users: User[] = await res.json();
      const user = users.find((u) => u.username === username);
      setCharacter(user ?? null);
    };
    fetchData();
  }, [username]);

  if (!character) {
    return <p className="p-4">Caricamento scheda in corso...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Benvenuto, {character.characterName}!</h1>
      <p className="text-lg mb-4">Questa sarà la tua scheda personale di D&D.</p>
      <SchedaPersonaggio />
    </div>
  );
}