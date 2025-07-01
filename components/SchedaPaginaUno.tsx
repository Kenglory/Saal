'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import Bar from '@/components/bar';

interface Stats {
  forza: number;
  intelligenza: number;
  destrezza: number;
  costituzione: number;
  saggezza: number;
  carisma: number;
  velocita: number;
}

export default function SchedaPaginaUno() {
  const { user } = useAuth();
  const uid = user?.uid;

  const [nome, setNome] = useState('');
  const [culto, setCulto] = useState('');
  const [razza, setRazza] = useState('');
  const [livello, setLivello] = useState(1);
  const [infoConfermate, setInfoConfermate] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [messaggioSalvataggio, setMessaggioSalvataggio] = useState('');
  const [mostraAnimazione, setMostraAnimazione] = useState(false);
  const [modificaInfo, setModificaInfo] = useState(false);

  const [hp, setHp] = useState(1000);
  const [hpMax, setHpMax] = useState(1000);
  const [focus, setFocus] = useState(100);
  const [focusMax, setFocusMax] = useState(100);
  const [exp, setExp] = useState(0);
  const [expMax, setExpMax] = useState(1000);
  const [karma, setKarma] = useState(0);
  const [karmaMax, setKarmaMax] = useState(1000);

  const [stats, setStats] = useState<Stats>({
    forza: 0,
    intelligenza: 0,
    destrezza: 0,
    costituzione: 0,
    saggezza: 0,
    carisma: 0,
    velocita: 0,
  });

  const [statPoints, setStatPoints] = useState(0);
  const [tempStats, setTempStats] = useState<Stats>({ ...stats });

  useEffect(() => {
    if (!uid) return;
    const load = async () => {
      const ref = doc(db, 'schede', uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const d = snap.data();
        setNome(d.nome || '');
        setCulto(d.culto || '');
        setRazza(d.razza || '');
        setLivello(d.livello || 1);
        setInfoConfermate(d.infoConfermate || false);
        setConfirmed(d.confirmed || false);
        setStats(d.stats || stats);
        setTempStats(d.stats || stats);
        setStatPoints(d.statPoints ?? d.livello ?? 0);
        setHp(d.hp ?? 1000);
        setHpMax(d.hpMax ?? 1000);
        setFocus(d.focus ?? 100);
        setFocusMax(d.focusMax ?? 100);
        setExp(d.exp ?? 0);
        setExpMax(d.expMax ?? 1000);
        setKarma(d.karma ?? 0);
        setKarmaMax(d.karmaMax ?? 1000);
      }
    };
    load();
  }, [uid]);

  useEffect(() => {
    if (exp >= expMax) {
      const nuovoLivello = livello + 1;
      setLivello(nuovoLivello);
      setExp(0);
      setExpMax(expMax + 1000);
      setStatPoints(nuovoLivello);
      setFocusMax(focusMax + 4);
      setConfirmed(false);
      setMessaggioSalvataggio(`🎉 Sei salito al livello ${nuovoLivello}! Hai ${nuovoLivello} punti da assegnare alle statistiche.`);
      setMostraAnimazione(true);
      setTimeout(() => {
        setMostraAnimazione(false);
        setMessaggioSalvataggio('');
      }, 4000);
      if (uid) {
        const ref = doc(db, 'schede', uid);
        setDoc(ref, {
          livello: nuovoLivello,
          exp: 0,
          expMax: expMax + 1000,
          focusMax: focusMax + 4,
          statPoints: nuovoLivello,
          confirmed: false
        }, { merge: true });
      }
    }
  }, [exp]);

  const salvaBar = async (campo: string, valore: number) => {
    if (!uid) return;
    const ref = doc(db, 'schede', uid);
    await setDoc(ref, { [campo]: valore }, { merge: true });
  };

  const salvaDatiGenerali = async () => {
    if (!uid) return;
    const ref = doc(db, 'schede', uid);
    await setDoc(ref, {
      nome,
      culto,
      razza,
      infoConfermate: true
    }, { merge: true });
    setInfoConfermate(true);
    setModificaInfo(false);
  };

  const salvaTutto = async () => {
    if (!uid) return;
    const ref = doc(db, 'schede', uid);
    await setDoc(ref, {
      stats: tempStats,
      confirmed: true,
      statPoints: 0,
      hp, hpMax,
      focus, focusMax,
      exp, expMax,
      karma, karmaMax,
    }, { merge: true });
    setStats(tempStats);
    setConfirmed(true);
    setStatPoints(0);
    setMessaggioSalvataggio('✔️ Statistiche confermate!');
    setTimeout(() => setMessaggioSalvataggio(''), 3000);
  };

  const modificaStat = (key: keyof Stats, valore: number) => {
    if (confirmed || statPoints <= 0) return;
    const nuovaStat = tempStats[key] + valore;
    if (nuovaStat < 0) return;
    if (valore > 0 && statPoints === 0) return;
    setTempStats((prev) => ({ ...prev, [key]: nuovaStat }));
    setStatPoints((prev) => prev - valore);
  };

  return (
    <div className="p-4 space-y-4 max-w-5xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[{ label: 'Nome', value: nome, set: setNome },
          { label: 'Culto', value: culto, set: setCulto },
          { label: 'Razza', value: razza, set: setRazza }].map(({ label, value, set }) => (
          <div key={label}>
            <label className="text-sm font-semibold">{label}</label>
            <input value={value} onChange={(e) => set(e.target.value)} disabled={!modificaInfo} className="w-full border px-2 py-1 rounded shadow-sm" />
          </div>
        ))}
        <div>
          <label className="text-sm font-semibold">Livello</label>
          <input value={livello} disabled className="w-full border px-2 py-1 rounded shadow-sm" />
        </div>
      </div>

      {!infoConfermate && (
        <button onClick={salvaDatiGenerali} className="bg-blue-600 text-white px-4 py-2 rounded">Conferma Dati Iniziali</button>
      )}
      {infoConfermate && !modificaInfo && (
        <button onClick={() => setModificaInfo(true)} className="bg-yellow-500 text-white px-4 py-2 rounded">Modifica Dati</button>
      )}
      {modificaInfo && (
        <button onClick={salvaDatiGenerali} className="bg-green-600 text-white px-4 py-2 rounded">Conferma Modifiche</button>
      )}

      <hr className="my-4 border-gray-400" />

      <div className="flex flex-col gap-4">
        <Bar tipo="hp" attuale={hp} massimo={hpMax} setAttuale={(val) => { setHp(val); salvaBar('hp', val); }} setMassimo={(val) => { setHpMax(val); salvaBar('hpMax', val); }} />
        <Bar tipo="focus" attuale={focus} massimo={focusMax} setAttuale={(val) => { setFocus(val); salvaBar('focus', val); }} setMassimo={(val) => { setFocusMax(val); salvaBar('focusMax', val); }} />
        <Bar tipo="exp" attuale={exp} massimo={expMax} setAttuale={(val) => { setExp(val); salvaBar('exp', val); }} setMassimo={(val) => { setExpMax(val); salvaBar('expMax', val); }} />
        <Bar tipo="karma" attuale={karma} massimo={karmaMax} setAttuale={(val) => { setKarma(val); salvaBar('karma', val); }} setMassimo={(val) => { setKarmaMax(val); salvaBar('karmaMax', val); }} />
      </div>

      <hr className="my-4 border-gray-400" />

      {!confirmed && statPoints > 0 && (
        <div className="text-center text-sm font-semibold text-green-700">
          Hai {statPoints} punti da assegnare!
        </div>
      )}

      {messaggioSalvataggio && (
        <div className="text-center text-yellow-700 font-semibold animate-bounce">
          {messaggioSalvataggio}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {["forza","intelligenza","destrezza","costituzione","saggezza","carisma","velocita"].map((key) => (
          <div key={key} className="border rounded-xl p-3 shadow">
            <p className="font-bold capitalize mb-2">{key}: {tempStats[key as keyof Stats]}</p>
            <div className="flex items-center gap-2">
              <button disabled={confirmed} onClick={() => modificaStat(key as keyof Stats, -1)} className="text-red-600 text-xl">➖</button>
              <span className="w-10 text-center">{tempStats[key as keyof Stats]}</span>
              <button disabled={confirmed || statPoints <= 0} onClick={() => modificaStat(key as keyof Stats, 1)} className="text-green-600 text-xl">➕</button>
            </div>
          </div>
        ))}
      </div>

      {!confirmed && (
        <div className="mt-4 text-center">
          <button onClick={salvaTutto} className="px-4 py-2 bg-black text-white rounded-xl hover:opacity-90">Conferma Statistiche</button>
        </div>
      )}

      {infoConfermate && (
        <div className="flex justify-center mt-8">
          <Link href="/scheda/paginaDue">
            <div className="px-6 py-2 bg-blue-700 text-white rounded-xl shadow-lg hover:bg-blue-800 transition cursor-pointer text-center">
              ➡️ Vai alla Pagina 2
            </div>
          </Link>
        </div>
      )}

      {mostraAnimazione && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed top-1/3 left-1/2 transform -translate-x-1/2 bg-yellow-300 text-black text-xl px-6 py-3 rounded-xl shadow-lg z-50">
          🎉 Livello aumentato!
        </motion.div>
      )}
    </div>
  );
}