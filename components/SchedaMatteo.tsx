import { useState } from "react";
import { motion } from "framer-motion";
interface InventorySlot {
name: string;
description: string;
}
  interface MatteoData {
currentHP: number;
maxHP: number;
focus: number;
exp: number;
inventory: InventorySlot[];
}

const SchedaMatteo = () => {

    const [data, setData] = useState<MatteoData>({
currentHP: 800,
maxHP: 1000,
focus: 5,
exp: 30,
inventory: Array.from({ length: 30 }, () => ({ name: '', description: '' })),
});
const [hpInput, setHpInput] = useState(0);
const [expInput, setExpInput] = useState(0);
const updateHP = (amount: number) => {
setData(prev => ({
...prev,
currentHP: Math.max(0, Math.min(prev.maxHP, prev.currentHP + amount))
}));
};
const updateFocus = (amount: number) => {
setData(prev => ({
...prev,
focus: Math.max(0, prev.focus + amount)
}));
};
const updateEXP = () => {
let newExp = data.exp + expInput;
newExp = Math.max(0, newExp);
setData(prev => ({
...prev,
exp: newExp
}));
setExpInput(0);
};
return (
  <div className="p-6 space-y-6">
    <h1 className="text-4xl font-bold">Matteo</h1>

    {/* HP */}
    <div>
      <p className="font-semibold">HP: {data.currentHP} / {data.maxHP}</p>
      <div className="w-full bg-gray-300 rounded h-4">
        <div
          className="bg-red-600 h-4 rounded"
          style={{ width: `${(data.currentHP / data.maxHP) * 100}%` }}
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
      <p className="font-semibold">Focus: {data.focus}</p>
      <div className="flex gap-2">
        <button onClick={() => updateFocus(1)} className="px-2 py-1 bg-green-600 text-white">+</button>
        <button onClick={() => updateFocus(-1)} className="px-2 py-1 bg-red-600 text-white">-</button>
      </div>
    </div>

    {/* Esperienza */}
    <div>
      <p className="font-semibold">EXP: {data.exp}</p>
      <div className="w-full bg-white border rounded h-4">
        <motion.div
          className="bg-green-500 h-4 rounded"
          animate={{ width: `${data.exp}%` }}
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

    {/* Inventario */}
    <div>
      <h2 className="text-xl font-semibold mt-6">Inventario</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-2">
        {data.inventory.map((slot, index) => (
          <div key={index} className="border p-2 rounded bg-white">
            <input
              type="text"
              placeholder="Oggetto"
              value={slot.name}
              onChange={(e) => {
                const newInventory = [...data.inventory];
                newInventory[index].name = e.target.value;
                setData({ ...data, inventory: newInventory });
              }}
              className="w-full border-b mb-1"
            />
            <textarea
              placeholder="Descrizione"
              value={slot.description}
              onChange={(e) => {
                const newInventory = [...data.inventory];
                newInventory[index].description = e.target.value;
                setData({ ...data, inventory: newInventory });
              }}
              className="w-full text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  </div>
)};

export default SchedaMatteo;