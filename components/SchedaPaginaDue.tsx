'use client';

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

interface Riga {
  titolo: string;
  descrizione: string;
}

export default function SchedaPaginaDue() {
  const { user } = useAuth();
  const uid = user?.uid;

  const [confermaSalvataggio, setConfermaSalvataggio] = useState("");

  const [abilita, setAbilita] = useState<Riga[]>([{ titolo: "", descrizione: "" }]);
  const [inventario, setInventario] = useState<Riga[]>([{ titolo: "", descrizione: "" }]);
  const [monete, setMonete] = useState<Riga[]>([{ titolo: "", descrizione: "" }]);
  const [lingue, setLingue] = useState<Riga[]>([{ titolo: "", descrizione: "" }]);
  const [forme, setForme] = useState<Riga[]>([{ titolo: "", descrizione: "" }]);

  // Carica una sola volta da Firebase
  useEffect(() => {
    if (!uid) return;

    const loadData = async () => {
      const ref = doc(db, "schede", uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data().paginaDue || {};
        setAbilita(data.abilita || [{ titolo: "", descrizione: "" }]);
        setInventario(data.inventario || [{ titolo: "", descrizione: "" }]);
        setMonete(data.monete || [{ titolo: "", descrizione: "" }]);
        setLingue(data.lingue || [{ titolo: "", descrizione: "" }]);
        setForme(data.forme || [{ titolo: "", descrizione: "" }]);
      }
    };

    loadData();
  }, [uid]);

  // Salva tutto su Firebase
  const salvaTutto = () => {
    if (!uid) return;
    const ref = doc(db, "schede", uid);
    setDoc(ref, {
      paginaDue: {
        abilita,
        inventario,
        monete,
        lingue,
        forme,
      },
    }, { merge: true });

    setConfermaSalvataggio("✔️ Tutto salvato con successo!");
    setTimeout(() => setConfermaSalvataggio(""), 3000);
  };

  // Aggiorna stato locale
  const aggiornaValore = (
    setState: React.Dispatch<React.SetStateAction<Riga[]>>,
    index: number,
    campo: keyof Riga,
    valore: string
  ) => {
    setState((prev) => {
      const nuovi = [...prev];
      nuovi[index] = { ...nuovi[index], [campo]: valore };
      return nuovi;
    });
  };

  const aggiungiRiga = (setState: React.Dispatch<React.SetStateAction<Riga[]>>) => {
    setState((prev) => [...prev, { titolo: "", descrizione: "" }]);
  };

  const eliminaRiga = (setState: React.Dispatch<React.SetStateAction<Riga[]>>, index: number) => {
    setState((prev) => prev.filter((_, i) => i !== index));
  };

  // Componente Sezione
  const Sezione = ({
    titolo,
    dati,
    setDati,
  }: {
    titolo: string;
    dati: Riga[];
    setDati: React.Dispatch<React.SetStateAction<Riga[]>>;
  }) => (
    <div className="mb-6 border-b pb-4">
      <h2 className="text-xl font-bold mb-2 border-b-2 pb-1 border-gray-400">{titolo}</h2>
      {dati.map((riga, index) => (
        <div key={index} className="mb-2 flex flex-col sm:flex-row gap-2 items-center">
          <input
            type="text"
            placeholder="Titolo"
            value={riga.titolo}
            onChange={(e) => aggiornaValore(setDati, index, "titolo", e.target.value)}
            className="flex-1 px-2 py-1 border rounded"
          />
          <input
            type="text"
            placeholder="Descrizione"
            value={riga.descrizione}
            onChange={(e) => aggiornaValore(setDati, index, "descrizione", e.target.value)}
            className="flex-1 px-2 py-1 border rounded"
          />
          <button
            onClick={() => eliminaRiga(setDati, index)}
            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            ➖
          </button>
        </div>
      ))}
      <button
        onClick={() => aggiungiRiga(setDati)}
        className="mt-2 px-3 py-1 border rounded text-sm hover:bg-gray-100"
      >
        + Aggiungi riga
      </button>
    </div>
  );

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      {/* Bottone per tornare alla Pagina 1 */}
      <div className="flex justify-start mb-4">
        <Link href="/scheda">
          <button className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition">
            ⬅️ Torna alla Pagina 1
          </button>
        </Link>
      </div>

      {/* Sezioni */}
      <Sezione titolo="Abilità" dati={abilita} setDati={setAbilita} />
      <Sezione titolo="Inventario" dati={inventario} setDati={setInventario} />
      <Sezione titolo="Monete" dati={monete} setDati={setMonete} />
      <Sezione titolo="Lingue" dati={lingue} setDati={setLingue} />
      <Sezione titolo="Forme" dati={forme} setDati={setForme} />

      {/* Pulsante Salva Tutto */}
      <div className="text-center mt-6">
        <button
          onClick={salvaTutto}
          className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          💾 Salva Tutto
        </button>
        {confermaSalvataggio && (
          <p className="mt-2 text-green-700 font-semibold animate-fade-in-out">
            {confermaSalvataggio}
          </p>
        )}
      </div>
    </div>
  );
}