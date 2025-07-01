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

  // Draft locale
  const [draftAbilita, setDraftAbilita] = useState<Riga[]>([{ titolo: "", descrizione: "" }]);
  const [draftInventario, setDraftInventario] = useState<Riga[]>([{ titolo: "", descrizione: "" }]);
  const [draftMonete, setDraftMonete] = useState<Riga[]>([{ titolo: "", descrizione: "" }]);
  const [draftLingue, setDraftLingue] = useState<Riga[]>([{ titolo: "", descrizione: "" }]);
  const [draftForme, setDraftForme] = useState<Riga[]>([{ titolo: "", descrizione: "" }]);

  const [caricato, setCaricato] = useState(false);

  // Carica UNA SOLA VOLTA da Firebase
  useEffect(() => {
    if (!uid || caricato) return;

    const loadData = async () => {
      try {
        const ref = doc(db, "schede", uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data().paginaDue || {};
          setDraftAbilita(data.abilita || [{ titolo: "", descrizione: "" }]);
          setDraftInventario(data.inventario || [{ titolo: "", descrizione: "" }]);
          setDraftMonete(data.monete || [{ titolo: "", descrizione: "" }]);
          setDraftLingue(data.lingue || [{ titolo: "", descrizione: "" }]);
          setDraftForme(data.forme || [{ titolo: "", descrizione: "" }]);
        }
        setCaricato(true);
      } catch (error) {
        console.error("Errore caricamento dati:", error);
      }
    };

    loadData();
  }, [uid, caricato]);

  // Salva tutto su Firebase
  const salvaTutto = () => {
    if (!uid) return;
    const ref = doc(db, "schede", uid);
    setDoc(ref, {
      paginaDue: {
        abilita: draftAbilita,
        inventario: draftInventario,
        monete: draftMonete,
        lingue: draftLingue,
        forme: draftForme,
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
        <div
          key={index}
          className="mb-4 p-3 border rounded-xl shadow-sm flex flex-col gap-2 bg-white"
        >
          <textarea
            placeholder="Titolo"
            value={riga.titolo}
            onChange={(e) => aggiornaValore(setDati, index, "titolo", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border rounded-xl shadow-sm resize-y focus:outline-none focus:ring focus:border-blue-300"
          />
          <textarea
            placeholder="Descrizione"
            value={riga.descrizione}
            onChange={(e) => aggiornaValore(setDati, index, "descrizione", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border rounded-xl shadow-sm resize-y focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            onClick={() => eliminaRiga(setDati, index)}
            className="self-end px-3 py-1 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
          >
            ➖ Rimuovi
          </button>
        </div>
      ))}
      <button
        onClick={() => aggiungiRiga(setDati)}
        className="mt-2 px-4 py-2 border rounded-xl text-sm bg-gray-100 hover:bg-gray-200 transition"
      >
        ➕ Aggiungi riga
      </button>
    </div>
  );

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-start mb-4">
        <Link href="/scheda">
          <button className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition">
            ⬅️ Torna alla Pagina 1
          </button>
        </Link>
      </div>

      <Sezione titolo="Abilità" dati={draftAbilita} setDati={setDraftAbilita} />
      <Sezione titolo="Inventario" dati={draftInventario} setDati={setDraftInventario} />
      <Sezione titolo="Monete" dati={draftMonete} setDati={setDraftMonete} />
      <Sezione titolo="Lingue" dati={draftLingue} setDati={setDraftLingue} />
      <Sezione titolo="Forme" dati={draftForme} setDati={setDraftForme} />

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