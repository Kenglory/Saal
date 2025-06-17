// File: app/dashboard/samuele/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import styles from './SchedaSaal.module.css';
import Image from 'next/image';
import saalImg from '@/public/saal.png'; // salva la tua immagine come public/saal.png

interface Stats {
  forza: number;
  destrezza: number;
  saggezza: number;
  costituzione: number;
  velocita: number;
  carisma: number;
  intelligenza: number;
}

interface InventorySlot {
  name: string;
  description: string;
}

interface CharacterData {
  name: string;
  level: number;
  currentHP: number;
  maxHP: number;
  focus: number;
  exp: number;
  karma: number;
  stats: Stats;
  inventory: InventorySlot[];
  culto: string;
  lingue: string;
  abilita: string[];
  monete: {
    platino: number;
    oro: number;
    argento: number;
    petali: number;
    biglie: number;
    extra1: number;
    extra2: number;
    extra3: number;
  };
}

const SchedaSaal = () => {
  const [character, setCharacter] = useState<CharacterData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'personaggi', 'saal');
      const snap = await getDoc(docRef);
      if (snap.exists()) setCharacter(snap.data() as CharacterData);
    };
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      {character ? (
        <div className={styles.sheet}>
          <div className={styles.header}>
            <Image src={saalImg} alt="Sa'Al" className={styles.portrait} />
            <div>
              <h1>{character.name}</h1>
              <motion.p animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5 }}>Livello: {character.level}</motion.p>
              <p>EXP: {character.exp} / 100</p>
              <p>Focus: {character.focus}</p>
              <p>Karma: {character.karma}</p>
            </div>
          </div>

          <div className={styles.statsBox}>
            <h2>Statistiche</h2>
            {Object.entries(character.stats).map(([key, val]) => (
              <p key={key}><strong>{key}:</strong> {val}</p>
            ))}
          </div>

          <div className={styles.inventoryBox}>
            <h2>Inventario</h2>
            {character.inventory.map((item, i) => (
              <div key={i} className={styles.itemSlot}>
                <p><strong>{item.name}</strong></p>
                <p>{item.description}</p>
              </div>
            ))}
          </div>

          <div className={styles.moneteBox}>
            <h2>Monete</h2>
            {Object.entries(character.monete).map(([k, v]) => (
              <p key={k}><strong>{k}:</strong> {v}</p>
            ))}
          </div>

          <div className={styles.extraBox}>
            <h2>Culto & Lingue</h2>
            <p><strong>Culto:</strong> {character.culto}</p>
            <p><strong>Lingue:</strong> {character.lingue}</p>
            <h3>Abilità</h3>
            {character.abilita.map((a, idx) => <p key={idx}>{a}</p>)}
          </div>
        </div>
      ) : (
        <p>Caricamento...</p>
      )}
    </div>
  );
};

export default SchedaSaal;
