import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
  stats: Stats;
  inventory: InventorySlot[];
}

const SchedaPersonaggio = () => {
  const [character, setCharacter] = useState<CharacterData>({
    name: "Sa'Al",
    level: 10,
    currentHP: 1200,
    maxHP: 1500,
    focus: 10,
    exp: 40,
    stats: {
      forza: 2,
      destrezza: 2,
      saggezza: 2,
      costituzione: 2,
      velocita: 1,
      carisma: 1,
      intelligenza: 2,
    },
    inventory: Array.from({ length: 30 }, () => ({ name: "", description: "" }))
  });

  const [statPointsAvailable, setStatPointsAvailable] = useState(0);
  const [expInput, setExpInput] = useState(0);
  const [hpInput, setHpInput] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setStatPointsAvailable(character.level);
  }, [character.level]);

  const handleStatChange = (key: keyof Stats, amount: number) => {
    if (amount > 0 && statPointsAvailable === 0) return;
    setCharacter((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [key]: Math.max(0, prev.stats[key] + amount),
      },
    }));
    setStatPointsAvailable((prev) => Math.max(0, prev - amount));
  };

  const confirmStats = () => {
    if (statPointsAvailable > 0) {
      setErrorMessage(`Devi ancora assegnare ${statPointsAvailable} punti statistica.`);
      return;
    }
    setErrorMessage("");
    alert("Statistiche confermate!");
  };

  const updateHP = (amount: number) => {
    setCharacter((prev) => ({
      ...prev,
      currentHP: Math.max(0, Math.min(prev.maxHP, prev.currentHP + amount))
    }));
  };

  const updateFocus = (amount: number) => {
    setCharacter((prev) => ({
      ...prev,
      focus: Math.max(0, prev.focus + amount)
    }));
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
    setCharacter((prev) => ({
      ...prev,
      exp: newExp,
      level: newLevel
    }));
    setExpInput(0);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl font-bold">{character.name}</h1>

      {/* Livello */}
      <motion.div
        className="text-2xl font-semibold"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.5 }}
        key={character.level}
      >
        Livello: {character.level}
      </motion.div>

      {/* HP */}
      <div>
        <p className="font-semibold">HP: {character.currentHP} / {character.maxHP}</p>
        <div className="w-full bg-gray-300 rounded h-4">
          <div
            className="bg-red-600 h-4 rounded"
            style={{ width: `${(character.currentHP / character.maxHP) * 100}%` }}
          />
        </div>
        <div className="flex gap-2 mt-2">
          <button onClick={() => updateHP(10)} className="px-2 py-1 bg-green-600 text-white">+</button>
          <button onClick={() => updateHP(-10)} className="px-2 py-1 bg-red-600 text-white">-</button>
          <input
            type="number"
            value={hpInput}
            onChange={(e) => setHpInput(Number(e.target.value))}
            className="border px-2"
          />
          <button onClick={() => updateHP(hpInput)} className="bg-blue-500 text-white px-2">Conferma</button>
        </div>
      </div>

      {/* Focus */}
      <div>
        <p className="font-semibold">Focus: {character.focus}</p>
        <div className="flex gap-2">
          <button onClick={() => updateFocus(1)} className="px-2 py-1 bg-green-600 text-white">+</button>
          <button onClick={() => updateFocus(-1)} className="px-2 py-1 bg-red-600 text-white">-</button>
        </div>
      </div>

      {/* Esperienza */}
      <div>
        <p className="font-semibold">EXP: {character.exp} / 100</p>
        <div className="w-full bg-white border rounded h-4">
          <motion.div
            className="bg-green-500 h-4 rounded"
            animate={{ width: `${character.exp}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex gap-2 mt-2">
          <input
            type="number"
            value={expInput}
            onChange={(e) => setExpInput(Number(e.target.value))}
            className="border px-2"
          />
          <button onClick={updateEXP} className="bg-blue-600 text-white px-3 py-1">Conferma</button>
        </div>
      </div>

      {/* Statistiche */}
      <div>
        <h2 className="text-xl font-semibold">Statistiche</h2>
        <p>Punti disponibili: {statPointsAvailable}</p>
        {Object.entries(character.stats).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="capitalize w-32">{key}:</span>
            <span>{value}</span>
            <button onClick={() => handleStatChange(key as keyof Stats, 1)} className="bg-green-500 px-2">+</button>
            <button onClick={() => handleStatChange(key as keyof Stats, -1)} className="bg-red-500 px-2">-</button>
          </div>
        ))}
        {statPointsAvailable > 0 && (
          <>
            <button onClick={confirmStats} className="mt-2 bg-yellow-500 px-4 py-1">
              Conferma Statistiche
            </button>
            {errorMessage && <p className="text-red-600 mt-1">{errorMessage}</p>}
          </>
        )}
      </div>

      {/* Inventario */}
      <div>
        <h2 className="text-xl font-semibold mt-6">Inventario</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-2">
          {character.inventory.map((slot, index) => (
            <div key={index} className="border p-2 rounded bg-white">
              <input
                type="text"
                placeholder="Oggetto"
                value={slot.name}
                onChange={(e) => {
                  const newInventory = [...character.inventory];
                  newInventory[index] = {
                    ...newInventory[index],
                    name: e.target.value
                  };
                  setCharacter({ ...character, inventory: newInventory });
                }}
                className="w-full border-b mb-1"
              />
              <textarea
                placeholder="Descrizione"
                value={slot.description}
                onChange={(e) => {
                  const newInventory = [...character.inventory];
                  newInventory[index] = {
                    ...newInventory[index],
                    description: e.target.value
                  };
                  setCharacter({ ...character, inventory: newInventory });
                }}
                className="w-full text-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchedaPersonaggio;
