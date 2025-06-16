import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

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
  gold: {
    platino: number;
    oro: number;
    argento: number;
    petali: number;
    biglie: number;
    extra1: number;
    extra2: number;
    extra3: number;
  };
  culture: string;
  languages: string;
  abilities: string[];
}

const SchedaPersonaggio = () => {
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [statPointsAvailable, setStatPointsAvailable] = useState(0);
  const [expInput, setExpInput] = useState(0);
  const [hpInput, setHpInput] = useState(0);
  const [karmaInput, setKarmaInput] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCharacter = async () => {
      const docRef = doc(db, "personaggi", "saal");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCharacter(docSnap.data() as CharacterData);
      } else {
        console.log("Nessun documento trovato!");
      }
    };

    fetchCharacter();
  }, []);

  useEffect(() => {
    if (character) {
      setStatPointsAvailable(character.level);
    }
  }, [character?.level]);

  if (!character) return <p>Caricamento...</p>;

  const handleStatChange = (key: keyof Stats, amount: number) => {
    if (amount > 0 && statPointsAvailable === 0) return;
    setCharacter((prev) =>
      prev
        ? {
            ...prev,
            stats: {
              ...prev.stats,
              [key]: Math.max(0, prev.stats[key] + amount),
            },
          }
        : null
    );
    setStatPointsAvailable((prev) => Math.max(0, prev - amount));
  };

  const confirmStats = () => {
    if (statPointsAvailable > 0) {
      setErrorMessage(`Devi ancora assegnare ${statPointsAvailable} punti.`);
      return;
    }
    setErrorMessage("");
    alert("Statistiche confermate!");
  };

  const updateHP = (amount: number) => {
    setCharacter((prev) =>
      prev
        ? {
            ...prev,
            currentHP: Math.max(0, Math.min(prev.maxHP, prev.currentHP + amount)),
          }
        : null
    );
  };

  const updateFocus = (amount: number) => {
    setCharacter((prev) =>
      prev
        ? {
            ...prev,
            focus: Math.max(0, prev.focus + amount),
          }
        : null
    );
  };

  const useBeast = () => {
    updateFocus(-4);
  };

  const updateEXP = () => {
    let newExp = character.exp + expInput;
    let newLevel = character.level;
    while (newExp >= 100) {
      newExp -= 100;
      newLevel++;
    }
    while (newExp < 0 && newLevel > 1) {
      newLevel--;
      newExp += 100;
    }
    setCharacter((prev) =>
      prev
        ? {
            ...prev,
            exp: newExp,
            level: newLevel,
          }
        : null
    );
    setExpInput(0);
  };

  const updateKarma = (amount: number) => {
    setCharacter((prev) =>
      prev
        ? {
            ...prev,
            karma: Math.max(-10000, Math.min(10000, prev.karma + amount)),
          }
        : null
    );
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-3xl font-bold">{character.name}</h1>
      <p>Livello: {character.level}</p>
      <motion.div animate={{ width: `${character.exp}%` }} className="bg-green-500 h-2 rounded" />

      <div className="flex gap-2">
        <button onClick={() => updateEXP()} className="bg-blue-500 px-2 text-white">Conferma EXP</button>
        <input type="number" value={expInput} onChange={(e) => setExpInput(Number(e.target.value))} className="border px-1" />
      </div>

      <div>
        <p>HP: {character.currentHP} / {character.maxHP}</p>
        <button onClick={() => updateHP(10)}>+10</button>
        <button onClick={() => updateHP(-10)}>-10</button>
        <input type="number" value={hpInput} onChange={(e) => setHpInput(Number(e.target.value))} />
        <button onClick={() => updateHP(hpInput)}>Conferma</button>
      </div>

      <div>
        <p>Focus: {character.focus}</p>
        <button onClick={() => updateFocus(1)}>+</button>
        <button onClick={() => updateFocus(-1)}>-</button>
        <button onClick={useBeast}>Usa Bestia (-4)</button>
      </div>

      <div>
        <p>Karma: {character.karma}</p>
        <button onClick={() => updateKarma(10)}>+10</button>
        <button onClick={() => updateKarma(-10)}>-10</button>
        <input type="number" value={karmaInput} onChange={(e) => setKarmaInput(Number(e.target.value))} />
        <button onClick={() => updateKarma(karmaInput)}>Conferma</button>
      </div>

      <div>
        <h2>Statistiche</h2>
        <p>Punti disponibili: {statPointsAvailable}</p>
        {Object.entries(character.stats).map(([key, value]) => (
          <div key={key} className="flex gap-2">
            <span>{key}:</span>
            <span>{value}</span>
            <button onClick={() => handleStatChange(key as keyof Stats, 1)}>+</button>
            <button onClick={() => handleStatChange(key as keyof Stats, -1)}>-</button>
          </div>
        ))}
        {statPointsAvailable > 0 && (
          <>
            <button onClick={confirmStats} className="bg-yellow-400 px-2 py-1">Conferma</button>
            <p className="text-red-500">{errorMessage}</p>
          </>
        )}
      </div>

      <div>
        <h2>Inventario</h2>
        <div className="grid grid-cols-3 gap-2">
          {character.inventory.map((slot, i) => (
            <div key={i}>
              <input type="text" value={slot.name} onChange={(e) => {
                const updated = [...character.inventory];
                updated[i].name = e.target.value;
                setCharacter({ ...character, inventory: updated });
              }} />
              <textarea value={slot.description} onChange={(e) => {
                const updated = [...character.inventory];
                updated[i].description = e.target.value;
                setCharacter({ ...character, inventory: updated });
              }} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2>Monete</h2>
        {Object.entries(character.gold).map(([key, value]) => (
          <div key={key} className="flex gap-2">
            <span>{key}:</span>
            <span>{value}</span>
          </div>
        ))}
      </div>

      <div>
        <h2>Culto</h2>
        <textarea value={character.culture} readOnly className="w-full border" />
      </div>

      <div>
        <h2>Lingue</h2>
        <textarea value={character.languages} readOnly className="w-full border" />
      </div>

      <div>
        <h2>Abilità / Incantesimi</h2>
        {character.abilities.map((a, i) => (
          <input key={i} value={a} readOnly className="w-full border my-1" />
        ))}
      </div>
    </div>
  );
};

export default SchedaPersonaggio;
