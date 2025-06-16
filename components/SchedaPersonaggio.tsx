import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
  const [expInput, setExpInput] = useState(0);
  const [hpInput, setHpInput] = useState(0);
  const [karmaInput, setKarmaInput] = useState(0);
  const [statPointsAvailable, setStatPointsAvailable] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCharacter = async () => {
      const docRef = doc(db, "personaggi", "saal");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as CharacterData;
        setCharacter(data);
        setStatPointsAvailable(data.level);
      }
    };
    fetchCharacter();
  }, []);

  const saveCharacter = async (updated: CharacterData) => {
    setCharacter(updated);
    await setDoc(doc(db, "personaggi", "saal"), updated);
  };

  const updateHP = (amount: number) => {
    if (!character) return;
    const updated = {
      ...character,
      currentHP: Math.max(0, Math.min(character.maxHP, character.currentHP + amount)),
    };
    saveCharacter(updated);
  };

  const updateFocus = (amount: number) => {
    if (!character) return;
    const updated = {
      ...character,
      focus: Math.max(0, character.focus + amount),
    };
    saveCharacter(updated);
  };

  const updateEXP = () => {
    if (!character) return;
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
    const updated = {
      ...character,
      exp: newExp,
      level: newLevel,
      focus: character.focus + 3 * (newLevel - character.level),
    };
    saveCharacter(updated);
    setExpInput(0);
    setStatPointsAvailable(newLevel);
  };

  const updateKarma = (amount: number) => {
    if (!character) return;
    const updated = {
      ...character,
      karma: Math.max(-10000, Math.min(10000, character.karma + amount)),
    };
    saveCharacter(updated);
  };

  const handleStatChange = (key: keyof Stats, amount: number) => {
    if (!character) return;
    if (amount > 0 && statPointsAvailable === 0) return;
    const updated = {
      ...character,
      stats: {
        ...character.stats,
        [key]: Math.max(0, character.stats[key] + amount),
      },
    };
    setStatPointsAvailable(prev => Math.max(0, prev - amount));
    saveCharacter(updated);
  };

  const confirmStats = () => {
    if (statPointsAvailable > 0) {
      setErrorMessage(`Devi assegnare ancora ${statPointsAvailable} punti.`);
      return;
    }
    setErrorMessage("");
  };

  const evocaBestia = () => {
    updateFocus(-4);
    alert("Cavalier Quiete è stato evocato!");
  };

  return (
    <div className="p-6 space-y-4">
      {character ? (
        <>
          <h1 className="text-3xl font-bold">{character.name}</h1>
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5 }}>
            Livello: {character.level}
          </motion.div>

          <div>
            <p>EXP: {character.exp} / 100</p>
            <input type="number" value={expInput} onChange={(e) => setExpInput(Number(e.target.value))} />
            <button onClick={updateEXP}>Aggiungi EXP</button>
          </div>

          <div>
            <p>Karma: {character.karma}</p>
            <button onClick={() => updateKarma(-10)}>-10</button>
            <button onClick={() => updateKarma(10)}>+10</button>
            <input type="number" onChange={(e) => setKarmaInput(Number(e.target.value))} />
            <button onClick={() => updateKarma(karmaInput)}>Conferma</button>
          </div>

          <div>
            <p>Focus: {character.focus}</p>
            <button onClick={() => updateFocus(1)}>+</button>
            <button onClick={() => updateFocus(-1)}>-</button>
            <button onClick={evocaBestia}>Evoca Bestia (-4)</button>
          </div>

          <div>
            <p>HP: {character.currentHP}/{character.maxHP}</p>
            <button onClick={() => updateHP(10)}>+10</button>
            <button onClick={() => updateHP(-10)}>-10</button>
            <input type="number" value={hpInput} onChange={(e) => setHpInput(Number(e.target.value))} />
            <button onClick={() => updateHP(hpInput)}>Conferma</button>
          </div>

          <div>
            <h2>Statistiche</h2>
            <p>Punti da assegnare: {statPointsAvailable}</p>
            {Object.entries(character.stats).map(([key, value]) => (
              <div key={key}>
                {key}: {value}
                <button onClick={() => handleStatChange(key as keyof Stats, 1)}>+</button>
                <button onClick={() => handleStatChange(key as keyof Stats, -1)}>-</button>
              </div>
            ))}
            {statPointsAvailable > 0 && (
              <button onClick={confirmStats}>Conferma Statistiche</button>
            )}
            {errorMessage && <p>{errorMessage}</p>}
          </div>

          <div>
            <h2>Inventario</h2>
            {character.inventory.map((slot, i) => (
              <div key={i}>
                <input
                  value={slot.name}
                  placeholder="Nome oggetto"
                  onChange={(e) => {
                    const updated = [...character.inventory];
                    updated[i].name = e.target.value;
                    saveCharacter({ ...character, inventory: updated });
                  }}
                />
                <textarea
                  value={slot.description}
                  placeholder="Descrizione"
                  onChange={(e) => {
                    const updated = [...character.inventory];
                    updated[i].description = e.target.value;
                    saveCharacter({ ...character, inventory: updated });
                  }}
                />
              </div>
            ))}
          </div>

          <div>
            <h2>Monete</h2>
            {Object.entries(character.monete).map(([key, value]) => (
              <div key={key}>
                {key}: {value}
                <button onClick={() => saveCharacter({
                  ...character,
                  monete: { ...character.monete, [key]: value + 1 }
                })}>+</button>
                <button onClick={() => saveCharacter({
                  ...character,
                  monete: { ...character.monete, [key]: value - 1 }
                })}>-</button>
              </div>
            ))}
          </div>

          <div>
            <h2>Culto & Lingue</h2>
            <textarea
              placeholder="Culto"
              value={character.culto}
              onChange={(e) => saveCharacter({ ...character, culto: e.target.value })}
            />
            <textarea
              placeholder="Lingue"
              value={character.lingue}
              onChange={(e) => saveCharacter({ ...character, lingue: e.target.value })}
            />
          </div>

          <div>
            <h2>Abilità</h2>
            {character.abilita.map((ab, idx) => (
              <input
                key={idx}
                value={ab}
                onChange={(e) => {
                  const newAb = [...character.abilita];
                  newAb[idx] = e.target.value;
                  saveCharacter({ ...character, abilita: newAb });
                }}
              />
            ))}
            <button onClick={() => saveCharacter({ ...character, abilita: [...character.abilita, ""] })}>
              Aggiungi nuova abilità
            </button>
          </div>
        </>
      ) : (
        <p>Caricamento...</p>
      )}
    </div>
  );
};

export default SchedaSaal;